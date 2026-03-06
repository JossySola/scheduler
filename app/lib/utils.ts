'use server'
import crypto, { randomBytes } from "crypto";
import pool from "./tests/mocks/db";
import sgMail from "@sendgrid/mail";
import * as z from "zod/v4";
import { KMSDataKey, UtilResponse } from "./definitions";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { sql } from "@vercel/postgres";

export async function isPasswordPwned (password: string): Promise<number | UtilResponse> {
  try {
    const verifyInput = z.string().nonempty({ message: "Password must be provided" }).safeParse(password);
    if (!verifyInput.success) throw new Error(verifyInput.error?.issues?.[0]?.message || "Unknown validation error");
    // API requires password to be hashed with SHA1
    const hashed = crypto.createHash('sha1').update(password).digest('hex');
    // "range" endpoint requires only the first 5 characters of the hashed password
    const range = hashed.slice(0,5);
    console.log(range)
    const suffixToCheck = hashed.slice(5).toUpperCase();
    const response = await fetch(`https://api.pwnedpasswords.com/range/${range}`);
    // The API returns a plain text response, not a JSON
    const text = await response.text();
    // For each \n break, convert the plain text into an Array
    const lines = text.split('\n');
    for (const line of lines) {
      // The format of each line is divided by a ":", the left part is the suffix and the right part is the count
      const [hashSuffix, count] = line.split(':');
      // If the rest of the hashed password is found on the exposed list
      if (hashSuffix.includes(suffixToCheck)) {
          // return the count part as a number
          return parseInt(count, 10);
      }
    }
    // If the remaining part of the hashed password is not found on the list, return 0
    return 0;
  } catch (error) {
    return {
      message: "Unknown error from exposed password checking.",
      ok: false
    };
  }
}
export async function sendResetPasswordConfirmation (email: string): Promise<UtilResponse> {
  try {
    const verifyEmail = z.email({ error: "Invalid email" }).nonempty().safeParse(email);
    if (!verifyEmail.success) {
      return {
        ok: false,
        message: verifyEmail.error.issues[0].message as unknown as string,
      }
    }
    const confirming = await sql`
      SELECT email FROM scheduler_users
      WHERE email = ${email};
    `;
    if (confirming.rowCount === 0 || !confirming) {
      return {
        ok: false,
        message: 'Email not found',
      }
    }
    const verification_code = randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
    const msg = {
      to: `${email}`,
      from: 'no-reply@jossysola.com',
      subject: 'Scheduler: Reset password confirmation',
      text: `${verification_code}`,
    }
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (sendgridKey) sgMail.setApiKey(sendgridKey);
    const insertToken = await sql`
      INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
      VALUES (${verification_code}, ${email}, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
    `;
    if (!insertToken || insertToken.rowCount === 0) {
      console.error("Error inserting confirmation token");
      throw new Error('Server Error');
    }
    const sending = await sgMail.send(msg);
    if (sending[0].statusCode !== 202) {
      return {
        ok: false,
        message: 'Error at mail provider',
      }
    }
    return {
      ok: true,
      message: 'Code sent!',
    }
  } catch (error) {
    return {
      ok: false,
      message: `Password confirmation error: ${error}`,
    }
  }
}
export async function generateKmsDataKey (): Promise<KMSDataKey | null> {
  try {
    const accessKeyId = process.env.AWS_KMS_KEY;
    const secretAccessKey = process.env.AWS_KMS_SECRET;
    const region = 'us-east-1';
    const service = 'kms';
    if (!accessKeyId || !secretAccessKey) throw new Error("Missing keys", { cause: 400 });
    const signer = new SignatureV4({
      credentials: { accessKeyId, secretAccessKey },
      service,
      region,
      sha256: Sha256
    });
    const signedRequest = await signer.sign({
      method: "POST",
      hostname: "kms.us-east-1.amazonaws.com",
      protocol: "https:",
      port: 443,
      path: "/",
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'TrentService.GenerateDataKey',
        'Host': "kms.us-east-1.amazonaws.com",
      },
      body: JSON.stringify({
        "KeyId": "alias/scheduler",
        "KeySpec": "AES_256"
      })
    })
    const response = await fetch("https://kms.us-east-1.amazonaws.com", {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body
    });
    if (!response) throw new Error("No response", { cause: 500 })
    if (!response.ok) {
      const errorText = await response.text(); // Get AWS error message
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }
    const data: KMSDataKey = await response.json();
    if (data.CiphertextBlob && data.Plaintext) {
      return data;
    } else {
      throw new Error("Invalid response", { cause: 400 });
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}
export async function decryptKmsDataKey (CiphertextBlob: string): Promise<string> {
  try {
    const verifyCipher = z.string().nonempty().safeParse(CiphertextBlob);
    if (!verifyCipher.success) throw new Error("Cipher is malformed or empty");
    const accessKeyId = process.env.AWS_KMS_KEY;
    const secretAccessKey = process.env.AWS_KMS_SECRET;
    const KeyId = process.env.AWS_KMS_ARN;
    if (!accessKeyId || !secretAccessKey || !KeyId) throw new Error("Missing keys", { cause: 400 })
    const client = new KMSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(CiphertextBlob, "base64"), // Convert to Buffer
      KeyId,
    });
    const result = await client.send(command);
    if (result.Plaintext) {
      return Buffer.from(result.Plaintext).toString("base64");
    } else {
      throw new Error("Plaintext was not returned");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function encrypt(plaintext: string, base64Key: string): Promise<string> {
  const key = Buffer.from(base64Key, "base64");

  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes for AES-256-GCM");
  }

  const iv = crypto.randomBytes(12); // recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    encrypted.toString("base64"),
    tag.toString("base64")
  ].join(":");
}
export async function decrypt(payload: string, base64Key: string): Promise<string> {
  const key = Buffer.from(base64Key, "base64");

  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes for AES-256-GCM");
  }

  const [ivB64, ciphertextB64, tagB64] = payload.split(":");

  if (ivB64 === undefined || ciphertextB64 === undefined || tagB64 === undefined) {
    throw new Error("Invalid encrypted payload format");
  }

  const iv = Buffer.from(ivB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const tag = Buffer.from(tagB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}
export async function verifyPasswordAction (hashed: string, password: string): Promise<boolean> {
  try {
    const { verify } = await import('argon2');
    return await verify(hashed, password);
  } catch (e) {
    console.error(e);
    throw new Error(`Error verifying password: ${e}`);
  }

}
export async function hashPasswordAction (password: string): Promise<string> {
  try {
    const { hash } = await import('argon2');
    return await hash(password);
  } catch (e) {
    console.error(e);
    throw new Error(`Error hashing password: ${e}`);
  }
}
export async function signedOnlyWithProvider (id: string): Promise<boolean | null> {
  try {
    const response = await sql`
    SELECT password, user_password_key
    FROM scheduler_users
    WHERE id = ${id};`;
    const { password, user_password_key } = response.rows[0];
    if (password === null || user_password_key === null) {
      return true;
    } else {
      throw new Error(`Password: ${password}, Password Key: ${user_password_key}`);
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}
function toBase64Url (str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function fromBase64Url (str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4 !== 0) {
    str += '=';
  }
  return str;
}
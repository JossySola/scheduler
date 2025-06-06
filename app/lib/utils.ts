'use server'
import "server-only";
import crypto, { randomBytes } from "crypto";
import pool from "./mocks/db";
import sgMail from "@sendgrid/mail";
import { z } from "zod";
import { KMSDataKey, UserResponse, UtilResponse } from "./definitions";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { sql } from "@vercel/postgres";
import * as argon2 from "argon2";

export async function getUserFromDb (username: string, password: string): Promise<UtilResponse & UserResponse> {
  if (!username || !password) {
    return {
      message: "Data missing",
      provider: "",
      ok: false,
    }
  }
  
  try {
    const user = await sql`
        SELECT * FROM scheduler_users 
            WHERE username = ${username} OR email = ${username};
    `;
    
    if (user.rowCount === 0) {
      return {
        message: "User not found",
        provider: "",
        ok: false,
      }
    }
    
    const userRecord = user.rows[0];
    
    if (userRecord.password === null) {
      const provider = await sql`
        SELECT provider FROM scheduler_users_providers
        WHERE email = ${userRecord.email};
      `;
      const name = provider.rowCount === 2 ? `${provider.rows[0].provider} and ${provider.rows[1].provider}` : `${provider.rows[0]}`;

      return {
        message: `This account uses ${name} authentication.`,
        provider: name,
        ok: false
      }
    }
    
    const hashVerified = await argon2.verify(userRecord.password, password);

    if (hashVerified) {
      return {
          id: userRecord.id,
          name: userRecord.name,
          username: userRecord.username,
          email: userRecord.email,
          role: userRecord.role,
          message: "",
          ok: true
      };
    }
    throw new Error ("Invalid credentials");
  } catch (error) {
    return {
      message: "Invalid credentials",
      ok: false,
    }
  }
}
export async function isPasswordPwned (password: string): Promise<number | UtilResponse> {
  if (!password) throw new Error("No password received")
  try {
      // API requires password to be hashed with SHA1
      const hashed = crypto.createHash('sha1').update(password).digest('hex');
      // "range" endpoint requires only the first 5 characters of the hashed password
      const range = hashed.slice(0,5);
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
  if (!email) {
    return {
      ok: false,
      message: 'Email must be provided'
    }
  }
  const validated = z.string().min(1).email({ message: "Invalid e-mail" }).safeParse(email);
  if (!validated.success) {
    return {
      ok: false,
      message: validated.error?.issues?.[0]?.message || "Unknown validation error"
    }
  }
  const confirming = await sql`
      SELECT email FROM scheduler_users
      WHERE email = ${email};
  `;
  
  if (confirming.rowCount === 0 || !confirming) {
    return {
      ok: false,
      message: 'Email not found'
    }
  }
  const verification_code = randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
  const msg = {
    to: `${email}`,
    from: 'no-reply@jossysola.com',
    subject: 'Scheduler: Reset password confirmation',
    text: `${verification_code}`
  }
  try {
    process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const insertToken = await sql`
      INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
      VALUES (${verification_code}, ${email}, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
    `;
    if (insertToken.rowCount === 0) {
      throw new Error('Server Error');
    }
    const sending = await sgMail.send(msg)
    if (sending[0].statusCode !== 202) {
      return {
        ok: false,
        message: 'Error at mail provider'
      }
    }
    return {
      ok: true,
      message: 'Code sent!'
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Server failure'
    }
  }
}
export async function generateKmsDataKey (): Promise<KMSDataKey | null> {
  const accessKeyId = process.env.AWS_KMS_KEY;
  const secretAccessKey = process.env.AWS_KMS_SECRET;
  const region = 'us-east-1';
  const service = 'kms';
  try {
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
    throw e;
  }
}
export async function decryptKmsDataKey (CiphertextBlob: string) {
  const accessKeyId = process.env.AWS_KMS_KEY;
  const secretAccessKey = process.env.AWS_KMS_SECRET;
  const KeyId = process.env.AWS_KMS_ARN;
  try {
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
    }
  } catch (err) {
    throw err;
  }
}
export async function encrypt (data: string, key: string): Promise<string >{
  const iv = crypto.randomBytes(16);
  const keyBuffer = Buffer.from(key, 'base64'); 
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  let encrypted = cipher.update(data, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  const ivBase64url = toBase64Url(iv.toString('base64'));
  const encryptedBase64url = toBase64Url(encrypted);

  return `${ivBase64url}:${encryptedBase64url}`;
}
export async function decrypt (encrypted: string, key: string): Promise<string> {
  const [ ivStr, encryptedData ] = encrypted.split(':');

  const iv = Buffer.from(fromBase64Url(ivStr), 'base64');
  const encryptedBase64 = fromBase64Url(encryptedData);

  const keyBuffer = Buffer.from(key, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);

  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
export async function verifyPasswordAction (hashed: string, password: string): Promise<boolean> {
  return await argon2.verify(hashed, password);
}
export async function hashPasswordAction (password: string): Promise<string> {
  return await argon2.hash(password);
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
'use server'
import "server-only";
import crypto, { randomBytes } from "crypto";
import pool from "./mocks/db";
import { Argon2id } from "oslo/password";
import sgMail from "@sendgrid/mail";
import { z } from "zod";
import { asyncActionStateResponse, UserResponse, UtilResponse } from "./definitions";

export async function getUserFromDb (username: string, password: string): Promise<UtilResponse & UserResponse> {
  if (!username || !password) {
    return {
      message: "Data missing",
      provider: "",
      ok: false,
    }
  }
  
  try {
    const user = await pool.query(`
        SELECT * FROM scheduler_users 
            WHERE username = $1 OR email = $1;
    `, [username]);
    
    if (user.rowCount === 0) {
      return {
        message: "User not found",
        provider: "",
        ok: false,
      }
    }
    
    const userRecord = user.rows[0];
    
    if (userRecord.password === null) {
      const provider = await pool.query(`
        SELECT provider FROM scheduler_users_providers
        WHERE email = $1;
      `, [userRecord.email]);
      const name = provider.rowCount === 2 ? `${provider.rows[0].provider} and ${provider.rows[1].provider}` : `${provider.rows[0]}`;

      return {
        message: `This account uses ${name} authentication.`,
        provider: name,
        ok: false
      }
    }
    
    const argon2id = new Argon2id();
    const hashVerified = await argon2id.verify(userRecord.password, password);

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
  const confirming = await pool.query(`
      SELECT email FROM scheduler_users
      WHERE email = $1;
  `, [email])
  
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
    const insertToken = await pool.query(`
      INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
    `, [verification_code, email]);
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
export async function useAsyncActionState (
  action: (state: { message: string, ok?: boolean, descriptive?: unknown }, payload: FormData) => { message: string, ok?: boolean, descriptive?: unknown } | Promise<{ message: string, ok?: boolean, descriptive?: unknown }>, 
  initialState: { message: string, ok?: boolean, descriptive?: unknown }): 
  Promise<asyncActionStateResponse> {
    return new Promise( resolve => {
      let isPending = true;
      let state = initialState;

      const dispatch = async (payload: FormData) => {
        'use server'
        state = await action(state, payload);
        isPending = false;
      }

      resolve([state, dispatch, isPending]);
    });
}
import crypto from "crypto";
import * as z from "zod/v4";

export default async function isPasswordLeaked(password: string): Promise<boolean | null> {
  try {
    z.string({ error: "Invalid type" }).min(8, { error: "Password must be at least 8 characters long" }).parse(password);
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
          // return true
          return true;
      }
    }
    // If the remaining part of the hashed password is not found on the list, return false
    return false;
  } catch (error: any) {
    // Return null for errors
    if (error instanceof z.ZodError) {
        console.error(error.issues[0].message);
        return null;
    } else {
        console.error(error.message);
        return null;
    }
  }
}
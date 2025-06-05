"use server"
import { Argon2id } from "oslo/password";

export async function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  const argon = new Argon2id();
  return await argon.verify(hashed, plain);
}

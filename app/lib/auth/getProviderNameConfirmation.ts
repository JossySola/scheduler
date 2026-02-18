import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function getProviderNameConfirmation(email: string, expectedName: string): Promise<string | null> {
    try {
        const verifyEmail = z.email().safeParse(email);
        if (!verifyEmail.success) {
            throw new Error("Invalid email format");
        }
        const verifyProviderName = z.string().nonempty().safeParse(expectedName);
        if (!verifyProviderName.success) {
            throw new Error("Invalid provider name");
        }
        const response = await sql`
        SELECT provider 
        FROM scheduler_users_providers
        WHERE email = ${email} AND provider = ${expectedName};
        `;
        return response.rows[0]?.provider;
    } catch (error) {
        console.error("Error confirming provider name:", error);
        return null;
    }
}
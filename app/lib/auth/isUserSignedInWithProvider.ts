import { sql } from "@vercel/postgres";

export async function isUserSignedInWithProvider(email: string): Promise<boolean> {
    try {
        const response = await sql`
            SELECT provider FROM scheduler_users_providers
            WHERE email = ${email};
        `;
        return response.rowCount !== 0;
    } catch (error) {
        return false;
    }
}
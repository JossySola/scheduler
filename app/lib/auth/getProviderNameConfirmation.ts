import { sql } from "@vercel/postgres";

export async function getProviderNameConfirmation(email: string, expectedName: string): Promise<string | null> {
    try {
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
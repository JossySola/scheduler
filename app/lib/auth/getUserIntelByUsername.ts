import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

type UserIntel = {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    user_image: string;
}
export async function getUserIntelByUsername(username: string): Promise<UserIntel | null> {
    try {
        const verifyUsername = z.string().nonempty().safeParse(username);
        if (!verifyUsername.success) {
            throw new Error("Invalid username format or missing");
        }
        const data = await sql`
        SELECT
            id,
            name,
            username,
            email,
            password,
            user_image
        FROM scheduler_users
        WHERE email = ${username} OR username = ${username};
        `;
        return data.rows[0] as UserIntel;
    } catch (error) {
        console.error("Error fetching user by username:", error);
        return null;
    }
}
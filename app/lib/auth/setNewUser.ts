import { sql } from "@vercel/postgres";
import { z } from "zod/v4";

export async function setNewUser(
    name: string,
    username: string,
    email: string,
    user_image: string,
): Promise<{ success: boolean; id: string }> {
    try {
        const verifyName = z.string().nonempty().safeParse(name);
        const verifyUsername = z.string().nonempty().safeParse(username);
        const verifyEmail = z.email().safeParse(email);
        const verifyUserImage = z.url().safeParse(user_image);
        if (!verifyName.success || !verifyUsername.success || !verifyEmail.success || !verifyUserImage.success) {
            throw new Error("Invalid data format");
        }
        const response = await sql`
        INSERT INTO scheduler_users(name, username, email, user_image)
        VALUES (
            ${name},
            ${username},
            ${email},
            ${user_image}
        )
        ON CONFLICT (username) DO NOTHING
        RETURNING id;
        `;
        return { success: true, id: response.rows[0].id };
    } catch (error) {
        console.error("Error setting new user record:", error);
        return { success: false, id: "" };
    }
}
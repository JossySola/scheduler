import { sql } from "@vercel/postgres";

export async function setNewUser(
    name: string,
    username: string,
    email: string,
    user_image: string,
): Promise<{ success: boolean; id: string }> {
    try {
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
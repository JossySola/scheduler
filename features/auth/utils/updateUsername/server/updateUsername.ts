import { auth } from "@/auth";
import z from "zod";

export default async function updateUsername(username: string) {
    try {
        const verifyUsername = z.string().nonempty().safeParse(username);
        if (!verifyUsername.success) throw new Error("Invalid input: expected string");
        const data = await auth.api.updateUser({
            body: {
                username,
            }
        });
        return data;
    } catch (e) {
        console.error(e);
        throw new Error("Failed updating username");
    }
}
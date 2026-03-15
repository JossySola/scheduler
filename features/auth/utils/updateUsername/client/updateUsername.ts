import { authClient } from "@/features/auth/utils/auth-client";
import z from "zod";

export default async function updateUsername(username: string) {
    try {
        const verifyUsername = z.string().nonempty().safeParse(username);
        if (!verifyUsername.success) throw new Error("Invalid input: expected string");
        const { data, error } = await authClient.updateUser({
            username,
        });
        return { data, error };
    } catch (e) {
        console.error(e);
        throw new Error("Failed updating username");
    }
}
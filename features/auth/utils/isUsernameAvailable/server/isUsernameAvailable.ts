import { auth } from "@/auth";
import z from "zod";

export default async function isUsernameAvailable(username: string) {
    try {
        const verifyUsername = z.string().nonempty().safeParse(username);
        if (!verifyUsername) throw new Error("Invalid input: expected string");
        const response = await auth.api.isUsernameAvailable({
            body: {
                username,
            }
        });
        if (response?.available) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
        throw new Error("Failed to check if username is available");
    }
}
import { z } from "zod/v4";

export async function verifyPassword(inputPassword: string, decryptedPassword: string): Promise<boolean> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL!;
        const verifyInput = z.string().nonempty().safeParse(inputPassword);
        const verifyDecrypted = z.string().nonempty().safeParse(decryptedPassword);
        if (!verifyInput.success || !verifyDecrypted.success) {
            throw new Error("Invalid input");
        }
        const response = await fetch(`${baseUrl}/api/argon2/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hashed: decryptedPassword,
                password: inputPassword
            })
        })
        if (!response.ok || response.status !== 200) {
            throw new Error("Failed verification");
        }
        const res = await response.json();
        return res.isValid;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}
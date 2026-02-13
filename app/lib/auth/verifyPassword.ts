export async function verifyPassword(inputPassword: string, decryptedPassword: string): Promise<boolean> {
    try {
        const response = await fetch("/api/argon2/verify", {
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
        return false;
    }
}
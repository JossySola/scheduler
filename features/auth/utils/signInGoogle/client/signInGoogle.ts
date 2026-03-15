import { authClient } from "@/features/auth/auth-client";

export default async function signInGoogle() {
    try {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed when signing in with Google. ${error}`);
    }
}
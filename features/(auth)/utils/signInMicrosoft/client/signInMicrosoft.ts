import { authClient } from "@/features/(auth)/auth-client";

export default async function signInMicrosoft() {
    try {
        const data = await authClient.signIn.social({
            provider: "microsoft",
            callbackURL: "/dashboard",
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed when signing in with Microsoft. ${error}`);
    }
}
import { authClient } from "@/features/auth/auth-client";

export default async function signInFacebook() {
    try {
        const data = await authClient.signIn.social({
            provider: "facebook",
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed when signing in with Facebook. ${error}`);
    }
}
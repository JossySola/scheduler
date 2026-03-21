import { auth } from "@/auth";

export default async function resetPassword(newPassword: string, token: string) {
    try {
        const request = await auth.api.resetPassword({
            body: {
                newPassword,
                token,
            },
        });
        if (request.status) {
            return request;
        } else {
            return new Error();
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed resetting password");
    }
}
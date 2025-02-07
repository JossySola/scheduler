import ResetPassword from "@/app/ui/molecules/mol-reset-password";
import { verifyResetTokenAction } from "./actions";

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Page ({ searchParams }: {
    searchParams: Promise<{ 
        email: string,
        token: string, 
    }>
}) {
    const email = (await searchParams).email;
    const token = (await searchParams).token;

    if (!email || !token) {
        return <p>Broken link</p>
    }

    const verification = await verifyResetTokenAction(email, token);

    if (verification.rowCount === 0) {
        return <p>Invalid or already used token.</p>
    }

    const { expires_at } = verification.rows[0];
    const now = new Date().toISOString();
    const expires = new Date(expires_at).toISOString();

    if (expires < now) {
        return <p>Token has expired.</p>
    }

    return (
        <>
        <h2>Reset Password</h2>
        <p>Your new password must contain 8 characters at least.</p>
        <p>We highly recommend using your <b>Password Manager</b> suggestion to create a strong password. This way, your password will be securely stored without the need to memorize it!</p>
        <ResetPassword token={token} />
        </>
    )
}
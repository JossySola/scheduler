import ResetPassword from "@/app/ui/molecules/mol-reset-password";
import { verifyResetTokenAction } from "./actions";

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Page ({ params, searchParams }: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<{ 
        email: string,
        token: string, 
    }>
}) {
    const email = (await searchParams).email;
    const token = (await searchParams).token;
    const lang = (await params).lang;

    if (!email || !token) {
        return (
            <section className="h-screen w-full flex flex-col items-center">
                <h2>{ lang === "es" ? "Enlace inválido" : "Broken link" }</h2>
            </section>
        )
    }

    const verification = await verifyResetTokenAction(email, token);

    if (verification.rowCount === 0) {
        return (
            <section className="h-screen w-full flex flex-col items-center">
                <h2>{ lang === "es" ? "Token inválido o ya usado" : "Invalid or already used token."}</h2>
            </section>
        )
    }

    const { expires_at } = verification.rows[0];
    const now = new Date().toISOString();
    const expires = new Date(expires_at).toISOString();

    if (expires < now) {
        return (
            <section className="h-screen w-full flex flex-col items-center">
                <h2>{ lang === "es" ? "Token ha expirado" : "Token has expired."}</h2>
            </section>
        )
    }

    return (
        <section className="h-screen w-full flex flex-col items-center">
            <h2>{ lang === "es" ? "Restaurar contraseña" : "Reset Password"}</h2>
            <ResetPassword token={token} />
        </section>
    )
}
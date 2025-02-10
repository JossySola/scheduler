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
        return <p>{ lang === "es" ? "Enlace inválido" : "Broken link" }</p>
    }

    const verification = await verifyResetTokenAction(email, token);

    if (verification.rowCount === 0) {
        return <p>{ lang === "es" ? "Token inválido o ya usado" : "Invalid or already used token."}</p>
    }

    const { expires_at } = verification.rows[0];
    const now = new Date().toISOString();
    const expires = new Date(expires_at).toISOString();

    if (expires < now) {
        return <p>{ lang === "es" ? "Token ha expirado" : "Token has expired."}</p>
    }

    return (
        <>
        <h2>{ lang === "es" ? "Restaurar contraseña" : "Reset Password"}</h2>
        <p>{ lang === "es" ? "La contraseña debe tener al menos 8 caracteres." : "Your new password must contain 8 characters at least."}</p>
        {
            lang === "es" ? 
            <p>Recomendamos ampliamente utilizar tu <b>Administrador de contraseñas</b> para crear una contraseña segura. De este modo, ¡la contraseña quedará guardada en tu dispositivo y podrás utilizarla sin necesidad de memorizarla!</p> :
            <p>We highly recommend using your <b>Password Manager</b> suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!</p>
        }
        <ResetPassword token={token} />
        </>
    )
}
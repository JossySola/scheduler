import pool from "@/app/lib/mocks/db";
import { decrypt, decryptKmsDataKey, generateKmsDataKey } from "@/app/lib/utils";
import { signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

export default async function Page ({ params, searchParams }: {
    params: Promise<{ lang: "en" | "es" }>,
    searchParams: Promise<{ token: string, email: string }>,
}) {
    const token = (await searchParams).token;
    const lang = (await params).lang;
    const confirming = await sql`
        SELECT token, key 
        FROM scheduler_email_confirmation_tokens
        WHERE token = ${token} AND expires_at > NOW() AND email = ${(await searchParams).email};
    `;
    if (!confirming.rows.length || confirming.rowCount === 0) {
        return <section className="h-screen p-10">
            <h3 className="text-center">{ lang === "es" ? "Este enlace es inválido o ha expirado" : "This confirmation link is invalid or has expired." }</h3>
            <Link href={`/${lang}/signup`}>{ lang === "es" ? "Intentar registro nuevamente" : "Try signing up again" }</Link>
        </section>
    }
    const key = await decryptKmsDataKey(confirming.rows[0].key) ?? "";
    const data = await decrypt(token, key);
    const decoded = data.split('//');

    const email = decoded[0];
    const username = decoded[1];
    const name = decoded[2];
    const birthday = decoded[3];
    const password = decoded[4];
    const raw = decoded[5];

    const secret = await generateKmsDataKey();

    const insert = await sql`
        INSERT INTO scheduler_users (name, username, email, birthday, password, user_password_key)
        VALUES (
            ${name},
            ${username},
            ${email},
            ${birthday},
            pgp_sym_encrypt_bytea(${password}, ${secret?.Plaintext}),
            ${secret?.CiphertextBlob}
        );
    `;
    if (insert.rowCount === 0) {
        return <section className="h-screen p-10">
        <h3 className="text-center">{ lang === "es" ? "Hubo un problema con el registro, intenta registrarte nuevamente y reporta este problema." : "There has been a problem with the sign up process, please try again and report the error." }</h3>
    </section>
    }
    await sql`
        DELETE FROM scheduler_email_confirmation_tokens WHERE token = ${token};
    `;

    try {
        await signIn("credentials", {
          username,
          password: raw,
          redirect: false
        });
        redirect(`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/dashboard`);
    } catch (err) {
        return (
            <section className="flex flex-col justify-center items-center h-screen p-10 text-center">
                <h3>{lang === "es" ? "Registro completado, pero hubo un problema iniciando sesión." : "Account created, but there was a problem logging you in."}</h3>
                <Link href={`/${lang}/login`} className="underline mt-4 inline-block text-center">
                    {lang === "es" ? "Iniciar sesión" : "Log in manually"}
                </Link>
            </section>
        );
    }
}
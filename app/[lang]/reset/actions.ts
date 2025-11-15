"use server"
import "server-only";
import { decryptKmsDataKey, generateKmsDataKey, hashPasswordAction, isPasswordPwned, verifyPasswordAction } from "@/app/lib/utils";
import { auth, signOut } from "@/auth";
import pool from "@/app/lib/mocks/db";
import { headers } from "next/headers";
import { sql } from "@vercel/postgres";

export async function passwordResetAction(prevState: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const password = formData.get("password")?.toString();
    const confirmation = formData.get("confirmpwd")?.toString();
    const token = formData.get("token")?.toString();
    const session = await auth();
    const email = session?.user?.email;

    if (!password || !confirmation) {
        return {
            message: locale === "es" ? "Por favor, llena todos los campos." : "Please fill out both input fields.",
        }
    }

    if (password.length < 8) {
        return {
            message: locale === "es" ? "Tu contraseña debe tener un mínimo de 8 caracteres." : "Your password must have at least 8 characters.",
        }
    }

    if (password !== confirmation || !token) {
        return {
            message: locale === "es" ? "Confirmación de contraseña fallida" : "Password confirmation failed.",
        }
    }

    const isTokenExpired = await sql`
       SELECT expires_at, used_at FROM scheduler_password_resets
       WHERE email = ${email} AND token = ${token}; 
    `;
    if (isTokenExpired.rowCount === 0) {
        return {
            message: locale === "es" ? "El token no se ha encontrado" : "Token not found",
        }
    }
    const { expires_at, used_at } = isTokenExpired.rows[0];
    if (used_at) {
        return {
            message: locale === "es" ? "Este token ya ha sido usado. Genera uno nuevo." : "This token has already been used. Request a new one.",
        }
    }
    const expires = new Date(expires_at).toISOString();
    const now = new Date().toISOString();
    if (expires < now) {
        return {
            message: locale === "es" ? "Este token ha expirado. Genera uno nuevo." : "The token has expired. Request a new one.",
        }
    }

    const queryKey = await sql`
        SELECT user_password_key FROM scheduler_users 
        WHERE email = ${email};
    `;
    if ( queryKey.rows[0].user_password_key === null || !queryKey.rows.length) {
        // The user exists but has signed in with a provider, so there is no password set yet
        const exposed = await isPasswordPwned(password);
        if (typeof exposed === 'number' && exposed > 0) {
            return {
                message: locale === "es" ? "Después de validar la contraseña, parece que ha sido expuesta y comprometida previamente. Por favor, usa una nueva contraseña más segura." : "After a password checkup, it appears this password has been exposed in a data breach in the past. Please use a stronger password.",
            }
        }
        const hashed = await hashPasswordAction(password);
        const key = await generateKmsDataKey();
        if (!key?.CiphertextBlob) {
            return {
                message: locale === "es" ? "Token inválido." : "Invalid key.",
            }
        }
        const query = await sql`
        UPDATE scheduler_users
        SET password = pgp_sym_encrypt_bytea(${hashed}, ${key.Plaintext}), 
                user_password_key = ${key.CiphertextBlob}
        WHERE email = ${email}; 
        `;
        if (query.rowCount === 0) {
            return {
                message: locale === "es" ? "Proceso fallido." : "Password reset failed.",
            }
        }

        const invalidate = await sql`
            UPDATE scheduler_password_resets
            SET used_at = NOW()
            WHERE email = ${email} AND token = ${token}
            RETURNING used_at;
        `;

        if (invalidate.rowCount === 0) {
            return {
                message: locale === "es" ? "Fallo en completar el proceso." : "Failed to end process.",
            }
        }

        await signOut({
            redirect: true,
            redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/login`
        });

        return {
            message: locale === "es" ? "¡Proceso completado!" : "Reset successful!",
        }
    }
    // The user has used their own credentials
    const decryptedKey = await decryptKmsDataKey(queryKey.rows[0].user_password_key);
    const oldPassword = await sql`
       SELECT pgp_sym_decrypt_bytea(password, ${decryptedKey}) AS decrypted_password
       FROM scheduler_users
       WHERE email = ${email}; 
    `;
    if (oldPassword.rowCount === 0) {
        return {
            message: locale === "es" ? "Usuario no encontrado." : "User not found.",
        }
    }
    const decryptedPassword = oldPassword.rows[0].decrypted_password;
    
    const comparison = await verifyPasswordAction(decryptedPassword, password);
    if (comparison) {
        return {
            message: locale === "es" ? "La nueva contraseña no debe ser la misma a la anterior." : "New password cannot be the same as the old password.",
        }
    }

    const exposed = await isPasswordPwned(password);
    if (typeof exposed === 'number' && exposed > 0) {
        return {
            message: locale === "es" ? "Después de validar la contraseña, parece que ha sido expuesta y comprometida previamente. Por favor, usa una nueva contraseña más segura." : "After a password checkup, it appears this password has been exposed in a data breach in the past. Please use a stronger password.",
        }
    }
    
    const hashed: string = await hashPasswordAction(password);
    const key = await generateKmsDataKey();
    if (!key?.CiphertextBlob) {
        return {
            message: locale === "es" ? "Token inválido." : "Invalid key.",
        }
    }
    const query = await sql`
       UPDATE scheduler_users
       SET password = pgp_sym_encrypt_bytea(${hashed}, ${key.Plaintext}), 
            user_password_key = ${key.CiphertextBlob}
       WHERE email = ${email}; 
    `;
    if (query.rowCount === 0) {
        return {
            message: locale === "es" ? "Proceso fallido." : "Password reset failed.",
        }
    }

    const invalidate = await sql`
        UPDATE scheduler_password_resets
        SET used_at = NOW()
        WHERE email = ${email} AND token = ${token}
        RETURNING used_at;
    `;

    if (invalidate.rowCount === 0) {
        return {
            message: locale === "es" ? "Fallo en completar el proceso." : "Failed to end process.",
        }
    }

    await signOut({
        redirect: true,
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/login`
    });

    return {
        message: locale === "es" ? "¡Proceso completado!" : "Reset successful!",
    }
}
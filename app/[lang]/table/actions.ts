"use server"
import "server-only";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { decryptKmsDataKey, generateKmsDataKey } from "@/app/lib/utils";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { StatesType } from "@/app/hooks/custom";

export async function SaveNewTableAction (states: StatesType) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();

    if (session && session.user) {
        const num_tables: number | null = await sql`SELECT num_tables FROM scheduler_users WHERE id = ${session.user.id}`.then(result => result.rows[0].num_tables ?? null).catch(reason => console.error(reason));
        if (num_tables === 3 || num_tables === null) {
            return {
                ok: false,
                message: locale === "es" ? "Alcanzaste el límite de tres tablas 😔" : "You've reached the three schedules limit 😔",
                id: null
            }
        }
        const name_key = await generateKmsDataKey();
        const rows_key = await generateKmsDataKey();
        const values_key = await generateKmsDataKey();
        const cols_specs_key = await generateKmsDataKey();
        const rows_specs_key = await generateKmsDataKey();

        if (name_key && rows_key && values_key && cols_specs_key && rows_specs_key) {
            const insert = await sql`
            INSERT INTO scheduler_users_tables (
                user_id, 
                table_name, 
                table_name_key, 
                table_rows, 
                table_rows_key, 
                table_values, 
                table_values_key, 
                table_type, 
                table_interval,
                table_cols_specs,
                table_cols_specs_key,
                table_rows_specs,
                table_rows_specs_key,
                table_cols_num
            )
            VALUES (
                ${session.user.id},
                pgp_sym_encrypt(${states.title}, ${name_key.Plaintext}),
                ${name_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(states.data)}, ${rows_key.Plaintext}),
                ${rows_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(states.values)}, ${values_key.Plaintext}),
                ${values_key.CiphertextBlob},
                ${JSON.stringify(states.headerType)},
                ${states.interval},
                pgp_sym_encrypt(${JSON.stringify(states.colSpecs)}, ${cols_specs_key.Plaintext}),
                ${cols_specs_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(states.rowSpecs)}, ${rows_specs_key.Plaintext}),
                ${rows_specs_key.CiphertextBlob},
                ${JSON.stringify(states.colsNum)}
            )
            RETURNING id;
            `
            .then(result => { 
                const newId = result.rows[0].id;
                return {
                    ok: true, 
                    message: locale === "es" ? "¡Horario guardado!" : "Schedule saved!",
                    id: newId,
                }
                 
            })
            .catch(()=> ({ ok: false, message: locale === "es" ? "Ha ocurrido un error 😔" : "An error has occurred 😔", id: null }));
            
            await sql`
            UPDATE scheduler_users
            SET num_tables = COALESCE(num_tables, 0) + 1
            WHERE id = ${session.user.id};`;

            return insert;           
        }
        return {
            ok: false,
            message: locale === "es" ? "Se ha producido un error antes de procesar la información" : "There is an error prior to information processing",
            id: null,
        }             
    }
    return {
        ok: false,
        message: locale === "es" ? "Parece que se ha desconectado tu sesión" : "It looks like you've lost the session",
        id: null,
    }
};
export async function SaveTableAction (
    states: StatesType, 
    table_id: string
) 
{
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    
    if (session && session.user) {
        const encrypted_keys = await sql`
        SELECT table_name_key, table_rows_key, table_values_key, table_cols_specs_key, table_rows_specs_key
        FROM scheduler_users_tables
        WHERE user_id = ${session.user.id} AND id = ${table_id};`
        .then(result => result.rowCount !== 0 ? result.rows[0] : null)
        .catch(() => null);

        const name_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_name_key) : null;
        const rows_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_rows_key) : null;
        const values_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_values_key) : null;
        const cols_specs_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_cols_specs_key) : null;
        const rows_specs_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_rows_specs_key) : null;

        if (name_key && rows_key && values_key && cols_specs_key && rows_specs_key) {
            const insert = await sql`
            UPDATE scheduler_users_tables
            SET 
                table_name = pgp_sym_encrypt(${states.title}, ${name_key}),
                table_rows = pgp_sym_encrypt(${JSON.stringify(states.data)}, ${rows_key}),
                table_values = pgp_sym_encrypt(${JSON.stringify(states.values)}, ${values_key}),
                table_type = ${JSON.stringify(states.headerType)},
                table_interval = ${states.interval},
                table_cols_specs = pgp_sym_encrypt(${JSON.stringify(states.colSpecs)}, ${cols_specs_key}),
                table_rows_specs = pgp_sym_encrypt(${JSON.stringify(states.rowSpecs)}, ${rows_specs_key}),
                table_cols_num = ${JSON.stringify(states.colsNum)},
                updated_at = NOW()
            WHERE user_id = ${session.user.id} AND id = ${table_id};`
            .then(() => ({ ok: true, message: locale === "es" ? "¡Horario guardado!" : "Schedule saved!" }))
            .catch(()=> ({ ok: false, message: locale === "es" ? "Ha ocurrido un error 😔" : "An error has occurred 😔" }));
            revalidatePath(`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${locale}/dashboard`);
            return insert;
        }
        return {
            ok: false,
            message: locale === "es" ? "Se ha producido un error antes de procesar la información" : "There is an error prior to information processing",
        }
    }
    return {
        ok: false,
        message: locale === "es" ? "Parece que se ha desconectado tu sesión" : "It looks like you've lost the session"
    }
};

"use server"
import "server-only";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { decryptKmsDataKey, generateKmsDataKey } from "@/app/lib/utils";
import { sql } from "@vercel/postgres";
import { RowType } from "@/app/lib/utils-client";
import { revalidatePath } from "next/cache";

type ObjectType = {
    value: string,
    specs?: {
        disabled: boolean,
        disabledCols: Array<string>,
        rowTimes: number,
        preferValues: Array<string>,
        colTimes: number,
        valueTimes: Array<[string, number]>,
    },
};
export async function SaveTableAction (name: string, rows: Array<Map<string, RowType>>, values: Set<string>, type: string, interval: number, table_id: string) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    const objectify: Array<Array<[string, ObjectType]>> = rows.map(col => {
        return Array.from(col.entries()).map(([key, value]): [string, ObjectType] => {
            if (value.specs) {
                return [
                    key,
                    {
                        ...value,
                        specs: {
                            ...value.specs,
                            valueTimes: Array.from(value.specs.valueTimes),
                        }
                    }
                ];
            }
            return [key, value as ObjectType];
        })
    })
    if (session && session.user) {
        const encrypted_keys = await sql`
        SELECT table_name_key, table_rows_key, table_values_key
        FROM scheduler_users_tables
        WHERE user_id = ${session.user.id} AND id = ${table_id};`
        .then(result => result.rowCount !== 0 ? result.rows[0] : null)
        .catch(() => null);

        const name_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_name_key) : null;
        const rows_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_rows_key) : null;
        const values_key = encrypted_keys ? await decryptKmsDataKey(encrypted_keys.table_values_key) : null;

        if (name_key && rows_key && values_key) {
            const insert = await sql`
            UPDATE scheduler_users_tables
            SET 
                table_name = pgp_sym_encrypt(${name}, ${name_key}),
                table_rows = pgp_sym_encrypt(${JSON.stringify(objectify)}, ${rows_key}),
                table_values = pgp_sym_encrypt(${JSON.stringify(Array.from(values))}, ${values_key}),
                table_type = ${type},
                table_interval = ${interval},
                updated_at = NOW()
            WHERE user_id = ${session.user.id} AND id = ${table_id};`
            .then(() => ({ ok: true, message: locale === "es" ? "¡Horario guardado!" : "Schedule saved!" }))
            .catch(()=> ({ ok: false, message: locale === "es" ? "Ha ocurrido un error 😔" : "An error has occurred 😔" }));
            revalidatePath(`${process.env.NEXT_PUBLIC_ORIGIN}/${locale}/dashboard`);
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
}
export async function SaveNewTableAction (name: string, rows: Array<Map<string, RowType>>, values: Set<string>, type: string, interval: number) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    
    const objectify: Array<Array<[string, ObjectType]>> = rows.map(col => {
        return Array.from(col.entries()).map(([key, value]): [string, ObjectType] => {
            if (value.specs) {
                return [
                    key,
                    {
                        ...value,
                        specs: {
                            ...value.specs,
                            valueTimes: Array.from(value.specs.valueTimes),
                        }
                    }
                ];
            }
            return [key, value as ObjectType];
        })
    })
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

        if (name_key && rows_key && values_key) {
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
                table_interval
            )
            VALUES (
                ${session.user.id},
                pgp_sym_encrypt(${name}, ${name_key.Plaintext}),
                ${name_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(objectify)}, ${rows_key.Plaintext}),
                ${rows_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(Array.from(values))}, ${values_key.Plaintext}),
                ${values_key.CiphertextBlob},
                ${type},
                ${interval}
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
            return insert;

            await sql`
            UPDATE scheduler_users
            SET num_tables = num_tables + 1
            WHERE id = ${session.user.id};`
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
}
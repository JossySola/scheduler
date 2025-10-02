import { decryptKmsDataKey } from "@/app/lib/utils";
import { BackButton } from "@/app/ui/atoms/atom-button-back";
import Table from "@/app/ui/v4/table/table";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation';

export default async function Page ({ params }: { 
    params: Promise<{ id: string, lang: "en" | "es" }>
}) {
    const { id, lang } = await params;
    const session = await auth();

    if (session && session.user) {
        const owner = await sql`
        SELECT user_id
        FROM scheduler_users_tables
        WHERE id = ${id};
        `.then(result => result.rowCount !== 0 ? result.rows[0].user_id : null).catch(e => console.error(e));
        if (owner !== session.user.id) {
            return (
                <section className="w-full h-full flex flex-col items-center justify-center">
                    <h2>{ lang === "es" ? "No eres el propietario de este horario 🤚🏾" : "You are not the owner of this schedule 🤚🏾" }</h2>
                </section>
            )
        }

        // Replaced API endpoint with direct query logic
        const keys = await sql`
        SELECT table_name_key, table_rows_key, table_values_key, table_rows_specs_key, table_cols_specs_key
        FROM scheduler_users_tables
        WHERE id = ${id};`.then(result => result.rowCount !== 0 ? result.rows[0] : null).catch(e => console.error(e));


        if (keys && keys.table_name_key && keys.table_rows_key && keys.table_values_key && keys.table_rows_specs_key && keys.table_cols_specs_key) {
            const name_key = await decryptKmsDataKey(keys.table_name_key);
            const rows_key = await decryptKmsDataKey(keys.table_rows_key);
            const values_key = await decryptKmsDataKey(keys.table_values_key);
            const rows_specs_key = await decryptKmsDataKey(keys.table_rows_specs_key);
            const cols_specs_key = await decryptKmsDataKey(keys.table_cols_specs_key);

            const serialized_table = await sql`
            SELECT
                pgp_sym_decrypt_bytea(table_name, ${name_key}) AS decrypted_name,
                pgp_sym_decrypt_bytea(table_rows, ${rows_key}) AS decrypted_rows,
                pgp_sym_decrypt_bytea(table_values, ${values_key}) AS decrypted_values,
                pgp_sym_decrypt_bytea(table_rows_specs, ${rows_specs_key}) AS decrypted_rows_specs,
                pgp_sym_decrypt_bytea(table_cols_specs, ${cols_specs_key}) AS decrypted_cols_specs,
                table_type,
                table_interval,
                created_at,
                updated_at,
                user_id,
                table_cols_num
            FROM scheduler_users_tables
            WHERE id = ${id};`
            .then(result => result.rowCount !== 0 ? result.rows[0] : null)
            .catch(e => console.error(e));
            
            if (serialized_table) {
                // Remember to deserialize this object if you pass any property as prop to a component
                const storedData = {
                    user_id: serialized_table.user_id,
                    name: serialized_table.decrypted_name.toString(),
                    data: JSON.parse(serialized_table.decrypted_rows),
                    values: JSON.parse(serialized_table.decrypted_values),
                    type: JSON.parse(serialized_table.table_type),
                    interval: serialized_table.table_interval,
                    cols_specs: JSON.parse(serialized_table.decrypted_cols_specs),
                    rows_specs: JSON.parse(serialized_table.decrypted_rows_specs),
                    created_at: serialized_table.created_at,
                    updated_at: serialized_table.updated_at,
                    cols: serialized_table.table_cols_num ? JSON.parse(serialized_table.table_cols_num): [],
                }
                
                return (
                    <section className="w-full h-fit mt-15 mb-20">
                        <Table storedData={storedData} />
                    </section>
                )
            }
        } else {
            return <section className="h-full flex flex-col justify-start items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Tabla no encontrada" : "Schedule not found" }</h2>
            </section>
        }
    }
    redirect(`/${lang}/login`);
}
import { decryptKmsDataKey } from "@/app/lib/utils";
import { RowType } from "@/app/lib/utils-client";
import { BackButton } from "@/app/ui/atoms/atom-button-back";
import Panel from "@/app/ui/v3/client-panel";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";

export default async function Page ({ params }: { 
    params: Promise<{ id: string, lang: "en" | "es" }>
}) {
    const { id, lang } = await params;
    const session = await auth();

    if (session?.user?.id) {
        const owner = await sql`
        SELECT user_id
        FROM scheduler_users_tables
        WHERE id = ${id};
        `.then(result => result.rowCount !== 0 ? result.rows[0] : null).catch(() => undefined);
        if (owner !== session.user.id) {
            return (
                <section className="w-full h-full flex flex-col items-center justify-center">
                    <h2>{ lang === "es" ? "No eres el propietario de este horario 🤚🏾" : "You are not the owner of this schedule 🤚🏾" }</h2>
                </section>
            )
        }

        // Replaced API endpoint with direct query logic
        const keys = await sql`
        SELECT table_name_key, table_rows_key, table_values_key
        FROM scheduler_users_tables
        WHERE id = ${id};`.then(result => result.rowCount !== 0 ? result.rows[0] : null).catch(() => null);


        if (keys && keys.table_name_key && keys.table_rows_key && keys.table_values_key) {
            const name_key = await decryptKmsDataKey(keys.table_name_key);
            const rows_key = await decryptKmsDataKey(keys.table_rows_key);
            const values_key = await decryptKmsDataKey(keys.table_values_key);
            const serialized_table = await sql`
            SELECT
                pgp_sym_decrypt_bytea(table_name, ${name_key}) AS decrypted_name,
                pgp_sym_decrypt_bytea(table_rows, ${rows_key}) AS decrypted_rows,
                pgp_sym_decrypt_bytea(table_values, ${values_key}) AS decrypted_values,
                table_type,
                table_interval,
                created_at,
                updated_at
            FROM scheduler_users_tables
            WHERE id = ${id};`
            .then(result => result.rowCount !== 0 ? result.rows[0] : null)
            .catch(() => null);
            
            if (serialized_table) {
                const rows: Array<Map<string, RowType>> = JSON.parse(serialized_table.decrypted_rows).map(
                    (row: Array<[string, RowType]>) => {
                        for (const [, cell] of row) {
                            if (cell.specs?.valueTimes) {
                                cell.specs.valueTimes = new Map(cell.specs.valueTimes);
                            }
                        }
                        return new Map(row);
                    }
                )
                // Remember to deserialize this object if you pass any property as prop to a component
                const table = {
                    user_id: serialized_table.user_id,
                    name: serialized_table.decrypted_name.toString(),
                    rows,
                    values: JSON.parse(serialized_table.decrypted_values),
                    type: serialized_table.table_type,
                    interval: serialized_table.table_interval,
                    created_at: serialized_table.created_at,
                    updated_at: serialized_table.updated_at,
                }
                
                return (
                    <section className="w-full h-fit mt-15 mb-20">
                        <Panel 
                        name={table.name}
                        stored_rows={table.rows}
                        stored_values={table.values}
                        stored_type={table.type}
                        stored_interval={table.interval} />
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
}
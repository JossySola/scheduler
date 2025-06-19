import { decryptKmsDataKey } from "@/app/lib/utils";
import { BackButton } from "@/app/ui/atoms/atom-button-back";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";

export default async function Page ({ params }: { 
    params: Promise<{ id: string, lang: "en" | "es" }>
}) {
    const { id, lang } = await params;
    const session = await auth();
    const decryptToString = (decrypt: Buffer) => {
        if (!decrypt) return;
        const buffer = Buffer.from(decrypt);
        const string = buffer.toString("utf-8");
        const data = JSON.parse(string);
        return data;
    }
    if (session?.user?.id) {
        const user_id = session.user.id;
        // Replaced API endpoint with direct query logic
        const doesTableExist = await sql`
        SELECT id FROM scheduler_users_tables
        WHERE id = ${(await params).id};
        `;
        if (!doesTableExist.rows.length || doesTableExist.rowCount === 0) {
            return <section className="h-full flex flex-col justify-start items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Tabla no encontrada" : "Schedule not found" }</h2>
            </section>
        }
        const tableKey = await sql`
        SELECT table_data_key FROM scheduler_users_tables
        WHERE user_id = ${user_id} AND id = ${(await params).id}; 
        `;
        if (tableKey.rowCount === 0) {
            return <section className="h-full flex flex-col justify-start items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Ha ocurrido un error, inténtalo más tarde." : "An unexpected error has happened, please try again." }</h2>
            </section>
        }
        const key = tableKey.rows[0].table_data_key;
        const decryptedKey = await decryptKmsDataKey(key);
        const request = await sql`
            SELECT table_name,
                    pgp_sym_decrypt_bytea(table_data, ${decryptedKey}) AS decrypted_table,
                    pgp_sym_decrypt_bytea(table_rowspecs, ${decryptedKey}) AS decrypted_rowspecs,
                    pgp_sym_decrypt_bytea(table_colspecs, ${decryptedKey}) AS decrypted_colspecs,
                    pgp_sym_decrypt_bytea(table_values, ${decryptedKey}) AS decrypted_values,
                    created_at,
                    updated_at
            FROM scheduler_users_tables
            WHERE user_id = ${user_id} AND id = ${(await params).id};
        `;
        const data = request.rows[0];
        const response = {
            title: data.table_name as string,
            rows: data.decrypted_table as Buffer,
            rowSpecs: data.decrypted_rowspecs as Buffer,
            values: data.decrypted_values as Buffer,
            colSpecs: data.decrypted_colspecs as Buffer,
            created_at: data.created_at as string,
            updated_at: data.updated_at as string,
        }
        const title = response.title;
        const rows = decryptToString(response.rows);
        const rowSpecs = decryptToString(response.rowSpecs);
        const values = decryptToString(response.values);
        const colSpecs = decryptToString(response.colSpecs);
        return (
            <main className="h-full mt-10 pb-10">
                <form className="flex flex-col justify-center items-center relative">
                    <input type="text" name="table_id" value={ id } readOnly hidden />
                </form>
            </main>
        )
    }
}
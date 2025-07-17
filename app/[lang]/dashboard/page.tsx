import pool from "@/app/lib/mocks/db";
import UserProfile from "@/app/ui/atoms/atom-user-profile";
import Settings from "@/app/ui/molecules/mol-settings";
import { auth } from "@/auth";
import { QueryResultRow, sql } from "@vercel/postgres";
import DashboardTable from "@/app/ui/molecules/mol-dashboard-table";
import { decryptKmsDataKey, signedOnlyWithProvider } from "@/app/lib/utils";

interface ProviderData {
    provider: string,
}
export const dynamic = 'force-dynamic';
export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>
}) {
    const session = await auth();
    const { lang } = await params;
    type metadata = Array<{ table_id: string, table_name: string, updated_at: string, created_at: string }>;
    
    if (session?.user && session.user.email) {
        const providers = await sql`
        SELECT provider FROM scheduler_users_providers
        WHERE email = ${session.user.email};
        `;
        const providersResponse = providers.rows as ProviderData[] ?? [];

        const name_keys: Array<string> | null = await sql`
        SELECT table_name_key FROM scheduler_users_tables
        WHERE user_id = ${session.user.id};`
        .then(result => result.rowCount !== 0 
            ? result.rows.map(row => row.table_name_key) 
            : null)
        .catch(() => null);
        const table_names: Array<QueryResultRow | null> | null = name_keys && name_keys.length > 0 
        ? await Promise.all(name_keys.map(async (key: string) => {
            const decrypted_key = await decryptKmsDataKey(key);
            return await sql`
            SELECT pgp_sym_decrypt_bytea(table_name, ${decrypted_key}) AS decrypted_name, id, updated_at, created_at
            FROM scheduler_users_tables
            WHERE user_id = ${session.user.id} AND table_name_key = ${key};`
            .then(result => {
                if (result.rowCount !== 0) {
                    const meta = {
                        table_id: result.rows[0].id,
                        table_name: result.rows[0].decrypted_name.toString(),
                        updated_at: result.rows[0].updated_at,
                        created_at: result.rows[0].created_at,
                    }
                    return meta;
                } else {
                    return null;
                }
            })
            .catch(() => null);
        })) 
        : null;
        const onlyWithProvider = await signedOnlyWithProvider(session.user.id);
        return (
            <section>
                <section className="w-full flex flex-row justify-center gap-6 p-5 sm:justify-start sm:p-10">
                        <UserProfile />
                        <Settings lang={lang} data={providersResponse} onlyWithProvider={onlyWithProvider} />
                </section>
                <DashboardTable metadata={ table_names ? table_names as metadata : [] } />
            </section>
        )
    }
}
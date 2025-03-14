import pool from "@/app/lib/mocks/db";
import DashboardTable from "@/app/ui/molecules/mol-dashboard-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>,
}) {
    const session = await auth();
    const lang = (await params).lang;

    if (session?.user) {
        const table_data = await pool.query(`
            SELECT id AS table_id, table_name, updated_at, created_at
            FROM scheduler_users_tables
            WHERE user_id = $1;
        `, [session.user.id]);

        return <DashboardTable rows={ table_data.rows } lang={ lang } />
    }
    redirect(`/${lang}/login`);
}
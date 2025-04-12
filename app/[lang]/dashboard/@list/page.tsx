import pool from "@/app/lib/mocks/db";
import { DashboardSkeleton } from "@/app/ui/atoms/skeletons";
import DashboardTable from "@/app/ui/molecules/mol-dashboard-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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

        return (
            <Suspense fallback={ <DashboardSkeleton /> }>
                <DashboardTable rows={ table_data.rows } lang={ lang } />
            </Suspense>
        )
    }
    redirect(`/${lang}/login`);
}
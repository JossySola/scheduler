import pool from "@/app/lib/mocks/db";
import { DashboardSkeleton } from "@/app/ui/atoms/skeletons";
import DashboardTable from "@/app/ui/molecules/mol-dashboard-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { sql } from "@vercel/postgres";

interface TableData {
    table_id: string;
    table_name: string;
    updated_at: string;
    created_at: string;
}
export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>,
}) {
    const session = await auth();
    const lang = (await params).lang;

    if (session?.user) {
        const table_data = await sql`
            SELECT id AS table_id, table_name, updated_at, created_at
            FROM scheduler_users_tables
            WHERE user_id = ${session.user.id};
        `;
        const rows = table_data.rows as TableData[];
        return (
            <Suspense fallback={ <DashboardSkeleton /> }>
                <DashboardTable rows={ rows } lang={ lang } />
            </Suspense>
        )
    }
    redirect(`/${lang}/login`);
}
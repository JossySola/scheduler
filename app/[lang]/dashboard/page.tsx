import pool from "@/app/lib/mocks/db";
import UserProfile from "@/app/ui/atoms/atom-user-profile";
import { DashboardSkeleton, UserSkeleton } from "@/app/ui/atoms/skeletons";
import Settings from "@/app/ui/molecules/mol-settings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { sql } from "@vercel/postgres";
import DashboardTable from "@/app/ui/molecules/mol-dashboard-table";

interface ProviderData {
    provider: string,
}
interface TableData {
    table_id: string;
    table_name: string;
    updated_at: string;
    created_at: string;
}
export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>
}) {
    const session = await auth();
    const lang = (await params).lang;
    
    if (session?.user && session.user.email) {
        const providers = await sql`
            SELECT provider FROM scheduler_users_providers
            WHERE email = ${session.user.email};
        `;
        const providersResponse = providers.rows as ProviderData[] ?? [];
        const table_data = await sql`
            SELECT id AS table_id, table_name, updated_at, created_at
            FROM scheduler_users_tables
            WHERE user_id = ${session.user.id};
        `;
        const rows = table_data.rows as TableData[];
        return (
            <section>
                <section className="w-full flex flex-row justify-center gap-6 p-5 sm:justify-start sm:p-10">
                        <UserProfile />
                        <Settings lang={lang} data={providersResponse}/>
                </section>
                    <DashboardTable rows={ rows } lang={ lang } />
            </section>
        )
    }
    redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/login`);
}
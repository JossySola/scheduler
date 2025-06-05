import pool from "@/app/lib/mocks/db";
import TableWithProvider from "@/app/ui/molecules/mol-provider-table";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>
}) {
    const lang = (await params).lang;
    const session = await auth();

    if (!session?.user) redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/login`);

    if (session && session.user) {
        const numTables = await sql`
            SELECT num_tables 
            FROM scheduler_users
            WHERE id = ${session.user.id};
        `;

        if (numTables.rows && numTables.rows.length > 0) {
            if (numTables.rows[0].num_tables < 3) {
                return (
                    <main className="h-full mt-10 pb-10">
                        <form className="flex flex-col justify-center items-center relative">
                            <TableWithProvider lang={ lang } />
                        </form>
                    </main>
                )
            } else {
                redirect(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/dashboard`);
            }
        } else {
            return (
                <main className="w-full h-full mt-10 pb-10">
                    <form className="w-full flex flex-col justify-center items-center relative">
                        <TableWithProvider lang={ lang } />
                    </form>
                </main>
            )
        }
    }
}
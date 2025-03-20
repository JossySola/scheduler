import pool from "@/app/lib/mocks/db";
import UserProfile from "@/app/ui/atoms/atom-user-profile";
import Settings from "@/app/ui/molecules/mol-settings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const session = await auth();
    const lang = (await params).lang;
    
    if (session?.user && session.user.email) {
        const providers = await pool.query(`
            SELECT provider FROM scheduler_users_providers
            WHERE email = $1;
        `, [session.user.email]);
        const providersResponse = providers.rows ?? [];

        return (
            <section className="w-full flex flex-row justify-center gap-6 p-5 sm:justify-start sm:p-10">
                <UserProfile />
                <Settings lang={lang} data={providersResponse}/>
            </section>
        )
    }
    redirect(`/${lang}/login`);
}
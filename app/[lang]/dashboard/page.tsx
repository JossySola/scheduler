import pool from "@/app/lib/mocks/db";
import UserProfile from "@/app/ui/atoms/atom-user-profile";
import { UserSkeleton } from "@/app/ui/atoms/skeletons";
import Settings from "@/app/ui/molecules/mol-settings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { sql } from "@vercel/postgres";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const session = await auth();
    const lang = (await params).lang;
    
    if (session?.user && session.user.email) {
        const providers = await sql`
            SELECT provider FROM scheduler_users_providers
            WHERE email = ${session.user.email};
        `;
        const providersResponse = providers.rows ?? [];

        return (
            <section className="w-full flex flex-row justify-center gap-6 p-5 sm:justify-start sm:p-10">
                <Suspense fallback={ <UserSkeleton /> }>
                    <UserProfile />
                    <Settings lang={lang} data={providersResponse}/>
                </Suspense>
            </section>
        )
    }
    redirect(`/${lang}/login`);
}
import UserProfile from "@/app/ui/atoms/atom-user-profile";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const session = await auth();
    const lang = (await params).lang;
    
    if (session?.user) {
        return (
            <>
                <Link href={`/${lang}/table/new`}>{ lang === "es" ? "Crear nuevo" : "Create new" }</Link>
                <UserProfile />
                <Link href={`/${lang}/profile/settings`}>{ lang === "es" ? "Ajustes" : "Settings" }</Link>
            </>
        )
    }
}
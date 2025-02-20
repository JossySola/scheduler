import UserProfile from "@/app/ui/atoms/atom-user-profile";
import Settings from "@/app/ui/molecules/mol-settings";
import { auth } from "@/auth";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const session = await auth();
    const lang = (await params).lang;
    
    if (session?.user && session.user.email) {
        const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/providers`, {
            method: "GET",
            headers: {
                "user_email": session.user.email
            }
        })
        const response = await request.json();

        return (
            <section className="m-8 flex flex-row gap-6">
                <UserProfile />
                <Settings lang={lang} data={response.data}/>
            </section>
        )
    }
}
import pool from "@/app/lib/mocks/db";
import Panel from "@/app/ui/v3/client-panel";
import { auth } from "@/auth";

export default async function Page () {
    const session = await auth();

    if (session && session.user) {
        return (
            <section className="w-full h-fit mt-15 mb-20">
                <Panel />
            </section>
        )
    }
}
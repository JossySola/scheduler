import DashboardTable from "@/app/ui/molecules/mol-dashboard-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>,
}) {
    const session = await auth();
    const user_email = session?.user?.email ? session.user.email : null;
    const lang = (await params).lang;
    
    if (user_email) {
        const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/id`, {
            method: "GET",
            headers: {
                user_email
            }
        })
        const response = await request.json();
        
        if (response && response.data.user_id) {
            const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/tables`, {
                method: "GET",
                headers: {
                    "user_id": response.data.user_id
                }
            });
            const tables = await request.json();

            if (tables.data) {
                return tables.data && <DashboardTable rows={tables.data} lang={lang as "en" | "es"}/>
            }
            return (
                <p>{ lang === "es" ? "Aún no hay contenido para mostrar" : "No tables yet" }</p>
            )            
        }
        return (
            <p>User not found</p>
        )
    }
    return redirect(`/${lang}/login`);
}
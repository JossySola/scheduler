import TableLink from "@/app/ui/molecules/mol-table-link";
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export default async function Page () {
    const session = await auth();
    const user_email = session?.user?.email ? session.user.email : null;
    
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
                return (
                    <section>
                        {
                            tables.data && tables.data.map((table: { table_id: string, table_name: string, updated_at: string}, index: number) => {
                                return <TableLink key={`${table.table_name}${index}`} table_id={table.table_id} table_name={table.table_name} updated_at={table.updated_at} />
                            })
                        }
                    </section>
                )
            }
            return (
                <p>No tables yet</p>
            )            
        }
        return (
            <p>User not found</p>
        )
    }
    return redirect('/login');
}
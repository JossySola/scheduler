import TableButtonSave from "@/app/ui/atoms/atom-table-button-save";
import TableNameInput from "@/app/ui/atoms/atom-table-name-input";
import YTable from "@/app/ui/molecules/mol-YTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page ({ params }: { 
    params: Promise<{ id: string, lang: "en" | "es" }>
}) {
    const { id, lang } = await params;
    const session = await auth();

    if (session?.user?.id) {
        const storedTable = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/${id}`, {
            method: 'GET',
            headers: {
                user_id: session.user.id
            }
        })
        const response = await storedTable.json();
        
        return (
            <main className="w-full mt-10">
                <form className="flex flex-col justify-center items-center">
                    <div className="w-full flex flex-row justify-center items-center gap-5">
                    <TableNameInput name={ response.title } />
                    <TableButtonSave lang={ lang } />
                    </div>
                    <YTable 
                    lang={ lang }
                    storedRows={ response.table }
                    storedSpecs={ response.specs }
                    storedValues={ response.values }
                    storedColSpecs={ response.cols } 
                    storedTimestamps={ response.timestamps }/>
                </form>
            </main>
        )
    }
    redirect(`/${lang}/login`);
}
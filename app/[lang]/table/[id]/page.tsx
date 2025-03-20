import TableNameInput from "@/app/ui/atoms/atom-table-name-input";
import TableWithProvider from "@/app/ui/molecules/mol-provider-table";
import { auth } from "@/auth";

export default async function Page ({ params }: { 
    params: Promise<{ id: string, lang: "en" | "es" }>
}) {
    const { id, lang } = await params;
    const session = await auth();
    const decryptToString = (decrypt: { type: 'Buffer', data: Array<number> }) => {
        if (!decrypt) return;
        const buffer = Buffer.from(decrypt.data);
        const string = buffer.toString("utf-8");
        const data = JSON.parse(string);
        return data;
    }
    if (session?.user?.id) {
        const storedTable = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/${id}`, {
            method: 'GET',
            headers: {
                user_id: session.user.id
            }
        })
        const response = await storedTable.json();
        return (
            <main className="mt-10">
                <form className="flex flex-col justify-center items-center relative">
                    <input type="text" value={`${id}`} aria-label="table-id" id="table_id" name="table_id" hidden readOnly/>
                    <TableNameInput name={ response.title } />
                    <TableWithProvider 
                    lang={ lang }
                    storedRows={ decryptToString(response.rows) }
                    storedSpecs={ decryptToString(response.specs) }
                    storedValues={ decryptToString(response.values) }
                    storedColSpecs={ decryptToString(response.colSpecs) } />
                </form>
            </main>
        )
    }
}
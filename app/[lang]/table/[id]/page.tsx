import { BackButton } from "@/app/ui/atoms/atom-button-back";
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
        const rows = decryptToString(response.rows);
        const specs = decryptToString(response.specs);
        const values = decryptToString(response.values);
        const colSpecs = decryptToString(response.colSpecs);
        
        if (response.error || !response) {
            return <section className="flex flex-col justify-center items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Tabla no encontrada" : "Schedule not found" }</h2>
            </section>
        }
        return (
            <main className="mt-10">
                <form className="flex flex-col justify-center items-center relative">
                    <input type="text" name="table_id" value={ id } readOnly hidden />
                    <TableWithProvider 
                    lang={ lang }
                    storedTitle={ response.title }
                    storedRows={ rows }
                    storedSpecs={ specs }
                    storedValues={ values }
                    storedColSpecs={ colSpecs } />
                </form>
            </main>
        )
    }
}
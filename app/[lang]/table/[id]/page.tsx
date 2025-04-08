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
                user_id: session.user.id,
            }
        })
        if (storedTable.status === 404) {
            return <section className="h-full flex flex-col justify-start items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Tabla no encontrada" : "Schedule not found" }</h2>
            </section>
        }
        if (storedTable.status === 400) {
            return <section className="h-full flex flex-col justify-start items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Esta tabla es privada" : "This schedule is private" }</h2>
            </section>
        }
        if (storedTable.status !== 200) {
            return <section className="h-full flex flex-col justify-start items-center">
                <BackButton />
                <h2 className="text-center">{ lang === "es" ? "Ha ocurrido un error, inténtalo más tarde." : "An unexpected error has happened, please try again." }</h2>
            </section>
        }
        
        const response = await storedTable.json();
        const rows = decryptToString(response.rows);
        const rowSpecs = decryptToString(response.rowSpecs);
        const values = decryptToString(response.values);
        const colSpecs = decryptToString(response.colSpecs);
        return (
            <main className="h-full mt-10 pb-10">
                <form className="flex flex-col justify-center items-center relative">
                    <input type="text" name="table_id" value={ id } readOnly hidden />
                    <TableWithProvider 
                    lang={ lang }
                    storedTitle={ response.title }
                    storedRows={ rows }
                    storedRowSpecs={ rowSpecs }
                    storedValues={ values }
                    storedColSpecs={ colSpecs } />
                </form>
            </main>
        )
    }
}
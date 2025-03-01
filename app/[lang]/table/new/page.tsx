import TableNameInput from "@/app/ui/atoms/atom-table-name-input";
import YTable from "@/app/ui/molecules/mol-YTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const lang = (await params).lang;
    const session = await auth();

    if (session && session.user) {
        return (
            <main className="w-full mt-10">
                <form className="flex flex-col justify-center items-center">
                    <TableNameInput name={ lang === "es" ? "Sin título" : "No title yet" } />
                    <YTable lang={ lang } />
                </form>
            </main>
        )
    }
    redirect(`/${lang}/login`);
}
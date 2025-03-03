import TableButtonSave from "@/app/ui/atoms/atom-table-button-save";
import TableNameInput from "@/app/ui/atoms/atom-table-name-input";
import YTable from "@/app/ui/molecules/mol-YTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>
}) {
    const lang = (await params).lang;
    const session = await auth();

    if (session && session.user) {
        return (
            <main className="w-full mt-10">
                <form className="flex flex-col justify-center items-center">
                    <div className="w-full flex flex-row justify-center items-center gap-5">
                    <TableNameInput name={ lang === "es" ? "Sin título" : "No title yet" } />
                    <TableButtonSave lang={ lang } />
                    </div>
                    <YTable lang={ lang } />
                </form>
            </main>
        )
    }
    redirect(`/${lang}/login`);
}
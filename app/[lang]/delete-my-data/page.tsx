import DeleteDataList from "@/app/ui/atoms/atom-delete-data";

export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es"}>
}) {
    const lang = (await params).lang;
    return (
        <section className="w-full h-auto p-10">
            <h1 className="mb-7">{ lang === "es" ? "¿Cómo elimino mis datos?" : "How do I delete my data?"}</h1>
            <DeleteDataList />
        </section>
    )
}
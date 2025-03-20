import DeleteDataList from "@/app/ui/atoms/atom-delete-data";

export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es"}>
}) {
    const lang = (await params).lang;
    return (
        <section className="m-5">
            <h1 className="mb-7">{ lang === "es" ? "¿Cómo elimino mis datos?" : "How do I delete my data?"}</h1>
            <DeleteDataList />
        </section>
    )
}
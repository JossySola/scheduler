import SignupForm from "@/app/ui/molecules/mol-signup-form";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const lang = (await params).lang;

    return <section className="h-fit flex flex-col justify-start items-center p-5 mb-10">
        <h2 className="tracking-tight">{ lang === "es" ? "Regístrate" : "Create an account" }</h2>
        {
            <SignupForm lang={ lang as "en" | "es" } />
        }
    </section>
}
import SignupForm from "@/app/ui/molecules/mol-signup-form";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const lang = (await params).lang;

    return <main className="flex flex-col justify-center items-center pt-5">
        <h2 className="tracking-tight">{ lang === "es" ? "Regístrate" : "Create an account" }</h2>
        {
            <SignupForm lang={ lang as "en" | "es" } />
        }
    </main>
}
import ContactForm from "@/app/ui/molecules/mol-contact-form";


export default async function Page ({ params }: {
    params: Promise<{ lang: "en" | "es" }>
}) {
    const lang = (await params).lang;

    return (
        <section className="flex flex-col justify-center items-center">
            <h2>{ lang === "es" ? "Contactar" : "Contact" }</h2>
            <ContactForm lang={ lang } />
        </section>
    )
}
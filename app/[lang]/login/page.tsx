import LogIn from "@/app/ui/molecules/mol-login";
import SignInProviders from "@/app/ui/molecules/mol-signin-providers";

export default async function Page ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const lang = (await params).lang;

    return (
        <section className="w-full flex flex-col items-center">
            <LogIn lang={lang} />
            <SignInProviders lang= {lang as "en" | "es" } />
        </section>
        
    )
}
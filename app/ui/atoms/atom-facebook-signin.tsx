import { signIn } from "@/auth"

export default function FacebookSignIn ({ lang }: {
    lang: string,
}) {
    return (
        <form action={async () => {
            "use server"
            await signIn("facebook", { redirect: true, redirectTo: `/${lang}/dashboard` });
        }}>
            <button type="submit">{ lang === "es" ? "Continúa con Facebook" : "Signin with Facebook" }</button>
        </form>
    )
}
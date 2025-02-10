import { signIn } from "@/auth";

export default function GoogleSignIn ({ lang }: {
    lang: string,
}) {
    return (
        <form action={async () => {
            "use server"
            await signIn("google", { redirect: true, redirectTo: `/${lang}/dashboard`});
        }}>
            <button type="submit">{ lang === "es" ? "Continúa con Google" : "Signin with Google" }</button>
        </form>
    )
}
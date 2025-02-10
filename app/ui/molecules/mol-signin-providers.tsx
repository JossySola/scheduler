import FacebookSignIn from "../atoms/atom-facebook-signin";
import GoogleSignIn from "../atoms/atom-google-signin";

export default function SignInProviders ({ lang }: {
    lang: string
}) {
    return (
        <>
            <p>{ lang === "es" ? "O inicia sesión con cualquiera de los siguientes proveedores:" : "Or signin with your provider" }</p>
            <GoogleSignIn lang={lang} />
            <FacebookSignIn lang={lang} />
        </>
    )
}
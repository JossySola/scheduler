import FacebookSignIn from "../atoms/atom-facebook-signin";
import GoogleSignIn from "../atoms/atom-google-signin";

export default function SignInProviders ({ lang }: {
    lang: "en" | "es"
}) {
    return (
        <section className="w-full p-3 sm:w-[400px] flex flex-col justify-center items-center text-center">
            <p className="text-sm text-[#a1a1aa] m-2">{ lang === "es" ? "O inicia sesión con cualquiera de los siguientes proveedores:" : "Or sign in with your provider" }</p>
            <GoogleSignIn lang={ lang } />
            <FacebookSignIn lang={ lang } />
        </section>
    )
}
import { ActionButton } from "@/app/ui/atoms/atom-button"
import { SendResetEmailAction } from "./actions"
import FormInputEmail from "@/app/ui/atoms/atom-form-input-email";

export default async function Page({ params, searchParams }: {
    params: Promise<{ lang: "es" | "en" }>,
    searchParams: Promise<{ error?: string, code?: string }>,
}) {
    const lang = (await params).lang;
    const { error, code } = await searchParams;

    const handleErrorParam = () => {
        if (error) {
            switch (error) {
                case '400': {
                    return lang === "es" ? "Ingresa tu correo electrónico" : "Enter your e-mail";
                }
                case '404': {
                    return lang === "es" ? "Usuario no encontrado" : "User not found";
                }
                case '500': {
                    return lang === "es" ? "Error interno, inténtalo más tarde" : "Internal error, try again later";
                }
                default: lang === "es" ? "Error desconocido, inténtalo más tarde" : "Unknown error, try again later";
            }
        }
    }

    return (
        <section className="h-screen w-full flex flex-col justify-start items-center p-5">
            <h2>{ lang === "es" ? "Recuperación de contraseña" : "Password Recovery" }</h2>
            {
                lang === "es" ? 
                <p className="sm:w-[500px] m-5">Enviarémos un correo electrónico con un enlace. Por favor, sigue las instrucciones que encontrarás en el mensaje. Recuerda checar la carpeta de <b>Spam</b> en caso de no ver el correo en la <b>Bandeja de Entrada</b> o espera unos minutos.</p> :
                <p className="sm:w-[500px] m-5">We'll send you an e-mail with a link. Please, follow the instructions contained in the e-mail. Remember to check the <b>Spam</b> folder in case you don't see the e-mail in your <b>Inbox</b> or wait a few minutes.</p>
            }
            <form className="flex flex-col justify-center items-center" action={SendResetEmailAction}>
                <FormInputEmail />
                <p aria-live="polite" className="text-danger m-2">{ handleErrorParam() }</p>
                {
                    code && !error ? <p aria-live="polite" className="text-success m-2">{ lang === "es" ? "¡Correo enviado!" : "Email sent!" }</p> : null
                }
                <ActionButton type="submit">
                    { lang === "es" ? "Recuperar contraseña" : "Recover password" }
                </ActionButton>
            </form>
        </section>
    )
}
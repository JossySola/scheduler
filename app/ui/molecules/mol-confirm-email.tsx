import ExpiringTokenInput from "../atoms/atom-token-input";

export default function ConfirmEmail ({children, lang }: {
    children: React.JSX.Element,
    lang: "en" | "es"
}) {

    return (
        <fieldset className="w-full sm:w-[400px] p-3">
            { lang === "es" ? 
                <h4 className="m-2">Hemos enviado un correo electrónico que contiene un código, por favor ingresalo aquí para verificar tu cuenta. Recuerda checar la carpeta de <b>Spam</b> si no ves el e-mail en tu <b>Bandeja de Entrada</b>.</h4> : 
                <h4 className="m-2">We've sent you an e-mail with a code, please type it here to verify your account. Remember to check your <b>Junk</b> folder in case you don't see the confirmation e-mail in your <b>Inbox</b>.</h4>    
            }
            
            <ExpiringTokenInput lang={lang as "es" | "en"} />
            
            { children }
        </fieldset>
    )
}
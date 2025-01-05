import { handleEmailConfirmation } from "@/app/lib/utils-server";
import { sendEmailConfirmation } from "@/app/lib/utils-server";
import { useActionState, useState } from "react"

export default function ConfirmEmail (form: { email: string }) {
    const [sent, setSent] = useState<boolean>(false);
    const [state, formAction, pending] = useActionState(handleEmailConfirmation, { message: ''});
    
    return (
        <section>
            <h3>We've sent you an e-mail with a code, please type it here to verify your account</h3>
            <h4>Hemos enviado un e-mail que contiene un código, por favor ingresalo aquí para verificar tu cuenta</h4>
            <form action={formAction}>
                <input type="hidden" id="email" name="email" value={form.email}></input>
                <input maxLength={6} id="confirmation-token" name="confirmation-token"></input>
                <button type="submit">{pending ? 'Sending...' : 'Confirm'}</button>
            </form>
            <p>{state.message}</p>

            <button type="button" onClick={(event) => {
                event.preventDefault();
                sendEmailConfirmation(`${form.email}`);
                setSent(true);
            }}>Resend code</button>
            {
                sent ? <p>A new code has been sent!</p> : null
            }
        </section>
    )
}
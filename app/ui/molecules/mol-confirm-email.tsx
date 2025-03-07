"use client"
import { verifyTokenAction } from "@/app/[lang]/signup/actions";
import ExpiringTokenInput from "../atoms/atom-token-input";
import { useActionState } from "react";
import { Button, Form, Input } from "@heroui/react";
import { CheckCircle } from "geist-icons";

export default function ConfirmEmail ({ lang }: {
    lang: "en" | "es",
}) {
    const [ confirmState, confirmAction, confirmPending ] = useActionState(verifyTokenAction, { ok: false, message: "" });

    return (
        <Form className="w-full sm:w-[400px] p-3" action={ confirmAction }>
            { lang === "es" ? 
                <>
                <h4 className="m-2">
                    Hemos enviado un correo electrónico que contiene un código, por favor ingresalo aquí para verificar tu cuenta.
                </h4>
                <h4 className="m-2">
                    Recuerda checar la carpeta de <b>Spam</b> si no ves el e-mail en tu <b>Bandeja de Entrada</b>.
                </h4>
                </>
                : 
                <>
                <h4 className="m-2">
                    We've sent you an e-mail with a code, please type it here to verify your account.
                </h4>
                <h4 className="m-2">
                    Remember to check your <b>Junk</b> folder in case you don't see the confirmation e-mail in your <b>Inbox</b>.
                </h4>
                </>
            }
            <Input
            minLength={6}
            maxLength={6}
            name="confirmation-token"
            id="confirmation-token"
            variant="flat"
            radius="md"
            size="lg"
            isClearable />
            <ExpiringTokenInput lang={ lang as "es" | "en" } />
            
            <p aria-live="polite" className="text-danger mt-5">{ confirmState.message }</p>
            <Button
            className="bg-white text-black mt-3"
            type="submit"
            isDisabled={ confirmPending }
            isLoading={ confirmPending }
            endContent={ <CheckCircle /> }>
                { lang === "es" ? "Confirmar" : "Confirm" }
            </Button>
        </Form>
    )
}
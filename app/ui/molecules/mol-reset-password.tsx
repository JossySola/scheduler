"use client"
import { useActionState } from "react";
import { passwordResetAction } from "../../[lang]/reset/actions";
import FormInputPassword from "../atoms/atom-form-input-password";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";

export default function ResetPassword({ token }: {
    token: string
}) {
    const [ resetState, resetAction, pending ] = useActionState(passwordResetAction, { message: "" });
    const params = useParams();
    const { lang } = params;

    return (
        <section className="w-full p-3 sm:w-[400px] flex flex-col justify-center items-center pt-5">
            <form action={resetAction}>
                <input type="text" name="token" value={token} readOnly hidden />
                <FormInputPassword />
                
                <p aria-live="polite" className="text-danger">{resetState.message}</p>
                <Button type="submit" className="action-button" isLoading={pending} isDisabled={pending}>
                    { lang === "es" ? "Cambiar contraseña" : "Change password" }
                </Button>
            </form>
        </section>
    )
}
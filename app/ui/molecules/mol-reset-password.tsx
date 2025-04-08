"use client"
import { ActionButton } from "@/app/ui/atoms/atom-button";
import { useActionState } from "react";
import { passwordResetAction } from "../../[lang]/reset/actions";
import FormInputPassword from "../atoms/atom-form-input-password";
import { useParams } from "next/navigation";

export default function ResetPassword({ token }: {
    token: string
}) {
    const [ resetState, resetAction, pending ] = useActionState(passwordResetAction, { message: "" });
    const params = useParams();
    const { lang } = params;

    return (
        <form action={resetAction}>
            <input type="text" name="token" value={token} readOnly hidden />
            <FormInputPassword />
            
            <p aria-live="polite" className="text-danger">{resetState.message}</p>
            <ActionButton type="submit" loading={pending} disabled={pending}>
                { lang === "es" ? "Cambiar contraseña" : "Change password" }
            </ActionButton>
        </form>
    )
}
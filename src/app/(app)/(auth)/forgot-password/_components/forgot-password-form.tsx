"use client"
import { ForgotFormProps } from "@/lib/definitions";
import { forgotPasswordAction } from "@/src/app/(app)/(auth)/forgot-password/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import { useActionState } from "react";

export default function ForgotPasswordForm({t}: ForgotFormProps) {
    const [state, dispatchAction, isPending] = useActionState(forgotPasswordAction, { message: "" })

    return (
        <Form action={dispatchAction}>
            <Label>{t.label}</Label>
            <Input placeholder={t.placeholder} type="text" name="email" autoComplete="email" required />
            <Text slot="description">{t.description}</Text>
            <p role="alert">{state.message}</p>        
            <ActionButton type="submit" isDisabled={isPending}>{t.button}</ActionButton>
        </Form>
    )
}
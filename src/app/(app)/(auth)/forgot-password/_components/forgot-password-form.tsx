"use client"
import { forgotPasswordAction } from "@/src/app/(app)/(auth)/forgot-password/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

export default function ForgotPasswordForm() {
    const [state, dispatchAction, isPending] = useActionState(forgotPasswordAction, { message: "" })
    const translation = useTranslations("forgot-form");

    return (
        <Form action={dispatchAction}>
            <Label>{translation("label")}</Label>
            <Input placeholder={translation("placeholder")} type="text" name="email" autoComplete="email" required />
            <Text slot="description">{translation("description")}</Text>
            <p role="alert">{state.message}</p>
            {
                state.errors ? <p role="alert">{state.errors[0]}</p> : null
            }            
            <ActionButton type="submit" isDisabled={isPending}>{translation("button")}</ActionButton>
        </Form>
    )
}
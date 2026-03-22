"use client"
import { forgotPasswordAction } from "@/app/(app)/forgot-password/actions"
import ActionButton from "@/ui/buttons/action-button"
import Form from "@/ui/form/form"
import Input from "@/ui/input/input"
import Label from "@/ui/label/label"
import Text from "@/ui/text/text"
import { useActionState } from "react"

export default function ForgotPasswordForm() {
    const [state, dispatchAction, isPending] = useActionState(forgotPasswordAction, { message: "" })
    return (
        <Form action={dispatchAction}>
            <Label>Enter your email</Label>
            <Input type="text" name="email" autoComplete="email" required />
            <Text slot="description">We will send you an email in order to proceed with the password reset process. If you don't see the email in your inbox, please wait a few minutes or check your spam folder.</Text>
            <p>{state.message}</p>
            {
                state.errors ? <p>{state.errors[0]}</p> : null
            }            
            <ActionButton type="submit" isDisabled={isPending}>Send reset request</ActionButton>
        </Form>
    )
}
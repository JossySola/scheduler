"use client"
import { requestPasswordReset } from "@/app/(app)/reset-password/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import TextField from "@/ui/textField/text-field";
import { useActionState } from "react";

export default function ResetForm({ token }: { token: string }) {
    const [state, dispatchAction, isPending] = useActionState(requestPasswordReset, { message: "" })
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>New password</Label>
                <Input placeholder="Enter your new password" name="password" autoComplete="new-password" required />
            </TextField>
            <Input name="token" value={token} hidden />
            <p>{state.message}</p>
            <ActionButton type="submit" isDisabled={isPending}>Reset password</ActionButton>
        </Form>
    )
}
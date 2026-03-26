"use client"
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import { useActionState } from "react";
import { Button } from "react-aria-components";
import { deleteAccountAction } from "../actions";
import { DeleteFormProps } from "@/lib/definitions";

export default function DeleteForm({t}: DeleteFormProps) {
    const [state, dispatchAction, isPending] = useActionState(deleteAccountAction, { message: "" });
    return (
        <Form action={dispatchAction}>
            <Text slot="description">{t.warning}</Text>
            <Label>{t.label}</Label>
            <Input placeholder={t.placeholder} name="password" autoComplete="current-password" required />
            <p role="alert">{state.message}</p>
            <Button type="submit" isDisabled={isPending}>{t.button}</Button>
        </Form>
    )
}
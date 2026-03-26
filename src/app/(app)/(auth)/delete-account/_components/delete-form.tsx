"use client"
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import { useActionState } from "react";
import { Button } from "react-aria-components";
import { deleteAccountAction } from "../actions";
import { useTranslations } from "next-intl";

export default function DeleteForm() {
    const [state, dispatchAction, isPending] = useActionState(deleteAccountAction, { message: "" });
    const translation = useTranslations("delete-form");
    return (
        <Form action={dispatchAction}>
            <Text slot="description">{translation("warning")}</Text>
            <Label>{translation("label")}</Label>
            <Input placeholder={translation("placeholder")} name="password" autoComplete="current-password" required />
            <p role="alert">{state.message}</p>
            <Button type="submit" isDisabled={isPending}>{translation("button")}</Button>
        </Form>
    )
}
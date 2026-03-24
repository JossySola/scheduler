"use client"

import Form from "@/ui/form/form"
import Input from "@/ui/input/input"
import Label from "@/ui/label/label"
import Text from "@/ui/text/text"
import { useActionState } from "react"
import { Button } from "react-aria-components"
import { deleteAccountAction } from "../actions"

export default function DeleteForm() {
    const [state, dispatchAction, isPending] = useActionState(deleteAccountAction, { message: "" });
    return (
        <Form action={dispatchAction}>
            <Text slot="description">CAUTION: You will need to confirm this action with your password, as this action is irreversible.</Text>
            <Label>Password</Label>
            <Input placeholder="Enter your password" name="password" autoComplete="current-password" required />
            <p>{state.message}</p>
            <Button type="submit" isDisabled={isPending}>Delete account</Button>
        </Form>
    )
}
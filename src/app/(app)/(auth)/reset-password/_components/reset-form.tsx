"use client"
import { requestPasswordResetAction } from "@/src/app/(app)/(auth)/reset-password/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import TextField from "@/ui/textField/text-field";
import { useActionState, useState } from "react";
import Visibility from '@react-spectrum/s2/icons/Visibility';
import VisibilityOff from '@react-spectrum/s2/icons/VisibilityOff';
import { Button } from "react-aria-components";
import { ResetFormProps } from "@/lib/definitions";

export default function ResetForm({ token, t }: { token: string, t: ResetFormProps }) {
    const [state, dispatchAction, isPending] = useActionState(requestPasswordResetAction, { message: "" })
    const [isVisible, setIsVisible] = useState(false);
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>{t.label}</Label>
                <div>
                    <Input placeholder={t.placeholder} type={isVisible ? "text" : "password"} name="password" autoComplete="new-password" required />
                    <Button type='button' aria-label='switch password visibility' onClick={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
            </TextField>
            <Input name="token" value={token} hidden readOnly />
            <p role="alert">{state.message}</p>
            {
                state.errors ? <p role="alert">{state.errors[0]}</p> : null
            }
            <ActionButton type="submit" isDisabled={isPending}>{t.button}</ActionButton>
        </Form>
    )
}
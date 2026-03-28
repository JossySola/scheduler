"use client"
import { updatePasswordAction } from "@/src/app/(app)/(auth)/update-password/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import TextField from "@/ui/textField/text-field";
import { useActionState, useState } from "react";
import { Button } from "react-aria-components";
import Visibility from '@react-spectrum/s2/icons/Visibility';
import VisibilityOff from '@react-spectrum/s2/icons/VisibilityOff';
import { UpdateFormProps } from "@/lib/definitions";

export default function UpdatePasswordForm({t}: UpdateFormProps) {
    const [state, dispatchAction, isPending] = useActionState(updatePasswordAction, { message: "" });
    const [isVisible, setIsVisible] = useState(false);
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>{t.labelCurrent}</Label>
                <div>
                    <Input placeholder={t.placeholderCurrent} type={isVisible ? "text" : "password"} name="current-password" autoComplete="current-password" required />
                    <Button type='button' aria-label='switch password visibility' onClick={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
            </TextField>
            <TextField type="text">
                <Label>{t.labelNew}</Label>
                <div>
                    <Input placeholder={t.placeholderNew} type={isVisible ? "text" : "password"} name="new-password" autoComplete="new-password" required />
                    <Button type='button' aria-label='switch password visibility' onClick={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
            </TextField>
            <p role="alert">{state.message}</p>    
            <ActionButton type="submit" isDisabled={isPending}>{t.button}</ActionButton>
        </Form>
    )
}
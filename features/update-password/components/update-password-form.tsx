"use client"
import { updatePasswordAction } from "@/app/(app)/update-password/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import TextField from "@/ui/textField/text-field";
import { useActionState, useState } from "react";
import { Button } from "react-aria-components";
import Visibility from '@react-spectrum/s2/icons/Visibility';
import VisibilityOff from '@react-spectrum/s2/icons/VisibilityOff';

export default function UpdatePasswordForm() {
    const [state, dispatchAction, isPending] = useActionState(updatePasswordAction, { message: "" });
    const [isVisible, setIsVisible] = useState(false);
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>Current password</Label>
                <div>
                    <Input placeholder="Enter your current password" type={isVisible ? "text" : "password"} name="current-password" autoComplete="current-password" required />
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
                <Label>New password</Label>
                <div>
                    <Input placeholder="Enter your new password" type={isVisible ? "text" : "password"} name="new-password" autoComplete="new-password" required />
                    <Button type='button' aria-label='switch password visibility' onClick={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
            </TextField>
            <p>{state.message}</p>
            {
                state.errors ? <p>{state.errors[0]}</p> : null
            }        
            <ActionButton type="submit" isDisabled={isPending}>Update password</ActionButton>
        </Form>
    )
}
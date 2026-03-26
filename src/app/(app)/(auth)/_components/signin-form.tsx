"use client"
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import TextField from "@/ui/textField/text-field";
import { useActionState, useState } from "react";
import { Button } from "react-aria-components";
import Visibility from '@react-spectrum/s2/icons/Visibility';
import VisibilityOff from '@react-spectrum/s2/icons/VisibilityOff';
import ActionButton from "@/ui/buttons/action-button";
import { signInAction } from "../signin/actions";
import { useTranslations } from "next-intl";


export default function SignInForm() {
    const [state, dispatchAction, isPending] = useActionState(signInAction, { message: "" });
    const [username, setUsername] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const translation = useTranslations("signin-form");
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>{translation("username")}</Label>
                <Input
                placeholder={translation("placeholderUsername")}
                name="username"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)} />
            </TextField>
            <TextField type={isVisible ? "text" : "password"}>
                <Label>{translation("password")}</Label>
                <div>
                    <Input placeholder={translation("placeholderPassword")} name="password" minLength={8} autoComplete="" required />
                    <Button type="button" aria-label="switch password visibility" onClick={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
            </TextField>
            <p role="alert">{state.message}</p>
            {
                state.errors ? <p role="alert">{state.errors[0]}</p> : null
            }            
            <ActionButton type="submit" isDisabled={isPending}>{translation("button")}</ActionButton>
        </Form>
    )
}
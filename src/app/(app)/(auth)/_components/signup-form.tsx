"use client"
import Visibility from '@react-spectrum/s2/icons/Visibility';
import VisibilityOff from '@react-spectrum/s2/icons/VisibilityOff';
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import TextField from "@/ui/textField/text-field";
import { useActionState, useState } from "react";
import { Button } from 'react-aria-components';
import { signUpAction } from '../signup/actions';
import { useTranslations } from 'next-intl';

export default function SignUpForm() {
    const [state, dispatchAction, isPending] = useActionState(signUpAction, { message: "" });
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const translation = useTranslations("signup-form");
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>{translation("name")}</Label>
                <Input 
                placeholder={translation("placeholderName")}
                name="name" 
                autoComplete="name" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}/>
            </TextField>

            <TextField type="text">
                <Label>{translation("username")}</Label>
                <Input 
                placeholder={translation("placeholderUsername")}
                name="username" 
                autoComplete="username" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}/>
            </TextField>

            <TextField type="email">
                <Label>{translation("email")}</Label>
                <Input 
                placeholder={translation("placeholderEmail")} 
                name="email" 
                autoComplete="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}/>
            </TextField>

            <TextField type={isVisible ? "text" : "password"}>
                <Label>{translation("password")}</Label>
                <div>
                    <Input placeholder={translation("placeholderPwd")} name="password" minLength={8} autoComplete="new-password" required />
                    <Button type='button' aria-label='switch password visibility' onPress={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
                <Text slot="description">
                    {translation("pwd-description")}
                </Text>
            </TextField>

            <TextField type={isVisible ? "text" : "password"}>
                <Input placeholder={translation("placeholderConfirm")} name="confirm-password" minLength={8} autoComplete="new-password" required />
            </TextField>

            <Text slot="description">
                {translation("legal-description")}
            </Text>

            <p role='alert'>{state.message}</p>
            {
                state.errors ? <p role='alert'>{state.errors[0]}</p> : null
            }            
            <ActionButton type="submit" isDisabled={isPending}>{translation("button")}</ActionButton>
        </Form>
    )
}
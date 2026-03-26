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
import { AuthFormProps } from '@/lib/definitions';

export default function SignUpForm({t}: {t: AuthFormProps}) {
    const [state, dispatchAction, isPending] = useActionState(signUpAction, { message: "" });
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>{t.name}</Label>
                <Input 
                placeholder={t.placeholderName}
                name="name" 
                autoComplete="name" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}/>
            </TextField>

            <TextField type="text">
                <Label>{t.username}</Label>
                <Input 
                placeholder={t.placeholderUsername}
                name="username" 
                autoComplete="username" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}/>
            </TextField>

            <TextField type="email">
                <Label>{t.email}</Label>
                <Input 
                placeholder={t.placeholderEmail} 
                name="email" 
                autoComplete="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}/>
            </TextField>

            <TextField type={isVisible ? "text" : "password"}>
                <Label>{t.password}</Label>
                <div>
                    <Input placeholder={t.placeholderPassword} name="password" minLength={8} autoComplete="new-password" required />
                    <Button type='button' aria-label='switch password visibility' onPress={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
                <Text slot="description">
                    {t["pwd-description"]}
                </Text>
            </TextField>

            <TextField type={isVisible ? "text" : "password"}>
                <Input placeholder={t.placeholderConfirm} name="confirm-password" minLength={8} autoComplete="new-password" required />
            </TextField>

            <Text slot="description">
                {t["legal-description"]}
            </Text>

            <p role='alert'>{state.message}</p>
            {
                state.errors ? <p role='alert'>{state.errors[0]}</p> : null
            }            
            <ActionButton type="submit" isDisabled={isPending}>{t.signUpBtn}</ActionButton>
        </Form>
    )
}
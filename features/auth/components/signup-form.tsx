"use client"
import Visibility from '@react-spectrum/s2/icons/Visibility';
import VisibilityOff from '@react-spectrum/s2/icons/VisibilityOff';
import { signUpAction } from "@/app/(app)/(auth)/signup/actions";
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import TextField from "@/ui/textField/text-field";
import { useActionState, useState } from "react";
import { Button } from 'react-aria-components';

export default function SignUpForm() {
    const [state, dispatchAction, isPending] = useActionState(signUpAction, { message: "" });
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    return (
        <Form action={dispatchAction}>
            <TextField type="text">
                <Label>Name</Label>
                <Input 
                placeholder="Enter your name" 
                name="name" 
                autoComplete="name" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}/>
            </TextField>

            <TextField type="text">
                <Label>Username</Label>
                <Input 
                placeholder="Enter a username" 
                name="username" 
                autoComplete="username" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}/>
            </TextField>

            <TextField type="email">
                <Label>Email</Label>
                <Input 
                placeholder="Enter your email" 
                name="email" 
                autoComplete="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}/>
            </TextField>

            <TextField type={isVisible ? "text" : "password"}>
                <Label>Password</Label>
                <div>
                    <Input placeholder="Choose a password" name="password" minLength={8} autoComplete="new-password" required />
                    <Button type='button' aria-label='switch password visibility' onClick={() => setIsVisible(prev => !prev)}>
                        {
                            isVisible 
                            ? <VisibilityOff />
                            : <Visibility />
                        }
                    </Button>
                </div>
                <Text slot="description">
                    We highly recommend using your Password Manager suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!
                </Text>
            </TextField>

            <TextField type={isVisible ? "text" : "password"}>
                <Input placeholder="Confirm your password" name="confirm-password" minLength={8} autoComplete="new-password" required />
            </TextField>

            <Text slot="description">
                By completing the sign up process and/or signing in with an external provider, you agree with our Terms & Conditions.
            </Text>

            <p>{state.message}</p>
            {
                state.errors ? <p>{state.errors[0]}</p> : null
            }            
            <ActionButton type="submit" isDisabled={isPending}>Sign Up</ActionButton>
        </Form>
    )    
}
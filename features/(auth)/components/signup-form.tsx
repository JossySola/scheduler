"use client"
import ActionButton from "@/ui/buttons/action-button";
import Form from "@/ui/form/form";
import Input from "@/ui/input/input";
import Label from "@/ui/label/label";
import Text from "@/ui/text/text";
import TextField from "@/ui/textField/text-field";

export default function SignUpForm() {
    return (
        <Form>
            <TextField type="text">
                <Label>Name</Label>
                <Input placeholder="Enter your name" name="name" autoComplete="name" required />
            </TextField>
            <TextField type="text">
                <Label>Username</Label>
                <Input placeholder="Enter a username" name="username" autoComplete="username" required />
            </TextField>
            <TextField type="email">
                <Label>Email</Label>
                <Input placeholder="Enter your email" name="email" autoComplete="email" required />
            </TextField>
            <TextField type="password">
                <Label>Password</Label>
                <Input placeholder="Choose a password" name="password" minLength={8} autoComplete="new-password" required />
                <Text slot="description">
                    We highly recommend using your Password Manager suggestion to create a strong password. This way, your password will be securely stored and you'll be able to use it without the need to memorize it!
                </Text>
            </TextField>
            <TextField type="password">
                <Input placeholder="Confirm your password" name="confirm-password" minLength={8} autoComplete="new-password" required />
            </TextField>
            <Text slot="description">
                By completing the sign up process and/or signing in with an external provider, you agree with our Terms & Conditions.
            </Text>
            <ActionButton type="submit">Sign Up</ActionButton>
        </Form>
    )    
}
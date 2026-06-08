'use client'
import { signUpSchema } from "@/lib/schemas";
import Form from "@/ui/form/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod/v4";
import signUpNewUser from "../_utils/sign-up";
import { TextField } from "@/ui/text-field/text-field";
import ActionButton from "@/ui/buttons/action-button";
import { Button } from "react-aria-components";
import { Eye, EyeOff } from "@/ui/icons/geist/icons";
import Link from "next/link";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isRevealed, setIsRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignUp = async (formData: FormData) => {
        setIsLoading(true);
        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }
        try {
            signUpSchema.parse({
                email,
                password,
                confirmPassword,
            });
            const { error } = await signUpNewUser(email, password, `${window.location.origin}/dashboard`);
            if (error) throw error;
            router.push("/sign-up-success");
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                setError(error.issues[0].message);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form action={handleSignUp}>
            <TextField 
            label="Email" 
            name="email" 
            type="text"
            value={email}
            placeholder="Enter your email" 
            autoComplete="email"
            onChange={setEmail} isRequired />
            <div aria-hidden>
                <TextField
                label="Password"
                name="password"
                type={ isRevealed ? "text" : "password" }
                value={password}
                placeholder="Enter a password"
                description="We highly recommend using your Password Manager suggestion to get a strong password and store it"
                autoComplete="new-password"
                onChange={setPassword} isRequired />
                <Button 
                type="button" 
                aria-label={isRevealed ? "Hide password" : "Reveal password"}
                onPress={() => setIsRevealed((isRevealed) => !isRevealed)}>
                    { isRevealed ? <EyeOff /> : <Eye /> }
                </Button>
            </div>
            <TextField 
            label="Confirm password"
            name="confirmPassword"
            type={ isRevealed ? "text" : "password" }
            value={repeatPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            onChange={setRepeatPassword} isRequired/>

            <ActionButton type="submit" isDisabled={isLoading} isPending={isLoading}>Sign Up</ActionButton>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="mt-4 text-center text-sm">
                Aready have an account?{' '}
                <Link href="/login" className="underline underline-offset-4">
                Sign in
                </Link>
            </div> 
        </Form>
    )
}
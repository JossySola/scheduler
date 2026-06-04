'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from "zod/v4";
import Link from 'next/link';
import { signInSchema } from '@/lib/schemas';
import signInWithEmail from '../_utils/sign-in';
import Form from '@/ui/form/form';
import { TextField } from '@/ui/text-field/text-field';
import { Button } from 'react-aria-components';
import { Eye, EyeOff } from '@/ui/icons/geist/icons';
import ActionButton from '@/ui/buttons/action-button';

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (formData: FormData) => {
        setIsLoading(true);
        const email = formData.get("email")?.toString() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        try {
            signInSchema.parse({
                email,
                password,
            });
            const { error } = await signInWithEmail(email, password);
            if (error) throw error;
            // Update this route to redirect to an authenticated route. The user already has an active session.
            router.push('/dashboard');
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
    <Form action={handleLogin}>
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
        <Link
        href="/forgot-password"
        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
        >
        Forgot your password?
        </Link>
        <ActionButton type="submit" isDisabled={isLoading} isPending={isLoading}>Sign In</ActionButton>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
            </Link>
        </div>    
    </Form>
  )
}
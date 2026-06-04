'use client'
import { useState } from 'react';
import * as z from "zod/v4";
import Link from 'next/link';
import resetPassword from '../_utils/reset-password';
import Form from '@/ui/form/form';
import { TextField } from '@/ui/text-field/text-field';
import ActionButton from '@/ui/buttons/action-button';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (formData: FormData) => {
    setIsLoading(true);
    const email = formData.get("email")?.toString() ?? "";

    try {
        z.email().nonempty().parse(email);
        // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
        const { error } = await resetPassword(email, `${window.location.origin}/update-password`);
        if (error) throw error;
        setSuccess(true);
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
    <section>
      {success ? (
        <div>
          <h2 className="text-2xl">Check Your Email</h2>
          <p>Password reset instructions sent</p>
          <p className="text-sm text-muted-foreground">
            If you registered using your email and password, you will receive a password reset
            email.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl">Reset Your Password</h2>
          <p>
            Type in your email and we&apos;ll send you a link to reset your password
          </p>
          <Form action={handleForgotPassword}>
            <TextField
            label="Email"
            type="email"
            name="email"
            placeholder="me@example.com"
            value={email}
            onChange={setEmail} isRequired autoComplete='off'/>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <ActionButton type="submit" className="w-full" isDisabled={isLoading} isPending={isLoading}>
              {isLoading ? 'Sending...' : 'Send reset email'}
            </ActionButton>

            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </Form>
        </div>
      )}
    </section>
  )
}
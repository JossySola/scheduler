'use client'
import * as z from "zod/v4";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import updatePassword from '../_utils/update-password';
import { updatePasswordSchema } from "@/lib/schemas";
import Form from "@/ui/form/form";
import ActionButton from "@/ui/buttons/action-button";
import { TextField } from "@/ui/text-field/text-field";
import { Button } from "react-aria-components";
import { Eye, EyeOff } from "@/ui/icons/geist/icons";

export default function UpdatePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleForgotPassword = async (formData: FormData) => {
        setIsLoading(true);
        const currentPassword = formData.get("current-password")?.toString() ?? "";
        const newPassword = formData.get("new-password")?.toString() ?? "";
        try {
            updatePasswordSchema.parse({
                currentPassword,
                newPassword,
            })
            const { error } = await updatePassword(newPassword, currentPassword);
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
        <section>
            <h2 className="text-2xl">Reset Your Password</h2>
            <p>Please enter your new password below.</p>
            
            <Form action={handleForgotPassword}>
            <div aria-hidden>
                <TextField
                label="Current password"
                name="current-password"
                type={ isRevealed ? "text" : "password" }
                value={currentPassword}
                placeholder="Enter your current password"
                autoComplete="off"
                onChange={setCurrentPassword} isRequired />
                <Button 
                type="button" 
                aria-label={isRevealed ? "Hide password" : "Reveal password"}
                onPress={() => setIsRevealed((isRevealed) => !isRevealed)}>
                    { isRevealed ? <EyeOff /> : <Eye /> }
                </Button>
            </div>
            <TextField 
            label="New password"
            name="new-password"
            type={ isRevealed ? "text" : "password" }
            value={newPassword}
            placeholder="Enter a new password"
            description="We highly recommend using your Password Manager suggestion to get a strong password and store it"
            autoComplete="new-password"
            onChange={setNewPassword} isRequired/>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <ActionButton type="submit" isDisabled={isLoading} isPending={isLoading}>Sign Up</ActionButton>
            </Form>
        </section>
    )
}
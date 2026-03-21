"use client"
import { authClient } from "@/features/auth/utils/auth-client";
import PrimaryButton from "../../../ui/buttons/primary-button";
import { redirect } from "next/navigation";

export default function SignUpButton() {
    const { data: session } = authClient.useSession();
    if (!session) {
        return <PrimaryButton type="button" aria-label="sign up" onClick={e => redirect("/signup")}>Sign Up</PrimaryButton>
    }
    return null;
}
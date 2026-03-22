"use client"
import { authClient } from "../_utils/auth-client";
import { redirect } from "next/navigation";
import SecondaryButton from "../../../../ui/buttons/secondary-button";

export default function SignInButton() {
    const { data: session } = authClient.useSession();
    if (!session) {
        return <SecondaryButton type="button" aria-label="sign in" onClick={e => redirect("/signin")}>Sign In</SecondaryButton>
    }
    return null;
}
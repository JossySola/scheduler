"use client"
import { useActionState } from "react";
import { SubmitButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";
import Link from "next/link";
import { LogInAction } from "@/app/(routes)/login/actions";

export default function LogIn () {
    const [loginState, loginAction, pending] = useActionState(LogInAction, { message: "" });
    return (
        <>
            <form action={loginAction}>
                <label>
                    E-mail or username
                    <input name="username" id="username" type="text" autoComplete="username"/>
                </label>
                <label>
                    Password
                    <Password />
                </label>
                <Link href={"/reset"}>Reset password</Link>
                <SubmitButton text="Log In" disabled={pending} />
                <p aria-live="polite">{loginState.message}</p>
            </form>

            <p>If you don't have an account yet, <Link href={"/signup"}>Signup</Link></p>
        </>
    )
}
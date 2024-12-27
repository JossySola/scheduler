import { signIn } from "@/auth";
import { SubmitButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";

export default function LogIn () {
    return (
        <form action={async (formData) => {
            "use server"
            await signIn("credentials", { formData, redirect: true, redirectTo: '/dashboard' });
        }}>
            <label>
                E-mail or username
                <input name="username" type="text" />
            </label>
            <label>
                Password
                <Password />
            </label>
            <SubmitButton text="Log In" />
        </form>
    )
}
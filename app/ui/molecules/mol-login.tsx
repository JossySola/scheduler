import { signIn } from "@/auth";
import { SubmitButton } from "../atoms/atom-button";
import Password from "../atoms/atom-password";

export default function LogIn () {
    return (
        <form action={async () => {
            "use server"
            await signIn();
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
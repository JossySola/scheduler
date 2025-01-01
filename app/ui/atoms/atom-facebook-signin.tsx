import { signIn } from "@/auth"

export default function FacebookSignIn () {
    return (
        <form action={async () => {
            "use server"
            await signIn("facebook", { redirect: true, redirectTo: "/dashboard" });
        }}>
            <button type="submit">Signin with Facebook</button>
        </form>
    )
}
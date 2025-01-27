import { signIn } from "@/auth";

export default function GoogleSignIn () {
    return (
        <form action={async () => {
            "use server"
            await signIn("google", { redirect: true, redirectTo: "/dashboard"});
        }}>
            <button type="submit">Signin with Google</button>
        </form>
    )
}
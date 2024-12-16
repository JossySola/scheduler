import { signIn } from "@/auth"

export default function LogInButton () {
    return (
        <form action={async () => {
            "use server"
            await signIn("credentials", { redirectTo: "/dashboard" });
        }}>
            <button type="submit">Log In</button>
        </form>
        
    )
}
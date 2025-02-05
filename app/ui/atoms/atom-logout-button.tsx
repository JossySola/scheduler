import { signOut } from "@/auth";

export default function LogOutButton () {
    return (
        <form action={async () => {
            "use server"
            await signOut({
                redirect: true,
                redirectTo: "/login"
            })
        }}>
            <button type="submit">Sign Out</button>
        </form>
    )
}
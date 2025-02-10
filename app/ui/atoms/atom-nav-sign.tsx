import LogOutButton from "./atom-logout-button";
import LogInButton from "./atom-login-button";
import SignUpButton from "./atom-signup-button";
import { auth } from "@/auth";

export default async function SignNav () {
    const session = await auth();

    return (
        <nav>
            {
                session?.user ? <LogOutButton /> : (
                <>
                    <LogInButton  />
                    <SignUpButton />
                </>)
            }
        </nav>
    )
}
import UserProfile from "@/app/ui/atoms/atom-user-profile";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Page () {
    const session = await auth();

    if (session?.user) {
        return (
            <>
                <Link href="/table/new">Create new</Link>
                <UserProfile />
            </>
        )
    }
    return (
        <p>Unauthorized</p>
    )
}
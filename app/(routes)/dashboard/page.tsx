import UserProfile from "@/app/ui/atoms/atom-user-profile";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    return redirect('/login');
}
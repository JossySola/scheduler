import XPanel from "@/app/ui/organisms/org-XPanel";
import { auth } from "@/auth"

export default async function Page () {
    const session = await auth();

    if (session?.user) {
        return (
            <XPanel id={session.user.id}/>
        )
    }
    return (
        <p>Unauthorized</p>
    )
}
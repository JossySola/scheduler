import XPanel from "@/app/ui/organisms/org-XPanel";
import { auth } from "@/auth";

export default async function Page ({ params }: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const session = await auth();

    if (session?.user) {
        return <XPanel id={id} />
    }
    return (
        <p>Unauthenticated</p>
    )
}
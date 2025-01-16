import XPanel from "@/app/ui/organisms/org-XPanel";
import { auth } from "@/auth";

export default async function Page ({
    params,
}: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const session = await auth();

    if (id && session) {
        return (
            <>
            <XPanel id={id} />
            </>
        )
    }
    
    return (
        <p>Unauthorized</p>
    )
}
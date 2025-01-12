import XPanel from "@/app/ui/organisms/org-XPanel";

export default async function Page ({
    params,
}: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    
    return (
        <>
        <XPanel id={id} />
        </>
    )
}
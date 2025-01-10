import XForm from "@/app/ui/molecules/mol-XForm";

export default async function Page ({
    params,
}: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    
    return (
        <>
            <XForm id={id}/>
        </>
    )
}
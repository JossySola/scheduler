
export default async function Page ({ params }: {
    params: { id: string }
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:3000/api/table/${params.id}`);
    // _8eea43e99cbd4fafb6ca50bc098f48f0_untitled_1731303485221
    
    return (
        <>
            <p>{params.id}</p>
        </>
    )
}
export default async function Page ({ params }: {
    params: { id: string }
}) {
    const id = (await params).id
    const res = await fetch(`http://localhost:3000/api/edit?id=${id}`, {
        method: 'GET',
        cache: 'no-store',
    });
    const data = await res.json();
    // console.log(data)
    // http://localhost:3000/table/edit/_8eea43e99cbd4fafb6ca50bc098f48f0_untitled_1731303485221
    return (
        <>
        </>
    )
}
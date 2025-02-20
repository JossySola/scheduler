export default function Layout ({
    children,
    list,
}: {
    children: React.ReactNode,
    list: React.ReactNode,
}) {
    return (
        <>
        { children }
        { list }
        </>
    )
}
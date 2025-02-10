export default function Layout ({
    children,
    list,
    modal,
}: {
    children: React.ReactNode,
    list: React.ReactNode,
    modal: React.ReactNode,
}) {
    return (
        <>
        { children }
        { list }
        { modal }
        </>
    )
}
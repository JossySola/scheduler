export default function Layout ({ children } : 
    Readonly<{ children: React.ReactNode }>) {
    return (
        <section>
            { children }
        </section>
    )
}
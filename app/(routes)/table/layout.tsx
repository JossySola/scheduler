export const experimental_ppr = true;

export default function Layout({ children } : { children: React.ReactNode }) {
    return (
        <main>
            <h2>Table - Layout.tsx</h2>
            {children}
        </main>
    )
}
import LogInButton from "../ui/atoms/atom-login-button";

export default function Layout ({ children } : 
    Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <nav>
                <LogInButton />
            </nav>
            {children}
        </>
    )
}
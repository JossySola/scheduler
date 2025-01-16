import Branding from "./ui/atoms/atom-branding";
import SignNav from "./ui/atoms/atom-nav-sign";

export default function Template({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SignNav />
            {children}
            <Branding />
        </>
    )
}
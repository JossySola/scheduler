import Footer from "./ui/atoms/atom-footer";
import SignNav from "./ui/atoms/atom-nav-sign";

export default async function Template({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SignNav />
            {children}
            <Footer />
        </>
    )
}
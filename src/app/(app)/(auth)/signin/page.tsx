import SignInForm from "@/app/(app)/(auth)/_components/signin-form";
import SignInProviders from "@/app/(app)/(auth)/_components/signin-providers";

export default async function Page() {
    return (
        <section>
            <SignInProviders />
            <SignInForm />        
        </section>
    )
}
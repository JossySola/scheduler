import SignInForm from "@/features/auth/components/signin-form";
import SignInProviders from "@/features/auth/components/signin-providers";

export default async function Page() {
    return (
        <section>
            <SignInProviders />
            <SignInForm />        
        </section>
    )
}
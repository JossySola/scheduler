import SignInForm from "@/src/app/(app)/(auth)/_components/signin-form";
import SignInProviders from "@/src/app/(app)/(auth)/_components/signin-providers";

export default async function Page() {
    return (
        <section>
            <SignInProviders />
            <SignInForm />        
        </section>
    )
}
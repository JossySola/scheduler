import SignInProviders from "@/src/app/(app)/(auth)/_components/signin-providers";
import SignUpForm from "@/src/app/(app)/(auth)/_components/signup-form";

export default async function SignUpPage() {
    return (
        <section>
            <SignInProviders />
            <SignUpForm />
        </section>
    )
}
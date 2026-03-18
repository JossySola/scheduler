import SignInProviders from "@/features/auth/components/signin-providers";
import SignUpForm from "@/features/auth/components/signup-form";

export default async function SignUpPage() {
    return (
        <section>
            <SignInProviders />
            <SignUpForm />
        </section>
    )
}
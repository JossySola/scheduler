import SignInProviders from "@/src/app/(app)/(auth)/_components/signin-providers";
import SignUpForm from "@/src/app/(app)/(auth)/_components/signup-form";
import { getTranslations } from "next-intl/server";

export default async function SignUpPage() {
    const translation = await getTranslations("auth-form");
    return (
        <section>
            <SignInProviders />
            <SignUpForm t={{
                name: translation("name"),
                placeholderName: translation("placeholderName"),
                username: translation("username"),
                placeholderUsername: translation("placeholderUsername"),
                email: translation("email"),
                placeholderEmail: translation("placeholderEmail"),
                password: translation("password"),
                placeholderPassword: translation("placeholderPassword"),
                placeholderConfirm: translation("placeholderConfirm"),
                signUpBtn: translation("signUpBtn")
            }} />
        </section>
    )
}
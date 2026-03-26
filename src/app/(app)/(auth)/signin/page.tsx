import SignInForm from "@/src/app/(app)/(auth)/_components/signin-form";
import SignInProviders from "@/src/app/(app)/(auth)/_components/signin-providers";
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const translation = await getTranslations("auth-form");
    return (
        <section>
            <SignInProviders />
            <SignInForm t={{
                username: translation("username"),
                placeholderUsername: translation("placeholderUsername"),
                password: translation("password"),
                placeholderPassword: translation("placeholderPassword"),
                signInBtn: translation("signInBtn")
            }} />        
        </section>
    )
}
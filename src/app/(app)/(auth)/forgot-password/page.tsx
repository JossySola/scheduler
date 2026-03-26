import { getTranslations } from "next-intl/server";
import ForgotPasswordForm from "./_components/forgot-password-form";

export default async function ForgotPasswordPage() {
    const translation = await getTranslations("forgot-form");
    return (
        <section>
            <h2>Reset your password</h2>
            <ForgotPasswordForm t={{
                label: translation("label"),
                placeholder: translation("placeholder"),
                description: translation("description"),
                button: translation("button")
            }} />
        </section>
    )
}
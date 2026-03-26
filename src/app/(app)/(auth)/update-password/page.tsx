import { auth } from "@/auth";
import UpdatePasswordForm from "./_components/update-password-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function UpdatePasswordPage() {
    const translation = await getTranslations("update-form");
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        redirect("/signin");
    }    
    return (
        <section>
            <h2>{translation("h2-page")}</h2>
            <UpdatePasswordForm t={{
                labelCurrent: translation("labelCurrent"),
                placeholderCurrent: translation("placeholderCurrent"),
                labelNew: translation("labelNew"),
                placeholderNew: translation("placeholderNew"),
                button: translation("button")
            }}/>
        </section>
    )
}
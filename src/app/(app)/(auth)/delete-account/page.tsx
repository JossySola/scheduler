import { auth } from "@/auth";
import DeleteForm from "./_components/delete-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function DeleteAccountPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const translation = await getTranslations("delete-form");
    if (!session) { redirect("/signin") }    
    return (
        <section>
            <DeleteForm t={{
                warning: translation("warning"),
                label: translation("label"),
                placeholder: translation("placeholder"),
                button: translation("button")
            }}/>
        </section>
    )
}
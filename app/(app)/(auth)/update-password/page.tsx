import { auth } from "@/auth";
import UpdatePasswordForm from "./_components/update-password-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UpdatePasswordPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        redirect("/signin");
    }    
    return (
        <section>
            <h2>Update password</h2>
            <UpdatePasswordForm />
        </section>
    )
}
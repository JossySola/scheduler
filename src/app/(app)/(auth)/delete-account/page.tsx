import { auth } from "@/auth";
import DeleteForm from "./_components/delete-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DeleteAccountPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/signin");
    }    
    return (
        <section>
            <DeleteForm />
        </section>
    )
}
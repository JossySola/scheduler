"use server"
import "server-only"
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function DeleteTableAction (formData: FormData) {
    const table_id = formData.get("item_id")?.toString();
    const session = await auth();

    if (!table_id) {
        return;
    }

    if (!session?.user || !session?.user?.email) {
        return;
    }

    const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/delete`, {
        method: "GET",
        headers: {
            table_id,
            "user_email": session.user.email,
        }
    })
    if (request.ok) {
        redirect('/dashboard');
    }
}
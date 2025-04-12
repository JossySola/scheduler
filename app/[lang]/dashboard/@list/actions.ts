"use server"
import "server-only"
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import pool from "@/app/lib/mocks/db";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";

export async function DeleteTableAction (previousState: { message: string },formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const table_id = formData.get("item_id")?.toString();
    const session = await auth();

    if (!table_id) {
        return {
            message: locale === "es" ? "" : "",
        };
    }

    if (!session?.user || !session?.user?.id) {
        return {
            message: locale === "es" ? "" : "",
        }
    }
    const deletion = await sql`
        DELETE FROM scheduler_users_tables WHERE id = ${table_id} AND user_id = ${session.user.id};
    `;
    if (deletion.rowCount === 0) {
        return {
            message: locale === "es" ? "Hubo un problema al tratar de eliminar la tabla, por favor inténtalo más tarde." : "We failed to delete your schedule, please try again later.",
        }
    }
    const update = await sql`
        UPDATE scheduler_users
        SET num_tables = GREATEST(num_tables - 1, 0)
        WHERE id = ${session.user.id};
    `;

    revalidatePath(`/${locale}/dashboard`);
    revalidatePath(`/${locale}/table/${table_id}`);
    redirect(`/${locale}/dashboard`);
    return {
        message: locale === "es" ? "" : "",
    }
}
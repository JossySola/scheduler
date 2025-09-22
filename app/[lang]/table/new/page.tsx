import pool from "@/app/lib/mocks/db";
import Table from "@/app/ui/v4/table/table";
import { auth } from "@/auth";

export default async function Page () {
    const session = await auth();

    if (session && session.user) {
        return <Table />;
    }
}
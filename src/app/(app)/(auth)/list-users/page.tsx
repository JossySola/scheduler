import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function ListUsersPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return <h2>Unauthorized</h2>;
    }
    const users = await auth.api.listUsers({
        query: {
            
        },
        headers: await headers(),
    });
}
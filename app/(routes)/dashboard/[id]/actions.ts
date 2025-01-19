"use server"
import { auth } from "@/auth";

export async function getTableAction (table_id: string) {
    const session = await auth();
    const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/${table_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'client_email': `${session?.user?.email}`
        }
    });
    const data = await response.json();
    
    return data;
}
"use server"
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function ListUsers(initialState: { message: string }, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        return { message: "Unauthorized" }
    }
    try {
        const searchValue = formData.get("searchValue")?.toString() || "" as string;
        const searchField = formData.get("searchField")?.toString() as "email" | "name";
        const searchOperator = formData.get("searchOperator")?.toString() as "contains" | "starts_with" | "ends_with";
        const limit = formData.get("limit")?.toString() || 10 as string | number;
        const offset = formData.get("offset")?.toString() || 100 as string | number;
        const sortBy = formData.get("sortBy")?.toString() || "" as string;
        const sortDirection = formData.get("sortDirection")?.toString() as "desc" | "asc";
        const filterField = formData.get("filterField")?.toString() || "" as string;
        const filterOperator = formData.get("filterOperator")?.toString() as "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
        const filterValue = formData.get("filterValue")?.toString() || "" as string | number | boolean | string[] | number[];
        const users = await auth.api.listUsers({
            query: {
                searchValue,
                searchField,
                searchOperator,
                limit,
                offset,
                sortBy,
                sortDirection,
                filterField,
                filterOperator,
                filterValue,
            },
            headers: await headers(),
        });
        return users;
    } catch (error: any) {
        console.error(error);
        return { message: error.message || "An error occurred" };
    }
}
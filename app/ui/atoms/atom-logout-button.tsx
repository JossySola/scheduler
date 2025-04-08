import { headers } from "next/headers";
import SignOutButton from "./atom-logout-icon";

export default async function LogOutButton () {
    const requestHeaders = headers();
    const lang = (await requestHeaders).get("x-user-locale") || "en";
    return <SignOutButton lang={ lang as "en" | "es" } />
}
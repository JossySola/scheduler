import { auth } from "@/auth";
import Link from "next/link";
import DisconnectProviders from "./mol-disconnect-providers";
import DangerButton from "../atoms/atom-danger-button";

export default async function Settings () {
    const session = await auth();

    if (session?.user) {
        return (
            <section>
                <Link href="/reset">Reset password</Link>
                <DisconnectProviders />
                <DangerButton />
            </section>
        )
    }
}
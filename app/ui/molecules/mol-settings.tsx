import { auth } from "@/auth";
import DisconnectProviders from "./mol-disconnect-providers";
import DangerButton from "../atoms/atom-danger-button";

export default async function Settings () {
    const session = await auth();
// reset password
    if (session?.user) {
        return (
            <section>
                <DisconnectProviders />
                <DangerButton />
            </section>
        )
    }
}
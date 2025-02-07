import { auth } from "@/auth";
import DisconnectProviders from "./mol-disconnect-providers";
import DangerButton from "../atoms/atom-danger-button";
import PasswordResetButton from "../atoms/atom-button-password-reset";

export default async function Settings () {
    const session = await auth();

    if (session?.user) {
        return (
            <section>
                <PasswordResetButton />
                <DisconnectProviders />
                <DangerButton />
            </section>
        )
    }
}
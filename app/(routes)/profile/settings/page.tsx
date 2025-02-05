import DangerButton from "@/app/ui/atoms/atom-danger-button";
import DisconnectProviders from "@/app/ui/molecules/mol-disconnect-providers";
import Link from "next/link";

export default async function Page () {
    return (
        <>
        <Link href="/reset">Reset password</Link>
        <DisconnectProviders />
        <DangerButton />
        </>
    )
}
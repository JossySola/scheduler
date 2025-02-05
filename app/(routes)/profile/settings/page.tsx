import DangerButton from "@/app/ui/atoms/atom-danger-button";
import DisconnectProviders from "@/app/ui/molecules/mol-disconnect-providers";

export default async function Page () {
    // Options:
    // Reset Password
    // Unlink external provider
    // Delete account

    return (
        <>
        <DisconnectProviders />
        <DangerButton />
        </>
    )
}
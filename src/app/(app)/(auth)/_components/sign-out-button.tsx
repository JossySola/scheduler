'use client'
import TertiaryButton from "@/ui/buttons/tertiary-button";
import signOut from "../_utils/sign-out";

export default function SignOut() {
    const handleClick = async () => {
        const { error } = await signOut();
        
    }
    return (
        <TertiaryButton
        className="cursor-pointer"
        type="button"
        aria-label="Log out session"
        onPress={handleClick}>Log Out</TertiaryButton>
    )
}
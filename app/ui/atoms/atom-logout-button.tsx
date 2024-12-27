"use client"
import { handleSignOut } from "@/app/lib/utils-server";

export default function LogOutButton () {
    return (
        <button type="button" onClick={() => {
            handleSignOut();
        }}>Log Out</button>
    )
}
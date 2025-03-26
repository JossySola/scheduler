"use client"
import { SessionProvider } from "next-auth/react"
import MotionNavbar from "./atom-client-navbar";

export default function NavbarWithSession () {
    return (
        <SessionProvider>
            <MotionNavbar />
        </SessionProvider>
    )
}
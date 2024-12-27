"use client"
import { usePathname } from "next/navigation";
import LogOutButton from "./atom-logout-button";
import LogInButton from "./atom-login-button";
import { getSession } from "@/app/lib/utils-server";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import SignUpButton from "./atom-signup-button";

export default function SignNav () {
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const userSession = await getSession();
            setSession(userSession);
        }
        fetchSession();
    }, []);

    if (pathname === '/login' || pathname === '/signup') {
        return null;
    }
    return (
        <nav>
            {
                session?.user ? <LogOutButton /> : (
                <>
                    <LogInButton />
                    <SignUpButton />
                </>)
            }
        </nav>
    )
}
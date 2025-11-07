import LogOutButton from "./atom-logout-button";
import LogInButton from "./atom-login-button";
import SignUpButton from "./atom-signup-button";
import { auth } from "@/auth";
import {
    Navbar, 
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@heroui/navbar";
import { SchedulerBlack, SchedulerIcon, SchedulerWhite } from "./atom-branding";
import HomeAtom from "./atom-home";
import Link from "next/link";


export default async function SignNav () {
    const session = await auth();

    return (
        <Navbar className="bg-transparent" shouldHideOnScroll>
            <NavbarContent justify="start">
                <NavbarBrand className="sm:hidden">
                    <Link aria-label="Homepage" href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/`}>
                        <SchedulerIcon />
                    </Link>
                </NavbarBrand>
                <NavbarBrand className="hidden sm:dark:inline-block">
                    <Link aria-label="Homepage" href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/`}>
                        <SchedulerWhite height={25} />
                    </Link>
                </NavbarBrand>
                <NavbarBrand className="hidden dark:hidden sm:inline-block">
                    <Link aria-label="Homepage" href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/`}>
                        <SchedulerBlack height={25} />
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
            {
                session?.user ? 
                <>
                    <NavbarItem>
                        <HomeAtom />
                    </NavbarItem>
                    <NavbarItem>
                        <LogOutButton />
                    </NavbarItem>
                </>
                 :
                <>
                    <NavbarItem>
                        <LogInButton  />
                    </NavbarItem>
                    <NavbarItem>
                        <SignUpButton />
                    </NavbarItem>
                </>
            }
            </NavbarContent>
        </Navbar>
    )
}
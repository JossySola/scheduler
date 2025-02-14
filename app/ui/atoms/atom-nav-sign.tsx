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
import { SchedulerBlack, SchedulerWhite } from "./atom-branding";


export default async function SignNav () {
    const session = await auth();

    return (
        <Navbar className="bg-transparent w-screen pt-2" shouldHideOnScroll>
            <NavbarContent justify="start">
                <NavbarBrand className="hidden dark:inline-block">
                    <SchedulerWhite />
                </NavbarBrand>
                <NavbarBrand className="dark:hidden">
                    <SchedulerBlack />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
            {
                session?.user ? 
                <NavbarItem>
                    <LogOutButton />
                </NavbarItem> : (
                <>
                <NavbarItem>
                    <LogInButton  />
                </NavbarItem>
                <NavbarItem>
                    <SignUpButton />
                </NavbarItem>
                </>)
            }
            </NavbarContent>
        </Navbar>
    )
}
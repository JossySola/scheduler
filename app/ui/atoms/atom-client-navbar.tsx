"use client"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { motion, useScroll, useTransform } from "motion/react"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SchedulerBlack, SchedulerWhite } from "./atom-branding";
import HomeAtom from "./atom-home";
import LogOutButton from "./atom-logout-button";
import LogInButton from "./atom-login-button";
import SignUpButton from "./atom-signup-button";

export default function MotionNavbar () {
    const { data: session } = useSession();
    const { scrollY } = useScroll();
    const [ isMobile, setIsMobile ] = useState<boolean>(false);
    const [ dimensions, setDimensions ] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setIsMobile(window.innerWidth < 768);
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const initialLogoSize = isMobile ? 120 : 180;

    const centerX = dimensions.width / 2 - initialLogoSize / 2;
    const centerY = dimensions.height / 2 - initialLogoSize / 2;

    const logoSize = useTransform(scrollY, [0, 200], [initialLogoSize, 125]);

    const logoX = useTransform(scrollY, [0, 200], [centerX, 16]);
    const logoY = useTransform(scrollY, [0, 200], [centerY, 8]);
    
    const navbarBlur = useTransform(scrollY, [0, 100], [0, 5]);
    const navItemsOpacity = useTransform(scrollY, [100, 200], [0, 1]);
    return (
        <motion.div 
        className="bg-transparent fixed top-0 left-0 w-full z-50"
        style={{
            backdropFilter: `blur(${navbarBlur}px)`,
            backgroundColor: 'rgba(255,255,255,0.7)',
        }} >
            <Navbar>
                <NavbarContent justify="start">
                    <motion.div className="fixed z-50" style={{
                        width: 'auto',
                        height: logoSize,
                        top: logoY,
                        left: logoX,
                    }}>
                        <NavbarBrand className="hidden dark:inline-block">
                            <SchedulerWhite height={25} />
                        </NavbarBrand>
                    </motion.div>
                    
                    <motion.div className="fixed z-50" style={{
                        width: 'auto',
                        height: logoSize,
                        top: logoY,
                        left: logoX,
                    }}>
                        <NavbarBrand className="dark:hidden">
                            <SchedulerBlack height={25} />
                        </NavbarBrand>
                    </motion.div>
                </NavbarContent>
                <NavbarContent justify="end">
                    {
                        session?.user ?
                        <motion.div className="flex flex-row" style={{ opacity: navItemsOpacity }}>
                            <NavbarItem>
                                <HomeAtom />
                            </NavbarItem>
                            <NavbarItem>
                                <LogOutButton />
                            </NavbarItem>
                        </motion.div> :
                        <motion.div className="flex flex-row" style={{ opacity: navItemsOpacity }}>
                            <NavbarItem>
                                <LogInButton />
                            </NavbarItem>
                            <NavbarItem>
                                <SignUpButton />
                            </NavbarItem>
                        </motion.div>
                    }
                </NavbarContent>
            </Navbar>
        </motion.div>
    )
}
"use client"
import { motion, useInView, Variants } from "motion/react"
import React, { useRef } from "react";

interface ScrollRevealProps {
    children: React.ReactNode,
    direction?: "left" | "right",
    delay?: number,
    staggerChildren?: number,
}
export default function ScrollReveal ({
    children,
    direction = 'right',
    delay = 0,
    staggerChildren = 0.2
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px"
    });
    const initialX = direction === "left" ? -50 : 50;
    const containerVariants = {
        hidden: {
            opacity: 0,
            transition: {
                staggerChildren,
                delayChildren: delay,
            },
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren,
                delayChildren: delay,
            },
        },
    };
    const itemVariants = {
        hidden: {
            opacity: 0,
            x: initialX,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };
    return (
        <motion.div
        ref={ ref }
        variants={ containerVariants }
        initial="hidden"
        animate={ isInView ? "visible" : "hidden" }
        className="w-full">
            {
                React.Children.map(children, (child, index) => (
                    <motion.div key={ index } variants={ itemVariants as Variants }>
                        { child }
                    </motion.div>
                ))
            }
        </motion.div>
    );
}
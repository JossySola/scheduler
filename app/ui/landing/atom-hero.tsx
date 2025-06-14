"use client"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowCircleDown } from "../icons";

export default function Hero ({ lang }: {
    lang: "es" | "en"
}) {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [200, 230, 260, 290, 300, 310], [1, 0.4, 0.3, 0.2, 0.1, 0]);

    return (
        <motion.div style={{ opacity }} className="flex flex-col justify-center items-center h-[95vh] w-full bg-transparent relative top-[-64] left-0 z-0">
            <motion.h1 className="text-center text-[8vw] sm:text-[3rem]">
                { lang === "es" ? "Planeación estratégica" : "Strategic planning" }
            </motion.h1>
            <div className="m-6">
                <ArrowCircleDown width={64} height={64} />
            </div>
        </motion.div>
    )
}
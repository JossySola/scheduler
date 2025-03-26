"use client"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Hero ({ lang }: {
    lang: "es" | "en"
}) {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 100, 130, 160, 190, 200, 230, 260, 290, 300, 310], [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0]);

    return (
        <div className="flex flex-col justify-center items-center h-[95vh] w-full bg-transparent relative top-[-64] left-0 z-0">
            <motion.h1 
            style={{ opacity }}
            className="text-center text-[8vw] sm:text-[3rem]">
                { lang === "es" ? "Planeación estratégica" : "Strategic planning" }
            </motion.h1>
        </div>
    )
}
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import SampleSpecs from "./sample-specs"
import { RefObject } from "react"

export default function FrameSpecs ({ lang, ref }: {
    lang: "en" | "es",
    ref: RefObject<null>,
}) {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 30vh", "start 200px"]
    });
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [100, 280]);
    return (
        <motion.section className="w-full z-2">
            <motion.div  className="flex flex-col justify-center items-center">
                <motion.div
                ref={ ref }
                style={{
                    opacity,
                    y,
                    x: 100,
                }}>
                    <SampleSpecs lang={ lang } />
                </motion.div>
            </motion.div>
        </motion.section>
    )
}
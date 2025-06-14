"use client"
import { motion, useScroll, useTransform } from "motion/react";
import SampleValues from "./sample-values";
import { RefObject } from "react";

export default function FrameValues ({ lang, ref }: {
    lang: "en" | "es",
    ref: RefObject<null>,
}) {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90vh", "start 10vh"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [100, 280]);
    return (
        <motion.section className="w-full z-1">
            <motion.div ref={ ref } className="flex flex-col justify-center items-center">
                <motion.div
                style={{
                    opacity,
                    y,
                    x: -200,
                }}>
                    <SampleValues lang={ lang } />
                </motion.div>
            </motion.div>
        </motion.section>
    )
}
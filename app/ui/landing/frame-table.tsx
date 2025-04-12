"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import SampleTable from "./sample-table";
import { RefObject } from "react";

export default function FrameTable ({ lang, ref }: {
    lang: "en" | "es",
    ref: RefObject<null>,
}) {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90vh", "start 10vh"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], [0, 0.2, 0.4, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1]);
    const x = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3, 0.4, 0.5], [100, 80, 60, 40, 20, 0]);
    return (
        <motion.section className="w-full z-0">
            <motion.div className="flex flex-col justify-center items-center">
                    <motion.div
                    ref={ ref }
                    style={{ opacity, x }}
                    transition={{ delay: 0.5 }}>
                        <SampleTable lang={ lang } />
                    </motion.div>
            </motion.div>
        </motion.section>
    )
}
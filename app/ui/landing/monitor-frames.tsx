"use client"
import { PrimaryButtonAsLink } from "../atoms/atom-button"
import FrameTable from "./frame-table";
import FrameValues from "./frame-values";
import FrameSpecs from "./frame-specs";
import FrameAiFeature from "./frame-ai-feature";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MonitorFrames ({ lang }: {
    lang: "en" | "es"
}) {
    const refTable = useRef(null);
    const refValues = useRef(null);
    const refSpecs = useRef(null);
    const refEnd = useRef(null);
    const refContainer = useRef(null);

    const tableInView = useInView(refTable);
    const valuesInView = useInView(refValues);
    const specsInView = useInView(refSpecs);

    const { scrollYProgress: tableProgress } = useScroll({
        target: refTable,
        offset: ["start 30vh", "start 70vh"],
    });
    const { scrollYProgress: valuesProgress } = useScroll({
        target: refValues,
        offset: ["start 50vh", "start 0px"],
    });
    const { scrollYProgress: specsProgress } = useScroll({
        target: refSpecs,
        offset: ["start 50vh", "start 0px"],
    });
    const { scrollYProgress: endProgress } = useScroll({
        target: refEnd,
        offset: ["start 98vh", "start 0px"],
    })

    const opacityTable = useTransform(tableProgress, [0, 0.5, 0.8, 0.9, 1], [0, 1, 1, 1, 0]);
    const opacityValues = useTransform(valuesProgress, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0]);
    const opacitySpecs = useTransform(specsProgress, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0]);
    const position = useTransform(endProgress, [0, 1], ["sticky", "relative"]);

    useMotionValueEvent(valuesProgress, 'change', (x) => {
        console.log(x)
    })

    return (
        <section className="hidden sm:flex flex-col justify-center items-center p-5 sm:p-10">
            <motion.div
            ref={ refContainer }
            style={{ position }}
            className="w-full flex flex-col items-center mb-[10rem]">
                {/* SECTION 1 */}
                <motion.section className="w-full sticky top-[60px] min-h-screen">
                    <motion.h2
                    style={{
                        opacity: tableInView ? opacityTable : 0,
                    }}
                    className="text-[2.5rem] text-center m-5">
                        { lang === "es" ? "Llena los títulos de tus columnas y filas..." : "Fill out your column and row headers..." }
                    </motion.h2>
                    <FrameTable lang={ lang } ref={ refTable } />
                </motion.section>
                {/* SECTION 2 */}
                <motion.section className="w-full sticky top-[60px] min-h-screen">
                    <motion.h2 
                    style={{
                        opacity: valuesInView ? opacityValues : 0,
                    }}
                    className="text-[2.5rem] text-center m-5">
                        { lang === "es" ? "...ingresa los valores que usarás" : "...enter the values you'll use" }
                    </motion.h2>
                    <FrameValues lang={ lang } ref={ refValues } />
                </motion.section>
                {/* SECTION 3 */}
                <motion.section className="w-full sticky top-[60px] min-h-screen">
                    <motion.h2
                    style={{
                        opacity: specsInView ? opacitySpecs : 0,
                    }}
                    className="text-[2.5rem] text-center m-5">
                        { lang === "es" ? "...y configura las especificaciones de cada fila" : "...and set the criteria for each row" }
                    </motion.h2>
                    <FrameSpecs lang={ lang } ref={ refSpecs } />
                </motion.section>
            </motion.div>

            <div ref={ refEnd } className="w-full p-6 mt-[10rem] mb-6">
                <FrameAiFeature lang={ lang } />
                <div className="w-full flex flex-col justify-center items-center mt-[6rem] mb-[6rem]">
                    <h3 className="text-[1.5rem] text-center">
                        { lang === "es" ? "¡Regístrate gratis!" : "Signup for free!" } <a href="#legal-4"><sup className="text-[1rem]">4</sup></a> 😊
                    </h3>
                    <PrimaryButtonAsLink link={`${lang}/signup`}>
                        { lang === "es" ? "Registrarse" : "Signup" }
                    </PrimaryButtonAsLink>
                </div>
            </div>
        </section>
    )
}
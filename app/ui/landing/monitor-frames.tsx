"use client"
import FrameTable from "./frame-table";
import FrameValues from "./frame-values";
import FrameSpecs from "./frame-specs";
import FrameAiFeature from "./frame-ai-feature";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button, Link } from "@heroui/react";

export default function MonitorFrames ({ lang }: {
    lang: "en" | "es"
}) {
    const refTable = useRef(null);
    const refValues = useRef(null);
    const refSpecs = useRef(null);
    const refEnd = useRef(null);
    const refContainer = useRef(null);
    const refSection = useRef(null);

    const tableInView = useInView(refTable);
    const valuesInView = useInView(refValues);
    const specsInView = useInView(refSpecs);

    const { scrollYProgress: tableProgress } = useScroll({
        target: refTable,
        offset: ["start 30vh", "start 70vh"],
    });
    const { scrollYProgress: valuesProgress } = useScroll({
        target: refValues,
        offset: ["start 50vh", "start 13vh"],
    });
    const { scrollYProgress: specsProgress } = useScroll({
        target: refSpecs,
        offset: ["start 40vh", "start 13vh"],
    });
    const { scrollYProgress: endProgress } = useScroll({
        target: refEnd,
        offset: ["start 13vh", "start 90vh"],
    })
    const { scrollYProgress: sectionProgress } = useScroll({
        target: refSection,
        offset: ["start 0vh", "end 50vh"],
    })

    const opacityTable = useTransform(tableProgress, [0, 0.2, 0.4, 0.8, 1], [0, 0.5, 1, 1, 0]);
    const opacityValues = useTransform(valuesProgress, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], [0, 0, 0, 0, 0, 0, 0.2, 1, 1, 0, 0]);
    const opacitySpecs = useTransform(specsProgress, [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], [0, 0, 0, 0, 0, 0, 0.3, 1, 1, 1, 0]);
    const position = useTransform(sectionProgress, [0, 1], ["sticky", "relative"]);
    
    return (
        <motion.section className="hidden sm:flex flex-col justify-center items-center p-5 sm:p-10 sm:gap-10">
            <motion.div
            ref={ refContainer }
            style={{
                position
            }}
            className="w-full flex flex-col items-center mb-[10rem] top-[13vh]">
                {/* SECTION 1 */}
                <motion.section className="w-full sticky top-[13vh] min-h-screen">
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
                <motion.section className="w-full sticky top-[13vh] min-h-screen">
                    <motion.h2
                    style={{
                        opacity: valuesInView ? opacityValues : 0,
                    }}
                    className="dark:bg-[#1A1A1A] text-[2.5rem] text-center m-5">
                        { lang === "es" ? "...ingresa los valores que usarás" : "...enter the values you'll use" }
                    </motion.h2>
                    <FrameValues lang={ lang } ref={ refValues } />
                </motion.section>
                {/* SECTION 3 */}
                <motion.section className="w-full sticky top-[13vh] min-h-screen">
                    <motion.h2
                    style={{
                        opacity: specsInView ? opacitySpecs : 0,
                    }}
                    className="dark:bg-[#1A1A1A] text-[2.5rem] text-center m-5">
                        { lang === "es" ? "...y configura las especificaciones de cada fila" : "...and set the criteria for each row" }
                    </motion.h2>
                    <FrameSpecs lang={ lang } ref={ refSpecs } />
                </motion.section>
            </motion.div>

            <div ref={ refEnd } className="w-full p-6 mt-[10rem] mb-2">
                <FrameAiFeature lang={ lang } />
                <div className="w-full flex flex-col justify-center items-center mt-[6rem] mb-[2rem]">
                    <h3 className="text-[1.5rem] text-center">
                        { lang === "es" ? "¡Regístrate gratis!" : "Sign up for free!" } <a href="#legal-4"><sup className="text-[1rem]">4</sup></a> 😊
                    </h3>
                    <Button as={ Link } href={`${lang}/signup`} className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg text-3xl p-8">
                        { lang === "es" ? "Registrarse" : "Sign Up" }
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}
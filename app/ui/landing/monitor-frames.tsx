"use client"
import FrameTable from "./frame-table";
import FrameValues from "./frame-values";
import FrameSpecs from "./frame-specs";
import FrameAiFeature from "./frame-ai-feature";
import { motion, useInView, useScroll, useTransform } from "motion/react";
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
    const valuesInView = useInView(refValues);
    const specsInView = useInView(refSpecs);

    const { scrollYProgress: sectionProgress } = useScroll({
        target: refSection,
        offset: ["start 0vh"],
    })

    const position = useTransform(sectionProgress, [0, 1], ["sticky", "relative"]);

    return (
        <motion.section className="hidden sm:flex flex-col justify-center items-center p-5 sm:p-10 gap-20">
            <motion.div
            ref={ refContainer }
            style={{
                position
            }}
            className="w-full flex flex-col items-center top-[13vh] h-fit mb-[10rem]">
                {/* SECTION 1 */}
                <motion.section className="w-full sticky top-[13vh] min-h-screen">
                    <div className="static my-15">
                        <motion.h2 className="text-[2.5rem] w-full">
                            <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: valuesInView ? 0 : 1 }}
                            className="absolute top-0 w-full text-center"
                            transition={{ delay: 0.3 }}>{ lang === "es" ? "Llena los títulos de tus columnas y filas..." : "Fill out your column and row headers..." }</motion.p>
                            <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: specsInView ? 0 : valuesInView ? 1 : 0 }}
                            className="absolute top-0 w-full text-center"
                            transition={{ delay: 0.3 }}>{ lang === "es" ? "...ingresa los valores que usarás" : "...enter the values you'll use" }</motion.p>
                            <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: specsInView ? 1 : 0 }}
                            className="absolute top-0 w-full text-center"
                            transition={{ delay: 0.3 }}>{ lang === "es" ? "...y configura las especificaciones de cada fila" : "...and set the criteria for each row" }</motion.p>
                        </motion.h2>
                    </div>
                    
                    <FrameTable lang={ lang } ref={ refTable } />
                </motion.section>
                {/* SECTION 2 */}
                <motion.section 
                className="w-full sticky top-[13vh] min-h-screen">
                    <FrameValues lang={ lang } ref={ refValues } />
                </motion.section>
                {/* SECTION 3 */}
                <motion.section 
                className="w-full sticky top-[13vh] min-h-screen">
                    <FrameSpecs lang={ lang } ref={ refSpecs } />
                </motion.section>
            </motion.div>

            <div ref={ refEnd } className="w-full p-6 mt-5 mb-2 bg-background z-10">
                <FrameAiFeature lang={ lang } />
                <div className="w-full flex flex-col justify-center items-center my-10">
                    <h3 className="text-[1.5rem] text-center">
                        { lang === "es" ? "¡Regístrate gratis!" : "Sign up for free!" } <a href="#legal-4"><sup className="text-[1rem]">4</sup></a> 😊
                    </h3>
                    <Button as={ Link } href={`${lang}/signup`} className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg text-3xl p-8" 
                    style={{
                        textDecorationLine: "none"
                    }}>
                        { lang === "es" ? "Registrarse" : "Sign Up" }
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}
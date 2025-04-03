"use client"
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import FrameTable from "./frame-table";
import FrameAiFeature from "./frame-ai-feature";
import SampleSpecs from "./sample-specs";
import SampleValues from "./sample-values";
import { Button, Link } from "@heroui/react";

export default function MobileFrames ({ lang }: {
    lang: "en" | "es",
}) {
    const refTable = useRef(null);
    const refValues = useRef(null);
    const refSpecs = useRef(null);
    const { scrollYProgress: tableProgress } = useScroll({
        target: refTable,
        offset: ["start 50vh", "start 40vh"],
    });
    const { scrollYProgress: valuesProgress } = useScroll({
        target: refValues,
        offset: ["start 50vh", "start 40vh"],
    });
    const { scrollYProgress: specsProgress } = useScroll({
        target: refSpecs,
        offset: ["start 50vh", "start 40vh"],
    });
    const opacityTable = useTransform(tableProgress, [0, 0.5, 1], [0, 0.5, 1]);
    const opacityValues = useTransform(valuesProgress, [0, 0.5, 1], [0, 0.5, 1]);
    const opacitySpecs = useTransform(specsProgress, [0, 0.5, 1], [0, 0.5, 1]);
    return (
        <section className="flex flex-col justify-center items-center sm:hidden">
            <motion.section  
            style={{ opacity: opacityTable }}
            className="flex flex-col justify-center items-center mb-12">
                <motion.h2 className="p-3 text-center text-[2rem]">
                    { lang === "es" ? "Llena los títulos de tus columnas y filas" : "Fill out your column and row headers" }
                </motion.h2>
                <FrameTable lang={ lang } ref={ refTable } />
            </motion.section>

            <motion.section 
            style={{ opacity: opacityValues }}
            className="flex flex-col justify-center items-center mb-12">
                <motion.h2 className="p-3 text-center text-[2rem]" >
                    { lang === "es" ? "Ingresa los valores que usarás" : "Enter the values you'll use" }
                </motion.h2>
                <motion.div ref={ refValues }>
                    <SampleValues lang={ lang } />
                </motion.div>
            </motion.section>

            <motion.section  
            style={{ opacity: opacitySpecs }}
            className="flex flex-col justify-center items-center">
                <motion.h2 className="p-3 text-center text-[2rem]">
                    { lang === "es" ? "Y configura las especificaciones de cada fila" : "And set the criteria for each row" }
                </motion.h2>
                <motion.div ref={ refSpecs }>
                    <SampleSpecs lang={ lang } />
                </motion.div>
            </motion.section>

            <div className="w-full p-6 mt-[10rem] mb-6">
                <FrameAiFeature lang={ lang } />
                <div className="w-full flex flex-col justify-center items-center mt-[6rem] mb-[6rem]">
                    <h3 className="text-[1.5rem] text-center">
                        { lang === "es" ? "¡Regístrate gratis!" : "Sign up for free!" } <a href="#legal-4"><sup className="text-[1rem]">4</sup></a> 😊
                    </h3>
                    <Button as={ Link } href={`${lang}/signup`} className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg text-3xl p-8">
                        { lang === "es" ? "Registrarse" : "Sign Up" }
                    </Button>
                </div>
            </div>
        </section>
    )
}
"use client"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';

export default function Benefits () {
    const params = useParams<{ lang: "en" | "es" }>();
    const { lang } = params;
    
    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delayChildren: 0.5 } },
    }
    const item = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }
    return (
        <section className='w-full lg:w-[900px] p-5 flex flex-col justify-center items-center gap-y-[50vh]'>
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center w-full">
            {
                lang === "es" 
                ? "Planificación de trabajo, coordinación de horarios y bloques de tiempo ajustables"
                : "Workforce planning, shift coordination, and custom time blocks." 
            }
            </motion.h2>

            <motion.section 
            variants={container}
            initial="hidden"
            whileInView="visible"
            className="w-full flex flex-col md:flex-row justify-center items-center md:justify-between gap-10 text-center sm:text-left">
                <motion.h3
                variants={item}>
                    {
                        lang === "es"
                        ? "Se adapta a tus especificaciones"
                        : "Adapts to your constraints"
                    }
                </motion.h3>
                <DotLottieReact src="/assets/settings.lottie" autoplay loop mode='bounce' />
            </motion.section>

            <motion.section
            variants={container}
            initial="hidden"
            whileInView="visible" 
            className="w-full flex flex-col sm:flex-row justify-center items-center md:justify-between gap-10 text-center sm:text-left">
                <motion.h3 variants={item}>
                    {
                        lang === "es"
                        ? "Te da todo el control"
                        : "Gives you full control"
                    }
                </motion.h3>
                <DotLottieReact src='/assets/input-types.lottie' speed={0.5} autoplay loop />
            </motion.section>

            <motion.section
            variants={container}
            initial="hidden"
            whileInView="visible" 
            className="w-full flex flex-col sm:flex-row justify-center items-center gap-10 text-center">
                <motion.h3 variants={item}>
                    {
                        lang === "es"
                        ? "Crece junto tu equipo"
                        : "Scales with your team"
                    }
                </motion.h3>
                <DotLottieReact src='/assets/team.lottie' autoplay loop />
            </motion.section>
        </section>
    )
}
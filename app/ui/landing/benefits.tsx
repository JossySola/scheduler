"use client"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useParams } from 'next/navigation';
import { motion, stagger } from 'motion/react';

export default function Benefits () {
    const params = useParams<{ lang: "en" | "es" }>();
    const { lang } = params;
    
    const container = {
        hidden: { opacity: 0, transition: { when: "afterChildren " } },
        visible: { opacity: 1, transition: { when: "beforeChildren", delayChildren: stagger(0.5) } },
    }
    const item = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
    }
    return (
        <section className='w-full lg:w-[900px] p-5 flex flex-col justify-center items-center gap-y-[20vh]'>

            <motion.ul variants={container} initial="hidden" whileInView="visible">
                <motion.li variants={item} className="text-4xl/15 before:content-['✅']">{ lang === "es" ? " Planificación de trabajo" : " Workforce planning" }</motion.li>
                <motion.li variants={item} className="text-4xl/15 before:content-['✅']">{ lang === "es" ? " Coordinación de horarios" : " Shift coordination" }</motion.li>
                <motion.li variants={item} className="text-4xl/15 before:content-['✅']">{ lang === "es" ? " y bloques de tiempo ajustables" : " and custom time blocks" }</motion.li>
            </motion.ul>

            <motion.section 
            variants={container}
            initial="hidden"
            whileInView="visible"
            className="w-full flex flex-col md:flex-row justify-center items-center md:justify-between gap-5 text-center sm:text-right">
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
            className="w-full flex flex-col sm:flex-row justify-center items-center md:justify-between gap-5 text-center sm:text-right">
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
            className="w-full flex flex-col sm:flex-row justify-center items-center gap-5 text-center sm:text-right">
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
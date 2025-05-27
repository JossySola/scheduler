"use client"
import { Claude } from "../atoms/atom-anthropic"
import { motion } from "framer-motion"
import { Box } from "../icons"

export default function FrameAiFeature ({ lang }: {
    lang: "en" | "es",
}) {
    return (
        <>
            <motion.p
            className="m-10 text-[2rem] text-center">
                { lang === "es" ? "Usa el botón:" : "Hit the button:" }
                <motion.span className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-xl gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-default data-[hover=true]:opacity-hover bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg m-5">
                    { lang === "es" ? "Crear" : "Create" }
                    <Box height={16} width={16} />
                </motion.span>
            </motion.p>
            {
                lang === "es" ?
                <motion.p className="text-[1.8rem]">Para que <b>Claude</b> <Claude /> <a href="#legal-1"><sup className="text-[1rem]">1</sup></a>  genere un plan estratégico<a href="#legal-2"><sup className="text-[1rem]">2</sup></a> de acuerdo a las especificaciones configuradas.</motion.p> :
                <motion.p className="text-[1.8rem]">And <b>Claude</b> <Claude /> <a href="#legal-1"><sup className="text-[1rem]">1</sup></a> will generate a strategic planification<a href="#legal-2"><sup className="text-[1rem]">2</sup></a> based on the data you provided!</motion.p>
            }
            <br></br>
            {
                lang === "es" ?
                <motion.p className="text-[1.8rem]">Sin embargo, puedes usar la aplicación sin necesidad de utilizar la IA, por lo que podrás crear tus horarios<a href="#legal-3"><sup className="text-[1rem]">3</sup></a> como desees y con la complejidad que requieras.</motion.p> :
                <motion.p className="text-[1.8rem]">However, you can use this web application without utilizing the AI, so you can create your schedules<a href="#legal-3"><sup className="text-[1rem]">3</sup></a> as you wish with any complexity you may need.</motion.p>
            }
        </>
    )
}
"use client"
import { useScroll, motion, useTransform } from "framer-motion"
import Frame_Specs from "./frame-specs"
import Frame_Table from "./frame-table"
import Frame_Values from "./frame-values"
import { useEffect, useState } from "react"
import { Box } from "geist-icons"
import { AnthropicBig } from "../atoms/atom-anthropic"
import { PrimaryButtonAsLink } from "../atoms/atom-button"

export default function Frames ({ lang }: {
    lang: "en" | "es"
}) {
    const { scrollY } = useScroll();
    const [ isMobile, setIsMobile ] = useState<boolean>(false);
    const [ height, setHeight ] = useState<number>(0);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        setHeight(window.innerHeight);
    }, [])

    const h2Opacity = useTransform(scrollY, [0, 600], [0, 1]);
    const h2Y = useTransform(scrollY, [0, 500], [100, 0])

    return (
        <section className="flex flex-col justify-center items-center p-10">
            <motion.h2 
            style={{ opacity: h2Opacity, y: h2Y }}
            className="text-[2.5rem] text-center">
                { lang === "es" ? "Llena los títulos de tus columnas y filas..." : "Fill out your column and row headers..." }
            </motion.h2>
            <motion.div>
                <Frame_Table lang={ lang } />
            </motion.div>
            
            <motion.h2 
            style={{ opacity: h2Opacity, y: h2Y }}
            className="text-[2.5rem] text-center">
                { lang === "es" ? "...ingresa los valores que usarás" : "...enter the values you'll use" }
            </motion.h2>
            <Frame_Values lang={ lang } />

            <motion.h2 
            style={{ opacity: h2Opacity, y: h2Y }}
            className="text-[2.5rem] text-center">
                { lang === "es" ? "...y configura las especificaciones de cada fila" : "...and set the criteria for each row" }
            </motion.h2>
            <Frame_Specs lang={ lang } />

            <motion.p 
            style={{ opacity: h2Opacity, y: h2Y }}
            className="text-[2rem] text-center">
                { lang === "es" ? "Usa el botón:" : "Hit the button:" }
                <motion.span className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-xl gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-default data-[hover=true]:opacity-hover bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg m-5 h-[50px]">
                    { lang === "es" ? "Crear" : "Create" }
                    <Box height="32px" width="32px" />
                </motion.span>
            </motion.p>

            {
                lang === "es" ?
                <motion.p className="text-[1.8rem]">para que Claude <AnthropicBig/> generare un plan estratégico <sup className="text-[1rem]">1</sup> 🔥 de acuerdo a las especificaciones configuradas</motion.p> :
                <motion.p className="text-[1.8rem]">And Claude <AnthropicBig /> will generate a strategic plan <sup className="text-[1rem]">1</sup> 🔥 based on the data you provided!</motion.p>
            }
            {
                lang === "es" ?
                <motion.p className="text-[1.8rem]">Sin embargo, puedes usar la aplicación sin necesidad de utilizar la IA para crear tus horarios, planes o tablas <sup className="text-[1rem]">2</sup>.</motion.p> :
                <motion.p className="text-[1.8rem]">However, you can use this web application without utilizing the AI to create your schedules, plans or tables <sup className="text-[1rem]">2</sup>.</motion.p>
            }

            <motion.h3 className="text-[1.5rem] text-center">{ lang === "es" ? "¡Regístrate gratis!" : "Signup for free!" } <sup className="text-[1rem]">3</sup>😊</motion.h3>
            
            <PrimaryButtonAsLink link={`${lang}/signup`}>
                { lang === "es" ? "Registrarse" : "Signup" }
            </PrimaryButtonAsLink>
        </section>
    )
}
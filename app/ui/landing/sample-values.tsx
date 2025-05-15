"use client"
import { motion } from "framer-motion"
import { PlusCircle } from "geist-icons"
import HourValue from "./sample-hour-value";

export default function SampleValues ({ lang }: {
    lang: "en" | "es"
}) {
    const container = {
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 1,
            }
        },
        hidden: {
            opacity: 0,
        },
    }
    const item = {
        visible: {
            opacity: 1,
            scale: 1
        },
        hidden: {
            opacity: 0,
            scale: 0.3,
        }
    }
    return (
        <motion.div className="text-black w-[220px] bg-white rounded-xl shadow-xl w-fit flex flex-col justify-center items-center gap-3 p-8"> 
            <motion.h3>{ lang === "es" ? "Valores a usar" : "Values to use" }</motion.h3>
            <motion.div aria-label="sample-values-row" className="w-full flex flex-row justify-center items-center gap-2">
                <motion.div className="group flex flex-col data-[hidden=true]:hidden w-full relative justify-end data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_10px)]">
                    <motion.div aria-label="sample-main-wrapper" className="h-full flex flex-col">
                        <motion.div aria-label="sample-input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background">
                            <motion.div aria-label="sample-inner-wrapper" className="inline-flex w-full items-center h-full box-border">
                                <motion.div aria-label="sample-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground text-[#A1A1AA]">
                                    { lang === "es" ? "Ingresa un valor" : "Enter a value" }
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div aria-label="sample-button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-small gap-2 rounded-medium px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-primary/20 text-primary-600 min-w-10 w-10 h-10 data-[hover=true]:opacity-hover">
                    <motion.span className="w-xs h-xs flex flex-row justify-center items-center">
                        <PlusCircle />
                    </motion.span>
                </motion.div>
            </motion.div>

            <motion.ul 
            variants={ container }
            initial="hidden"
            whileInView="visible"
            className="w-full flex flex-col justify-center items-center">
                <motion.li className="w-full" variants={ item }>
                    <HourValue value="10:00-19:00" />
                </motion.li>
                <motion.li className="w-full" variants={ item }>
                    <HourValue value="11:00-20:00" />
                </motion.li>
                <motion.li className="w-full" variants={ item }>
                    <HourValue value="12:00-21:00" />
                </motion.li>
                <motion.li className="w-full" variants={ item }>
                    <HourValue value="13:00-22:00" />
                </motion.li>
            </motion.ul>
        </motion.div>
    )
}
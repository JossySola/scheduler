"use client"
import { motion } from "framer-motion";
import { Trash } from "geist-icons";

export default function HourValue ({ value }: {
    value: string
}) {
    return (
        <motion.div aria-label="sample-values-row" className="w-full flex flex-row justify-center items-center gap-2 mb-3">
            <motion.div className="group flex flex-col data-[hidden=true]:hidden w-full relative justify-end data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_10px)]">
                <motion.div aria-label="sample-main-wrapper" className="h-full flex flex-col">
                    <motion.div aria-label="sample-input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background">
                        <motion.div aria-label="sample-inner-wrapper" className="inline-flex w-full items-center h-full box-border">
                            <motion.div aria-label="sample-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground">
                                { value }
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div aria-label="sample-button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-small gap-2 rounded-medium px-0 !gap-0 transition-transform-colors-opacity motion-reduce:transition-none bg-danger/20 text-danger-600 dark:text-danger-500 min-w-10 w-10 h-10 data-[hover=true]:opacity-hover">
                <motion.span className="w-xs h-xs">
                    <Trash />
                </motion.span>
            </motion.div>
        </motion.div>
    )
}
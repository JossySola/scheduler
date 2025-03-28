"use client"
import { Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react"
import { motion } from "framer-motion"

export default function Frame_Specs ({ lang }: {
    lang: "en" | "es"
}) {
    return (
        <motion.div className="bg-white rounded-xl shadow-xl w-fit flex flex-col justify-center items-center gap-10 p-8">
            <motion.h3>{ lang === "es" ? "Configuración de Filas" : "Rows Settings" }</motion.h3>

            <motion.div aria-label="sample-tabs-row" className="inline-flex">
                <motion.div aria-label="sample-tabList" className="flex p-1 h-fit gap-2 items-center flex-nowrap overflow-x-scroll scrollbar-hide bg-default-100 rounded-medium">
                    <motion.div aria-label="sample-tab" className="z-0 w-full px-3 py-1 flex group relative justify-center items-center transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 data-[hover-unselected=true]:opacity-disabled outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-small">
                        <motion.span className="absolute z-0 inset-0 rounded-small bg-background dark:bg-default shadow-small"></motion.span>
                        <motion.div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-default-foreground">
                        José Solá
                        </motion.div>
                    </motion.div>
                    <motion.div className="z-0 w-full px-3 py-1 flex group relative justify-center items-center transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 data-[hover-unselected=true]:opacity-disabled outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-small">
                        <motion.div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-default-foreground">
                        Keith Pace
                        </motion.div>
                    </motion.div>
                    <motion.div className="z-0 w-full px-3 py-1 flex group relative justify-center items-center transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 data-[hover-unselected=true]:opacity-disabled outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-small">
                        <motion.div className="relative z-10 whitespace-nowrap transition-colors text-default-500 group-data-[selected=true]:text-default-foreground">
                        Chace Duncan
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div aria-label="sample-panel" className="py-3 px-1 data-[inert=true]:hidden outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2">
                <motion.div className="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium rounded-large transition-transform-background motion-reduce:transition-none p-3">
                    <motion.div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased">
                        
                        <Switch 
                        color="danger"
                        className="m-4">
                            { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                        </Switch>

                        <CheckboxGroup
                        className="m-4"
                        label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }>
                            <Checkbox value="Monday">Monday</Checkbox>
                            <Checkbox value="Tuesday">Tuesday</Checkbox>
                            <Checkbox value="Wednesday">Wednesday</Checkbox>
                            <Checkbox value="Thursday">Thursday</Checkbox>
                            <Checkbox value="Friday">Friday</Checkbox>
                            <Checkbox value="Saturday">Saturday</Checkbox>
                            <Checkbox value="Sunday">Sunday</Checkbox>
                        </CheckboxGroup>

                        <NumberInput 
                        minValue={ 0 }
                        label={ lang === "es" ? "¿Cuántas veces debería aparecer en la tabla?" : "How many times should it appear on the schedule?" }
                        labelPlacement="outside-left"/>

                        <CheckboxGroup
                        className="m-4"
                        label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}>
                            <Checkbox value="10:00-19:00">10:00-19:00</Checkbox>
                            <Checkbox value="11:00-20:00">11:00-20:00</Checkbox>
                            <Checkbox value="12:00-21:00">12:00-21:00</Checkbox>
                            <Checkbox value="13:00-22:00">13:00-22:00</Checkbox>
                        </CheckboxGroup>

                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
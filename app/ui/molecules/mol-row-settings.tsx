"use client"
import { Tab, Tabs } from "@heroui/react";
import RowTabCard from "./mol-row-card";
import { useContext } from "react";
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";
import { useParams } from "next/navigation";

export default function RowSettings () {
    const { rowHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const params = useParams();
    const lang = params.lang;
    return (
        <section className="w-full p-5 flex flex-col justify-start items-center magicBorder">
            <h3>{ lang === "es" ? "Configuración de Filas" : "Rows Settings" }</h3>
            <Tabs aria-label="row-settings">
            {
                rowHeaders && rowHeaders.map((header, rowIndex) => {
                    if (rowIndex !== 0) {
                        return (
                            <Tab 
                            key={ `tab-${rowIndex}` }
                            title={ header ? header : lang === "es" ? "Sin nombre" : "No name" }>
                                <RowTabCard 
                                key={ `card-${rowIndex}` }
                                name={ header ? header : lang === "es" ? "Sin nombre" : "No name" }
                                rowIndex={ rowIndex } />
                            </Tab>
                        )
                    }
                })
            }
            </Tabs>
        </section>
    )
}
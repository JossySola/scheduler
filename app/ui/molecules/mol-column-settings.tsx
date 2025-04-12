"use client"
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context"
import { Tab, Tabs } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import ColumnTabCard from "./mol-column-card";

export default function ColumnSettings () {
    const { columnHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const params = useParams();
    const lang = params.lang;
    return (
        <section className="w-full text-center p-5 max-w-lg magicBorder">
            <h3>{ lang === "es" ? "Configuración de Columnas" : "Column Settings" }</h3>
            <Tabs 
            aria-label="column-settings" 
            classNames={{
                tabList: "overflow-x-scroll"
            }}
            fullWidth={ true }>
            {
                columnHeaders && columnHeaders.map((column, columnIndex) => {
                    if (columnIndex !== 0) {
                        return (
                            <Tab 
                            key={ `tab-${columnIndex}` } 
                            title={ column ? column : lang === "es" ? "Sin nombre" : "No name" }>
                                <ColumnTabCard 
                                key={ `column-card-${columnIndex}` }
                                columnIndex={ columnIndex } 
                                name={ column } />
                            </Tab>
                        )
                    }
                })
            }
            </Tabs>
        </section>
    )
}
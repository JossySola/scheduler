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
        <section className="w-full text-center p-5 max-w-lg magicBorder">
            <h3>{ lang === "es" ? "Configuración de Filas" : "Rows Settings" }</h3>
            <Tabs 
            aria-label="row-settings" 
            classNames={{
                tabList: "overflow-x-scroll"
            }}
            fullWidth={ true }>
            {
                rowHeaders && rowHeaders.map((header, rowIndex) => {
                    if (rowIndex !== 0) {
                        return (
                            <Tab 
                            key={ `tab-${rowIndex}` }
                            title={ header ? header : lang === "es" ? "Sin nombre" : "No name" }>
                                <RowTabCard 
                                key={ `row-card-${rowIndex}` }
                                name={ header }
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
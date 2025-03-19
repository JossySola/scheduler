"use client"
import { Tab, Tabs } from "@heroui/react";
import TableTabCard from "../atoms/atom-table-card";
import TableButtonAi from "../atoms/atom-table-button-ai";
import { useContext } from "react";
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";
import { useParams } from "next/navigation";

export default function TableTabs ({ name }: { 
    name: string,
}) {
    const { rowHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const params = useParams();
    const lang = params.lang;
    return (
        <section className="w-full flex flex-col items-center">
            <h3>{ name }</h3>
            <Tabs aria-label={ name }>
            {
                rowHeaders && rowHeaders.map((header, rowIndex) => {
                    if (rowIndex > 0) {
                        return (
                            <Tab key={ `tab-${rowIndex}` } title={ header ? header : lang === "es" ? "Sin nombre" : "No name" }>
                                <TableTabCard 
                                key={ `card-${rowIndex}` }
                                name={ header ? header : lang === "es" ? "Sin nombre" : "No name" }
                                rowIndex={ rowIndex } />
                            </Tab>
                        )
                    }
                })
            }
            </Tabs>
            <TableButtonAi isDisabled={ rowHeaders && rowHeaders.length < 2 } />
        </section>
    )
}
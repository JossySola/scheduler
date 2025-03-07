"use client"
import { Tab, Tabs } from "@heroui/react";
import TableTabCard from "../atoms/atom-table-card";
import TableButtonAi from "../atoms/atom-table-button-ai";
import { Specs } from "@/app/hooks/custom";
import { useState } from "react";

export type LocalSpecs = {
    disable: Array<boolean>,
    count: Array<number>,
    enabledValues: Array<Array<string>>,
    enabledColumns: Array<Array<string>>,
}

export default function TableTabs ({ name, lang, values, rowsHeaders, colHeaders, specs }: {
    name: string,
    lang: "en" | "es",
    values: Array<string>,
    rowsHeaders: Array<string>,
    colHeaders: Array<string>,
    specs: Specs[],
}) {
    const [ localSpecs, setLocalSpecs ] = useState<LocalSpecs>({
        disable: [],
        count: [],
        enabledValues: [],
        enabledColumns: [],
    })
    return (
        <section className="flex flex-col items-center">
            <h3>{ name }</h3>
            <Tabs aria-label={ name }>
            {
                rowsHeaders.map((header, index) => {
                    if (index > 0) {
                        return (
                            <Tab key={ `tab-${index}` } title={ header ? header : lang === "es" ? "Sin nombre" : "No name" } className="overflow-hidden">
                                <TableTabCard 
                                key={ `card-${index}` }
                                columns={ colHeaders }
                                values={ values }
                                tab={ header }
                                lang={ lang }
                                index={ index }
                                specs={ specs[index] }
                                localSpecs={ localSpecs }
                                setLocalSpecs={ setLocalSpecs } />
                            </Tab>
                        )
                    }
                })
            }
            </Tabs>
            <TableButtonAi lang={ lang } isDisabled={ rowsHeaders && rowsHeaders.length < 2 } />
        </section>
    )
}
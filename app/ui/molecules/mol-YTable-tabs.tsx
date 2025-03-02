"use client"
import { Divider, Tab, Tabs } from "@heroui/react";
import TableTabCard from "../atoms/atom-table-card";
import { useState } from "react";

export type Specs = {
    disable: Array<boolean>,
    count: Array<number>,
    enabledValues: Array<Array<string>>,
    enabledColumns: Array<Array<string>>,
}

export default function TableTabs ({ name, tabs, lang, values, columns }: {
    name: string,
    tabs: Array<string>,
    lang: "en" | "es",
    values: Array<string>,
    columns: Array<string>,
}) {
    const [ specs, setSpecs ] = useState<Specs>({
        disable: [],
        count: [],
        enabledValues: [],
        enabledColumns: [],
    })

    return (
        <section className="flex flex-col items-center">
            <h4 className="m-2">{ lang === "es" ? "Generar con IA" : "Generate with AI" }</h4>
            <Divider orientation="horizontal" />
            <h3>{ name }</h3>
            {
                tabs && tabs.length ? <Tabs aria-label={ name }>
                {
                    tabs.map((tab, index) => {
                        if (index !== 0) {
                            return (
                            <Tab key={index} title={tab ? tab : lang === "es" ? "Sin nombre" : "No name" }>
                                <TableTabCard key={index} columns={columns} values={values} tab={tab} lang={lang} specs={specs} setSpecs={setSpecs} index={index}/>
                            </Tab> )
                        }
                    })
                }
                </Tabs>
                 : lang === "es" ? <p>Aún no hay filas por mostrar</p> : <p>There are no rows yet</p>
            }
            
        </section>
    )
}
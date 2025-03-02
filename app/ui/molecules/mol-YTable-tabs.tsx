"use client"
import { Divider, Tab, Tabs } from "@heroui/react";
import TableTabCard from "../atoms/atom-table-card";
import { useState } from "react";
import { TabsData } from "./mol-YTable";
import TableButtonAi from "../atoms/atom-table-button-ai";

export type Specs = {
    disable: Array<boolean>,
    count: Array<number>,
    enabledValues: Array<Array<string>>,
    enabledColumns: Array<Array<string>>,
}

export default function TableTabs ({ name, lang, values, tabsData, children }: {
    name: string,
    lang: "en" | "es",
    values: Array<string>,
    children: React.JSX.Element,
    tabsData: TabsData,
}) {
    const [ specs, setSpecs ] = useState<Specs>({
        disable: [],
        count: [],
        enabledValues: [],
        enabledColumns: [],
    })

    return (
        <section className="flex flex-col items-center">
            { children }
            
            <Divider orientation="horizontal" />
            <h3>{ name }</h3>
            {
                tabsData.tabs && tabsData.tabs.length ? <Tabs aria-label={ name }>
                {
                    tabsData.tabs.map((tab, index) => {
                        if (index !== 0) {
                            return (
                            <Tab key={index} title={tab ? tab : lang === "es" ? "Sin nombre" : "No name" }>
                                <TableTabCard key={index} columns={tabsData.cols} values={values} tab={tab} lang={lang} specs={specs} setSpecs={setSpecs} index={index}/>
                            </Tab> )
                        }
                    })
                }
                </Tabs>
                 : lang === "es" ? <p>Aún no hay filas por mostrar</p> : <p>There are no rows yet</p>
            }
            <TableButtonAi lang={ lang } />
        </section>
    )
}
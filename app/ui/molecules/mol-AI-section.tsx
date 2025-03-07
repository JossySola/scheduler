"use client"
import { SetStateAction } from "react";
import TableTabs from "./mol-YTable-tabs";
import { Specs } from "@/app/hooks/custom";

export default function AISection ({ lang, values, colHeaders, rowHeaders, specs }: {
    lang: "es" | "en",
    values: string[],
    colHeaders: string[],
    rowHeaders: string[],
    specs: Specs[],
    
}) {

    return (
        <fieldset className="magicBorder p-[16px] m-3">
            <TableTabs 
            name={ lang === "es" ? "Configuración de Filas" : "Rows Settings" }
            lang={ lang as "en" | "es" }
            values={ values }
            specs={ specs }
            colHeaders={ colHeaders }
            rowsHeaders={ rowHeaders } />
        </fieldset>
    )
}
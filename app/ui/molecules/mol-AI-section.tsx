"use client"
import { useParams } from "next/navigation";
import TableTabs from "./mol-YTable-tabs";

export default function AISection () {
    const params = useParams();
    const lang = params.lang;
    return (
        <fieldset className="w-full magicBorder sm:w-fit">
            <TableTabs 
            name={ lang === "es" ? "Configuración de Filas" : "Rows Settings" } />
        </fieldset>
    )
}
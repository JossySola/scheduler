"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { NumberInput, Select, SelectItem } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";

export default function HeaderSpecs() {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table, panelUpdate } = useContext(TableContext);
    const [selection, setSelection] = useState<"text" | "date" | "time">(table.columnType);
    const [interval, setInterval] = useState<number>(() => {
        if (table.columnType === "time") {
            return 60;
        } else {
            return 1;
        }
    });
    const handleIntervalChange = (num: number) => {
        setInterval(num);
        table.interval = num;
    }
    return ( <section className="flex flex-col gap-5">
        <Select 
        defaultSelectedKeys={[selection]}
        label={ lang === "es" ? "Tipo de encabezado de columnas:" : "Column headers' type:" }
        labelPlacement="outside"
        size="lg"
        onChange={ e => { 
            table.columnType = e.target.value as "text" | "date" | "time";
            // Reset all headers' values
            if (table.rows[0].size > 0) {
                table.rows[0].forEach(header => header.value = "");
            }
            if (e.target.value === "time") {
                // If the type is Time, set the interval as 60 minutes
                handleIntervalChange(60);
            } else if (e.target.value === "date") {
                // If the type is Date, set the interval as 1 day
                handleIntervalChange(1);
            }
            setSelection(e.target.value as "text" | "date" | "time");
            // Trigger a re-render
            panelUpdate();
        }}>
            <SelectItem key="text">{ lang === "es" ? "Text" : "Text" }</SelectItem>
            <SelectItem key="date">{ lang === "es" ? "Fecha" : "Date" }</SelectItem>
            <SelectItem key="time">{ lang === "es" ? "Tiempo" : "Time" }</SelectItem>
        </Select>
        {
            selection === "date" ? <NumberInput
            size="lg"
            label={ lang === "es" ? "Intervalo" : "Interval" } 
            labelPlacement="outside"
            description={ lang === "es" ? "días" : "days" }
            minValue={1} 
            value={interval}
            onValueChange={handleIntervalChange}/> : null
        }
        {
            selection === "time" ? <NumberInput
            size="lg"
            label={ lang === "es" ? "Intervalo" : "Interval" } 
            labelPlacement="outside"
            description={ lang === "es" ? "minutos" : "minutes" }
            minValue={1} 
            value={interval}
            onValueChange={handleIntervalChange}/> : null
        }
    </section>    
    )
}
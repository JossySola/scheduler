"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { NumberInput, Select, SelectItem } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";

export default function HeaderSpecs() {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const { table, setPanelRender } = useContext(TableContext);
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
            setSelection(e.target.value as "text" | "date" | "time");
            if (e.target.value === "time") handleIntervalChange(60);
            setPanelRender && setPanelRender(v => v + 1);
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
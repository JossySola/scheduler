"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { TableExtended } from "@/app/lib/utils-client";
import { Slider } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ValueSlider ({ value, colIndex }: {
    value: string,
    colIndex: number,
}) {
    const { table } = useContext(TableContext);
    const column = table.rows[0].get(`${TableExtended.indexToLabel(colIndex)}0`);
    const { lang } = useParams<{ lang: "es" | "en"}>();
    const [count, setCount] = useState<number | number[]>(column?.specs?.valueTimes.get(value) ?? 0);
    useEffect(() => {
        if (column && column.specs) {
            if (typeof count === "number") {
                column.specs.valueTimes.set(value, count);
            } else if (Array.isArray(count) && count.length === 1) {
                column.specs.valueTimes.set(value, count[0]);
            }
        }
    }, [count]); 
    return (
        <Slider
        color="primary"
        minValue={ 0 }
        maxValue={ table.rows[0].size ?? 1 }
        label={ lang === "es" ? `Usar el valor "${value}" esta cantidad de veces: `: `Use the value "${value}" this amount of times:` }
        showSteps={ true }
        size="md"
        step={ 1 }
        value={ count }
        onChangeEnd={ setCount } />
    )
}
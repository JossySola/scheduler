"use client"
import { useContext, useEffect, useState } from "react";
import Cell from "./cell";
import { RowType, TableExtended } from "@/app/lib/utils-client";
import { TableContext } from "@/app/[lang]/table/context";
import { CalendarDate, Time } from "@internationalized/date";

export default function ColHeaders({ row, rowIndex }: {
    row: Map<string, RowType>,
    rowIndex: number,
}) {
    const [ A1, setA1 ] = useState<CalendarDate | Time | string | null>(null);
    const { table, panelUpdate } = useContext(TableContext);
    useEffect(() => {
        switch(table.columnType) {
            case "date": {
                if (table.size > 0 && A1) {
                    const date = A1 as CalendarDate;
                    let nextDate = new CalendarDate(date.year, date.month, date.day);
                    table.rows[0].forEach((column, key) => {
                        if (key !== "A0" && key !== "A1") {
                            column.value = nextDate.toString();
                            nextDate = nextDate.add({ days: table.interval });
                            return;
                        }
                        return;
                    })
                }
                break;
            };
            case "time": {
                if (table.size > 0 && A1) {
                    const time = A1 as Time;
                    let nextTime = new Time(time.hour, time.minute, time.second, time.millisecond).add({ minutes: table.interval });
                    table.rows[0].forEach((column, key) => {
                        if (key !== "A0" && key !== "A1") {
                            column.value = nextTime.toString();
                            nextTime = nextTime.add({ minutes: table.interval });
                            return;
                        }
                        return;
                    })
                }
                break;
            }
        }
        panelUpdate();
    }, [A1]);
    return Array.from(row.values()).map((_, colIndex: number) => {
        return <th scope="col" key={`col${colIndex}row${rowIndex}`} className="flex flex-col justify-center items-center gap-2" >
            <span className="text-tiny">{TableExtended.indexToLabel(colIndex)}</span>
            <div className="flex flex-row items-center gap-3">
                { colIndex === 0 && <span className="text-tiny w-[1rem]">{String(rowIndex)}</span> }
                { rowIndex === 0 && colIndex === 1 
                ? <Cell rowIndex={ rowIndex } colIndex={ colIndex } setA1={ setA1 } /> 
                : <Cell rowIndex={rowIndex} colIndex={colIndex} /> }
            </div>
        </th>
    })
}
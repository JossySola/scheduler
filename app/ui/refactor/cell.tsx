"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { RowType, TableExtended } from "@/app/lib/utils-client";
import { DatePicker, Input, Select, SelectItem, TimeInput } from "@heroui/react";
import { memo, useContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ClockDashed } from "../icons";
import { CalendarDate, parseDate, parseTime, Time } from "@internationalized/date";
import * as zod from "zod/v4";

export default function Cell ({ element, rowIndex, colIndex }: { 
    element: RowType,
    rowIndex: number,
    colIndex: number,
}) {
    const { table } = useContext(TableContext);
    const label = `${TableExtended.indexToLabel(colIndex)}${rowIndex}`;
    const debouncedModification = useDebouncedCallback((value: string) => {
        table.edit(colIndex, rowIndex, value);
    }, 1000);

    if (rowIndex === 0 && colIndex !== 0) {
        if (table.columnType === "date") {
            const verify = zod.iso.date().safeParse(element.value);
            return <DatePicker
            id={label}
            name={label}
            size="lg"
            variant="flat"
            classNames={{
                innerWrapper: "w-[60vw] text-2xl sm:text-base sm:w-[204px]",
                inputWrapper: "border-medium border-transparent",
            }}
            defaultValue={ verify.success ? parseDate(element.value) : null }
            onChange={e => {
                debouncedModification((e && e.toString()) ?? "");
                if (colIndex === 1 && e) {
                    let currentDate = new CalendarDate(e.year, e.month, e.day);
                    let newDate = currentDate;
                    if (table.rows.length > 0) {
                        table.rows[0].forEach((value, key) => {
                            if (key !== "A0") {
                                value.value = newDate.toString();
                                currentDate = newDate;
                                newDate = currentDate.add({days: table.interval});
                            }
                        })
                    }
                }
            }} />
        }
        if (table.columnType === "time") {
            const verify = zod.iso.time().safeParse(element.value);
            return <TimeInput
            id={label}
            name={label}
            size="lg"
            variant="flat"
            classNames={{
                innerWrapper: "w-[60vw] text-2xl sm:text-base sm:w-[204px]",
                inputWrapper: "border-medium border-transparent",
            }}
            startContent={ <ClockDashed /> }
            defaultValue={ verify.success ? parseTime(element.value) : null }
            onChange={e => {
                debouncedModification((e && e.toString()) ?? "");
                if (colIndex === 1 && e) {
                    let currentTime = new Time(e.hour, e.minute, e.second, e.millisecond);
                    let newTime = currentTime;
                    if (table.rows.length > 0) {
                        table.rows[0].forEach((value, key) => {
                            if (key !== "A0") {
                                value.value = newTime.toString();
                                currentTime = newTime;
                                newTime = currentTime.add({minutes: table.interval});
                            }
                        })
                    }
                }
            }} />
        }
        return <Input 
            defaultValue={ element.value }
            id={label}
            name={label}
            type="text"
            size="lg"
            autoComplete="off"
            isClearable
            variant="flat"
            classNames={{
                input: "w-[60vw] text-2xl sm:text-base sm:w-[204px]",
                innerWrapper: "border-medium border-transparent"
            }}
            onValueChange={(value: string) => debouncedModification(value)}
        />
    }
    if (table.values.size > 0 && rowIndex !== 0 && colIndex !== 0) {
        return <Select
        variant="bordered"
        defaultSelectedKeys={ [element.value] }
        classNames={{
            innerWrapper: "w-[60vw] text-2xl sm:text-base sm:w-[204px]",
            trigger: "h-[48px]"
        }}
        onChange={e => table.edit(colIndex, rowIndex, e.target.value)}>
            {
                Array.from(table.values).map((value, index) => (
                    <SelectItem key={index} textValue={value}>
                        { value }
                    </SelectItem>
                ))
            }
        </Select>
    }
    return <Input 
        defaultValue={ element.value }
        id={label}
        name={label}
        type="text"
        size="lg"
        autoComplete="off"
        isClearable
        variant={ colIndex === 0 ? "flat" : "bordered" }
        classNames={{
            input: "w-[60vw] text-2xl sm:text-base sm:w-[204px]",
        }}
        onValueChange={(value: string) => debouncedModification(value)}
    />
}
"use client"
import { RowType } from "./utils-client";

onmessage = (e) => {
    const payload = e.data;
    const rows: [string, object][][] = payload.map((col: Map<string, RowType>) => {
        return Array.from(col.entries()).map(([key, value]): [string, object] => {
            if (value.specs) {
                return [
                    key,
                    {
                        ...value,
                        specs: {
                            ...value.specs,
                            valueTimes: Array.from(value.specs.valueTimes),
                        }
                    }
                ];
            }
            return [key, value];
        })
    })
    postMessage(rows);
}
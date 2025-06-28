"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { useContext } from "react";
import RowHeaders from "./row-headers";
import ColHeaders from "./col-headers";
import { RowType } from "@/app/lib/utils-client";

export default function Table () {
    const { table } = useContext(TableContext);

    return (
        <section className="col-start-2 row-start-2">
            <table className="flex flex-col gap-2 overflow-x-scroll w-[75vw] pt-5 pb-5">
                {
                    table && table.rows.map((row: Map<string, RowType>, rowIndex: number) => {
                        if (rowIndex === 0) {
                            return (
                                <thead key={`row${rowIndex}`}>
                                    <tr className="flex flex-row gap-2">
                                        {
                                            <ColHeaders row={row} rowIndex={rowIndex} />
                                        }
                                    </tr>
                                </thead>
                            )
                        }
                        return (
                            <tbody key={`row${rowIndex}`}>
                                <tr className="flex flex-row gap-2">
                                {
                                    <RowHeaders row={row} rowIndex={rowIndex} />
                                }
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
        </section>
    )
}
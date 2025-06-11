"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { useParams } from "next/navigation"
import { useContext } from "react";
import Cell from "./cell";
import RowHeaders from "./row-headers";
import ColHeaders from "./col-headers";

export default function Table () {
    const params = useParams<{ lang: "en" | "es" }>();
    const { table } = useContext(TableContext);

    return (
        <section>
            <h1>Table</h1>
            <table>
                {
                    table && table.rows.map((row: Map<any, any>, rowIndex: number) => {
                        if (rowIndex === 0) {
                            return (
                                <thead key={`row${rowIndex}`}>
                                    <tr>
                                        {
                                            <ColHeaders row={row} rowIndex={rowIndex} size={table.size} />
                                        }
                                    </tr>
                                </thead>
                            )
                        }
                        return (
                            <tbody key={`row${rowIndex}`}>
                                <tr>
                                {
                                    <RowHeaders row={row} rowIndex={rowIndex} size={table.size}/>
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
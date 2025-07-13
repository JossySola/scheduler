"use client"
import Cell from "./cell";
import { RowType } from "@/app/lib/utils-client";
import { AnimatePresence, motion } from "motion/react";

export default function RowHeaders({ row, rowIndex }: {
    row: Map<string, RowType>,
    rowIndex: number,
}) {
    return Array.from(row.values()).map((column: RowType, colIndex: number) => {
        if (colIndex === 0) {
            return <th scope="row" className="flex flex-row items-center gap-2" key={`col${colIndex}row${rowIndex}`}>
                <AnimatePresence>
                    <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex flex-row items-center justify-center gap-3">
                        <span className="text-tiny w-[1rem]">{String(rowIndex)}</span>
                        <Cell rowIndex={rowIndex} colIndex={colIndex} />
                    </motion.div>
                </AnimatePresence>
                
            </th>
        }
        return (
            <AnimatePresence key={`col${colIndex}row${rowIndex}`}>
                <motion.td 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}>
                    <Cell rowIndex={rowIndex} colIndex={colIndex} />
                </motion.td>
            </AnimatePresence>
        )
    })
}
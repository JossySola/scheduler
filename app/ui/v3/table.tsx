"use client"
import { TableContext } from "@/app/[lang]/table/context";
import { useContext } from "react";
import RowHeaders from "./row-headers";
import ColHeaders from "./col-headers";
import { RowType } from "@/app/lib/utils-client";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/app/scheduler_loader.json";

export default function Table () {
    const { table, isGenerating } = useContext(TableContext);

    return (
        <section className="col-start-2 row-start-2 relative h-fit">
            {
                isGenerating 
                ?  (
                    <div className="w-[75vw] h-full backdrop-blur-xs absolute top-0 z-3 flex flex-col items-center">
                        <LottieLoader />
                    </div> 
                )
                : null
            }
            <table className="flex flex-col gap-2 overflow-x-scroll w-[75vw] h-fit pt-5 pb-5">
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

const LottieLoader = () => {
    return (
        <div className="w-1/6 h-full flex flex-col justify-center">
            <Lottie animationData={ animationData } loop autoplay />
        </div>
    )
}
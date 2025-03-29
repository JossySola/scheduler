"use client"
import MonitorFrames from "./monitor-frames";
import MobileFrames from "./mobile-frames";

export default function Frames ({ lang }: {
    lang: "en" | "es",
}) {
    return (
        <>
            <MobileFrames lang={ lang } />
            <MonitorFrames lang={ lang } />
        </>
    )
}
"use client"
import Link from "next/link";
import { useParams } from "next/navigation";
import { Anthropic } from "./atom-anthropic";

export default function PowerWithAnthropic () {
    const params = useParams();
    const lang = params.lang ?? "en";

    return <div className="flex flex-col justify-center items-center bg-[#f0eee670] dark:bg-[#3F3F4670] dark:border-[#52525B] backdrop-blur-sm border-1 py-2 rounded-full bottom-1 shadow-small z-10 w-fit p-5">
        <Link 
        href="https://www.anthropic.com/" 
        target="_blank" 
        style={{
            textDecoration: "none"
        }}
        className="text-tiny text-center">
            { lang === "es" ? "Impulsado con" : "Powered with" } 
            <Anthropic />
        </Link>  
    </div>
}
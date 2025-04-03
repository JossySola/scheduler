"use client"
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import min from "@/app/scheduler_table_min.json";
import max from "@/app/scheduler_table_max.json";

export default function LottieLoader() {
    return (
        <div className="flex flex-col justify-center items-center w-full h-screen relative top-[-64]">
            <div className="relative sm:hidden">
                <Lottie animationData={ min } loop autoplay />
            </div>
            <div className="hidden sm:relative">
                <Lottie animationData={ max } loop autoplay />
            </div>
        </div>  
    )
}
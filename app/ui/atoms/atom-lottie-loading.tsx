"use client"
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/app/scheduler_loader.json";

export default function LottieLoader() {
    return (
        <div className="flex flex-col justify-center items-center w-full h-screen relative top-[-64]">
          <Lottie animationData={ animationData } style={{ width: 200, height: 200 }} loop autoplay />
        </div>  
    )
}
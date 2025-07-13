"use client"
import dynamic from "next/dynamic";

const Panel = dynamic(() => import('@/app/ui/v3/panel'), { ssr: false });

export default Panel;
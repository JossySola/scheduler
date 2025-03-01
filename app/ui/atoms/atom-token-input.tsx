"use client"
import { sendTokenAction } from "@/app/[lang]/signup/actions";
import { Button, CircularProgress, Input } from "@heroui/react";
import { useEffect, useState } from "react";

export default function ExpiringTokenInput ({ lang }: {
    lang: "en" | "es"
}) {
    const [ time, setTime ] = useState<number>(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(v => Math.max(0, v - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
        <Input
        minLength={6}
        maxLength={6}
        name="confirmation-token"
        id="confirmation-token"
        variant="flat"
        radius="md"
        size="lg"
        isRequired
        isClearable />
        <div className="w-full flex flex-row justify-center items-center mt-2 mb-2">
            <CircularProgress 
            color="danger"
            showValueLabel={true} 
            formatOptions={{ style: "unit", unit: "second" }}
            size="lg"
            value={time}
            maxValue={60}/>
        </div> 
        <Button
        type="submit"
        isDisabled={ time > 0 ? true : false } 
        formAction={async (formData: FormData) => {
            await sendTokenAction(formData, lang as "en" | "es");
        }}>
            { lang === "es" ? "Re-enviar código" : "Request a new token" }
        </Button>
        </>
    )
}
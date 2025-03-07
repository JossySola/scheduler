"use client"
import { Input } from "@heroui/react";
import { useParams } from "next/navigation";
import { SetStateAction } from "react";

export default function FormInputBirthday ({ birthday, setBirthday }: {
    birthday: Date | null,
    setBirthday: React.Dispatch<SetStateAction<Date | null>>,
}) {
    const params = useParams();
    const lang = params.lang;
    
    return (
        <Input 
        name="birthday"
        type="date"
        max="2012-12-31"
        className="sm:w-[400px] m-2"
        isRequired
        radius="md"
        variant="bordered"
        label={ lang === "es" ? "Fecha de nacimiento " : "Birthday " }
        size="lg"
        value={ birthday ? birthday.toISOString().split("T")[0] : "" }
        onChange={e => setBirthday(e.target.value ? new Date(e.target.value) : null) }/>
    )
}
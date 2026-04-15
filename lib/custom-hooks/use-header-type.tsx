"use client"
import { useState } from "react";

export default function useHeaderType(initialState: "text" | "time" | "date" = "text") {
    const [type, setType] = useState<"text" | "time" | "date">(initialState);
    const changeType = (newType: string): boolean => {
        if (newType !== "text" && newType !== "time" && newType !== "date") {
            return false;
        }
        setType(newType);
        return true;
    }
    return {
        type,
        changeType,
    }
}
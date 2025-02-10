"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function Timestamp ({ updated_at }: {
    updated_at: string,
}) {
    const params = useParams();
    const { lang } = params;
    const [ update, setUpdate ] = useState<string>(formatTimeAgo(updated_at, lang && typeof lang === "string" ? lang : "en"));

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (lang && typeof lang === "string") {
                setUpdate(formatTimeAgo(updated_at, lang));
            } else {
                setUpdate(formatTimeAgo(updated_at, "en"));
            }
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    return <p>{update}</p>
}

function formatTimeAgo (date: string, lang: string) {
    const now = new Date();
    const updated = new Date(date);

    if (isNaN(updated.getTime())) {
        throw new Error("Invalid date passed");
    }
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

    if (diffMinutes < 1) {
        if (lang === "es") {
            return "Modificado justo ahora"
        } else {
            return "Updated just now"
        }
    };
    if (diffMinutes < 60) {
        if (lang === "es") {
            return `Modificado hace ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
        } else {
            return `Updated ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
        } 
    }
    if (diffHours < 24) {
        if (lang === "es") {
            return `Modificado hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
        } else {
            return `Updated ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        }
    };
    if (diffDays < 7) {
        if (lang === "es") {
            return `Modificado hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
        } else {
            return `Updated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        }
    };
    if (diffWeeks < 4) {
        if (lang === "es") {
            return `Modificado hace ${diffWeeks} semana${diffWeeks > 1 ? "s" : ""}`;
        } else {
            return `Updated ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
        }
        
    };

    if (lang === "es") {
        return `Modificado hace ${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
    } else {
        return `Updated ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    }
}
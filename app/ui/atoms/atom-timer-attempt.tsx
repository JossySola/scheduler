"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function CountdownTimer({ nextAttempt }: { nextAttempt: string }) {
    const [ minutesRemaining, setMinutesRemaining ] = useState<number | null>(null);
    const params = useParams();
    const { lang } = params;
    const minute = lang === "es" ? "minuto" : "minute";
    const minutes = lang === "es" ? "minutos" : "minutes";

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const nextAttemptDate = new Date(nextAttempt);
            const diffMs = nextAttemptDate.getTime() - now.getTime();
            const diffMinutes = Math.ceil(diffMs / 60000);
            setMinutesRemaining(diffMinutes > 0 ? diffMinutes : 0);
        }
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [nextAttempt]);

    if (minutesRemaining) return <p aria-live="polite">
        { lang === "es" ? "Espera " : "Wait "} 
        { minutesRemaining } 
        { minutesRemaining === 1 ? minute : minutes } 
        { lang === "es" ? " antes de intentarlo de nuevo." : " before trying again." }</p>

    return null;
}
"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function CountdownTimer({ nextAttempt }: { nextAttempt: string }) {
    // The argument format is: 2025-02-16T12:34:56.789Z.
    const [ minutesRemaining, setMinutesRemaining ] = useState<number | null>(null);
    const params = useParams();
    const { lang } = params;
    const minute = lang === "es" ? " minuto" : " minute";
    const minutes = lang === "es" ? " minutos" : " minutes";

    useEffect(() => {
        const updateTime = () => {
            // Returns this format:  Sun Feb 16 2025 11:09:13 GMT-0600 (GMT-06:00) for the actual Date.
            const now = new Date();
            // Returns this format:  Sun Feb 16 2025 11:09:13 GMT-0600 (GMT-06:00) for the Date in the argument.
            const nextAttemptDate = new Date(nextAttempt);
            // .getTime() method returns the Date as a timestamp: 1739709296789 in millisenconds.
            const diffMs = nextAttemptDate.getTime() - now.getTime();
            // Math.ceil static method rounds up and returns the smallest integer greater than or equal to a given number.
            // 60 000 milliseconds = 1 minute.
            const diffMinutes = Math.ceil(diffMs / 60000);
            setMinutesRemaining(diffMinutes > 0 ? diffMinutes : 0);
        }
        updateTime();
        // Update every second.
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [nextAttempt]);

    if (minutesRemaining) return <p aria-live="polite" className="text-danger">
        { lang === "es" ? "Espera " : "Wait "} 
        { minutesRemaining } 
        { minutesRemaining === 1 ? minute : minutes } 
        { lang === "es" ? " antes de intentarlo de nuevo." : " before trying again." }
    </p>
    return null;
}
"use client"
import { CircularProgress } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function CountdownTimer({ nextAttempt }: { nextAttempt: string }) {
    // The argument format is: 2025-02-16T12:34:56.789Z.
    const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
    const [initialTimeInSeconds, setInitialTimeInSeconds] = useState<number>(0); // Store total countdown time in seconds
    const params = useParams();
    const { lang } = params;

    const minuteText = lang === "es" ? " minuto" : " minute";
    const minutesText = lang === "es" ? " minutos" : " minutes";

    useEffect(() => {
        const now = new Date();
        const nextAttemptDate = new Date(nextAttempt);
        const diffMs = nextAttemptDate.getTime() - now.getTime();
        const diffSeconds = Math.ceil(diffMs / 1000); // Get the difference in seconds

        setSecondsRemaining(diffSeconds > 0 ? diffSeconds : 0); // Set seconds remaining
        setInitialTimeInSeconds(diffSeconds); // Store total countdown duration in seconds

        const interval = setInterval(() => {
            setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000); // Update every second (1000 ms)

        return () => clearInterval(interval);
    }, [nextAttempt]);

    if (secondsRemaining > 0) {
        const minutesRemaining = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;

        return (
            <section className="w-full flex flex-col justify-center items-center">
                <p aria-live="polite" className="text-danger">
                    {lang === "es" ? "Espera " : "Wait "}
                    {minutesRemaining > 0 ? `${minutesRemaining} ${minutesRemaining === 1 ? minuteText : minutesText}` : ""}
                    {seconds > 0 ? ` ${seconds} s` : ""}
                    {lang === "es" ? " antes de intentarlo de nuevo." : " before trying again."}
                </p>
                <CircularProgress
                    aria-label="timer-progress"
                    color="danger"
                    size="lg"
                    value={secondsRemaining} // Value in seconds
                    maxValue={initialTimeInSeconds} // Max countdown time in seconds
                />
            </section>
        );
    }

    return null;
}
"use client"
import { useEffect, useState } from "react";

export function Timestamp ({ updated_at }: {
    updated_at: string,
}) {
    const [ update, setUpdate ] = useState<string>(formatTimeAgo(updated_at));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setUpdate(formatTimeAgo(updated_at));
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    return <p>{update}</p>
}

function formatTimeAgo (date: string) {
    const now = new Date();
    const updated = new Date(date);

    if (isNaN(updated.getTime())) {
        throw new Error("Invalid date passed");
    }
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMs / 7);
    const diffMonths = Math.floor(diffMs / 30);

    if (diffMinutes < 1) return "Updated just now";
    if (diffMinutes < 60) return `Updated ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `Updated ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `Updated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 4) return `Updated ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    return `Updated ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}
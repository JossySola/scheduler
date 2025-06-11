"use client"
import { useParams } from "next/navigation"

export default function Specs () {
    const params = useParams<{ lang: "en" | "es" }>();
    return (
        <section>
            <h1>Specs</h1>
        </section>
    )
}
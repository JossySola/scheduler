'use client'
import ActionButton from "@/ui/buttons/action-button"
import { useRouter } from "next/navigation"

export default function NewTable() {
    const router = useRouter();
    return (
        <ActionButton
        aria-label="Create new table"
        type="button"
        onPress={() => router.push(`/table/new`)}>New table</ActionButton>
    )
}
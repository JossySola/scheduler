"use client"
import Link from "next/link"
import { Button } from "../atoms/atom-button"
import Dialog from "../atoms/atom-dialog"
import { useEffect, useRef, useState } from "react"
import { DeleteTableAction } from "@/app/(routes)/dashboard/@list/actions"
import { Timestamp } from "../atoms/atom-timestamp"

export default function TableLink ({ table_id, table_name, updated_at }: { 
    table_id: string,
    table_name: string,
    updated_at: string,
}) {
    const dialogElement = useRef<HTMLDialogElement | null>(null);
    const [ refAvailable, setRefAvailable ] = useState<boolean>(false);

    useEffect(() => {
        if (dialogElement.current) {
            setRefAvailable(true);
        }
    }, [refAvailable])

    const handleDialog = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (dialogElement.current) {
            dialogElement.current.showModal();
        }
    }

    return (
        <section>
            <Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/table/${table_id}`}>{table_name} <Timestamp updated_at={updated_at} /></Link>
            <Dialog ref={dialogElement && dialogElement} action={DeleteTableAction} item_id={table_id} />
            {
                refAvailable ? <Button text="Delete" callback={handleDialog}/> : null
            }
        </section>
    )
}
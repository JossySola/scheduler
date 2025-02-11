"use client"
import Link from "next/link"
import { SecondaryButton, SubmitButton } from "../atoms/atom-button"
import Dialog from "../atoms/atom-dialog"
import { useEffect, useRef, useState } from "react"
import { DeleteTableAction } from "@/app/[lang]/dashboard/@list/actions"
import { Timestamp } from "../atoms/atom-timestamp"
import { useParams } from "next/navigation"

export default function TableLink ({ table_id, table_name, updated_at }: { 
    table_id: string,
    table_name: string,
    updated_at: string,
}) {
    const dialogElement = useRef<HTMLDialogElement | null>(null);
    const [ refAvailable, setRefAvailable ] = useState<boolean>(false);
    const params = useParams();
    const { lang } = params;

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
            <Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/${table_id}`}>{table_name} <Timestamp updated_at={updated_at} /></Link>
            
            <Dialog ref={dialogElement && dialogElement}>
                <form action={DeleteTableAction}>
                    <label>{ lang === "es" ? "Confirma esta acción, ya que será irreversible:" : "Confirm this action as this will be irreversible:" }</label>
                    <input type="text" name="item_id" value={table_id} readOnly hidden />
                    <SubmitButton text={ lang === "es" ? "Confirmar" : "Confirm" } />
                </form>
            </Dialog>
            {
                refAvailable && <SecondaryButton text={ lang === "es" ? "Eliminar" : "Delete"} callback={handleDialog} />
            }
        </section>
    )
}
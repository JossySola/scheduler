'use client'
import { printAction, SaveActionPOOL } from "@/app/(routes)/table/actions"
import DynamicTable from "./dynamic-table"
import { SubmitButton } from "../atoms/atom-button"

export default function SaveTableForm() {
    return (
        <form action={SaveActionPOOL} id="new-table" className="flex flex-col">
            <input name="table-name" id="table-name" type="text" defaultValue="Untitled" />
            <DynamicTable />
            <SubmitButton text="save"/>
        </form>
    )
}
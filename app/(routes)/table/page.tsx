import { SubmitButton } from "@/app/ui/atoms/atom-button";
import DynamicTable from "@/app/ui/organisms/dynamic-table";
import { printAction } from "./actions/actions";

export default function Page () {
    
    return (
        <>
            <h1>Table - Page.tsx</h1>
            <form action={printAction} id="new-table" className="flex flex-col">
                <input name="table-name" type="text" defaultValue="Untitled" />
                <DynamicTable />
                <SubmitButton text="print"/>
            </form>
            
        </>
    )
}
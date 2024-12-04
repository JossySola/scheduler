'use server'
import "server-only"
import { FormDataToQuery } from "@/app/lib/utils"
import { redirect } from "next/navigation"

export async function SaveAction (prevState: { message: string }, formData: FormData) {
    const {id, columns, columnsParams, rows} = FormDataToQuery(formData);
    
    const response = await fetch('http://localhost:3000/api/table/create', {
        method: 'POST',
        body: JSON.stringify({
            id,
            columns,
            columnsParams,
            rows,
        })
    })

    const res = await response.json();
    
    if (res.success) {
        // redirect('/dashboard');
        return prevState;
    } else {
        return {
            message: 'Table creation failed'
        }
    }
}

export async function CancelAction () {

}
'use server'
import { FormDataToQuery } from "@/app/lib/utils-client"
import { redirect } from "next/navigation"

export async function SaveAction (prevState: { message: string }, formData: FormData) {
    const {id, columns, columnsParams, rows} = FormDataToQuery(formData);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
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
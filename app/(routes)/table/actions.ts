'use server'
import pool from "@/app/lib/mocks/db"
import { FormDataToQuery } from "@/app/lib/utils"
import { Action_State } from "@/app/lib/definitions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function printAction (formData: FormData) {
    console.log(formData)
}

export async function SaveActionMOCK (prevState: Action_State, formData: FormData) {
    const {id, columns, columnsParams, rows} = FormDataToQuery(formData);
    
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${id} (
            ${columns}
            );
        `)
        await Promise.all(
            rows.map(async (rowValues) => {
                const placeholders = rowValues.map((_, index) => `$${index+1}`).join(', ');
                return pool.query(
                    `INSERT INTO ${id} (${columnsParams}) VALUES (${placeholders})`,
                    rowValues
                )
            })
        )
    } catch (error) {
        return {
            message: `${error.message}`,
        }
    }
/*
    revalidatePath('/dashboard');
    redirect('/dashboard');
*/    
}
export async function SaveAction (formData: FormData) {

}
export async function CancelAction () {

}
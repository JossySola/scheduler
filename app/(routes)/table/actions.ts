'use server'
import pool from "@/app/lib/mocks/db"
import { FormDataToQuery } from "@/app/lib/utils"
import { TableFormData } from "@/app/lib/definitions"

export async function printAction (formData: FormData) {
    console.log(formData)
}

export async function SaveActionPOOL (formData: TableFormData) {
    const {id, columns, columnsParam, rows} = FormDataToQuery(formData);
    
    
    await pool.query(`
        CREATE TABLE ${id} (
        ${columns}
        );
    `)
    /*
    await Promise.all(
        rows.map(row => {
            return pool.query(`
                INSERT INTO ${id} (${columnsParam})
                VALUES (${row});
            `)
        })
    )
    */

}
export async function SaveAction (formData: TableFormData) {

}
export async function CancelAction () {

}
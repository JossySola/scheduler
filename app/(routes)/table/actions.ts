'use server'
import pool from "@/app/lib/mocks/db"
import { FormDataToQuery } from "@/app/lib/utils"

export async function printAction (formData: FormData) {
    console.log(formData)
}

export async function SaveActionPOOL (formData: FormData) {
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
export async function SaveAction (formData: FormData) {

}
export async function CancelAction () {

}
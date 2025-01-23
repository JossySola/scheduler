"use server"
import { redirect } from "next/navigation";

export async function SaveTableAction (state: { message: string }, formData: FormData) {
    console.log("[SaveTableAction] Starting...")
    console.log("[SaveTableAction] Received:", formData)
    console.log("[SaveTableAction] Unpacking...")

    const content = UNPACK(formData);
    console.log("[SaveTableAction] Content:", content)
    
    if (!content) {
        return {
            message: "Some data is missing"
        }
    }
    
    const table_id: string = content.filter(item => item[0] === "table_id").filter(item => item !== undefined && item !== null)[0][1];
    const user_email: string = content.filter(item => item[0] === "user_email").filter(item => item !== undefined && item !== null)[0][1];
    const rows: Array<Array<string>> = SORT(content);
    const values: Array<Array<string>> = content.filter(item => item[0].startsWith("ValueOption")).filter(item => item !== undefined && item !== null);
    const specs: Array<Array<string>> = content.filter(item => item[0].startsWith("Specification[")).filter(item => item !== undefined && item !== null);
    console.log("[SaveTableAction] Table id:", table_id)
    console.log("[SaveTableAction] Rows:", rows)
    console.log("[SaveTableAction] Email:", user_email)
    console.log("[SaveTableAction] Values:", values)
    console.log("[SaveTableAction] Specs:", specs)
    console.log("[SaveTableAction] Fetching /api/table/save...")
    
    const payload = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/save`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_email,
            table_id,
            title: formData.get("table_title"),
            rows,
            values,
            specs
        })
    })
    console.log("[SaveTableAction] Fetch result:", payload)
    if (payload.ok) {
        redirect(payload.url);
    }
    
    return {
        message: "Saved!"
    }
}
export async function UseAiAction (state: { message: string }, formData: FormData) {
    console.error("[UseAiAction] Starting...")
    const payload = UNPACK(formData);
    console.error("[UseAiAction] Form Data:", payload)
    const rows = SORT(payload);
    if (!rows) {
        return {
            message: "No rows provided"
        }
    }
    const specifications = payload.map(row => {
        if (row && row[0] && row[0].startsWith("Specification[")) {
            return row;
        }
    }).filter(key => key !== undefined);
    if (!specifications) {
        return {
            message: "No values provided"
        }
    }
    const values = payload.map(row => {
        if (row && row[0] && row[0].startsWith("ValueOption")) {
            return row[1];
        }
    }).filter(header => header !== undefined);
    console.error("[UseAiAction] Rows", rows)
    const columns = rows && rows[0];
    console.error("[UseAiAction] Columns", columns)
    const rowHeaders = rows && rows.map((row, index) => {
        if (index !== 0) {
            const [ header ] = row;
            return header;
        }
    }).filter(header => header !== undefined);
    console.error("[UseAiAction] Row Headers", rowHeaders)
    

    const request = {
        columns,
        rows: rowHeaders,
        specifications,
        values,
    }
    console.error("[UseAiAction] Request", request)
    const requesting = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/ai`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    const response = await requesting.json();
    console.error("[UseAiAction] Fetching /api/ai endpoint...")
    console.error("[UseAiAction] Fetch result:", response)
    console.error("[UseAiAction] Exiting...")
    return {
        message: "",
        response
    }
}
const UNPACK = (formData: FormData): Array<[string, FormDataEntryValue]> => {
    let pack = [];
    for (const pair of formData.entries()) {
        if (pair[0].startsWith("$")) {
            break;
        }
        pack.push(pair)
    }
    return pack;
}
const SORT = (pack: Array<[string, FormDataEntryValue]>) => {
    let numRows = 0;
    let newArray = [];

    // Get how many columns are
    pack.forEach(([key, value]) => {
        if (key.match(/[A-Z][0-9]/)) {
            const index = parseInt(key[1]) + 1;
            if (index > numRows) {
                numRows = index;
            }
        }
    })
    // Add empty array representing rows
    for (let count = 0; count < numRows; count ++) {
        newArray.push([])
    }
    // Pushes elements based on their name index, e.g.: A1 to index 1
    pack.forEach(([key, value]) => {
        if (key.match(/[A-Z][0-9]/)) {
            const index = parseInt(key[1]);
            newArray[index].push(value);
        }
    })
    return newArray;
}
"use server"
import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { RowSpecs, ColSpecs } from "@/app/hooks/custom";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { StreamableValue } from 'ai/rsc';
import { z } from "zod";

export async function SaveTableAction (
    previousState: { message: string, ok: boolean }, 
    formData: FormData, 
    statesObject: { values: Array<string> | undefined, colSpecs: Array<ColSpecs> | undefined, rowSpecs: Array<RowSpecs> | undefined },
    ) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    
    if (session && session.user) {
        const entries = [...formData.entries()];
        const tableEntries = entries
        .filter(([key]) => /^[A-Z][0-9]+$/.test(key)) // Filters out all input fields whose name are not <Letter><Number> format
        .map(([key, value]) => ({ key, value })); // Returns an Array of objects containing the key-value pairs]
        console.log(statesObject)
        let payload = {
            "user_id": session.user.id,
            "table_id": formData.get("table_id")?.toString(),
            "table_title": formData.get("table_title")?.toString(),
            rows: [[]],
            values: statesObject && statesObject.values ? statesObject.values : [],
            colSpecs: statesObject && statesObject.colSpecs ? statesObject.colSpecs.map(spec => {
                if (typeof spec === "object") {
                    if (Object.hasOwn(spec, "numberOfRows") && Object.hasOwn(spec, "amountOfValues")) {
                        return spec;
                    }
                }
            }).filter(element => element !== undefined) : [],
            rowSpecs: statesObject && statesObject.rowSpecs ? statesObject.rowSpecs.map(spec => {
                if (typeof spec === "object") {
                    if (Object.hasOwn(spec, "disable") 
                        && Object.hasOwn(spec, "count") 
                        && Object.hasOwn(spec, "enabledColumns") 
                        && Object.hasOwn(spec, "enabledValues")) {
                        return spec;
                    }
                }
            }).filter(element => element !== undefined) : [],
        };
        tableEntries.forEach(({ key, value }) => {
            const rowIndex = Number(key.slice(1));
            if (!payload.rows[rowIndex]) payload.rows[rowIndex] = [];
            payload.rows[rowIndex].push(value.toString() as never);
        })
        const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/save`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        if (request.status === 200) {
            if (!request.url.includes("/api")) {
                redirect(`${request.url}`);
            } else {
                revalidatePath(`/${locale}/table/${payload.table_id}`);
                revalidatePath(`/${locale}/dashboard`);
                return {
                    ok: true,
                    message: locale === "es" ? "¡Guardo exitosamente!" : "Saved successfuly!"
                }
            }
        }

        if (request.status === 404) {
            return {
                ok: false,
                message: locale === "es" ? "Usuario no encontrado" : "User not found"
            }
        } else if (request.status === 401) {
            return redirect(`/${locale}/login`);
        } else if (request.status === 403) {
            return {
                ok: false,
                message: locale === "es" ? "Haz alcanzado el límite de tablas" : "You've reached the table's limit"
            }
        } else if (request.status === 400) {
            return {
                ok: false,
                message: locale === "es" ? "Ha ocurrido un error, inténtalo más tarde" : "An error has occured, try again later"
            }
        } else {
            return {
                ok: false,
                message: locale === "es" ? "Error interno, inténtalo más tarde" : "Internal error, try again later"
            }
        }
    }
    return {
        ok: false,
        message: locale === "es" ? "Vuelve a iniciar sesión" : "Sign in again"
    }
    
}

const recentAIOutputs: Array<{
    timestamp: Date,
    output: StreamableValue<any, any>,
}> = [];
const MAX_HISTORY_SIZE = 5;
export async function generateTableAction (previousState: { rows: Array<Array<string>>, conflicts: Array<string> },formData: FormData) {
    let historyText = "";
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";

    if (recentAIOutputs.length > 0) {
        historyText = "Previous outputs I've generated (DO NOT REPEAT THESE PATTERNS):\n";
        recentAIOutputs.forEach((item, index) => {
          historyText += `Output ${index + 1}: ${JSON.stringify(item.output)}\n`;
        });
    }

    const entries = [...formData.entries()];
    let payload = {
        rows: [[]],
        values: entries && entries.map(entry => {
            if (entry[0].startsWith("ValueOption")) {
                return entry;
            }
        }).filter(entry => entry !== undefined),
        specs: entries && entries.map(entry => {
            if (entry[0].startsWith("Specification")) {
                return entry;
            }
        }).filter(entry => entry !== undefined),
    }

    const tableEntries = entries
    .filter(([key]) => /^[A-Z][0-9]+$/.test(key)) // Filters out all input fields whose name are not <Letter><Number> format
    .map(([key, value]) => ({ key, value })); // Returns an Array of objects containing the key-value pairs]
    tableEntries.forEach(({ key, value }) => {
        const rowIndex = Number(key.slice(1));
        if (!payload.rows[rowIndex]) payload.rows[rowIndex] = [];
        payload.rows[rowIndex].push(value.toString() as never);
    })
    const { object } = await generateObject({
        model: anthropic('claude-3-opus-20240229'),
        temperature: 1,
        output: 'object',
        schema: z.object({
            rows: z.array(z.array(z.string())),
            conflicts: z.array(z.string()),
        }),
        prompt: `
            ${historyText}
            You are a sophisticated scheduling algorithm designed to create strategic schedules/planners with the given data. Your task is to generate a schedule based on the provided information and specifications.
            Generate a highly strategic schedule with the following data:
            **Column Headers**: ${JSON.stringify(payload.rows && payload.rows[0])}
            **Rows Header**: ${JSON.stringify(payload.rows ? payload.rows.map((row: Array<string>, index: number) => {
                if (index !== 0) {
                    return row[0]; 
                }
            }): [])}
            **Values**: ${JSON.stringify(payload.values)}
            These are the specific requirements and constraints for the schedule. Each specification follows a format that you must interpret and apply correctly.
            **Specifications**: ${JSON.stringify(payload.specs)}
            
            Now, let's create the schedule following these steps:
            1. Initialize the schedule with the column headers.
            2. Add row headers and follow these steps for each row:
                a. If the header row does not have a name, fill all its columns with empty strings and move into the next row.
                b. Check if the row has this specification: "Specification: Row <index> named <name>, disable on the entire table", if so fill all the columns with empty strings. Otherwise, go to the next step.
                c. For the current row to work with, check if there are specifications for which columns to fill: "Specification: Row <index> named <name>, is meant to be used on this column:"
                d. Check if there is a row specification: "Specification: Row <index> named <name>, should be used this fixed amount of times:", The specification means the row should appear no more than the specified amount, regardless of the column's specifications.
                e. If there is a conflict between the specification: "Specification: Row <index> named <name>, is meant to be used on this column:" where N columns must be filled in the row, and the specification: "Specification: Row <index> named <name>, should be used this fixed amount of times:", prioritize this specification: "Specification: Row <index> named <name>, is meant to be used on this column:" and fill those columns
                f. Check if there is a row specification: "Specification: Row <index> named <name>, has this value assigned:". If there are values meant to be used in this row, it's mandatory to use them all on the row in a random order. If there are more columns to fill than values to use, reuse them randomly. If there are no values assigned for this row, use values from the provided list randomly. If this specification has a conflict with: "Specification: Row <index> named <name>, should be used this fixed amount of times:", prioritize this last specification.
            3. Once all rows have been filled check for each column's specification: "Specification: Column <index> named <name>, must have this fixed amount of rows filled in:". If there are more values filled than the amount assigned, check each row's specification: "Specification: Row <index> named <name>, is meant to be used on this column:". If there is a row that don't have this specification, replace the value on the column with an empty string. If there is a row specification assigning the column to be filled with a value, leave the value and make an annotation about this conflict in an array called "conflicts".
            4. Fill unused columns with empty strings.
            5. After completing all the table, analyze the result and perform any improvement to better meet the criteria given. Remember that the specifications given is the most important to give a strategic result.
            6. Finish the output as an Object, a property called "rows" for the table, and "conflicts" for any conflicts met that couldn't be handled in this language: ${ locale } where 'en' is English and 'es' is Spanish (note that this is a generic example and should not influence the actual content of the current generated schedule):
            {
                rows: [
                    ["Employees", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    ["Employee1", "shift1", "shift2", "", "shift3", "shift4", "", ""],
                    ["Employee2", "", "shift1", "shift2", "", "", "shift3", "shift4"],
                    // ... more employees ...
                ],
                conflicts: ["The specification in column <name> could not be met because [...]", "The specification in row <name> could not be met because [...]"],
            }
            Rules to follow:
                1. **Randomness**
                - Distribute the values randomly throughout the table ONLY IF it does not affect row any specification.
                2. **Emptiness**
                - Fill unused cells with an empty string after placing all required values.
                3.  **Output**
                - Generate and return the output as a JavaScript Object. A property called "rows" is an Array of Arrays, and a second property called "conflicts" with all annotations of specifications that could not be met.
                - The first array should contain the column headers.
                - Each subsequent array represents a row.
                - The first element of a row is the row header.
                - The remaining elements of each row Array are the values for each column.
                4. **Prioritization**
                - Prioritize the specification: "Specification: Row <index> named <name>, should be used this fixed amount of times:" over "Specification: Column <index> named <name>, must have this fixed amount of rows filled in:", regardless of the amount of rows.
                - If there are any "Specification: Row <index> named <name>, has this value assigned:", ONLY use these specified values in the specified row. These values can be reused in the same row.
            Make a second analysis to confirm that the rules are followed.
        `,
    })
    return object;
}
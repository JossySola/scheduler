"use server"
import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Specs } from "@/app/hooks/custom";
import { streamObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createStreamableValue } from 'ai/rsc';
import { z } from "zod";

export async function SaveTableAction (
    previousState: { message: string, ok: boolean }, 
    formData: FormData, 
    statesObject: { values: Array<string> | undefined, colSpecs: Array<number> | undefined, specs: Array<Specs> | undefined },
    ) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();

    if (session && session.user) {
        const entries = [...formData.entries()];
        const tableEntries = entries
        .filter(([key]) => /^[A-Z][0-9]+$/.test(key)) // Filters out all input fields whose name are not <Letter><Number> format
        .map(([key, value]) => ({ key, value })); // Returns an Array of objects containing the key-value pairs]
        let payload = {
            "user_id": session.user.id,
            "table_id": formData.get("table_id")?.toString(),
            "table_title": formData.get("table_title")?.toString(),
            rows: [[]],
            values: statesObject && statesObject.values ? statesObject.values : [],
            colSpecs: statesObject && statesObject.colSpecs ? statesObject.colSpecs : [],
            specs: statesObject && statesObject.specs ? statesObject.specs.map(spec => {
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
        message: locale === "es" ? "Vuelve a iniciar sesión" : "Signin again"
    }
    
}
export async function UseAiAction (formData: FormData, submit: (input: any) => void) {
    const session = await auth();

    if (session) {
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
        
        /*
        const stream = createStreamableValue();
        const generation = async () => {
            const { partialObjectStream } = streamObject({
                model: anthropic('claude-3-opus-20240229'),
                output: 'object',
                schema: z.object({
                    rows: z.array(z.array(z.string()))
                }),
                prompt: `
                    You are a sophisticated scheduling algorithm designed to create strategic schedules/planners with the given data. Your task is to generate a schedule based on the provided information and specifications.
    
                    Generate a highly strategic schedule with the following data:
                    **Column Headers**: ${JSON.stringify(payload && payload.rows && payload.rows[0])}
                    **Rows Header**: ${JSON.stringify(payload && payload.rows ? payload.rows.map((row: Array<string>, index: number) => {
                        if (index !== 0) {
                            return row[0]; 
                        }
                    }): [])}
                    **Values**: ${JSON.stringify(payload.values)}
                    These are the specific requirements and constraints for the schedule. Each specification follows a format that you must interpret and apply correctly.
                    **Specifications**: ${JSON.stringify(payload.specs)}
                    
                    Now, let's create the schedule following these steps:
                    1. Initialize the schedule with the column headers.
                    2. Add row headers for each row.
                    3. Apply the specifications in this order:
                        a. Assign rows to specific columns as required.
                        b. Assign specific values to rows as specified.
                        c. Ensure each row appears the correct number of times.
                        d. Avoid scheduling rows on columns they should not work.
                    4. Fill the remaining slots randomly with the specified values in case there is not a specification dictating how many times the row should appear.
                    5. Fill unused cells with empty strings.
                    6. If there is a remote case where a criteria could not be meet, append this suffix: ^, to the value in question.
                    7. Rows specifications should be prioritized over columns specifications, regardless of the number of rows. For example: If there is only 1 row that has to appear 3 times in a table of 5 columns, the row should only have 3 columns filled with values.
    
                    Rules to follow:
                    1. **Randomness**
                    - Distribute the values randomly throughout the table ONLY IF it does not affect any specification.
                    2. **Emptiness**
                    - Fill unused cells with an empty string after placing all required values.
                    3.  **Output**
                    - Generate and return the output as a JavaScript Array of Arrays:
                    - The first array should contain the column headers.
                    - Each subsequent array represents a row.
                    - The first element of a row is the row header.
                    - The remaining elements of each row Array are the values for each column.
                    - The specification: "Specification:Row-<name>-should-appear-only-this-amount-of-times" means the row should appear no more than the specified amount, regardless of the column's specifications.
                    4. **Prioritization**
                    - Prioritize the specification: "Specification:Row-<name>-should-appear-only-this-amount-of-times" over "Specification:Column:<name>-must-have-this-amount-of-cells-filled-in", regardless of the amount of rows.
                    - If there are any "Specification:Row-<name>-use-this-value-specifically", ONLY use these specified values in the specified row. These values can be reused in the same row.
    
                    After creating the complete schedule, double-check your work against each specification to ensure all requirements are met.
    
                    Here's an example of how the output should be structured (note that this is a generic example and should not influence the actual content of the current generated schedule):
    
                    [
                        ["Employees", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                        ["Employee1", "shift1", "shift2", "", "shift3", "shift4", "", ""],
                        ["Employee2", "", "shift1", "shift2", "", "", "shift3", "shift4"],
                        // ... more employees ...
                    ]
                `,
            })
            for await (const partialObject of partialObjectStream) {
                stream.update(partialObject);
            }
            stream.done();
        }
        await generation();
        return { object: stream.value }
        */
    }
    return { object: { rows: [] } }
}
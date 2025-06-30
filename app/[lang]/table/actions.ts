"use server"
import "server-only";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { StreamableValue } from 'ai/rsc';
import { z } from "zod";
import { generateKmsDataKey } from "@/app/lib/utils";
import { sql } from "@vercel/postgres";
import { RowType } from "@/app/lib/utils-client";

export async function SaveNewTableAction (name: string, rows: Array<Map<string, RowType>>, values: Set<string>, type: string, interval: number) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const session = await auth();
    
    const objectify = rows.map(col => {
        return Array.from(col).map(([key, value], index) => {
            if (value.specs) {
                return [key, {
                    ...value,
                    specs: {
                        ...value.specs,
                        valueTimes: Array.from(value.specs.valueTimes)
                    }
                }];
            }
            return [key, value];
        })
    })
    
    if (session && session.user) {
        const num_tables: number | null = await sql`SELECT num_tables FROM scheduler_users WHERE id = ${session.user.id}`.then(result => result.rows[0].num_tables ?? null).catch(reason => console.error(reason));
        if (num_tables === 3 || num_tables === null) {
            return {
                ok: false,
                message: locale === "es" ? "Alcanzaste el límite de tres tablas 😔" : "You've reached the three schedules limit 😔",
            }
        }
        const name_key = await generateKmsDataKey();
        const rows_key = await generateKmsDataKey();
        const values_key = await generateKmsDataKey();

        if (name_key && rows_key && values_key) {
            const insert = await sql`
            INSERT INTO scheduler_users_tables (
                user_id, 
                table_name, 
                table_name_key, 
                table_rows, 
                table_rows_key, 
                table_values, 
                table_values_key, 
                table_type, 
                table_interval
            )
            VALUES (
                ${session.user.id},
                pgp_sym_encrypt(${name}, ${name_key.Plaintext}),
                ${name_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(objectify)}, ${rows_key.Plaintext}),
                ${rows_key.CiphertextBlob},
                pgp_sym_encrypt(${JSON.stringify(Array.from(values))}, ${values_key.Plaintext}),
                ${values_key.CiphertextBlob},
                ${type},
                ${interval}
            );
            `
            .then(() => ({ ok: true, message: locale === "es" ? "¡Horario guardado!" : "Schedule saved!" }))
            .catch(()=> ({ ok: false, message: locale === "es" ? "Ha ocurrido un error 😔" : "An error has occurred 😔" }));
            return insert;
        }
        return {
            ok: false,
            message: locale === "es" ? "Se ha producido un error antes de procesar la información" : "There is an error prior to information processing",
        }
    }
    return {
        ok: false,
        message: locale === "es" ? "Parece que se ha desconectado tu sesión" : "It looks like you've lost the session"
    }
}
const recentAIOutputs: Array<{
    timestamp: Date,
    output: StreamableValue<any, any>,
}> = [];
const MAX_HISTORY_SIZE = 5;
export async function generateTableAction (previousState: { lang: string, rows: Array<Array<string>>, conflicts: Array<string> }, formData: FormData) {
    let historyText = "";
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
    let { object } = await generateObject({
        model: anthropic('claude-opus-4-20250514'),
        temperature: 1,
        output: 'object',
        schema: z.object({
            lang: z.string(),
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

            Rules to follow:
            1. **Randomness**
                - Distribute the values randomly throughout the table ONLY IF it does not affect any row specification.
            2. **Emptiness**
                - Fill unused cells with an empty string after placing all required values.
                - Do not fill rows that have a disabled specification. No need to add it as a conflict.
            3.  **Output**
                - Generate and return the output as a JavaScript Object. A property called "rows" is an Array of Arrays, and a second property called "conflicts" with all annotations of specifications that could not be met.
                - The first array should contain the column headers.
                - Each subsequent array represents a row.
                - The first element of a row is the row header.
                - The remaining elements of each row Array are the values for each column.
                
            Now, let's create the schedule following these steps:
            1. Initialize the schedule with the column headers as the first array in a main array.
            2. For each subsequent row add an array to the main array, add the row headers as the first element of each array and start filling them according to the specifications of each row:
                a. If the header row does not have a name, fill all its columns with empty strings and move into the next row.
                b. Check if the row has this specification: "Specification: Row <index> named <name>, disable on the entire table", if so fill all the columns with empty strings. Otherwise, go to the next step.
                c. First check which values to use for this row under the "Specification: Row <index> named <name>, has this value assigned:" specification. Keep in mind there could be more than one value with this specification assigned to this row. It's mandatory to use all the specified values on the row in a random order. If there are more columns to fill than values to use, reuse them randomly. If there are no values assigned for this row, use values from the provided list randomly.
                d. For the current row to work with, check if there are specifications for which columns to fill: "Specification: Row <index> named <name>, should be used on this column specifically:" and fill them with the previous assigned values' list. Keep in mind this specification may be repeated with other column names.
                e. Look up for the specification: "Specification: Row <index> named <'name'>, this is in how many columns the row should be filled in:". If it exists, do the following:
                    i. If the specification: "Specification: Row <index> named <name>, should be used on this column specifically:" exists as well, use this one instead and discard the other specification.
                    ii. If the specification: "Specification: Row <index> named <name>, should be used on this column specifically:" does not exist, fill any N of columns with the previously assigned values in a random order. 
                f. Repeat the previous steps for each row.
            3. After having all the rows filled in following their specifications, now we will move into the Columns' specifications. Iterate through each column and follow these steps on each one:
                a. Look up for the specification: "Specification: Column <letter> named <'name'>, must have this fixed amount of rows filled in:". If the column currently has more rows filled in than it should, remove ONLY the row's values that do not conflict with: "Specification: Row <index> named <name>, should be used on this column specifically:". Otherwise, leave them there and add this observation to an array named "conflicts". If the Column currently has less values than it is specified, fill in any values with the row's assigned values as long as it does not conflict with: "Specification: Row <index> named <'name'>, this is in how many columns the row should be filled in:". Otherwise, do not do annything and add this observation to the array named "conflicts".
                b. Look up for the specification: "Specification: Column <letter> named <'name'>, use the value: "<value>" in this column this amount of times:". 
                    i. If there are values missing: fill them into any rows that have these values assigned, then check the other columns that hold values of those rows and place the value that was held into any of their filled columns that may have this value duplicated. If the past value did not have a duplicate, place it in any other column that may expect this value to be used BUT if the row does not have assigned values specified, then drop this past value and move on. Annotate any conflict into the 'conflicts' array.
                    ii. If there are values not expected in the column: Check each row specifications, if a row has: "Specification: Row <index> named <name>, should be used on this column specifically:", check their assigned values, if among the values there are values expected in the column, replace the past value with any of the expected values. If the past value has a duplicate drop it and move on. If it does not have a duplicate, place it in any column that expects this value and write the annotation into the 'conflicts' array. If the row does not have this specification: "Specification: Row <index> named <name>, should be used on this column specifically:", place the past value in any column that expects this value. 
            4. Fill unused columns with empty strings.
            5. After completing all the table, analyze the result and perform any improvement to better meet the criteria. Remember that the specifications given are the most important to be able to return a strategic result.
            6. Finish the output as an Object, a property called "rows" for the table, and "conflicts" for any conflicts met that couldn't be handled. Write the conflict messages in this language: ${ previousState.lang } where 'en' is English and 'es' is Spanish, return in the same object a property called 'lang' with the language used for the 'conflicts' annotation. (note that the following is a generic example and should not influence the actual content of the current generated schedule):
            {
                rows: [
                    ["Employees", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    ["Employee1", "shift1", "shift2", "", "shift3", "shift4", "", ""],
                    ["Employee2", "", "shift1", "shift2", "", "", "shift3", "shift4"],
                    // ... more employees ...
                ],
                conflicts: ["The specification in column <name> could not be met because [...]", "The specification in row <name> could not be met because [...]"],
                lang: 'en'
            }
        `,
    })
    return object;
}
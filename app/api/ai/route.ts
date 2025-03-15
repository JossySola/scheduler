"use server"
import "server-only";
import { anthropic } from '@ai-sdk/anthropic';
import { streamObject } from "ai";
import { z } from "zod";
import { NextRequest } from "next/server";

const recentAIOutputs: Array<{
    timestamp: Date,
    output: Response,
}> = [];
const MAX_HISTORY_SIZE = 5;

export async function POST (request: NextRequest) {
    let historyText = "";
    if (recentAIOutputs.length > 0) {
        historyText = "Previous outputs I've generated (DO NOT REPEAT THESE PATTERNS):\n";
        recentAIOutputs.forEach((item, index) => {
          historyText += `Output ${index + 1}: ${JSON.stringify(item.output)}\n`;
        });
    }

    const payload = await request.json();
    const rows: Array<Array<string>> = payload.rows;
    const values: Array<string> = payload.values;
    const specs: Array<string> = payload.specs;

    const result = streamObject({
        model: anthropic('claude-3-opus-20240229'),
        temperature: 1,
        output: 'object',
        schema: z.object({
            rows: z.array(z.array(z.string()))
        }),
        prompt: `
            ${historyText}

            You are a sophisticated scheduling algorithm designed to create strategic schedules/planners with the given data. Your task is to generate a schedule based on the provided information and specifications.

            Generate a highly strategic schedule with the following data:
            **Column Headers**: ${JSON.stringify(rows && rows[0])}
            **Rows Header**: ${JSON.stringify(rows ? rows.map((row: Array<string>, index: number) => {
                if (index !== 0) {
                    return row[0]; 
                }
            }): [])}
            **Values**: ${JSON.stringify(values)}
            These are the specific requirements and constraints for the schedule. Each specification follows a format that you must interpret and apply correctly.
            **Specifications**: ${JSON.stringify(specs)}
            
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
                - The specification: "Specification: Row <index> named <name>, should be used this fixed amount of times:" means the row should appear no more than the specified amount, regardless of the column's specifications.
                4. **Prioritization**
                - Prioritize the specification: "Specification: Row <index> named <name>, should be used this fixed amount of times:" over "Specification: Column <index> named <name>, must have this fixed amount of rows filled in:", regardless of the amount of rows.
                - If there are any "Specification: Row <index> named <name>, has this value assigned:", ONLY use these specified values in the specified row. These values can be reused in the same row.

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

    const output = result.toTextStreamResponse();

    recentAIOutputs.push({
        timestamp: new Date(),
        output,
    })
    if (recentAIOutputs.length > MAX_HISTORY_SIZE) {
        recentAIOutputs.shift();
    }

    return output;
}
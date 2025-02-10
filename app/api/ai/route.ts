"use server"
import "server-only";
import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest): Promise<NextResponse> {
    console.error("[/api/ai] Starting...")
    const payload = await request.json();
    console.error("[/api/ai] Payload:", payload);
    const columns: Array<string> = payload.columns;
    const rows: Array<Array<string>> = payload.rows;
    const values: Array<string> = payload.values;
    const specifications: Array<Array<string>> = payload.specifications;

    if (!rows || !columns || !values) {
        return NextResponse.json({ error: "Some data is missing." }, { status: 400 })
    }

    try {
        const { object } = await generateObject({
            model: anthropic('claude-3-opus-20240229'),
            output: 'object',
            schema: z.object({
                rows: z.array(z.array(z.string()))
            }),
            prompt: `
                You are a sophisticated scheduling algorithm designed to create strategic schedules/planners with the given data. Your task is to generate a schedule based on the provided information and specifications.

                Generate a highly strategic schedule with the following data:
                **Columns**: ${JSON.stringify(columns)}
                **Rows**: ${JSON.stringify(rows)}
                **Values**: ${JSON.stringify(values)}
                These are the specific requirements and constraints for the schedule. Each specification follows a format that you must interpret and apply correctly.
                **Specifications**: ${JSON.stringify(specifications)}
                
                Now, let's create the schedule following these steps:
                1. Initialize the schedule with the column headers (days of the week).
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
        });
        
        return NextResponse.json({ 
            statusText: "Done",
            result: object.rows
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 })
    }
}
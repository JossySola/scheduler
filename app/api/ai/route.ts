import { openai } from "@ai-sdk/openai";
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
            model: openai('gpt-4o'),
            output: 'object',
            schema: z.object({
                rows: z.array(z.array(z.string()))
            }),
            prompt: `
                Generate a schedule / planner using the following data: 
                **Columns**: ${JSON.stringify(columns)}
                **Rows**: ${JSON.stringify(rows)}
                **Values**: ${JSON.stringify(values)}
                **Specifications**: ${specifications ? JSON.stringify(specifications) : 'No specifications provided.'}
                
                ### Rules:
                1. **Random Value Placement**:
                - Distribute values **randomly** across the table.
                - Use randomness in placement for each column and row while adhering to specifications.

                2. **Specification Enforcement**:
                - If "Specification[<row header name>]-should-appear-this-amount-of-times" is specified, ensure the total occurrences of values in that row matches the specified count (e.g., "3" means exactly 3 values spread randomly).
                - If "Specification[<row header name>]-fill-all-columns-with-at-least-<N>-values" is specified, ensure at least "<N>" unique values appear in every column of the row.

                3. **Empty Cells**:
                - Fill unused cells with an empty string ("''") after placing all required values.

                4. **Conflict Resolution**:
                - If both rules apply, prioritize "should-appear-this-amount-of-times".

                5. **Output Requirements**:
                - Return the schedule as an array of arrays:
                    - The first array contains column headers.
                    - Each subsequent array represents a row:
                        - The first element is the row header.
                        - Remaining elements are the values for each column.

                ### Notes:
                - Values should **not** appear in the same predictable order every time.
                - Each execution should yield a different random arrangement of values.
                - If multiple rows exist, repeat the process for each row.
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
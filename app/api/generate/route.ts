"use server"
import { streamObject } from "ai";
import { NextRequest } from "next/server";
import { tableGenerationSchema } from "./schema";
import { anthropic } from "@ai-sdk/anthropic";

type ObjectType = {
    value: string,
    specs?: {
        disabled: boolean,
        disabledCols: Array<string>,
        rowTimes: number,
        preferValues: Array<string>,
        colTimes: number,
        valueTimes: Array<[string, number]>,
    },
};
export async function POST (request: NextRequest) {
    const payload = await request.json();
    const rows: Array<Array<ObjectType>> = payload.rows;
    const values: Array<string> = payload.values;
    const previous: Array<Array<Array<ObjectType>>> | undefined = payload.previous;
    const lang: string = payload.lang;
    const result = streamObject({
        model: anthropic('claude-opus-4-20250514'),
        temperature: 1,
        output: "object",
        schema: tableGenerationSchema,
        prompt: `
            You are a sophisticated scheduling algorithm designed to create strategic schedules with the given data. Your task is to generate a schedule based on the provided information to efficiently meet the specifications from the user.

            The rows that you are going to check are structured this way:
            Every cell is indexed, a capital letter for each column and an index number for each row. So for instance, the first cell in the table is "A0", the second column in the first row is "A1", the second cell in the second row at the first column is "B0".
            The data structure used is an Array of Maps. Each Map represents a row, and each Map key represents the indexed column.
            The cells that are located either in the first row (column headers) or in the first column in all rows (row headers) contain an object property called "specs".
            All cells including headers contain a property called "value" (string). The property "conflict" (boolean) is only part of normal cells.
            The "specs" property, which is exclusive of headers, is an object containing the next properties:
                1. disabled
                2. disabledCols
                3. rowTimes
                4. preferValues
                5. colTimes
                6. valueTimes
            Each one specifies the following criteria:
                Specifications for rows:
                    1. "disabled": Type: boolean. Whether the row is disabled, if so, no work has to be done in the row and all of its cells must be empty.
                    2. "disabledCols": Type: Array<string>. It contains the "value" string of the columns that should not be filled for the current row, meaning these columns in the row should be empty.
                    3. "rowTimes": Type: number. It specifies how many cells must be filled in with a value in the current row.
                    4. "preferValues": Type: Array<string>. It contains the values that must be used in the current row.
                Specifications for columns:
                    1. "colTimes": Type: number. It specifies how many rows must be filled in with a value in the current column.
                    2. "valueTimes": Type: Map<string, number>. The string specifies the "value" and the number specifies the amount of times that value must be assigned in the current column.
            
            Generate a highly strategic schedule with the following data. The Maps and Sets are converted into Arrays:
            **Rows**: ${JSON.stringify(rows)}
            **Values**: ${JSON.stringify(values)}

            The output generated must be an Object containing:
                1. rows: A property holding an Array of Arrays. The child arrays will be tuples. The first element of a child array will be the index of the cell (for example: "A0","B0",..., "C2", etc.), the second element will be the value assigned by you, and the third element will be a boolean to know whether or not that cell has any conflicts. Therefore, the output will be an array of arrays with tuples containing the information only about the working cells, not column or row headers.
                2. conflicts: An array of strings containing any descriptive conflicts found while generating the schedule, as instance, any conflict with contradictory criteria. The conflict text must be in this language: ${lang}

            Rules to follow:
            1. **Randomness**
                - Distribute the values randomly throughout the table ONLY IF it does not affect any row specification.
            2. **Emptiness**
                - Fill unused cells with an empty string after placing all required values.
                - Do not fill rows that have a disabled specification. No need to add it as a conflict.
                
            These are the suggested steps to follow in order to generate the most strategic schedule, however, after reading these steps if you come up with a better process that would generate an even more strategic schedule, you're free to do that:
            Having in mind that the column headers are located at the first array of the main array ("Rows") and the row headers are located in the first element of each row (array), we will begin to iterate "Rows":
            1. First row (array in "Rows"): column headers. Save each column specification and index to have them available when we start working with the next rows.
            2. Create an array and start inserting arrays containing a string set to each cell's name, an empty string as the second element, and the boolean 'false' as the third element, these child arrays will represent a cell, BUT only insert the cells that are not row or column headers. For example: [["A1", "", false], ["B2", "", false], ["C3", "", false], ... ]. Hereafter, I refer to this array as "Output". Hereafter, by "fill the cell" I mean "assign it to the string at the second element of the cell (array)".
            2. If there is a conflict in a specific cell, find the array containing the cell's name in question in Output and set the third element to true.
            3. For each consecutive row (array) in "Rows", check for the "specs" property in the first element, which is the row header:
                a. If the property "disabled" is "true", do nothing and continue with the next row.
                b. If "disabledCols" has content, leave each array's second element that have the corresponding cell name that is part of the row, with the empty string it started in Output. Keep these disabled columns in mind.
                c. If "preferValues" has content, save them to work with the next and last specification. If it does not have content, use all values from "Values" at least once in random order. If there are less values than columns, you can also repeat them randomly. If there are more values than columns, choose the values randomly to fill the cells.
                d. If "rowTimes" is greater than 0, randomly (order and location) fill the cells with the "preferValues"'s values if applicable, avoiding the cells with empty strings you set in step "b". If there are no columns left to apply this specification, add this issue in "conflicts". If there are some columns available but not enough for this specification to succeed, fill those available columns and annotate this in "conflicts". If there are more columns than "rowTimes", fill the amount of cells specified and the remaining fill them with empty strings. If "rowTimes" is 0, fill all available columns with any assigned or random values, and suggest on "conflicts" to use the "disabled" option, to disable the row. Any cell conflicting with a column's specification fill it as requested but add this in "conflicts".
            4. It is important to note that the input cells are displayed as select types. So based on the "Values" array and the elements' indexes, set the prior values with the value's index as a string, so instead of words the value must be index numbers as strings.
            
            
            This is an example of how the output should look like:
            {
                rows: [
                    ["B1", "1", true],
                    ["C1", "0", true],
                    ["B2", "0", false],
                    ["C2", "2", false],
                    ["B3", "0", false],
                    ["C3", "0", false]
                ],
                conflicts: ["In the row 'Chema' it was expected to fill 5 columns but the table only has 2, resolve a contradicting specification under 'Row Specifications'.", ...],
            }

            This is previous output: ${previous ? JSON.stringify(previous) : null}, do not repeat it/them. 
        `,
    });
    return result.toTextStreamResponse();
} 
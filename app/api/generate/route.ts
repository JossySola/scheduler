"use server"
import { streamObject } from "ai";
import { NextRequest } from "next/server";
import { tableGenerationSchema } from "./schema";
import { anthropic } from "@ai-sdk/anthropic";
import { VTData } from "@/app/hooks/custom";
import * as z from "zod/v4";

// TYPES
type Values = Array<string>;
type Data = Array<VTData>;
type ColsSpecs = {
    numberOfRows: { [key: string]: number };
    amountOfValues: {
        [key: string]: number;
    }
}
type RowsSpecs = {
    disabled: { [key: string]: boolean };
    count: { [key: string]: number };
    enabledValues: { [key: string]: Array<string> };
    enabledColumns: { [key: string]: Array<string> };
}
type Columns = Array<string>;
type Rows = Array<string>;
type Payload = {
    values: Values;
    data: Data;
    rows: Rows;
    cols: Columns;
    colSpecs: ColsSpecs;
    rowSpecs: RowsSpecs;
    lang: "en" | "es";
    user_id: string;
    previousStorage: string | null;
}

export async function POST (request: NextRequest) {
    const payload: Payload = await request.json();
    const values = payload.values;
    const lang = payload.lang;
    const cols = payload.cols;
    const rows = payload.rows;
    const colSpecs = payload.colSpecs;
    const rowSpecs = payload.rowSpecs;
    const user_id = payload.user_id;
    const previousStorage = payload.previousStorage;
    
    if (user_id) {
        const result = streamObject({
            model: anthropic('claude-opus-4-20250514'),
            temperature: 1,
            output: "object",
            schema: tableGenerationSchema,
            system: `
                You are a sophisticated scheduling algorithm designed to create strategic schedules with the given data. Your task is to generate a schedule based on the provided information to efficiently meet the specifications from the user.

                The rows that you are going to check are structured this way:
                Every cell is indexed, a capital letter for each column and an index number for each row. So for instance, the first cell in the table is "A0", the second column in the first row is "A1", the second cell in the second row at the first column is "B0".
                
                The "rowsSpecs" property is an object containing the next properties:
                    1. disabled
                    2. count
                    3. enabledValues
                    4. enabledColumns
                Each one specifies the following criteria:
                        1. "disabled": Type: { [key: number]: boolean }. Whether the row is disabled, if so, no work has to be done in the row and all of its cells must be empty.
                        2. "count": Type: { [key: string]: number }. It specifies how many cells must be filled in with a value in the current row.
                        3. "enabledValues": Type: { [key: string]: Array<string> }. It contains the values that must be used in the current row.
                        4. "enabledColumns": Type: { [key: string]: Array<string> }. It contains the "value" string of the columns that should not be filled for the current row, meaning these columns in the row should be empty.
            
                The "colsSpecs" property is an object containing the next properties:
                    1. numberOfRows
                    2. amountOfValues
                Each one specifies the following criteria:
                    1. "numberOfRows": Type: { [key: string]: number }. It specifies how many rows must be filled in with a value in the current column.
                    2. "amountOfValues": Type: { [key: string]: Array<number> }. The key specifies the column. The array contains the numbers specifying the amount of times that value must be assigned on each column. The indexes should be the same as the index order in the "values" array provided in the prompt. If the array is empty, it means the user hasn't set a specific number, so work with the number of rows as the number for each column.
            
                The output generated must be an Object containing:
                    1. data: A property holding an Array of Objects. Each object represents a row in the schedule and every key:value pair represents a cell in that row. The key is the cell's name (i.e. "A") and the value is the value assigned to that cell (i.e. "Math", "0", "1", etc). If a cell is empty, the value must be an empty string ("").
                    2. conflicts: An array of strings containing any descriptive conflicts found while generating the schedule, as instance, any conflict with contradictory criteria. The conflict texts must be in this language: ${lang}. Each conflict text must cover these questions:
                        a. In which column the conflict is located?
                        b. What cell key (i.e. "A3") has the conflict?
                        c. Which specification was not met?
                        d. Why the conflict occured?
                        2.1. Use this specification's names instead of the abbreviated keys:
                            a. disabled:
                                i. English: "Disable on all columns"
                                ii. Spanish: "Deshabilitar en todas las columnas"
                            b. disabledCols:
                                i. English: "Disable these columns"
                                ii. Spanish: "Deshabilitar estas columnas"
                            c. rowTimes:
                                i. English: "In how many columns should it appear?"
                                ii. Spanish: "¿En cuántas columnas debería aparecer?"
                            d. preferValues:
                                i. English: "Prefer the following values to use in this row"
                                ii. Spanish: "Preferir usar estos valores en la fila"
                            e. colTimes:
                                i. English: "Amount of rows to fill in this column"
                                ii. Spanish: "Número de filas a llenar en esta columna"
                            f. valueTimes:
                                i. English: "Use the value "<insert value>" this amount of times"
                                ii. Spanish: "Usar el valor "<insert value>" esta cantidad de veces"

                Rules to follow:
                1. **Randomness**
                    - Distribute the values randomly throughout the table ONLY IF it does not affect any row specification.
                2. **Emptiness**
                    - Fill unused cells with an empty string after placing all required values.
                    - Do not fill rows that have a disabled specification. No need to add it as a conflict.
                3. **Values**
                    - When there are values provided, it means the cells' components are of type Select. Therefore, if "values" are provided in prompt, you ought to use the values' indexes instead of the values themselves, as Select components manage the value selected by the index. Check the output sample in the end.
                    
                These are the suggested steps to follow in order to generate the most strategic schedule, however, after reading these steps if you come up with a better process that would generate an even more strategic schedule, you're free to do that:

                Having in mind that the column headers are located at the first array of the main array ("Rows") and the row headers are located at the object's key called "A":
                1. Create and object with two properties: "data" and "conflicts", each one having an empty array as value.
                2. Create a new array to use for "data" and insert into the array the first object which will contain the column headers. Populate the object with key:value pairs, the key being the column (i.e. A, B, C, etc.) and the value being the headers' values at "cols" provided in the prompt.
                3. For each of the next objects created based on the "rows" provided in the prompt (representing different rows based on "rows" provided in the prompt):
                    a. Check the "rowSpecs" object, check each property's key matching the row's index with the key's name:
                        i. On the "disable" property, if the value is "true", break the following steps and work directly with the next row.
                        ii. On the "enabledColumns" property, if the row's key's value is an empty array, it means you can use all the cells in the row, so go to the next step. Otherwise, fill the cells with an empty string for each column that IS NOT in the array.
                        iii. On the "enabledValues" property, if the row's key's value is an empty array, it means you can use any of the values provided at "values" in the prompt. Otherwise, maintain the array to use in the next step.
                        iv. On the "count" property, if the row's key's value is cero, fill all the row's cells with empty strings. Otherwise, fill just the amount of cells based on this value using the values' index (just if the prior values' array is populated) kept in the prior step in random order, if there are no values provided in the prompt use whatever value you think fits the context based on the columns and rows and using the language based on the "lang" value in the prompt. If the are more cells to fill than values to use, reuse the values (if provided) randomly in random order.
                    b. Check the "colSpecs" object, iterate over each row created in the prior step and:
                        i. On the "amountOfValues" property, if the column's key's value is an empty array, move on into the next step. Otherwise, based on the "rows" length, use the best performant iteration algorithm. The task is to guarantee that each value is used the correct amount of times for each column. If any row has a conflict with this column specification, do not modify the row's cell's column and add this conflict into the "conflict" array. If there is no conflict with the rows specifications, replace with an empty string the cells necessary to meet this criteria. 
                        ii. On the "numberOfRows" property, based on the "rows" length, use the best performant iteration algorithm. The task is to guarantee that each column has the correct amount of rows filled. If any row has a conflict with this column specification, do not modify the row's cell's column and add this conflict into the "conflict" array. If there is no conflict with the rows specifications, replace with an empty string the cells necessary to meet this criteria.
                
                This is an example of how the output should look like (if the values were: V1, V2, V3):
                {
                    data: [
                        { A: 'A0', B: 'B0', C: 'C0', D: 'D0' },
                        { A: 'A1', B: '0', C: '2', D: '2' },
                        { A: 'A2', B: '1', C: '1', D: '0' },
                        { A: 'A3', B: '2', C: '0', D: '1' }
                    ],
                    conflicts: ["In the row 'A2' it was expected to fill 5 columns but the table only has 3, resolve this contradicting specification under 'Row Specifications'.", ...],
                }
            `,
            prompt: `
            Generate a highly strategic schedule with the following data and specifications
            **Language**: ${lang}
            **Rows**: ${JSON.stringify(rows)}
            **Columns**: ${JSON.stringify(cols)}
            **Values**: ${JSON.stringify(values)}
            **Columns Specs**: ${JSON.stringify(colSpecs)}
            **Rows Specs**: ${JSON.stringify(rowSpecs)}
            **Previous Storage**: ${previousStorage} (do not give as output any previous generated output. If all output possibilities have been used, you can then reuse them.)
            `,
        });
        return result.toTextStreamResponse();
    }
} 
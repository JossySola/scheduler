import { Result_FormDataToQuery, TableFormData } from "./definitions";
import { v4 as uuidv4 } from 'uuid';

export function FormDataToQuery (formData: TableFormData) {
    const getNumRowsCols = (formData: TableFormData) => {
        // Keeps count of each element on table
        let index = 0;
        // Keeps record of how many columns there are based on the first letter of the key's name
        let count = 0;
        // Current letter
        let letter = '';
        // Matches [letter][number] (e.g. A0)
        const regexCol = /[A-Z][0-9]/;
        // Matches [$ACTION_ID_][alphanumeric id] (e.g. $ACTION_ID_dbba0bad173f8c1ba9734f1313c7ca3f7298c8f6)
        const regexId = /(\$ACTION_ID_)[\w]+/;
        // Matches [table-name]
        const regexName = /(table-name)/;

        for (let column in formData) {
            // If the current element is an Action ID or the table name, do nothing and continue iteration
            if (column.match(regexId) || column.match(regexName)) {
                continue;
            }
            // If the current element's key is a letter+number AND the key start with the letter stored in the variable
            if (column.match(regexCol) && column.startsWith(letter)) {
                count++;
                // Store current key's name first letter
                letter = column[0];
            }
            // Count every iteration
            index++;
        }
        return {columns: count, rows: index};
    }

    const numberOf = getNumRowsCols(formData);
    const uuid = uuidv4();
    // Form entries to Object
    const formEntries = Object.entries(formData);
    // Query Object to be returned
    let result: Result_FormDataToQuery = {
        id: uuid,
        name: formData['table-name'],
        columns: '',
        rows: [],
    };
    
    // For each element, if the index is greater than 1 and is less than the number of columns
    // push a query to the array below
    let columnArray: Array<string> = []
    formEntries.forEach((entry, index) => {
        if (index > 1 && index < numberOf.columns + 2) {
            columnArray.push(`${entry[1]} varchar(20)`);
        }
        return;
    })
    result['columns'] = columnArray.join(',');
    
    // First remove the first two elements corresponding to the ID and table's name
    // Then remove the number of columns added to the query above
    const reducedFormEntries = formEntries.toSpliced(0, numberOf.columns + 2);
    let count = 0;
    reducedFormEntries.forEach(entry => {
        if (count === 0) {
            result.rows.push(`${entry[1]}`);
            count++;
            return;
        } else if (count === numberOf.columns) {
            count = 1;
            result.rows.push(`${entry[1]}`);
            return;
        }
        result.rows[result.rows.length - 1] += `, ${entry[1]}`;
        count++;
        return;
    });

    return result;
}
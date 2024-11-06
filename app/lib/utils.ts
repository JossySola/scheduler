import { Result_FormDataToQuery, TableFormData } from "./definitions";
import { v4 as uuidv4 } from 'uuid';

export function FormDataToQuery (formData: TableFormData) {
    const date = Date.now().toString();
    const uuid =`_${uuidv4().replace(/-/g, '')}_${formData.get('table-name')}_${date}`;
    const entries_values = formData.values();
    const entries_keys = formData.keys();

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
    // Query Object to be returned
    let result: Result_FormDataToQuery = {
        id: uuid,
        columns: '',
        columnsParam: '',
        rows: [],
    };
    // For each element, if the index is greater than 1 and is less than the number of columns
    // push a query to the array below
    let columnArray: Array<FormDataEntryValue> = [];
    let paramsArray: Array<FormDataEntryValue> = [];
    let count = 0;
    for (const entry of entries_keys) {
        if (count > 1) {
            columnArray.push(`${entry} VARCHAR(30)`);
            paramsArray.push(`${entry}`);
        }
        count++;
    }
    if (columnArray && paramsArray) {
        result.columns = columnArray.join(', ');
        result.columnsParam = paramsArray.join(', ');
    }
    
    // First remove the first two elements corresponding to the ID and table's name
    // Then remove the number of columns added to the query above
    
    return result;
}
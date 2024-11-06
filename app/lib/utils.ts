import { Result_FormDataToQuery } from "./definitions";
import { v4 as uuidv4 } from 'uuid';

export function FormDataToQuery (formData: FormData) {
    // Query Object to be returned
    let result: Result_FormDataToQuery = {
        id: `_${uuidv4().replace(/-/g, '')}_${formData.get('table-name')}_${Date.now().toString()}`,
        columns: '',
        columnsParam: '',
        rows: [],
    };
    const entries_values = formData.values();
    const entries_keys = formData.keys();
    
    const createColumnsQuery = () => {
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
    }
    createColumnsQuery();

    const createRowsQuery = () => {

    }
    
    return result;
}
import { describe, expect, test } from '@jest/globals'

describe('Receives formData, Outputs Query Rows Object', () => {
    type ObjectOutput = {
        id: string,
        name: string,
        columns: string,
        rows: Array<string>
    }
    const sample = {
        '$ACTION_ID_dbba0bad173f8c1ba9734f1313c7ca3f7298c8f6': '',
        'table-name': 'Untitled',
        A0: 'COL1',
        B0: 'COL2',
        C0: 'COL3',
        A1: 'ROW1-1',
        B1: 'ROW1-2',
        C1: 'ROW1-3',
        A2: 'ROW2-1',
        B2: 'ROW2-2',
        C2: 'ROW2-3'
    };

    test('Returns the number of rows & columns', () => {
        const expectedColumns = 3;
        const expectedRows = 9;

        const OPERATION = (table: typeof sample) => {
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

            for (let column in table) {
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

        const result = OPERATION(sample);
        expect(result.columns).toStrictEqual(expectedColumns);
        expect(result.rows).toStrictEqual(expectedRows);
    });
    test('Returns an object with SQL queries', () => {
        const expected = {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            name: 'Untitled',
            columns: 'COL1 varchar(20),COL2 varchar(20),COL3 varchar(20)', 
            rows: [
                'ROW1-1, ROW1-2, ROW1-3',
                'ROW2-1, ROW2-2, ROW2-3'
            ]
        };

        const OPERATION = (form: typeof sample) => {
            // Mock results of the function from previous test
            const previousResult = {
                columns: 3,
                rows: 9
            }
            // Mock of UUIDv4 result function
            const uuid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
            // Form entries to Object
            const formEntries = Object.entries(form);
            // Query Object to be returned
            let result: ObjectOutput = {
                id: uuid,
                name: form['table-name'],
                columns: '',
                rows: [],
            };
            
            // For each element, if the index is greater than 1 and is less than the number of columns
            // push a query to the array below
            let columnArray: Array<string> = []
            formEntries.forEach((entry, index) => {
                if (index > 1 && index < previousResult.columns+2) {
                    columnArray.push(`${entry[1]} varchar(20)`);
                }
                return;
            })
            result['columns'] = columnArray.join(',');
            
            // First remove the first two elements corresponding to the ID and table's name
            // Then remove the number of columns added to the query above
            const reducedFormEntries = formEntries.toSpliced(0, previousResult.columns+2);
            let count = 0;
            reducedFormEntries.forEach(entry => {
                if (count === 0) {
                    result.rows.push(`${entry[1]}`);
                    count++;
                    return;
                } else if (count === previousResult.columns) {
                    count = 1;
                    result.rows.push(`${entry[1]}`);
                    return;
                }
                result.rows[result.rows.length-1] += `, ${entry[1]}`;
                count++;
                return;
            });

            return result;
        };
        const result = OPERATION(sample);
        expect(result).toEqual(expected);
    });
})

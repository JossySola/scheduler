import { describe, expect, test } from '@jest/globals'

describe('Receives formData, Outputs Query Rows Object', () => {
    type Definition = {
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
            let index = 0;
            let count = 0;
            let letter = '';
            const regexCol = /[A-Z][0-9]/;
            const regexId = /(\$ACTION_ID_)[\w]+/;
            const regexName = /(table-name)/;

            for (let column in table) {
                if (column.match(regexId) || column.match(regexName)) {
                    continue;
                }
                if (column.match(regexCol) && column.startsWith(letter)) {
                    count++;
                    letter = column[0];
                }
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
            let result: Definition = {
                id: uuid,
                name: form['table-name'],
                columns: '',
                rows: [],
            };
    
            let columnArray = []
            Object.entries(form).forEach((value, index) => {
                if (index > 1 && index < previousResult.columns+2) {
                    columnArray.push(`${value[1]} varchar(20)`);
                }
                return;
            })
            result['columns'] = columnArray.join(',');
            
            return result;
        };
        const result = OPERATION(sample);
        expect(result).toEqual(expected);
    });
})

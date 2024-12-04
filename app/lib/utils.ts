import { Result_FormDataToQuery } from "./definitions";
import { v4 as uuidv4 } from 'uuid';

export function FormDataToQuery (formData: FormData) {
    // Query Object to be returned
    const name = formData.get('table-name')?.toString().replaceAll(' ', '');
    let result: Result_FormDataToQuery = {
        id: `_${uuidv4().replace(/-/g, '')}_${name}_${Date.now().toString()}`,
        columns: '',
        columnsParams: '',
        rows: [],
    };
    const entries_values = formData.values();
    const entries_keys = formData.keys();
    const regexCol = /[A-Z][0]/;
    const regexAction = /[\$](ACTION_)/;
    
    const createColumnsQuery = () => {
        // For each element, if the index is greater than 1 and is less than the number of columns
        // push a query to the array below
        let columnArray: Array<FormDataEntryValue> = [];
        let paramsArray: Array<FormDataEntryValue> = [];
        let count = 0;
        let notColumns = 0;
        for (const key of entries_keys) {
            if (key.match(regexCol)) {
                columnArray.push(`"${key}" VARCHAR(30)`);
                paramsArray.push(`"${key}"`);
            } else if (key.match(regexAction) || key.match('table-name')) {
                notColumns++;
            }
            count++;
        }
        if (columnArray && paramsArray) {
            result.columns = columnArray.join(', ');
            result.columnsParams = paramsArray.join(', ');
        }
        const numOfColumns = paramsArray.length;

        return {
            columnArray,
            paramsArray,
            numOfColumns,
            notColumns,
        }
    }
    const { numOfColumns, notColumns } = createColumnsQuery();

    const createRowsQuery = () => {
        let index = 0;
        let tempArray: Array<string | null> = [];

        for (const value of entries_values) {
            if (index < notColumns) {
                index++;
                continue;
            }
            tempArray.push(value ? `${value}` : `${null}`);

            if (tempArray.length === numOfColumns) {
                result.rows.push([...tempArray])
                tempArray = [];
            }
            index++;
        }

        if (tempArray.length > 0) {
            result.rows.push([...tempArray])
        }
    }
    createRowsQuery();
    return result;
}

export function isInputValid(formData: FormData) {
    if (!formData) false;
    
    let result = {
        message: 'Success!',
        ok: true,
    }

    for (const pair of formData.entries()) {
        const type = pair[0].toString();
        const value = pair[1].toString();
        const name = /[+/\\@#$%^&()_!<>:;{}=`|?"[\].,*-]/;
        const birthday = /([0-9][0-9])(\/|-)([0-9][0-9])(\/|-)([0-9][0-9][0-9][0-9])/;
        const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const pwd = /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>-_']).{8,}/;

        if (!value) {
            result.message = 'Field must not be empty';
            result.ok = false;
            return result;
        }
        
        switch (type) {
            case 'name':
                if (name.test(value)) {
                    result.message = 'Failed due to the use of a possible forbidden character. (name)';
                    result.ok = false;
                    return result;
                }
            break;
            case 'username':
                if (name.test(value)) {
                    result.message = 'Failed due to the use of a possible forbidden character. (username)';
                    result.ok = false;
                    return result;
                }
            break;
            case 'birthday':
                if (birthday.test(value)) {
                    result.message = 'Failed due to the use of a possible forbidden character. (birthday)';
                    result.ok = false;
                    return result;
                }
            break;
            case 'email':
                if (!email.test(value)) {
                    result.message = 'Malformed email syntax. (email)';
                    result.ok = false;
                    return result;
                }
            break;
            case 'password':
                if (!pwd.test(value)) {
                    result.message = 'Password must contain one special character, one number and one uppercase letter.';
                    result.ok = false;
                    return result;

                } else if (value.length < 8) {
                    result.message = 'Password must be more than 8 characters.';
                    result.ok = false;
                    return result;
                }
            break;
            case 'confirmpwd':
            break;
            default:
                result.message = 'The input type is not listed';
                return result;
        }
    }
    return result;
}
import { Result_FormDataToQuery } from "./definitions";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import pool from "./mocks/db";

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

export function isInputValid (formData: FormData) {
    'use client'
    if (formData === undefined || !(formData instanceof FormData)) {
        const errors = [
            {
                message: 'Wrong data instance or is missing',
                ok: false,
            }
        ]
        return errors;        
    }
    
    const form = {
        name: { value: formData.get('name')?.toString(), error: { message: 'A name is required.', ok: false}},
        username: { value: formData.get('username')?.toString(), error: { message: 'A username is required.', ok: false}},
        birthday: { value: formData.get('birthday')?.toString(), error: { message: 'A birthday date is required.', ok: false}},
        email: { value: formData.get('email')?.toString(), error: { message: 'An email is required.', ok: false}},
        password: { value: formData.get('password')?.toString(), error: { message: 'A password is required.', ok: false}},
        confirmation: { value: formData.get('confirmpwd')?.toString(), error: { message: 'The password confirmation is required.', ok: false}},
        token: { value: formData.get('recaptcha_token')?.toString(), error: { message: 'Server error.', ok: false}},
    }

    const errors = Object.entries(form)
    .filter(([_, { value }]) => !value)
    .map(([key, {error}]) => error );
    if (errors.length > 0) {
        return  errors ;
    }

    const nameREGEX = /[+/\\@#$%^&()_!<>:;{}=`|?"[\].,*-]/g;
    const birthdayREGEX = /([0-9][0-9])(\/|-)([0-9][0-9])(\/|-)([0-9][0-9][0-9][0-9])/;
    const emailREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (form.name.value?.match(nameREGEX) && form.birthday.value?.match(birthdayREGEX) && form.email.value?.match(emailREGEX)) {
        const errors = [
            !form.name.value?.match(nameREGEX) && form.name.error,
            !form.birthday.value?.match(birthdayREGEX) && form.birthday.error,
            !form.email.value?.match(emailREGEX) && form.email.error,
        ]
        return errors;
    } else {
        return true;
    }
}

export function arePasswordsConfirmed (formData: FormData) {
    if (!(formData instanceof FormData)) {
        return false;
    }
    
    const password = formData.get('password');
    const confirmation = formData.get('confirmpwd');
    
    if (!password || !confirmation) {
        return false
    }
    
    if (password === confirmation) {
        return true;
    } else {
        return false;
    }
}

export async function isPasswordPwned (password: string) {
    try {
        // API requires password to be hashed with SHA1
        const hashed = crypto.createHash('sha1').update(password).digest('hex');
        // "range" endpoint requires only the first 5 characters of the hashed password
        const range = hashed.slice(0,5);
        // Slice gives the remaining hashed password after the string index 5
        const suffixToCheck = hashed.slice(5).toUpperCase();
        const response = await fetch(`https://api.pwnedpasswords.com/range/${range}`);
        // The API returns a plain text response, not a JSON
        const text = await response.text();
        // For each \n break, convert the plain text into an Array
        const lines = text.split('\n');

        for (const line of lines) {
            // The format of each line is divided by a ":", the left part is the suffix and the right part is the count
            const [hashSuffix, count] = line.split(':');
            // If the rest of the hashed password is found on the exposed list
            if (hashSuffix === suffixToCheck) {
                // return the count part as a number
                return parseInt(count, 10);
            }
        }
        // If the remaining part of the hashed password is not found on the list, return 0
        return 0;
    } catch (error) {
        throw error;
    }
}

export async function getUserFromDb (username: string, email: string, password: string) {
    'use server'
    try {
        const user = await pool.query(`
            SELECT * FROM scheduler_users 
                WHERE username = $1 OR email = $2;
        `, [username, email]);
        
        if (user.rows.length === 0) {
            throw new Error('User not found.');
        }
        const userRecord = user.rows[0];
        if (await argon2.verify(userRecord.password, password)) {
            return userRecord;
        }
    } catch (error) {
        console.error(error)
        return null;
    }
}
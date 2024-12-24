import { isInputValid } from "../../../utils";
import { test, describe, expect } from "vitest";

describe('isInputValid', () => {
    test('Returns error object if formData is missing', () => {
        // Setup
        const expected = [
            {
                message: 'Wrong data instance or is missing',
                ok: false,
            }
        ]
        // Implementation
        const result = isInputValid();
        
        // Assertion
        expect(result).toEqual(expected);
    })
    test('Returns error object if the argument is not an instance of FormData', () => {
        // Setup
        const expected = [
            {
                message: 'Wrong data instance or is missing',
                ok: false,
            }
        ]
       
        // Implementation
        const result = isInputValid({
            name: 'jossysola'
        });
        
        // Assertion
        expect(result).toEqual(expected);
    })
    test('Returns error object if a field is missing', () => {
        // Setup
        const expected = [
            {
                message: 'A name is required.',
                ok: false,
            }
        ]
        const formData = new FormData;
        formData.append('name', '');
        formData.append('username', 'jossysola');
        formData.append('birthday', '1994-08-09');
        formData.append('email', 'jossysola@gmail.com');
        formData.append('password', 'asfoi8fh08f9dfkj');
        formData.append('confirmpwd', 'asfoi8fh08f9dfkj');
        formData.append('recaptcha_token', 'fff4ee8d275fa9ae736cad496ea20e86f1be7ec1073e624c52d1f6318e3649a9%7Cb1227c198d6cf8ccb50f0ed1d42858ea6291436bd301d982bb499f04186aae27');

        // Implementation
        const result = isInputValid(formData);

        // Assertion
        expect(result).toEqual(expected);
    })
    test('Returns true if the form is correctly filled out', () => {
        // Setup
        const formData = new FormData;
        formData.append('name', 'Jossy Sola');
        formData.append('username', 'jossysola');
        formData.append('birthday', '1994-08-09');
        formData.append('email', 'jossysola@gmail.com');
        formData.append('password', 'asfoi8fh08f9dfkj');
        formData.append('confirmpwd', 'asfoi8fh08f9dfkj');
        formData.append('recaptcha_token', 'fff4ee8d275fa9ae736cad496ea20e86f1be7ec1073e624c52d1f6318e3649a9%7Cb1227c198d6cf8ccb50f0ed1d42858ea6291436bd301d982bb499f04186aae27');
        
        // Implementation
        const result = isInputValid(formData);

        // Assertion
        expect(result).toBe(true);
    })
})
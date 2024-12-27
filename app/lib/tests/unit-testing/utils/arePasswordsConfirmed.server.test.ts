import { arePasswordsConfirmed } from "../../../utils-client";
import { describe, expect, test } from "vitest";

describe('arePasswordsConfirmed', () => {
    test('Returns true if both passwords are the same', () => {
        // Setup
        const formData = new FormData();
        formData.set('password', 'abc123');
        formData.set('confirmpwd', 'abc123');

        // Implementation
        const result = arePasswordsConfirmed(formData);

        // Assertion
        expect(result).toBe(true);
    })
    test('Returns false if both passwords are different', () => {
        // Setup
        const formData = new FormData();
        formData.set('password', 'abc123');
        formData.set('confirmpwd', 'abc124');

        // Implementation
        const result = arePasswordsConfirmed(formData);

        // Assertion
        expect(result).toBe(false);
    })
    test('Returns false if the fields are empty', () => {
        // Setup
        const formData = new FormData();
        formData.set('password', '');
        formData.set('confirmpwd', '');

        // Implementation
        const result = arePasswordsConfirmed(formData);

        // Assertion
        expect(result).toBe(false);
    })
    test('Returns false if the argument is not an instance of FormData', () => {
        // Implementation
        const result = arePasswordsConfirmed({});

        // Assertion
        expect(result).toBe(false);
    })
})
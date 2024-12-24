import { expect, test, vi, describe } from "vitest";
import crypto from "crypto";

describe('Uses pwned API successfuly', async () => {
    // FUNCTION TO TEST
    const fn = vi.fn(async (password) => {
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
    });

    test('Successfuly identifies exposed password', async () => {
        
        const test = await fn('p@55w0rd');

        expect(test).toBeGreaterThan(0);
        expect(test).toMatchSnapshot();
    });
    test('Returns 0 in a non-exposed password', async () => {
        
        const test = await fn('asfoi8fh08f9dfkj');

        expect(test).toBe(0);
        expect(test).toMatchSnapshot();
    })
})
import { expect, test, vi, describe } from "vitest";
import crypto from "crypto";

describe('Uses pwned API successfuly', async () => {
    test('Successfuly identifies pwned password', async () => {
        // Spy on a function and stores its call arguments, returns, and instances.
        const fn = vi.fn(async () => {
            try {
                const hashed = crypto.createHash('sha1').update('p@55w0rd').digest('hex');
                const range = hashed.slice(0,5);
                const suffixToCheck = hashed.slice(5).toUpperCase();
                const response = await fetch(`https://api.pwnedpasswords.com/range/${range}`);
                const text = await response.text();
                const lines = text.split('\n');

                for (const line of lines) {
                    const [hashSuffix, count] = line.split(':');
                    if (hashSuffix === suffixToCheck) {
                        return parseInt(count, 10);
                    }
                }
                return 0;
            } catch (error) {
                throw error;
            }
        });

        const result = await fn();
        console.log(result)

        expect(result).toBeGreaterThan(0);
    })
})
export async function ReturnReCAPTCHAError (error: string) {
    'use server'
    if (error === 'timeout-or-duplicate') {
        return {
            status: 408,
            statusText: 'Too old or has been used previously. (Timeout or duplicate)'
        }
    } else if (error === 'bad-request' || error === 'invalid-input-response' || error === 'invalid-input-secret') {
        return {
            status: 400,
            statusText: 'Bad request. (Invalid or malformed)'
        }
    } else {
        return {
            status: 401,
            statusText: 'Requires human verification'
        }
    }
}

interface Error {
    success: false;
    'error-codes': Array<'missing-input-secret' | 'invalid-input-secret' | 'missing-input-response' | 'invalid-input-response' | 'bad-request' | 'timeout-or-duplicate'>;
}
interface Success {
    success: true;
    'challenge_ts': string;
    hostname: string;
    score: number;
    action: string;
}
export type reCAPTCHAResponse = Success | Error;

export type VerificationResponse = {
    status: number;
    statusText: string;
};
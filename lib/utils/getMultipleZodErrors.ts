import z from "zod";

export default function getMultipleZodErrors(verifications: Array<z.ZodSafeParseResult<any>>): string | null {
    if (!verifications) return null;
    let result: string[] = [];
    verifications.forEach(zodResult => {
        if (!zodResult.success && zodResult.error) {
            result.push(zodResult.error.issues[0].message);
        }
    });
    const str = result.join("//");
    if (str) {
        return str;
    } else {
        return null;
    }
};
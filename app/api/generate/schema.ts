import * as z from "zod/v4";

const Keys = z.partialRecord(z.string(), z.string());
export const tableGenerationSchema = z.object({
    data: z.array(Keys),
    conflicts: z.array(z.string())
})
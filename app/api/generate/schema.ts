import { z } from "zod";

export const tableGenerationSchema = z.object({
    rows: z.array(z.object({
        colIndex: z.number(),
        rowIndex: z.number(),
        name: z.string(),
        value: z.string(),
        hasConflict: z.boolean()
    })),
    conflicts: z.array(z.string())
})
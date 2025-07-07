import { z } from "zod";

export const tableGenerationSchema = z.object({
    rows: z.array(z.tuple([z.string(), z.string(), z.boolean()])),
    conflicts: z.array(z.string())
})
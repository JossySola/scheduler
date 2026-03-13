import z from "zod";

export const signUpSchema = z.object({
    name: z.string().nonempty(),
    username: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
})
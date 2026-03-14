import z from "zod";

export const signUpSchema = z.object({
    name: z.string().nonempty(),
    username: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
});
export const sendEmailSchema = z.object({
    to: z.email(),
    subject: z.string().nonempty(),
    text: z.string().nonempty(),
    url: z.optional(z.string()),
    linkText: z.optional(z.string()),
})
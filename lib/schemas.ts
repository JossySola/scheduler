import z from "zod";

export const signUpSchema = z.object({
    email: z.email({ error: "Invalid email address" }).nonempty({ error: "This field should not be empty" }),
    password: z.string({ error: "Invalid input format" }).min(8, { error: "Password must be minimum 8 characters long" }),
    confirmPassword: z.string({ error: "Invalid input format" }).min(8, { error: "Password must be minimum 8 characters long" }),
});
export const signInSchema = z.object({
    email: z.email({ error: "Invalid email address" }).nonempty({ error: "This field should not be empty" }),
    password: z.string({ error: "Invalid input format" }).min(8, { error: "Password must be minimum 8 characters long" }),
})
export const sendEmailSchema = z.object({
    to: z.email({ error: "Invalid email address" }),
    subject: z.string({ error: "Invalid input format" }).nonempty({ error: "This field must not be empty" }),
    text: z.string({ error: "Invalid input format" }).nonempty({ error: "This field must not be empty" }),
    url: z.optional(z.string({ error: "Invalid input format" })),
    linkText: z.optional(z.string({ error: "Invalid input format" })),
});
export const resetPasswordSchema = z.object({
    newPassword: z.string({ error: "Password: Invalid input format" }).min(8, { message: "Password must be minimum 8 characters long" }),
    token: z.string({ error: "Token: Invalid input format" }).nonempty({ error: "Token is missing" }),
});
export const updatePasswordSchema = z.object({
    currentPassword: z.string({ error: "Invalid input format" }).min(8, { message: "Password must be minimum 8 characters long" }),
    newPassword: z.string({ error: "Invalid input format" }).min(8, { message: "Password must be minimum 8 characters long" }),
});
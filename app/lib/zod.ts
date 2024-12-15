import { object, string } from "zod";

export const logInSchema = object({
    username: string({ required_error: "Username or e-mail required" })
    .min(1, "Username or e-mail required"),
    password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})
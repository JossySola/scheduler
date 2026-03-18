import { signInAction } from "@/app/(app)/(auth)/signin/actions";
import { signUpAction } from "@/app/(app)/(auth)/signup/actions";
import { auth } from "@/auth";
import sendEmail from "@/features/auth/utils/sendEmail/sendEmail";
import handleSignIn from "@/features/auth/utils/signin/server/signin";
import handleSignUp from "@/features/auth/utils/signup/server/signup";
import { JSX } from "react";
import { Resend } from "resend";
import { beforeAll, beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";

vi.mock("@/auth", () => ({
    auth: {
        api: {
            signUpEmail: vi.fn().mockImplementation(() => ({
                token: null,
                user: {
                    id: "123",
                    createdAt: "DateType",
                    updatedAt: "DateType",
                    email: "name@domain",
                    emailVerified: true,
                    name: "jossy"
                }
            })),
            signInUsername: vi.fn().mockImplementation(() => ({
                token: "a123",
                user: {
                    id: "123",
                    createdAt: "DateType",
                    updatedAt: "DateType",
                    email: "name@domain.com",
                    emailVerified: true,
                    name: "jossy",
                    username: "jossysola",
                    displayUsername: "jossysola",
                }
            })),
        },     
    },
}));
vi.mock("resend", () => ({
    Resend: vi.fn(class {
        key: string;
        constructor(key: string) {
            this.key = key;
        }
        emails = {
            send: vi.fn(({ from, to, subject, react }: {
                from: string,
                to: Array<string>,
                subject: string,
                react: JSX.Element
            }) => ({
                data: "Success",
                error: "",
            }))
        }
    })
}))
describe("(auth)",() => {
    describe("signin/", () => {
        describe("@features/**/server -> handleSignIn", () => {
            test("returns user data", async () => {
                const username = "jossysola";
                const password = "password123";
                const result = await handleSignIn(username, password);
                expect(result).toEqual({
                    token: "a123",
                    user: {
                        id: "123",
                        createdAt: "DateType",
                        updatedAt: "DateType",
                        email: "name@domain.com",
                        emailVerified: true,
                        name: "jossy",
                        username: "jossysola",
                        displayUsername: "jossysola",
                    }                    
                });
            });
            test("throws if the password's length is less than 8 characters", async () => {
                const username = "jossysola";
                const password = "1234567";
                await expect(handleSignIn(username, password)).rejects.toThrow();                 
            })
        });
        describe("@app/**/signin -> signInAction", () => {
            test("returns successful message", async () => {
                const initialState = { message: "" };                
                const payload = {
                    username: "jossysola",
                    password: "password123",
                }
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                const result = await signInAction(initialState, formData);
                expect(result).toEqual({
                    message: "User signed in successfully"
                });
            });
            test("returns array with errors when input type is not expected", async () => {
                const initialState = { message: "" };                
                const payload = {
                    username: "jossysola",
                    password: "pass",
                }
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                const result = await signInAction(initialState, formData);
                expect(result).toEqual({ errors: ["Password must be minimum 8 characters long"] })
            });
        });
    });
    describe("signup/", () => {
        describe("@features/**/server -> handleSignUp", () => {
            test("returns sign up data", async () => {
                const payload = {
                    email: "name@domain.com",
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123"
                }
                const result = await handleSignUp(payload);
                expect(result).toEqual({
                    token: null,
                    user: {
                        id: "123",
                        createdAt: "DateType",
                        updatedAt: "DateType",
                        email: "name@domain",
                        emailVerified: true,
                        name: "jossy"
                    }
                });
            });
            test("throws if any expected input is invalid", async () => {
                const payload = {
                    email: "invalidEmail",
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123"                    
                }
                await expect(handleSignUp(payload)).rejects.toThrow();
            });
        });
        describe("@app/**/signup -> signUpAction", () => {
            test("returns object with successful message", async () => {
                const payload = {
                    email: "name@domain.com",
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123",
                    "confirm-password": "password123",                  
                }                
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                
                const result = await signUpAction({ message: "" }, formData);
                expect(result).toEqual({ message: "A confirmation email has been sent, please check your inbox to complete the sign up process." });
            });
            test("returns error's object when passwords mismatched", async () => {
                const payload = {
                    email: "name@domain.com",
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123",
                    "confirm-password": "password124",                  
                }                
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                
                const result = await signUpAction({ message: "" }, formData);
                expect(result).toEqual({ errors: ["Incorrect password confirmation"] });                
            });
            test("returns error's object when an expected input is invalid", async () => {
                const payload = {
                    email: 1,
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123",
                    "confirm-password": "password124",                  
                }                
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                
                const result = await signUpAction({ message: "" }, formData);
                expect(result).toEqual({ errors: ["Invalid email address"] });                  
            });
            test("returns error's object when a field is empty", async () => {
                const payload = {
                    email: "name@domain.com",
                    name: "",
                    username: "jossysola",
                    password: "password123",
                    "confirm-password": "password124",                  
                }                
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                
                const result = await signUpAction({ message: "" }, formData);
                expect(result).toEqual({ errors: ["This field should not be empty"] });
            });
            test("returns error's object when the password's length is less than 8 characters", async () => {
                const payload = {
                    email: "name@domain.com",
                    name: "Jossy",
                    username: "jossysola",
                    password: "admin",
                    "confirm-password": "admin",                  
                }                
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                
                const result = await signUpAction({ message: "" }, formData);
                expect(result).toEqual({ errors: ["Password must be minimum 8 characters long"] });
            });
            test("returns a message when the auth API throws an Error", async () => {
                vi.mocked(auth.api.signUpEmail).mockRejectedValueOnce(new Error("Error bubbling from auth.api.signUpEmail"));
                const payload = {
                    email: "name@domain.com",
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123",
                    "confirm-password": "password123",                  
                }                
                const formData = new FormData();
                Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
                
                const result = await signUpAction({ message: "" }, formData);
                expect(result).toEqual({ message: "Error: Error bubbling from auth.api.signUpEmail" });                
            });
        });
    });
    describe("sendEmail", () => {
        beforeAll(() => vi.stubEnv("RESEND_API_KEY", "123456789"));
        beforeEach(() => vi.clearAllMocks());

        test("is void after the function successfully completed", async () => {
            const payload = {
                to: "contact@jossysola.com",
                subject: "Scheduler: Confirm your email!",
                text: "Please confirm your email to complete the sign up process.",
                url: "",
                linkText: "",
            }
            const result = await sendEmail(payload);
            expectTypeOf(result).toBeVoid();
        });
        test("the properties: from, to, subject and react are passed to Resend API", async () => {
            const payload = {
                to: "contact@jossysola.com",
                subject: "Scheduler: Confirm your email!",
                text: "Please confirm your email to complete the sign up process.",
                url: "",
                linkText: "",
            }
            await sendEmail(payload);
            const resendInstance = vi.mocked(Resend).mock.results[0].value;
            expect(resendInstance.emails.send).toHaveBeenCalledWith({
                from: expect.any(String),
                to: ["contact@jossysola.com"],
                subject: "Scheduler: Confirm your email!",
                react: expect.any(Object),
            });
        });
        test("throws when any input uses an invalid format", async () => {
            const payload = {
                to: "contact",
                subject: "Scheduler: Confirm your email!",
                text: "Please confirm your email to complete the sign up process.",
                url: "",
                linkText: "",
            }
            await expect(sendEmail(payload)).rejects.toThrow("Error: ✖ Invalid email address");
        });
        test("throws when the Resend API fails", async () => {
            vi.mocked(Resend).mockImplementationOnce(class {
                key: string;
                constructor(key: string) {
                    this.key = key;
                }
                emails = {
                    send: vi.fn().mockRejectedValue(new Error("Resend API error")),
                }
            } as any);
            const payload = {
                to: "contact@jossysola.com",
                subject: "Scheduler: Confirm your email!",
                text: "Please confirm your email to complete the sign up process.",
                url: "",
                linkText: "",
            }
            await expect(sendEmail(payload)).rejects.toThrow("Unsuccessful send mail action: Error: Resend API error");
        });
    });
});
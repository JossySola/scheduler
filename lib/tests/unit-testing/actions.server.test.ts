import { signInAction } from "@/src/app/(app)/(auth)/signin/actions";
import { signUpAction } from "@/src/app/(app)/(auth)/signup/actions";
import { auth } from "@/auth";
import { beforeAll, describe, expect, expectTypeOf, test, vi } from "vitest";
import { forgotPasswordAction } from "@/src/app/(app)/(auth)/forgot-password/actions";
import { requestPasswordResetAction } from "@/src/app/(app)/(auth)/reset-password/actions";
import { updatePasswordAction } from "@/src/app/(app)/(auth)/update-password/actions";
import { deleteAccountAction } from "@/src/app/(app)/(auth)/delete-account/actions";
import { JSX } from "react";
import { beforeEach } from "node:test";
import sendEmail from "@/src/app/(app)/(auth)/_utils/sendEmail";
import { Resend } from "resend";

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
            requestPasswordReset: vi.fn().mockImplementation(() => ({
                status: true,
                message: "Success"
            })),
            resetPassword: vi.fn().mockImplementation(() => ({
                status: true,
            })),
            changePassword: vi.fn().mockImplementation(() => ({
                token: "123",
                user: {
                    id: "1234",
                    createdAt: "",
                    updatedAt: "",
                    email: "name@domain.com",
                    emailVerified: true,
                    name: "jossysola"
                },
            })),
            deleteUser: vi.fn().mockImplementation(() => ({

            })),
            getSession: vi.fn().mockImplementation(() => ({
                session: {
                    id: "123",
                    createdAt: "Date",
                    updatedAt: "Date",
                    useId: "abc123",
                    expiresIn: "Date",
                    token: "abc"
                },
                user: {
                    id: "123",
                    createdAt: "Date",
                    updatedAt: "Date",                    
                    email: "name@domain.com",
                    emailVerified: true,
                    name: "jossysola"
                }
            }))
        },     
    },
}));
vi.mock("next/headers", () => ({
    headers: vi.fn()
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
}));
vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000/");

describe("(app)",() => {
    describe("(auth)", () => {
        describe("UTILS", () => {
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
        describe("SERVER ACTIONS", () => {
            describe("signInAction", () => {
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
                    expect(result).toEqual({ message: "Password must be minimum 8 characters long" })
                });
            });
            describe("signUpAction", () => {
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
                    expect(result).toEqual({ message: "Incorrect password confirmation" });                
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
                    expect(result).toEqual({ message: "Invalid email address" });                  
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
                    expect(result).toEqual({ message: "This field should not be empty" });
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
                    expect(result).toEqual({ message: "Password must be minimum 8 characters long" });
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
                    expect(result).toEqual({ message: "Error bubbling from auth.api.signUpEmail" });                
                });
            });
            describe("forgotPasswordAction", () => {
                test("returns successful message", async () => {
                    const formData = new FormData();
                    formData.append("email", "name@domain.com");
                    const result = await forgotPasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "The email has been sent!" });
                });
                test("returns errors array with Zod messages when input is invalid", async () => {
                    const formData = new FormData();
                    formData.append("email", "invalid input");
                    const result = await forgotPasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Invalid email address" });
                });
                test("returns unsuccessful message if API fails", async () => {
                    vi.mocked(auth.api.requestPasswordReset).mockRejectedValueOnce(new Error("Error from requestPasswordReset"));
                    const formData = new FormData();
                    formData.append("email", "name@domain.com");
                    const result = await forgotPasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "The email couldn't be sent" });                
                });
            });
            describe("requestPasswordResetAction", () => {
                test("returns successful message", async () => {
                    const formData = new FormData();
                    formData.append("password", "password123");
                    formData.append("token", "abc123");
                    const result = await requestPasswordResetAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Password reset successful" })
                });
                test("returns Unauthorized if session is missing", async () => {
                    vi.mocked(auth.api.getSession).mockReturnValueOnce({});                
                    const formData = new FormData();
                    formData.append("password", "password123");
                    formData.append("token", "abc123");
                    const result = await requestPasswordResetAction({ message: "" }, formData);                
                    expect(result).toEqual({ message: "Unauthorized" });
                });
                test("returns errors array with Zod messages when input is invalid", async () => {
                    const formData = new FormData();
                    formData.append("password", "pass");
                    formData.append("token", "abc123");
                    const result = await requestPasswordResetAction({ message: "" }, formData);                
                    expect(result).toEqual({ message: "Password must be minimum 8 characters long" });
                });
                test("returns unsuccessful message if API fails", async () => {
                    vi.mocked(auth.api.resetPassword).mockRejectedValueOnce(new Error("Error at resetPassword"));
                    const formData = new FormData();
                    formData.append("password", "password123");
                    formData.append("token", "abc123");
                    const result = await requestPasswordResetAction({ message: "" }, formData);                
                    expect(result).toEqual({ message: "Error at resetPassword" });
                });
            });
            describe("updatePasswordAction", () => {
                test("returns successful message", async () => {
                    const formData = new FormData();
                    formData.append("current-password", "password123");
                    formData.append("new-password", "123password");
                    const result = await updatePasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Password update successful" });
                });
                test("returns Unauthorized when Session is missing", async () => {
                    vi.mocked(auth.api.getSession).mockReturnValueOnce({});
                    const formData = new FormData();
                    formData.append("current-password", "password123");
                    formData.append("new-password", "123password");
                    const result = await updatePasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Unauthorized" });
                });
                test("returns errors array with Zod messages when input is invalid", async () => {
                    const formData = new FormData();
                    formData.append("current-password", "pass");
                    formData.append("new-password", "123password");
                    const result = await updatePasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Password must be minimum 8 characters long" });
                });
                test("returns unsuccessful message if API fails", async () => {
                    vi.mocked(auth.api.changePassword).mockRejectedValueOnce(new Error("Error at changePassword"));
                    const formData = new FormData();
                    formData.append("current-password", "password123");
                    formData.append("new-password", "123password");
                    const result = await updatePasswordAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Error at changePassword"});
                });
            });
            describe("deleteAccountAction", () => {
                test("returns successful message", async () => {
                    const formData = new FormData();
                    formData.append("password", "password123");
                    const result = await deleteAccountAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "You will receive an email to complete the process"})
                });
                test("returns Unauthorized when Session is missing", async () => {
                    vi.mocked(auth.api.getSession).mockReturnValueOnce({});
                    const formData = new FormData();
                    formData.append("password", "password123");
                    const result = await deleteAccountAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Unauthorized" });                
                });
                test("returns error message when Zod rejects", async () => {
                    const formData = new FormData();
                    formData.append("password", "pass");
                    const result = await deleteAccountAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "The password must be 8 characters long" });
                });
                test("returns error message when API fails", async () => {
                    vi.mocked(auth.api.deleteUser).mockRejectedValueOnce(new Error("Error at deleteUser"));
                    const formData = new FormData();
                    formData.append("password", "password123");
                    const result = await deleteAccountAction({ message: "" }, formData);
                    expect(result).toEqual({ message: "Error at deleteUser" });
                });
            });
        });

    });
});
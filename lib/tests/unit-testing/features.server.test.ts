import sendEmail from "@/app/(app)/(auth)/_utils/sendEmail";
import { JSX } from "react";
import { Resend } from "resend";
import { beforeEach, beforeAll, describe, expect, expectTypeOf, test, vi } from "vitest";

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
describe("features", () => {
    describe("auth", () => {
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
});
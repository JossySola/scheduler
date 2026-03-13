import handleSignUp from "@/features/(auth)/utils/signup/server/signup";
import { beforeAll, describe, expect, test, vi } from "vitest";

describe("(auth)",() => {
    describe.skip("signin/", () => {

    });
    describe("signup/", () => {
        describe("@features/*/signup/server => handleSignUp", () => {
            beforeAll(() => {
                vi.mock("@/auth", () => ({
                    api: {
                        signUpEmail: vi.fn().mockImplementation(async (body: { email: string, name: string, password: string, username: string }) => {
                            return {}
                        })
                    }
                }))
            });
            test("returns sign up data", async () => {
                const payload = {
                    email: "name@domain.com",
                    name: "Jossy",
                    username: "jossysola",
                    password: "password123"
                }
                const result = await handleSignUp(payload);
                expect(result).toEqual({});
            });
        })
    });
});
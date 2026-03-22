import { signInAction } from "@/app/(app)/(auth)/signin/actions";
import { signUpAction } from "@/app/(app)/(auth)/signup/actions";
import { auth } from "@/auth";
import { describe, expect, test, vi } from "vitest";

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
describe("(app)",() => {
    describe("(auth)", () => {
        describe("signin", () => {
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
        describe("signup", () => {
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
});
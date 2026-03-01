import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { getDecryptedKey } from "../../auth/getDecryptedKey";
import { getDecryptedPassword } from "../../auth/getDecryptedPassword";
import { sql } from "@vercel/postgres";
import { getPasswordKey } from "../../auth/getPasswordKey";
import { DecryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { getProviderNameConfirmation } from "../../auth/getProviderNameConfirmation";
import { getUserByEmail } from "../../auth/getUserByEmail";
import { getUserIntelByUsername } from "../../auth/getUserIntelByUsername";
import { isAccountLocked } from "../../auth/isAccountLocked";
import { isUserSignedInWithProvider } from "../../auth/isUserSignedInWithProvider";
import { setFailedAttemptRecord } from "../../auth/setFailedAttemptRecord";
import { setNewUser } from "../../auth/setNewUser";
import { setUserWithProvider } from "../../auth/setUserWithProvider";
import { server } from "../mocks/node";
import { verifyPassword } from "../../auth/verifyPassword";
import { HttpResponse, http } from "msw";

vi.mock('@aws-sdk/client-kms', () => ({
        KMSClient: vi.fn(class {
            Plaintext = Buffer.from("AQIDAHpL9KfTzWQmrKVuYd/7hcLE3BNzgDXClU2wcqMnJrYhOAEF9trmVSxIEruFErbgQUt3AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQNuHv4En7L/eDf4RVaAgEQgDvjH7tPpSjkhPsy+ybxq4sCciBwBqXhGZvZDyqGCkrMPmr9T97lRqNy7xEsS5Tq5bTmY6kdI4LcI82MZQ==");
            send = vi.fn().mockResolvedValue({ Plaintext: this.Plaintext });
        }),
        DecryptCommand: vi.fn(class { }),
    })
);
vi.mock('@vercel/postgres', () => ({
        sql: vi.fn().mockResolvedValue({
            rows: [{ 
                decrypted_password: "decryptedPassword",
                user_password_key: "passwordKey",
                provider: "providerName",
                id: "1234",
            }]
        }),
    })
);

vi.stubEnv("AWS_KMS_KEY", "testAccessKey");
vi.stubEnv("AWS_KMS_SECRET", "testSecretKey");
vi.stubEnv("AWS_KMS_ARN", "testKeyArn");
vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000");

describe("Next Auth", () => {
    describe("getPasswordKey", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });      
        test("sql utility has been called", async () => {          
            const result = await getPasswordKey("email@domain.com");
            expect(sql).toHaveBeenCalled();
            expect(result).toMatchSnapshot();
        });
        test("returns password key as string", async () => {
            const result = await getPasswordKey("email@domain.com");
            expect(result).toBe("passwordKey");
            expect(result).toMatchSnapshot();
        });
        test("returns null if retrieval fails", async () => {
            vi.fn(sql).mockRejectedValue(new Error("Retrieval failed"));
            const result = await getPasswordKey("email@domain.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if email format is invalid", async () => {
            const result = await getPasswordKey("invalid-email");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if email is empty", async () => {
            const result = await getPasswordKey("");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });    
    describe("getDecryptedKey", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });
        test("KMSClient constructor has been called", async () => {
            const result = await getDecryptedKey("AQIDAHpL9KfTzWQmrKVuYd/7hcLE3BNzgDXClU2wcqMnJrYhOAEF9trmVSxIEruFErbgQUt3AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQNuHv4En7L/eDf4RVaAgEQgDvjH7tPpSjkhPsy+ybxq4sCciBwBqXhGZvZDyqGCkrMPmr9T97lRqNy7xEsS5Tq5bTmY6kdI4LcI82MZQ==");
            expect(KMSClient).toHaveBeenCalled();
            expect(result).toMatchSnapshot();
        });
        test("DecryptCommand constructor has been called with correct parameters", async () => {
            const result = await getDecryptedKey("AQIDAHpL9KfTzWQmrKVuYd/7hcLE3BNzgDXClU2wcqMnJrYhOAEF9trmVSxIEruFErbgQUt3AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQNuHv4En7L/eDf4RVaAgEQgDvjH7tPpSjkhPsy+ybxq4sCciBwBqXhGZvZDyqGCkrMPmr9T97lRqNy7xEsS5Tq5bTmY6kdI4LcI82MZQ==");
            expect(DecryptCommand).toHaveBeenCalledWith({
                CiphertextBlob: Buffer.from("AQIDAHpL9KfTzWQmrKVuYd/7hcLE3BNzgDXClU2wcqMnJrYhOAEF9trmVSxIEruFErbgQUt3AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQNuHv4En7L/eDf4RVaAgEQgDvjH7tPpSjkhPsy+ybxq4sCciBwBqXhGZvZDyqGCkrMPmr9T97lRqNy7xEsS5Tq5bTmY6kdI4LcI82MZQ==", "base64"),
                KeyId: "testKeyArn",
            });
            expect(DecryptCommand).toMatchSnapshot();
            expect(result).toMatchSnapshot();
        });
        test("returns decrypted key in base64 format", async () => {
            const result = await getDecryptedKey("AQIDAHpL9KfTzWQmrKVuYd/7hcLE3BNzgDXClU2wcqMnJrYhOAEF9trmVSxIEruFErbgQUt3AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQNuHv4En7L/eDf4RVaAgEQgDvjH7tPpSjkhPsy+ybxq4sCciBwBqXhGZvZDyqGCkrMPmr9T97lRqNy7xEsS5Tq5bTmY6kdI4LcI82MZQ==");
            expect(result).toBe("QVFJREFIcEw5S2ZUeldRbXJLVnVZZC83aGNMRTNCTnpnRFhDbFUyd2NxTW5KclloT0FFRjl0cm1WU3hJRXJ1RkVyYmdRVXQzQUFBQWZqQjhCZ2txaGtpRzl3MEJCd2FnYnpCdEFnRUFNR2dHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFOdUh2NEVuN0wvZURmNFJWYUFnRVFnRHZqSDd0UHBTamtoUHN5K3lieHE0c0NjaUJ3QnFYaEdadlpEeXFHQ2tyTVBtcjlUOTdsUnFOeTd4RXNTNVRxNWJUbVk2a2RJNExjSTgyTVpRPT0=");
            expect(result).toMatchSnapshot();
        });
        test("returns null if no argument is passed", async () => {
            const result = await getDecryptedKey("");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if decryption fails", async () => {
            vi.fn(KMSClient).mockRejectedValueOnce(new Error("Decryption failed"));
            const result = await getDecryptedKey("AQIDAHpL9KfTzWQmrKVuYd/7hcLE3BNzgDXClU2wcqMnJrYhOAEF9trmVSxIEruFErbgQUt3AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQNuHv4En7L/eDf4RVaAgEQgDvjH7tPpSjkhPsy+ybxq4sCciBwBqXhGZvZDyqGCkrMPmr9T97lRqNy7xEsS5Tq5bTmY6kdI4LcI82MZQ==");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("getDecryptedPassword", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.fn(sql).mockResolvedValue({
                rows: [{ 
                    decrypted_password: "decryptedPassword",
                }],
                command: "SELECT",
                rowCount: 1,
                oid: 0,
                fields: [],
            })
        });
        test("sql utility has been called", async () => {
            const result = await getDecryptedPassword("1234abcd-12ab-34cd-56ef-1234567890ab", "email@domain.com");
            expect(sql).toHaveBeenCalled();
            expect(result).toMatchSnapshot();
        });
        test("return decrypted password as string", async () => {
            const result = await getDecryptedPassword("1234abcd-12ab-34cd-56ef-1234567890ab", "email@domain.com");
            expect(result).toBe("decryptedPassword");
            expect(result).toMatchSnapshot();
        });
        test("returns null if decryption fails", async () => {
            vi.fn(sql).mockRejectedValueOnce(new Error("Decryption failed"));
            const result = await getDecryptedPassword("1234abcd-12ab-34cd-56ef-1234567890ab", "email@domain.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if decrypted key is invalid", async () => {
            const result = await getDecryptedPassword("invalid-decrypted-key", "email@domain.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if email format is invalid", async () => {
            const result = await getDecryptedPassword("1234abcd-12ab-34cd-56ef-1234567890ab", "invalid-email");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("getProviderNameConfirmation", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            (sql as any).mockResolvedValue({
                rows: [
                {
                    provider: "providerName",
                },
                ],
            });            
        });
        test("returns provider name", async () => {
            const result = await getProviderNameConfirmation("name@domain.com", "facebook");
            expect(result).toBe("providerName");
            expect(result).toMatchSnapshot();
        });
        test("returns null if email has an invalid format", async () => {
            const result = await getProviderNameConfirmation("invalid-email", "facebook");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if provider name is empty", async () => {
            const result = await getProviderNameConfirmation("name@domain.com", "");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if SQL query fails", async ()=> {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await getProviderNameConfirmation("name@domain.com", "facebook");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("getUserByEmail", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.fn(sql).mockResolvedValue({
                rows: [
                {
                    id: "1234",
                },
                ],
                command: "SELECT",
                rowCount: 1,
                oid: 0,
                fields: [],
            });
        });
        test("returns user ID", async () => {
            const result = await getUserByEmail("name@domain.com");
            expect(result).toBe("1234");
            expect(result).toMatchSnapshot();
        });
        test("returns null if email format is invalid", async () => {
            const result = await getUserByEmail("invalid-email");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if SQL query fails", async () => {
            vi.fn(sql).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await getUserByEmail("name@domain.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("getUserIntelByUsername", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.fn(sql as any).mockResolvedValue({
                rows: [
                {
                    id: "1234",
                    name: "Test User",
                    username: "testuser",
                    email: "testuser@domain.com",
                    password: "hashedPassword",
                    user_image: "https://example.com/user-image.jpg",
                },                
            ]});      
        });
        test("returns user intel object", async () => {
            const result = await getUserIntelByUsername("testuser");
            expect(result).toEqual({
                id: "1234",
                name: "Test User",
                username: "testuser",
                email: "testuser@domain.com",
                password: "hashedPassword",
                user_image: "https://example.com/user-image.jpg",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns null if username format is invalid", async () => {
            const result = await getUserIntelByUsername("");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if SQL query fails", async () => {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await getUserIntelByUsername("testuser");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("isAccountLocked", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            (sql as any).mockResolvedValue({
                rows: [
                {
                    next_attempt_allowed_at: "2024-06-30T12:00:00Z",
                },
                ],
            });      
        });
        test("returns isLocked true with nextAttempt timestamp", async () => {
            const result = await isAccountLocked("test@example.com");
            expect(result).toEqual({
                isLocked: true,
                nextAttempt: "2024-06-30T12:00:00Z",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns isLocked false if email format is invalid", async () => {
            const result = await isAccountLocked("invalid-email");
            expect(result).toEqual({
                isLocked: false,
            });
            expect(result).toMatchSnapshot();

        });
        test("returns isLocked false if SQL query fails", async () => {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await isAccountLocked("test@example.com");
            expect(result).toEqual({
                isLocked: false,
            });
            expect(result).toMatchSnapshot();
        });
    });
    describe("isUserSignedInWithProvider", () => {
        beforeEach(() => {
            vi.clearAllMocks();  
        });
        test("returns true if user is signed in with provider", async () => {
            const result = await isUserSignedInWithProvider("test@example.com");
            expect(result).toBe(true);
            expect(result).toMatchSnapshot();
        });
        test("returns false if user is not signed in with provider", async () => {
            vi.fn(sql).mockResolvedValueOnce({
                rows: [],
                command: "SELECT",
                rowCount: 0,
                oid: 0,
                fields: [],
            });
            const result = await isUserSignedInWithProvider("test@example.com");
            expect(result).toBe(false);
            expect(result).toMatchSnapshot();
        });
        test("returns false if email format is invalid", async () => {
            const result = await isUserSignedInWithProvider("invalid-email");
            expect(result).toBe(false);
            expect(result).toMatchSnapshot();
        });
        test("returns false if SQL query fails", async () => {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await isUserSignedInWithProvider("test@example.com");
            expect(result).toBe(false);
            expect(result).toMatchSnapshot();
        });
    });
    describe("setFailedAttemptRecord", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            (sql as any).mockResolvedValue({
                rows: [
                {
                    next_attempt_allowed_at: "2024-06-30T12:00:00Z",
                },
                ],
            });      
        });
        test("returns next attempt allowed timestamp", async () => {
            const result = await setFailedAttemptRecord("test@example.com");
            expect(result).toBe("2024-06-30T12:00:00Z");
            expect(result).toMatchSnapshot();
        });
        test("returns null if email format is invalid", async () => {
            const result = await setFailedAttemptRecord("invalid-email");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
        test("returns null if SQL query fails", async () => {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await setFailedAttemptRecord("test@example.com");
            expect(result).toBeNull();
            expect(result).toMatchSnapshot();
        });
    });
    describe("setNewUser", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            (sql as any).mockResolvedValue({
                rows: [
                {
                    id: "1234",
                },
                ],
            });      
        });
        test("returns success true with new user ID", async () => {
            const result = await setNewUser("Test User", "testuser", "test@example.com", "https://example.com/user-image.jpg");
            expect(result).toEqual({
                success: true,
                id: "1234",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if input data format is invalid", async () => {
            const result = await setNewUser("", "", "invalid-email", "invalid-url");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if email format is invalid", async () => {
            const result = await setNewUser("Test User", "testuser", "invalid-email", "https://example.com/user-image.jpg");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if user image URL format is invalid", async () => {
            const result = await setNewUser("Test User", "testuser", "test@example.com", "invalid-url");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if name is empty", async () => {
            const result = await setNewUser("", "testuser", "test@example.com", "https://example.com/user-image.jpg");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if username is empty", async () => {
            const result = await setNewUser("Test User", "", "test@example.com", "https://example.com/user-image.jpg");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if email is empty", async () => {
            const result = await setNewUser("Test User", "testuser", "", "https://example.com/user-image.jpg");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if user image URL is empty", async () => {
            const result = await setNewUser("Test User", "testuser", "test@example.com", "");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if SQL query fails", async () => {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await setNewUser("Test User", "testuser", "test@example.com", "https://example.com/user-image.jpg");
            expect(result).toEqual({
                success: false,
                id: "",
            });
            expect(result).toMatchSnapshot();
        });
    });
    describe("setUserWithProvider", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.mock("../../utils", () => ({
                generateKmsDataKey: vi.fn().mockResolvedValue("testDataKey"),
            }));
        });
        test("returns success true when user is set with provider", async () => {
            const result = await setUserWithProvider("test@example.com", "facebook", "provider-id-1234");
            expect(result).toEqual({
                success: true,
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if email format is invalid", async () => {
            const result = await setUserWithProvider("invalid-email", "facebook", "provider-id-1234");
            expect(result).toEqual({
                success: false,
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if provider format is invalid", async () => {
            const result = await setUserWithProvider("test@example.com", "test-provider", "provider-id-1234");
            expect(result).toEqual({
                success: false,
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if provider ID is empty", async () => {
            const result = await setUserWithProvider("test@example.com", "facebook", "");
            expect(result).toEqual({
                success: false,
            });
            expect(result).toMatchSnapshot();
        });
        test("returns success false if SQL query fails", async () => {
            (sql as any).mockRejectedValueOnce(new Error("SQL query failed"));
            const result = await setUserWithProvider("test@example.com", "facebook", "provider-id-1234");
            expect(result).toEqual({
                success: false,
            });
            expect(result).toMatchSnapshot();
        });
    });
    describe("verifyPassword", () => {
        beforeAll(() => {
            vi.clearAllMocks();
            server.listen();
        });
        afterEach(() => server.resetHandlers());
        afterAll(() => server.close());
        test("returns true if password verification is successful", async () => {
            const result = await verifyPassword("inputPassword", "decryptedPassword");
            expect(result).toBe(true);

            expect(result).toMatchSnapshot();
        });
        test("returns false if password verification fails", async () => {            
            server.use(
                http.post("http://localhost:3000/api/argon2/verify", async () => {
                    return HttpResponse.json({ isValid: false });
                }),
            );
            const result = await verifyPassword("inputPassword", "decryptedPassword");
            expect(result).toBe(false);
            expect(result).toMatchSnapshot();
        });
    });
});
import { http, HttpResponse } from "msw";
import mockExposedPasswords from "./mock-exposed-passwords";

export const handlers = [
    http.post("http://localhost:3000/api/argon2/verify", async () => {
        return HttpResponse.json({ isValid: true });
    }),
    http.get("https://api.pwnedpasswords.com/range/21BD1", async () => {
        return HttpResponse.text(mockExposedPasswords);
    }),
    http.get("https://api.pwnedpasswords.com/range/8be3c", async () => {
        return HttpResponse.text("");
    }),
    http.post("https://kms.us-east-1.amazonaws.com", async () => {
        return HttpResponse.json({
            CiphertextBlob: "cipher_mock",
            Plaintext: "plaintext_mock",
        })
    }),
];
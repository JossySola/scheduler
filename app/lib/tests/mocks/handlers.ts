import { http, HttpResponse } from "msw";
import mockExposedPasswords from "./mock-exposed-passwords";

export const handlers = [
    http.post("http://localhost:3000/api/argon2/verify", async () => {
        return HttpResponse.json({ isValid: true });
    }),
    http.get("https://api.pwnedpasswords.com/range/:range", async () => {
        return HttpResponse.text(mockExposedPasswords);
    }),
];
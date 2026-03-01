import { http, HttpResponse } from "msw";

export const handlers = [
    http.post("http://localhost:3000/api/argon2/verify", async () => {
        return HttpResponse.json({ isValid: true });
    }),
]
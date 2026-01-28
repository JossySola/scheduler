import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ['verbose', 'html'],
        coverage: {
            enabled: true,
            reporter: ['html'],
        },
    }
})
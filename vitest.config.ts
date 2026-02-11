import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ['verbose', 'html'],
        coverage: {
            enabled: true,
            reporter: ['html'],
        },
        projects: [
            'app/lib/tests/*',
            {
                extends: true,
                test: {
                    include: ['unit-testing/*.server.test.{ts,js}'],
                    name: 'Server-side tests',
                    environment: 'node',
                }
            },
            {
                extends: true,
                test: {
                    include: ['unit-testing/*.client.test.{ts,js}'],
                    name: 'Client-side tests',
                    environment: 'happy-dom',
                }
            }
        ]
    }
})
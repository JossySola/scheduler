import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ['verbose', 'html'],
        coverage: {
            enabled: true,
            reporter: ['html'],
        },
        workspace: [
            'app/lib/tests/*',
            {
                extends: true,
                test: {
                    include: ['**/*.server.test.{ts,js}'],
                    name: 'server',
                    environment: 'node',
                }
            },
            {
                extends: true,
                test: {
                    include: ['**/*.client.test.{ts,js}'],
                    name: 'client',
                    environment: 'jsdom',
                }
            },
        ]
    }
})
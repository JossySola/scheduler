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
                    name: { label: 'Server-side Tests', color: 'blue' },
                    environment: 'node',
                }
            },
            {
                extends: true,
                test: {
                    include: ['unit-testing/*.client.test.{ts,js}'],
                    name: { label: 'Client-side Tests', color: 'green' },
                    environment: 'happy-dom',
                }
            }, 
            {
                test: {
                    include: ['unit-testing/*.vercel.test.{ts,js}'],
                    name: { label: 'Vercel Edge tests', color: 'yellow' },
                    environment: 'edge-runtime',
                }
            }
        ]
    }
})
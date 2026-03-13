import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./")
        },
    },
    test: {
        reporters: ['verbose', 'html'],
        coverage: {
            enabled: true,
            reporter: ['html'],
        },
        setupFiles: ["vitest.setup.ts"],
        projects: [
            './lib/tests/*',
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
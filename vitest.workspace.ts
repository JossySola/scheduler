import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
    'app/lib/tests/*',
    {
        extends: './vitest.config.ts',
        test: {
            include: ['/*.client.test.{ts,js}'],
            name: 'client',
            environment: 'jsdom',
        }
    },
    {
        extends: './vitest.config.ts',
        test: {
            include: ['/*.server.test.{ts,js}'],
            name: 'server',
            environment: 'node',
        }
    }
])
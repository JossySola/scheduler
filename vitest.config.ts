import { defineConfig } from "vitest/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = dirname(fileURLToPath(import.meta.url));
const paths = tsconfigPaths({ root: __dirname });
export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        reporters: ['verbose', 'html'],
        coverage: {
            enabled: true,
            reporter: ['html'],
        },
        setupFiles: ["vitest.setup.ts"],
        projects: [
            {
                plugins: [paths],
                test: {
                    include: ['lib/tests/unit-testing/*.server.test.{ts,js}'],
                    name: { label: 'Server-side Tests', color: 'blue' },
                    environment: 'node',
                }
            },
            {
                plugins: [paths],
                test: {
                    include: ['lib/tests/unit-testing/*.client.test.{ts,js}'],
                    name: { label: 'Client-side Tests', color: 'green' },
                    environment: 'happy-dom',
                }
            }, 
            {
                plugins: [paths],
                test: {
                    include: ['lib/tests/unit-testing/*.vercel.test.{ts,js}'],
                    name: { label: 'Vercel Edge tests', color: 'yellow' },
                    environment: 'edge-runtime',
                }
            }
        ]
    }
});
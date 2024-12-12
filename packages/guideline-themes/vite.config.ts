/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, rollupTypes: true })],
    resolve: {
        mainFields: ['module', 'main'],
    },
    test: {
        environment: 'happy-dom',
        deps: {
            inline: ['clsx', '@juggle/resize-observer', '@frontify/fondue'],
        },
        setupFiles: ['setupTests.ts'],
        coverage: {
            provider: 'v8',
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/test.ts', 'src/**/test.tsx', 'src/**/spec.ts', 'src/**/spec.tsx'],
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: (format: string) => `[name].${format}.js`,
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies],
            output: [
                {
                    name: 'GuidelineThemes',
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                },
                {
                    name: 'GuidelineThemes',
                    format: 'umd',
                },
                {
                    name: 'GuidelineThemes',
                    format: 'cjs',
                },
            ],
        },
    },
});

import { join } from "path";
import CompilationFailedError from "../errors/CompilationFailedError";
import { rollup, RollupOptions, OutputOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import combine from "rollup-plugin-combine";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";

interface Options {
    distPath?: string;
    tsconfigPath?: string;
    env?: Record<string, string>;
    minify?: boolean;
    sourceMap?: boolean;
    treeshake?: boolean;
}

export const compile = async (
    projectPath: string,
    entryFileNames: string[],
    iifeGlobalName: string,
    {
        distPath = "dist",
        tsconfigPath = "tsconfig.json",
        env = {},
        minify = false,
        sourceMap = true,
        treeshake = true,
    }: Options,
): Promise<void> => {
    const rollupConfig: RollupOptions = {
        external: ["react", "react-dom"],
        treeshake,
        input: entryFileNames.map((entryFileName) => join(projectPath, entryFileName)),
        plugins: [
            nodeResolve({
                browser: true,
                extensions: [".js", ".ts", ".tsx", ".json"],
            }),
            json(),
            combine({
                exports: "named",
            }),
            replace({
                preventAssignment: true,
                values: {
                    ...Object.keys(env).reduce((stack, key) => {
                        stack[`process.env.${key}`] = JSON.stringify(env[key]);
                        return stack;
                    }, {}),
                },
            }),
            esbuild({
                sourceMap,
                minify,
                target: "es6",
                tsconfig: tsconfigPath,
                experimentalBundling: true,
            }),
            postcss({
                config: {
                    path: join(projectPath, "postcss.config.js"),
                    ctx: {},
                },
                minimize: minify,
            }),
        ],
    };

    const outputConfig: OutputOptions = {
        dir: distPath,
        format: "iife",
        name: iifeGlobalName,
        globals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
        banner: `
            window.require = (moduleName) => {
                switch (moduleName) {
                    case "react":
                        return window["React"];
                    case "react-dom":
                        return window["ReactDOM"];
                    default:
                        throw new Error("Could not resolve module from Frontify, please install it locally: npm i", moduleName);
                }
            };
        `,
    };

    try {
        const bundle = await rollup(rollupConfig);

        await bundle.write(outputConfig);

        await bundle.close();
    } catch (error) {
        throw new CompilationFailedError(error as string);
    }
};

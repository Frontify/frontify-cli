import { join } from "path";
import { resolve } from "path/posix";
import { ProvidePlugin, NormalModuleReplacementPlugin, webpack } from "webpack";
import InjectPlugin, { ENTRY_ORDER } from "webpack-inject-plugin";

export interface CompilerOptions {
    distPath?: string;
    tsconfigPath?: string;
    env?: Record<string, string>;
    minify?: boolean;
    sourceMap?: boolean;
    treeshake?: boolean | "smallest";
}

export const compile = async (
    projectPath: string,
    entryFileNames: string[],
    iifeGlobalName: string,
    options: CompilerOptions,
): Promise<void> => {
    const defaultOptions: CompilerOptions = {
        distPath: "dist",
        tsconfigPath: "tsconfig.json",
        env: {},
        minify: true,
        sourceMap: true,
        treeshake: true,
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    };

    const compiler = webpack({
        context: projectPath,
        externals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
        entry: entryFileNames.map((entryFileName) => join(projectPath, entryFileName)).reverse(),
        output: {
            library: iifeGlobalName,
            libraryTarget: "umd",
            path: join(projectPath, "dist"),
            filename: "index.js",
            iife: true,
        },
        mode: "development",
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve("babel-loader"),
                            options: {
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        {
                                            modules: false,
                                            loose: true,
                                        },
                                    ],
                                    "@babel/preset-typescript",
                                ],
                                plugins: [
                                    [
                                        "@babel/plugin-transform-react-jsx",
                                        {
                                            runtime: "automatic",
                                        },
                                    ],
                                    ["@babel/plugin-proposal-class-properties", { modules: false, loose: true }],
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                },
            ],
        },
        resolve: {
            extensions: [".js", ".ts", ".tsx", ".json"],
        },
        plugins: [
            // new ProvidePlugin({
            //     "window.React": "react",
            //     "window.ReactDOM": "react-dom",
            // }),
            //     new InjectPlugin(
            //         () => {
            //             return `console.log('this is a banner');
            // window.require = (moduleName) => {
            //     switch (moduleName) {
            //         case "react":
            //             console.log('react loaded');
            //             return window["React"];
            //         case "react-dom":
            //             console.log('react-dom loaded');
            //             return window["ReactDOM"];
            //         default:
            //             throw new Error("Could not resolve module from Frontify, please install it locally: npm i", moduleName);
            //     }
            // };
            // `;
            //         },
            //         { entryOrder: ENTRY_ORDER.First },
            //     ),
        ],
    });

    return new Promise((resolve) =>
        compiler.run((error, stats) => {
            if (error) {
                console.log(error.message);
            }
            const info = stats?.toJson();
            if (stats?.hasErrors() && info?.errors) {
                console.log(info.errors.join(", "));
            }
            resolve();
        }),
    );

    // const rollupConfig: RollupOptions = {
    //     external: ["react", "react-dom"],
    //     treeshake: mergedOptions.treeshake,
    //     input: entryFileNames.map((entryFileName) => join(projectPath, entryFileName)),
    //     plugins: [
    //         nodeResolve({
    //             extensions: [".js", ".ts", ".tsx", ".json"],
    //         }),
    //         json(),
    //         combine({
    //             exports: "named",
    //         }),
    //         replace({
    //             preventAssignment: true,
    //             values: {
    //                 ...Object.keys(mergedOptions.env || []).reduce((stack, key) => {
    //                     stack[`process.env.${key}`] = JSON.stringify(mergedOptions?.env?.[key] || "null");
    //                     return stack;
    //                 }, {}),
    //             },
    //         }),
    //         esbuild({
    //             sourceMap: mergedOptions.sourceMap,
    //             minify: mergedOptions.minify,
    //             tsconfig: mergedOptions.tsconfigPath,
    //             experimentalBundling: true,
    //         }),
    //         postcss({
    //             config: {
    //                 path: join(projectPath, "postcss.config.js"),
    //                 ctx: {},
    //             },
    //             minimize: mergedOptions.minify,
    //         }),
    //     ],
    // };

    // const outputConfig: OutputOptions = {
    //     dir: mergedOptions.distPath,
    //     format: "iife",
    //     name: iifeGlobalName,
    //     globals: {
    //         react: "React",
    //         "react-dom": "ReactDOM",
    //     },
    //     banner: `
    //         window.require = (moduleName) => {
    //             switch (moduleName) {
    //                 case "react":
    //                     return window["React"];
    //                 case "react-dom":
    //                     return window["ReactDOM"];
    //                 default:
    //                     throw new Error("Could not resolve module from Frontify, please install it locally: npm i", moduleName);
    //             }
    //         };
    //     `,
    // };

    // try {
    //     const bundle = await rollup(rollupConfig);

    //     await bundle.write(outputConfig);

    //     await bundle.close();
    // } catch (error) {
    //     throw new CompilationFailedError(error as string);
    // }
};

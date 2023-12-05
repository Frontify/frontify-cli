/* (c) Copyright Frontify Ltd., all rights reserved. */

import pc from 'picocolors';
import fastGlob from 'fast-glob';
import open from 'open';
import { join } from 'node:path';
import {
    CompilerOptions,
    Configuration,
    HttpClient,
    Logger,
    UserInfo,
    getUser,
    promiseExec,
    reactiveJson,
    readFileAsBase64,
    readFileLinesAsArray,
} from '../utils/index.js';
import { HttpClientError } from '../errors/HttpClientError.js';
import { platformAppManifestSchemaV1, verifyManifest } from '../utils/verifyManifest.js';

type Options = {
    dryRun?: boolean;
    noVerify?: boolean;
    openInBrowser?: boolean;
};

export type AppManifest = {
    appId: string;
    appType?: string;
    metadata?: {
        version?: number;
    };
};

const makeFilesDict = async (glob: string, ignoreGlobs?: string[]) => {
    const folderFiles = await fastGlob(join(glob, '**'), { ignore: ignoreGlobs, dot: true });

    const folderFilenames = folderFiles.map((filePath) => filePath.replace(`${glob}/`, ''));

    return folderFilenames.reduce((stack, filename, index) => {
        stack[`/${filename}`] = readFileAsBase64(folderFiles[index]);
        return stack;
    }, {});
};

const BUILD_FILE_BLOCK_LIST = ['**/*.*.map'];
const SOURCE_FILE_BLOCK_LIST = ['.git', 'node_modules', 'dist', '.vscode', '.idea', 'README.md', '.DS_Store'];

export const createDeployment = async (
    entryFile: string,
    distPath: string,
    { dryRun = false, noVerify = false, openInBrowser = false }: Options,
    compile: ({ projectPath, entryFile, outputName }: CompilerOptions) => Promise<unknown>,
): Promise<void> => {
    try {
        let user: UserInfo | undefined;
        const instanceUrl = Configuration.get('instanceUrl') as string | undefined;
        if (!instanceUrl) {
            Logger.error(`You are not logged in, you can use the command ${pc.bold('frontify-cli login')}.`);
            process.exit(-1);
        }

        if (!dryRun) {
            user = await getUser(instanceUrl);
            user && Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
        }

        if (user || dryRun) {
            dryRun && Logger.info(pc.blue('Dry run: enabled'));

            const projectPath = process.cwd();
            const manifestContent = reactiveJson<AppManifest>(join(projectPath, 'manifest.json'));
            const parsedManifest =
                manifestContent.appType === 'platform-app'
                    ? await verifyManifest(manifestContent, platformAppManifestSchemaV1)
                    : manifestContent;

            if (!noVerify) {
                Logger.info('Performing type checks...');
                await promiseExec('npx tsc --noEmit');

                Logger.info('Performing eslint checks...');
                await promiseExec('npx eslint src');
            }

            try {
                await compile({ projectPath, entryFile, outputName: parsedManifest.appId });
            } catch (error) {
                Logger.error(error as string);
                process.exit(-1);
            }

            const buildFilesToIgnore = BUILD_FILE_BLOCK_LIST.map((path) => join(projectPath, path));

            const gitignoreEntries = readFileLinesAsArray(join(projectPath, '.gitignore')).filter(
                (entry) => entry !== 'manifest.json',
            );
            const sourceFilesToIgnore = [...gitignoreEntries, ...SOURCE_FILE_BLOCK_LIST].map((path) =>
                join(projectPath, path),
            );

            const request = {
                build_files: await makeFilesDict(join(projectPath, distPath), buildFilesToIgnore),
                source_files: await makeFilesDict(join(projectPath), sourceFilesToIgnore),
            };

            if (!dryRun) {
                Logger.info('Sending the files to Frontify Marketplace...');

                const httpClient = new HttpClient(instanceUrl);

                const accessToken = Configuration.get('tokens.access_token');

                try {
                    await httpClient.put(`/api/marketplace/app/${parsedManifest.appId}`, request, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    Logger.success('The new version has been pushed.');

                    if (openInBrowser) {
                        Logger.info('Opening the Frontify Marketplace page...');
                        await open(`https://${instanceUrl}/marketplace/apps/${parsedManifest.appId}`);
                    }
                } catch (error) {
                    Logger.error('An error occured while deploying:', (error as HttpClientError).responseBody.error);
                    process.exit(-1);
                }
            } else {
                Logger.success('The command has been executed without any issue.');
                process.exit(0);
            }
        }
    } catch (error) {
        Logger.error('The deployment has failed and was aborted due to an error:', error as string);
        process.exit(-1);
    }
};

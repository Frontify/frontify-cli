/* (c) Copyright Frontify Ltd., all rights reserved. */

import colors from 'colors/safe';
import fastGlob from 'fast-glob';
import { Headers } from 'node-fetch';
import open from 'open';
import { join } from 'path';
import CompilationFailedError from '../errors/CompilationFailedError';
import FileNotFoundError from '../errors/FileNotFoundError';
import { compile } from '../utils/compiler';
import { Configuration } from '../utils/configuration';
import { readFileAsBase64, readFileLinesAsArray } from '../utils/file';
import { HttpClient } from '../utils/httpClient';
import Logger from '../utils/logger';
import { promiseExec } from '../utils/promiseExec';
import { reactiveJson } from '../utils/reactiveJson';
import { UserInfo, getUser } from '../utils/user';

interface Options {
    dryRun?: boolean;
    noVerify?: boolean;
    openInBrowser?: boolean;
}

const makeFilesDict = async (glob: string, ignoreGlobs?: string[], requiredFileNames?: string[]) => {
    const folderFiles = await fastGlob(join(glob, '**'), { ignore: ignoreGlobs, dot: true });

    const folderFilenames = folderFiles.map((filePath) => filePath.replace(`${glob}/`, ''));

    if (requiredFileNames) {
        for (const fileName of requiredFileNames) {
            if (!folderFilenames.includes(fileName)) {
                throw new FileNotFoundError(fileName);
            }
        }
    }

    return folderFilenames.reduce((stack, filename, index) => {
        stack[`/${filename}`] = readFileAsBase64(folderFiles[index]);
        return stack;
    }, {});
};

export const createDeployment = async (
    projectPath: string,
    entryFileName: string,
    distPath: string,
    { dryRun = false, noVerify = false, openInBrowser = false }: Options
): Promise<void> => {
    try {
        let user: UserInfo | undefined;
        const instanceUrl = Configuration.get('instanceUrl') as string;
        if (!dryRun) {
            user = await getUser(instanceUrl);
            user && Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
        }

        if (user || dryRun) {
            dryRun && Logger.info(colors.blue('Dry run: enabled'));

            const fullProjectPath = join(process.cwd(), projectPath);
            const manifest = reactiveJson<Manifest>(join(process.cwd(), 'manifest.json'));

            if (!noVerify) {
                Logger.info('Performing type checks...');
                await promiseExec(`cd ${fullProjectPath} && ./node_modules/.bin/tsc --noEmit`);

                Logger.info('Performing eslint checks...');
                await promiseExec(`cd ${fullProjectPath} && ./node_modules/.bin/eslint src`);
            }

            try {
                await compile(fullProjectPath, entryFileName, manifest.appId);
            } catch (error) {
                throw new CompilationFailedError(error as string);
            }

            const BUILD_FILE_BLOCK_LIST = ['**/*.*.map'];
            const buildFilesToIgnore = BUILD_FILE_BLOCK_LIST.map((path) => join(projectPath, path));

            const SOURCE_FILES_REQUIRED_LIST = ['.prettierrc', '.eslintrc.js', 'tsconfig.json'];
            const SOURCE_FILE_BLOCK_LIST = ['.git', 'node_modules', 'dist', '.vscode', '.idea', 'README.md'];

            const gitignoreEntries: string[] = [];
            try {
                gitignoreEntries.push(...readFileLinesAsArray(join(projectPath, '.gitignore')));
            } catch {}

            const sourceFilesToIgnore = [...gitignoreEntries, ...SOURCE_FILE_BLOCK_LIST].map((path) =>
                join(projectPath, path)
            );

            const request = {
                build_files: await makeFilesDict(join(projectPath, distPath), buildFilesToIgnore),
                source_files: await makeFilesDict(join(projectPath), sourceFilesToIgnore, SOURCE_FILES_REQUIRED_LIST),
            };

            if (!dryRun) {
                Logger.info('Sending the files to Frontify Marketplace...');

                const httpClient = new HttpClient(instanceUrl);

                const accessToken = Configuration.get('tokens.access_token');
                const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

                try {
                    await httpClient.put(`/api/marketplace/app/${manifest.appId}`, request, {
                        headers,
                    });

                    Logger.success('The new version has been pushed.');

                    if (openInBrowser) {
                        Logger.info('Opening the Frontify Marketplace page...');
                        await open(`https://${instanceUrl}/marketplace/apps/${manifest.appId}`);
                    }
                } catch (error) {
                    Logger.error('An error occured while deploying', (error as Error).toString());
                }
            } else {
                Logger.success('The command has been executed without any issue.');
            }
        }
    } catch (error) {
        Logger.error('The deployment has failed and was aborted.', error as string);
    }
};

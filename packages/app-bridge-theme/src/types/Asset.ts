/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Asset = {
    id: number;
    creatorName: string;
    extension: string;
    externalUrl: Nullable<string>;
    fileName: string;
    title: string;
    status: string;
    objectType: string;
    height: Nullable<number>;
    width: Nullable<number>;
    genericUrl: string;
    previewUrl: string;
    originUrl: string;
    projectId: number;
    fileSize: number;
    fileSizeHumanReadable: string;
    fileId: string;
    token: string;
    projectType: Nullable<string>;
    revisionId: Nullable<number>;
    backgroundColor: Nullable<string>;
    isDownloadProtected: boolean;
};

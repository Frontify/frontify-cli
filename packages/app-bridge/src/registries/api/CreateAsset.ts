/* (c) Copyright Frontify Ltd., all rights reserved. */

export type CreateAssetPayload = {
    data: File | Blob | string;
    title: string;
    parentId?: string;
    description?: string;
    externalId?: string;
    tags?: { value: string }[];
};

export type CreateAssetResponse = {
    assetId: string;
};

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, it } from 'vitest';

import {
    platformAppManifestSchemaV1,
    resetEndpointNameSet,
    resetSecretKeySet,
    verifyManifest,
} from '../../src/utils/verifyManifest';

const VALID_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
        automation: {
            actions: {
                setAssetTitle: {
                    name: 'Set asset title',
                    variables: {
                        title: {
                            name: 'Asset title',
                            type: 'STRING',
                        },
                    },
                    workflowId: '7DQ92y5AldGBwZ34',
                    description: 'Changes the title of an asset',
                },
            },
            triggers: {
                assetsCreated: {
                    name: 'Assets created',
                    variables: {
                        id: {
                            key: 'asset.id',
                            name: 'Asset Id',
                            type: 'NUMBER',
                        },
                        title: {
                            name: 'Asset title',
                            type: 'STRING',
                        },
                    },
                    description: 'Triggered when assets are created',
                },
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_SHORT_ID = {
    appType: 'platform-app',
    appId: 'tooShortId',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {},
        },
    },
    metadata: {
        version: 1,
    },
};

const ICON_LIBRARY_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        iconLibrary: {
            assetAction: {
                type: ['image'],
                filenameExtension: ['png'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const LOGO_LIBRARY_MANIFEST = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        logoLibrary: {
            assetAction: {
                type: ['video'],
                filenameExtension: ['exe'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MEDIA_LIBRARY_FORBIDDEN_EXTENSIONS = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                type: ['image'],
                filenameExtension: ['exe'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL = {
    appType: 'platform-app',
    appId: 'abcd',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                type: ['image'],
                filenameExtension: ['png'],
            },
        },
    },
    metadata: {
        version: 1.1,
    },
};

const MANIFEST_WITH_TOO_LONG_TITLE_ASSET_ACTION = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title action title action title action title action title action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_TOO_LONG_TITLE_ASSET_CREATION = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title action title action title action title action title action title action title action title action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_SECRETS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ label: 'first label', key: 'first_key' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_EMPTY_SECRETS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_NO_SECRETS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_WRONG_KEY_FORMAT = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ label: 'first label', key: 'first key %' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_SECRET_BUT_NO_KEY = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ label: 'first label' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_SECRET_BUT_NO_LABEL = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [{ key: 'first-key' }],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_INVALID_VARIABLE_TYPE = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        automation: {
            actions: {
                setAssetTitle: {
                    name: 'Set asset title',
                    workflowId: '7DQ92y5AldGBwZ32',
                    variables: {
                        title: {
                            name: 'Asset title',
                            type: 'VARCHAR',
                        },
                    },
                },
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const generateManifestWithEndpointNetworkCall = (networkEndpoints) => {
    return {
        appType: 'platform-app',
        appId: 'abcdabcdabcdabcdabcdabcda',
        network: {
            endpoints: networkEndpoints,
        },
        surfaces: {
            mediaLibrary: {
                assetAction: {
                    title: 'action title',
                    type: ['image', 'video'],
                    filenameExtension: ['png'],
                },
                assetCreation: {
                    title: 'action title',
                },
            },
        },
        metadata: {
            version: 1,
        },
    };
};

const MANIFEST_WITH_NETWORK_CALL = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
    {
        name: 'example-user-api',
        resource: 'https://api.example.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_DUPLICATE_NAME = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
    {
        name: 'frontify-user-api',
        resource: 'https://api.example.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NOT_ARRAY_NETWORK_CALL = generateManifestWithEndpointNetworkCall({
    name: 'frontify-user-api',
    resource: 'https://api.frontify.com/api/user',
    options: {
        method: 'POST',
        headers: {
            'x-frontify-auth-header': '$OPEN_API',
        },
        body: 'example body data',
    },
});

const MANIFEST_WITH_NETWORK_CALL_NO_ID = generateManifestWithEndpointNetworkCall([
    {
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_RESOURCE = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_STRING_RESOURCE = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'something-random',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_HEADERS_AND_BODY = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'GET',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_OPTIONS = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
    },
]);

const MANIFEST_WITH_NETWORK_CALL_NO_METHOD = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_WRONG_HEADER_OBJECT = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: 'x-frontify-auth-header',
            body: 'example body data',
        },
    },
    {
        name: 'example-user-api',
        resource: 'https://api.example.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_NETWORK_CALL_WRONG_HEADER_AS_NESTED_OBJECT = generateManifestWithEndpointNetworkCall([
    {
        name: 'frontify-user-api',
        resource: 'https://api.frontify.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': { test: '$OPEN_API' },
            },
            body: 'example body data',
        },
    },
    {
        name: 'example-user-api',
        resource: 'https://api.example.com/api/user',
        options: {
            method: 'POST',
            headers: {
                'x-frontify-auth-header': '$OPEN_API',
            },
            body: 'example body data',
        },
    },
]);

const MANIFEST_WITH_TOO_LONG_SECRET_KEY = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [
        {
            label: 'test label',
            key: 'SUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEYSUPER_LONG_KEY',
        },
    ],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_DUPLICATE_SECRET_KEY = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    secrets: [
        { label: 'test label', key: 'DUPLICATE_KEY' },
        { label: 'another label', key: 'DUPLICATE_KEY' },
    ],
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_NETWORK_HOST = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    network: {
        allowedHosts: ['google.ch', 'frontify.com', 'api.openai.com', 'test.open.api.example.com'],
    },
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const INVALID_MANIFEST_NETWORK_HOST = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    network: {
        allowedHosts: ['google.ch/test'],
    },
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const INVALID_MANIFEST_NETWORK_HOST_HTTPS = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    network: {
        allowedHosts: ['https://google.ch'],
    },
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const INVALID_MANIFEST_NETWORK_ALLOWED_HOST_DOUBLE_DOT = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    network: {
        allowedHosts: ['example..com'],
    },
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const INVALID_MANIFEST_NETWORK_ALLOWED_HOST_UNDESCORE = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    network: {
        allowedHosts: ['exa_mple.com'],
    },
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const VALID_MANIFEST_WITH_SCOPES = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    permissions: {
        scopes: ['basic:read', 'basic:write'],
    },
    surfaces: {
        mediaLibrary: {
            assetAction: {
                title: 'action title',
                type: ['image', 'video'],
                filenameExtension: ['png'],
            },
            assetCreation: {
                title: 'action title',
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_BULK_ACTIONS_SURFACE_ERROR = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetBulkActions: {
                title: 'action title',
                filenameExtensions: ['png', 'exe'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

const MANIFEST_WITH_BULK_ACTIONS_SURFACE = {
    appType: 'platform-app',
    appId: 'abcdabcdabcdabcdabcdabcda',
    surfaces: {
        mediaLibrary: {
            assetBulkActions: {
                title: 'action title',
                filenameExtensions: ['png'],
            },
        },
    },
    metadata: {
        version: 1,
    },
};

describe('Verify Platform App Manifest', () => {
    beforeEach(() => {
        resetSecretKeySet();
        resetEndpointNameSet();
    });

    it('should validate a valid manifest', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw error when wrong file extension is present in IconLibrary', () => {
        expect(() => verifyManifest(ICON_LIBRARY_MANIFEST, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when forbidden extensions are in the manifest', () => {
        expect(() => verifyManifest(MEDIA_LIBRARY_FORBIDDEN_EXTENSIONS, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when forbidden extensions are in the Logo Library manifest', () => {
        expect(() => verifyManifest(LOGO_LIBRARY_MANIFEST, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when version number is a float', () => {
        expect(() => verifyManifest(VERSION_NUMBER_IS_INTEGER_WITH_DECIMAL, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when appId is not of length 25', () => {
        expect(() => verifyManifest(MANIFEST_WITH_SHORT_ID, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when asset action title is too long', () => {
        expect(() => verifyManifest(MANIFEST_WITH_TOO_LONG_TITLE_ASSET_ACTION, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when asset creation title is too long', () => {
        expect(() =>
            verifyManifest(MANIFEST_WITH_TOO_LONG_TITLE_ASSET_CREATION, platformAppManifestSchemaV1),
        ).toThrow();
    });

    it('should accept a secret array with label and key', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST_WITH_SECRETS, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should accept an empty secrets array', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST_WITH_EMPTY_SECRETS, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should validate when no secret property is present', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST_WITH_NO_SECRETS, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw when secret object is not correct without key', () => {
        expect(() => verifyManifest(MANIFEST_WITH_SECRET_BUT_NO_KEY, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw when secret object is not correct without label', () => {
        expect(() => verifyManifest(MANIFEST_WITH_SECRET_BUT_NO_LABEL, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when key formatting is invalid', () => {
        expect(() => verifyManifest(MANIFEST_WITH_WRONG_KEY_FORMAT, platformAppManifestSchemaV1)).toThrow();
    });

    it('should accept an array of network endpoint objects', () => {
        const verifiedManifest = verifyManifest(MANIFEST_WITH_NETWORK_CALL, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });
    it('should accept an array of valid hosts', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST_NETWORK_HOST, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should accept a permissions object with scopes', () => {
        const verifiedManifest = verifyManifest(VALID_MANIFEST_WITH_SCOPES, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should accept a manifest with a bulk action surface', () => {
        const verifiedManifest = verifyManifest(MANIFEST_WITH_BULK_ACTIONS_SURFACE, platformAppManifestSchemaV1);
        expect(!!verifiedManifest).toBe(true);
    });

    it('should accept an array of network endpoint without header and body', () => {
        const verifiedManifest = verifyManifest(
            MANIFEST_WITH_NETWORK_CALL_NO_HEADERS_AND_BODY,
            platformAppManifestSchemaV1,
        );
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw error when network endpoint is not an array', () => {
        expect(() => verifyManifest(MANIFEST_WITH_NOT_ARRAY_NETWORK_CALL, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when fileextensions is not allowed', () => {
        expect(() => verifyManifest(MANIFEST_WITH_BULK_ACTIONS_SURFACE_ERROR, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when network endpoint object is not correct without id', () => {
        expect(() => verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_ID, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when network endpoint object is not correct without resource', () => {
        expect(() => verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_RESOURCE, platformAppManifestSchemaV1)).toThrow();
    });

    it('should not throw an error if the URL is not valid to allow secret replacement in the resource', () => {
        const verifiedManifest = verifyManifest(
            MANIFEST_WITH_NETWORK_CALL_STRING_RESOURCE,
            platformAppManifestSchemaV1,
        );
        expect(!!verifiedManifest).toBe(true);
    });

    it('should throw error when network endpoint object is not correct without options', () => {
        expect(() => verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_OPTIONS, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when network endpoint object is not correct without method', () => {
        expect(() => verifyManifest(MANIFEST_WITH_NETWORK_CALL_NO_METHOD, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when network endpoint object has duplicate Names', () => {
        expect(() => verifyManifest(MANIFEST_WITH_NETWORK_CALL_DUPLICATE_NAME, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when secret object has duplicate KEYs', () => {
        expect(() => verifyManifest(MANIFEST_WITH_DUPLICATE_SECRET_KEY, platformAppManifestSchemaV1)).toThrow();
    });

    it('should throw error when header is not an object of strings key value', () => {
        expect(() =>
            verifyManifest(MANIFEST_WITH_NETWORK_CALL_WRONG_HEADER_OBJECT, platformAppManifestSchemaV1),
        ).toThrow();
    });

    it('should throw error when header is not an object of strings key value', () => {
        expect(() =>
            verifyManifest(MANIFEST_WITH_NETWORK_CALL_WRONG_HEADER_AS_NESTED_OBJECT, platformAppManifestSchemaV1),
        ).toThrow();
    });

    it('should throw error when secret key is too long', () => {
        expect(() => verifyManifest(MANIFEST_WITH_TOO_LONG_SECRET_KEY, platformAppManifestSchemaV1)).toThrow();
    });

    it('should detect when it is not a valid hostName', () => {
        expect(() => verifyManifest(INVALID_MANIFEST_NETWORK_HOST, platformAppManifestSchemaV1)).toThrow();
    });

    it('should detect when it is not a valid hostName', () => {
        expect(() => verifyManifest(INVALID_MANIFEST_NETWORK_HOST_HTTPS, platformAppManifestSchemaV1)).toThrow();
    });

    it('should detect when it is not a valid hostName with 2 dots', () => {
        expect(() =>
            verifyManifest(INVALID_MANIFEST_NETWORK_ALLOWED_HOST_DOUBLE_DOT, platformAppManifestSchemaV1),
        ).toThrow();
    });

    it('should detect when it is not a valid hostName with underscore', () => {
        expect(() =>
            verifyManifest(INVALID_MANIFEST_NETWORK_ALLOWED_HOST_UNDESCORE, platformAppManifestSchemaV1),
        ).toThrow();
    });

    it('should detect when action variables have invalid types ', () => {
        expect(() => verifyManifest(MANIFEST_WITH_INVALID_VARIABLE_TYPE, platformAppManifestSchemaV1)).toThrow(
            'VARCHAR',
        );
    });
});

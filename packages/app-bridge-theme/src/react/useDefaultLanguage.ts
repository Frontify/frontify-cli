/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

export const useDefaultLanguage = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(
        appBridge.context('defaultLanguage').subscribe,
        appBridge.context('defaultLanguage').get,
    );
};

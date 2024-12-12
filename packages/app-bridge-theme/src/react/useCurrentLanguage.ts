/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

export const useCurrentLanguage = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(
        appBridge.context('currentLanguage').subscribe,
        appBridge.context('currentLanguage').get,
    );
};

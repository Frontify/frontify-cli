/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

export const useLanguages = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(appBridge.context('languages').subscribe, appBridge.context('languages').get);
};

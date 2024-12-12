/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';

export const useEnabledFeatures = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(
        appBridge.context('enabledFeatures').subscribe,
        appBridge.context('enabledFeatures').get,
    );
};

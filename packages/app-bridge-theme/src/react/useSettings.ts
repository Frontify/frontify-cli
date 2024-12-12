/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';

export const useSettings = <T = Record<string, unknown>>(appBridge: AppBridgeTheme) => {
    const settings = useSyncExternalStore(appBridge.context('settings').subscribe, appBridge.context('settings').get);

    const templateSettings = settings.templateSettings as T;

    return { templateSettings, templateAssets: settings.templateAssets };
};

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';

export const usePortalNavigation = (appBridge: AppBridgeTheme) => {
    const portalNavigation = useSyncExternalStore(
        appBridge.context('portalNavigation').subscribe,
        appBridge.context('portalNavigation').get,
    );

    return portalNavigation ?? [];
};

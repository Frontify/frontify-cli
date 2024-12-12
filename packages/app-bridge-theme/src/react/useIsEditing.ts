/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';

export const useIsEditing = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(appBridge.context('isEditing').subscribe, appBridge.context('isEditing').get);
};

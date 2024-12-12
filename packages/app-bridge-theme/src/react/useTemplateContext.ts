/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type TemplateContext } from '../types';

export const useTemplateContext = (appBridge: AppBridgeTheme): TemplateContext | null => {
    return useSyncExternalStore(appBridge.context('template').subscribe, appBridge.context('template').get);
};

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';
import { hydrateContextDocumentNavigation } from '../registries/commands/HydrateContextDocumentNavigation';
import { type DocumentNavigationItem, type DocumentChildNavigationItem } from '../types/Guideline';

export const useDocumentNavigation = (appBridge: AppBridgeTheme, document: DocumentNavigationItem) => {
    const documentNavigation: Record<number, DocumentChildNavigationItem[] | undefined> = useSyncExternalStore(
        appBridge.context('documentNavigation').subscribe,
        appBridge.context('documentNavigation').get,
    );

    useEffect(() => {
        appBridge.dispatch(hydrateContextDocumentNavigation(document.id()));
    }, [appBridge, document]);

    return documentNavigation ? documentNavigation[document.id()] ?? [] : [];
};

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { AppBridgeTheme } from '../AppBridgeTheme';
import { DocumentPageTargets } from '../types';

export type UseDocumentPageTargetsReturnType = {
    documentPageTargets: Nullable<DocumentPageTargets>;
    isLoading: boolean;
};

export type DocumentPageTargetEvent = {
    action: 'update';
    targets: number[];
    pageIds: number[];
};

export const useDocumentPageTargets = (appBridge: AppBridgeTheme, id: number): UseDocumentPageTargetsReturnType => {
    const [documentPageTargets, setDocumentPageTargets] = useState<Nullable<DocumentPageTargets>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDocumentPageTargets = async () => {
            setIsLoading(true);
            setDocumentPageTargets(await appBridge.getDocumentPageTargets(id));
            setIsLoading(false);
        };

        fetchDocumentPageTargets();
    }, [appBridge, id]);

    useEffect(() => {
        const handleTargetEventUpdates = (event: DocumentPageTargetEvent) => {
            if (event.pageIds.includes(id)) {
                setDocumentPageTargets((previousState) => updateTargets(previousState, event.targets));
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentPageTargetsAction', handleTargetEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageTargetsAction', handleTargetEventUpdates);
        };
    }, [id]);

    return { documentPageTargets, isLoading };
};

const updateTargets = (prevState: Nullable<DocumentPageTargets>, targetIds: number[]) =>
    prevState
        ? {
              ...prevState,
              hasSelectedTargets: targetIds.length > 0,
              targets: prevState.targets.map((target) => ({
                  ...target,
                  target: { ...target.target, checked: targetIds.includes(target.target.id) },
              })),
          }
        : null;

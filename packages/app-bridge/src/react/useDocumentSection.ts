/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useMemo, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type AppBridgeTheme } from '../AppBridgeTheme';
import { filterDocumentSectionsWithUnreadableTitles } from '../helpers';
import { type DocumentSection, type EmitterEvents } from '../types';

const insertDocumentSectionIntoArray = (
    previousDocumentSections: DocumentSection[],
    newDocumentSection: DocumentSection,
    previousDocumentSectionId: Nullable<number>,
) => {
    if (previousDocumentSectionId === null) {
        return [newDocumentSection, ...previousDocumentSections];
    }
    const index = previousDocumentSections.findIndex((section) => section.id === previousDocumentSectionId);
    if (index >= 0) {
        return [
            ...previousDocumentSections.slice(0, index + 1),
            newDocumentSection,
            ...previousDocumentSections.slice(index + 1),
        ];
    }
    return [...previousDocumentSections, newDocumentSection];
};

const updateDocumentSectionInArray = (
    previousDocumentSections: DocumentSection[],
    documentSectionIdToUpdate: number,
    title: Nullable<string>,
    slug: string,
) =>
    previousDocumentSections.map((documentSection) =>
        documentSection.id === documentSectionIdToUpdate ? { ...documentSection, title, slug } : documentSection,
    );

const deleteDocumentSectionFromArray = (previousDocumentSections: DocumentSection[], IdToDelete: number) =>
    previousDocumentSections.filter((documentSection) => documentSection.id !== IdToDelete);

type UseDocumentSectionReturn = {
    /**
     * The complete list of document sections that belong to the document page with the given documentPageId.
     */
    documentSections: DocumentSection[];
    /**
     * A filtered list of document sections which removes any sections that do not have a readable title.
     * Use this array for creating a navigation menu for the document page.
     */
    navigationItems: DocumentSection[];
};

export const useDocumentSection = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentPageId: number,
): UseDocumentSectionReturn => {
    const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
    const navigationItems = useMemo(
        () => filterDocumentSectionsWithUnreadableTitles(documentSections),
        [documentSections],
    );

    useEffect(() => {
        const fetchDocumentSection = async (documentPageId: number) => {
            setDocumentSections(await appBridge.getDocumentSectionsByDocumentPageId(documentPageId));
        };

        fetchDocumentSection(documentPageId);
    }, [appBridge, documentPageId]);

    useEffect(() => {
        const handleDocumentSectionEvent = ({
            action,
            payload,
        }: EmitterEvents['AppBridge:GuidelineDocumentSection:Action']) => {
            if (payload.documentPageId !== documentPageId) {
                return;
            }
            switch (action) {
                case 'add': {
                    const { documentSection, previousDocumentSectionId } = payload;
                    setDocumentSections((previousSections) =>
                        insertDocumentSectionIntoArray(previousSections, documentSection, previousDocumentSectionId),
                    );
                    break;
                }
                case 'update': {
                    const { id, title, slug } = payload;
                    setDocumentSections((previousSections) =>
                        updateDocumentSectionInArray(previousSections, id, title, slug),
                    );
                    break;
                }
                case 'delete': {
                    const { id } = payload;
                    setDocumentSections((previousSections) => deleteDocumentSectionFromArray(previousSections, id));
                    break;
                }
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentSection:Action', handleDocumentSectionEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentSection:Action', handleDocumentSectionEvent);
        };
    }, [documentPageId]);

    return { documentSections, navigationItems };
};

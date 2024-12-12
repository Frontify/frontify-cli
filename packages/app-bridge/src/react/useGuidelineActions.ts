/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import {
    type BrandportalLink,
    type CoverPage,
    type CoverPageCreate,
    type CoverPageUpdate,
    type CoverPageUpdateLegacy,
    type DocumentCategory,
    type DocumentCategoryCreate,
    type DocumentCategoryDelete,
    type DocumentCategoryUpdate,
    type DocumentGroup,
    type DocumentGroupCreate,
    type DocumentGroupDelete,
    type DocumentGroupUpdate,
    type DocumentLibraryCreate,
    type DocumentLibraryDelete,
    type DocumentLibraryUpdate,
    type DocumentLinkCreate,
    type DocumentLinkDelete,
    type DocumentLinkUpdate,
    type DocumentPage,
    type DocumentPageCreate,
    type DocumentPageDelete,
    type DocumentPageUpdate,
    type DocumentStandardCreate,
    type DocumentStandardDelete,
    type DocumentStandardUpdate,
    type EmitterEvents,
} from '../types';

export const useGuidelineActions = (appBridge: AppBridgeTheme) => {
    const createLink = useCallback(
        async (link: DocumentLinkCreate) => {
            const result = await appBridge.createLink(link);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: { ...result, ...(link.documentGroupId && { documentGroupId: link.documentGroupId }) },
                action: 'add',
            });

            if (link.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
                    document: { id: result.id, documentGroupId: link.documentGroupId },
                    action: 'add',
                });
            }

            return result;
        },
        [appBridge],
    );

    const updateLink = useCallback(
        async (link: DocumentLinkUpdate) => {
            const result = await appBridge.updateLink(link);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: { ...result, ...(link.documentGroupId && { documentGroupId: link.documentGroupId }) },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteLink = useCallback(
        async (link: DocumentLinkDelete) => {
            await appBridge.deleteLink(link.id);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: link,
                action: 'delete',
            });

            if (link.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
                    document: { ...link, documentGroupId: link.documentGroupId },
                    action: 'delete',
                });
            }
        },
        [appBridge],
    );

    const createLibrary = useCallback(
        async (library: DocumentLibraryCreate) => {
            const result = await appBridge.createLibrary(library);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: {
                    ...result,
                    ...(library.documentGroupId && { documentGroupId: library.documentGroupId }),
                },
                action: 'add',
            });

            if (library.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
                    document: { id: result.id, documentGroupId: library.documentGroupId },
                    action: 'add',
                });
            }

            return result;
        },
        [appBridge],
    );

    const updateLibrary = useCallback(
        async (library: DocumentLibraryUpdate) => {
            const result = await appBridge.updateLibrary(library);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: {
                    ...result,
                    ...(library.documentGroupId && { documentGroupId: library.documentGroupId }),
                },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteLibrary = useCallback(
        async (library: DocumentLibraryDelete) => {
            await appBridge.deleteLibrary(library.id);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: library,
                action: 'delete',
            });

            if (library.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
                    document: { ...library, documentGroupId: library.documentGroupId },
                    action: 'delete',
                });
            }
        },
        [appBridge],
    );

    const createStandardDocument = useCallback(
        async (document: DocumentStandardCreate) => {
            const result = await appBridge.createStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: {
                    ...result,
                    ...(document.documentGroupId && { documentGroupId: document.documentGroupId }),
                },
                action: 'add',
            });

            if (document.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
                    document: { id: result.id, documentGroupId: document.documentGroupId },
                    action: 'add',
                });
            }

            return result;
        },
        [appBridge],
    );

    const updateStandardDocument = useCallback(
        async (document: DocumentStandardUpdate) => {
            const result = await appBridge.updateStandardDocument(document);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document: {
                    ...result,
                    ...(document.documentGroupId && { documentGroupId: document.documentGroupId }),
                },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteStandardDocument = useCallback(
        async (document: DocumentStandardDelete) => {
            await appBridge.deleteStandardDocument(document.id);

            window.emitter.emit('AppBridge:GuidelineDocument:Action', {
                document,
                action: 'delete',
            });

            if (document.documentGroupId) {
                window.emitter.emit('AppBridge:GuidelineDocumentGroup:DocumentAction', {
                    document: { ...document, documentGroupId: document.documentGroupId },
                    action: 'delete',
                });
            }
        },
        [appBridge],
    );

    const createDocumentGroup = useCallback(
        async (documentGroup: DocumentGroupCreate) => {
            const result = await appBridge.createDocumentGroup(documentGroup);

            window.emitter.emit('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup: result,
                action: 'add',
            });

            return result;
        },
        [appBridge],
    );

    const updateDocumentGroup = useCallback(
        async (documentGroupUpdate: DocumentGroupUpdate) => {
            const documentGroup = await appBridge.updateDocumentGroup(documentGroupUpdate);

            window.emitter.emit('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteDocumentGroup = useCallback(
        async (documentGroup: DocumentGroupDelete) => {
            await appBridge.deleteDocumentGroup(documentGroup.id);

            window.emitter.emit('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup,
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createDocumentPage = useCallback(
        async (documentPage: DocumentPageCreate) => {
            const result = await appBridge.createDocumentPage(documentPage);

            window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: result,
                action: 'add',
            });

            if (documentPage.categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategory:DocumentPageAction', {
                    documentPage: {
                        id: result.id,
                        categoryId: documentPage.categoryId,
                        documentId: documentPage.documentId,
                    },
                    action: 'add',
                });
            }

            return result;
        },
        [appBridge],
    );

    /**
     * A method for page update
     *
     * @param documentPage - {@link DocumentPageUpdate} object
     * @requires id - Indicates page identifier.
     *
     *
     * and at least one of
     *
     * @property  title - Indicates title of a page.
     * @property  documentId - Indicates to witch document the page belongs to.
     * @property  categoryId - Indicates to witch category the page belongs to.
     * @property  visibility - Indicates whether the page is visible only to the editor or everyone.
     * @property  linkUrl - Indicates whether the page is link or not.
     */
    const updateDocumentPage = useCallback(
        async (documentPage: DocumentPageUpdate) => {
            const result = await appBridge.updateDocumentPage(documentPage);

            window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: result,
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteDocumentPage = useCallback(
        async (documentPage: DocumentPageDelete) => {
            await appBridge.deleteDocumentPage(documentPage.id);

            window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: { ...documentPage, categoryId: documentPage.categoryId ?? null },
                action: 'delete',
            });

            if (documentPage.categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategory:DocumentPageAction', {
                    documentPage: {
                        ...documentPage,
                        categoryId: documentPage.categoryId,
                        documentId: documentPage.documentId,
                    },
                    action: 'delete',
                });
            } else {
                window.emitter.emit('AppBridge:GuidelineDocument:DocumentPageAction', {
                    documentPage,
                    action: 'delete',
                });
            }
        },
        [appBridge],
    );

    const duplicateDocumentPage = useCallback(
        async ({ id, documentId, categoryId }: { id: number; documentId: number; categoryId?: number }) => {
            const duplicatedDocumentPage = await appBridge.duplicateDocumentPage(id);

            window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
                documentPage: { ...duplicatedDocumentPage, documentId, categoryId } as unknown as DocumentPage,
                action: 'add',
            });

            if (categoryId) {
                window.emitter.emit('AppBridge:GuidelineDocumentCategory:DocumentPageAction', {
                    documentPage: { id: duplicatedDocumentPage.id, categoryId, documentId },
                    action: 'add',
                });
            }

            return duplicatedDocumentPage;
        },
        [appBridge],
    );

    const createDocumentCategory = useCallback(
        async (category: DocumentCategoryCreate) => {
            const result = await appBridge.createDocumentCategory(category);

            window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory: result,
                action: 'add',
            });

            window.emitter.emit('AppBridge:GuidelineDocument:DocumentCategoryAction', {
                documentCategory: result,
                action: 'add',
            });

            return result;
        },
        [appBridge],
    );

    const updateDocumentCategory = useCallback(
        async (category: DocumentCategoryUpdate) => {
            const documentCategory = await appBridge.updateDocumentCategory(category);

            window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const deleteDocumentCategory = useCallback(
        async (documentCategory: DocumentCategoryDelete) => {
            await appBridge.deleteDocumentCategory(documentCategory.id);

            window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory,
                action: 'delete',
            });

            window.emitter.emit('AppBridge:GuidelineDocument:DocumentCategoryAction', {
                documentCategory,
                action: 'delete',
            });
        },
        [appBridge],
    );

    const createCoverPage = useCallback(
        async (coverPage: CoverPageCreate) => {
            const result = await appBridge.createCoverPage(coverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPage:Action', {
                coverPage: result,
                action: 'add',
            });

            return result;
        },
        [appBridge],
    );

    const updateCoverPage = useCallback(
        async (coverPage: CoverPageUpdate) => {
            const result = await appBridge.updateCoverPage(coverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPage:Action', {
                coverPage: result,
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    /**
     * @deprecated legacy method, should be removed once new endpoint is available
     */
    const updateLegacyCoverPage = useCallback(
        async (coverPage: Partial<CoverPage>) => {
            const legacyCoverPage: CoverPageUpdateLegacy = {
                ...(coverPage.title && { brandhome_title: coverPage.title }),
                ...(coverPage.draft !== undefined && { brandhome_draft: coverPage.draft }),
                ...(coverPage.hideInNav !== undefined && { brandhome_hide_in_nav: coverPage.hideInNav }),
            };

            const result = await appBridge.updateLegacyCoverPage(legacyCoverPage);

            window.emitter.emit('AppBridge:GuidelineCoverPage:Action', {
                coverPage: coverPage as CoverPage,
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const deleteCoverPage = useCallback(async () => {
        await appBridge.deleteCoverPage();

        window.emitter.emit('AppBridge:GuidelineCoverPage:Action', {
            action: 'delete',
        });
    }, [appBridge]);

    const updateBrandportalLink = useCallback(
        async (brandportalLink: Partial<BrandportalLink>) => {
            const result = await appBridge.updateBrandportalLink(brandportalLink);

            if (result) {
                window.emitter.emit('AppBridge:GuidelineBrandportalLink:Action', {
                    brandportalLink: result as BrandportalLink,
                    action: 'update',
                });
            }

            return result;
        },
        [appBridge],
    );

    const moveDocument = useCallback(
        async (
            document: { id: number; sort?: Nullable<number>; documentGroupId?: Nullable<number> },
            position: number,
            newGroupId?: number,
        ) => {
            const previewUpdateChannel: keyof EmitterEvents = 'AppBridge:GuidelineDocument:MoveEvent';
            window.emitter.emit(previewUpdateChannel, {
                document,
                position,
                newGroupId,
                action: 'movePreview',
            });

            const result = await appBridge.moveDocument(document.id, position, newGroupId);

            const channel: keyof EmitterEvents = 'AppBridge:GuidelineDocument:Action';

            // Emits in `useDocumentGroups` hook
            if (document.documentGroupId === newGroupId) {
                window.emitter.emit(channel, {
                    document: { ...result, sort: position },
                    action: 'move',
                });
            } else {
                window.emitter.emit(channel, {
                    document,
                    action: 'delete',
                });

                window.emitter.emit(channel, {
                    document: result,
                    action: 'add',
                });
            }
        },
        [appBridge],
    );

    const moveDocumentGroup = useCallback(
        async (documentGroup: { id: number; sort?: Nullable<number> }, position: number) => {
            const previewUpdateChannel: keyof EmitterEvents = 'AppBridge:GuidelineDocumentGroup:MoveEvent';
            window.emitter.emit(previewUpdateChannel, {
                documentGroup,
                position,
                action: 'movePreview',
            });

            await appBridge.moveDocumentGroup(documentGroup.id, position);

            window.emitter.emit('AppBridge:GuidelineDocumentGroup:Action', {
                documentGroup: { ...documentGroup, sort: position } as DocumentGroup,
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentCategory = useCallback(
        async (documentCategory: { id: number; sort?: Nullable<number> }, documentId: number, position: number) => {
            const previewUpdateChannel: keyof EmitterEvents = 'AppBridge:GuidelineDocumentCategory:MoveEvent';
            window.emitter.emit(previewUpdateChannel, {
                documentCategory,
                documentId,
                position,
                action: 'movePreview',
            });

            await appBridge.moveDocumentCategory(documentCategory.id, documentId, position);

            window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
                documentCategory: { ...documentCategory, documentId, sort: position } as DocumentCategory,
                action: 'update',
            });
        },
        [appBridge],
    );

    const moveDocumentPage = useCallback(
        async (
            documentPage: {
                id: number;
                documentId: number;
                sort?: Nullable<number>;
                categoryId?: Nullable<number>;
            },
            documentId: number,
            position?: number,
            categoryId: Nullable<number> = null,
        ) => {
            const previewUpdateChannel: keyof EmitterEvents = 'AppBridge:GuidelineDocumentPage:MoveEvent';
            window.emitter.emit(previewUpdateChannel, {
                documentPage,
                documentId,
                position,
                categoryId,
                action: 'movePreview',
            });

            const result = await appBridge.moveDocumentPage(
                documentPage.id,
                documentId,
                position,
                categoryId ?? undefined,
            );

            const channel: keyof EmitterEvents = 'AppBridge:GuidelineDocumentPage:Action';

            // Emits in `useCategorizedDocumentPages` and `useUncategorizedDocumentPages` hooks
            if (documentPage.categoryId === categoryId && documentPage.documentId === documentId) {
                window.emitter.emit(channel, {
                    documentPage: { ...result, sort: position ?? result.sort },
                    action: 'move',
                });
            } else {
                window.emitter.emit(channel, {
                    documentPage: { ...documentPage, categoryId: documentPage.categoryId ?? null },
                    action: 'delete',
                });

                window.emitter.emit(channel, {
                    documentPage: result,
                    action: 'add',
                });
            }

            // Emits in `useDocumentCategories` and `useDocuments` hook
            const deleteChannel = documentPage.categoryId
                ? 'AppBridge:GuidelineDocumentCategory:DocumentPageAction'
                : 'AppBridge:GuidelineDocument:DocumentPageAction';

            const addChannel = result.categoryId
                ? 'AppBridge:GuidelineDocumentCategory:DocumentPageAction'
                : 'AppBridge:GuidelineDocument:DocumentPageAction';

            window.emitter.emit(deleteChannel, { documentPage, action: 'delete' });
            window.emitter.emit(addChannel, { documentPage: result, action: 'add' });
        },
        [appBridge],
    );

    const updateDocumentPageTargets = useCallback(
        async (targets: number[], documentPageIds: number[]) => {
            const result = await appBridge.updateDocumentPageTargets(targets, documentPageIds);

            window.emitter.emit('AppBridge:GuidelineDocumentPageTargets:Action', {
                payload: { targets, pageIds: documentPageIds },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    const updateDocumentTargets = useCallback(
        async (targets: number[], documentIds: number[]) => {
            const result = await appBridge.updateDocumentTargets(targets, documentIds);

            window.emitter.emit('AppBridge:GuidelineDocumentTargets:Action', {
                payload: { targets, documentIds },
                action: 'update',
            });

            return result;
        },
        [appBridge],
    );

    return {
        createLink,
        updateLink,
        deleteLink,
        createDocumentPage,
        updateDocumentPage,
        deleteDocumentPage,
        duplicateDocumentPage,
        moveDocumentPage,
        createLibrary,
        updateLibrary,
        deleteLibrary,
        createDocumentCategory,
        updateDocumentCategory,
        deleteDocumentCategory,
        moveDocumentCategory,
        createCoverPage,
        updateCoverPage,
        deleteCoverPage,
        updateLegacyCoverPage,
        moveDocumentGroup,
        createDocumentGroup,
        updateDocumentGroup,
        deleteDocumentGroup,
        updateBrandportalLink,
        createDocument: createStandardDocument,
        updateDocument: updateStandardDocument,
        deleteDocument: deleteStandardDocument,
        moveDocument,
        updateDocumentPageTargets,
        updateDocumentTargets,
    };
};

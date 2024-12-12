/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import mitt from 'mitt';
import { type Mock, beforeAll, describe, expect, it, vi } from 'vitest';

import { type AppBridgeBlock, type AppBridgeTheme } from '../';
import { DocumentSectionDummy } from '../tests/DocumentSectionDummy';

import { useDocumentSection } from './useDocumentSection';

const DOCUMENT_PAGE_ID = 45;

const documentSections = [
    DocumentSectionDummy.withFields({ id: 464, title: null }),
    DocumentSectionDummy.withFields({ id: 356, title: 'New Title' }),
    DocumentSectionDummy.withFields({ id: 376, title: ' ' }),
    DocumentSectionDummy.withFields({ id: 174, title: '' }),
];

describe('useDocumentSection', () => {
    const appBridge: AppBridgeBlock | AppBridgeTheme = {} as AppBridgeBlock | AppBridgeTheme;

    beforeAll(() => {
        window.emitter = mitt();
        appBridge.getDocumentSectionsByDocumentPageId = vi.fn().mockResolvedValue(documentSections);
    });

    it('should return the document sections from appBridge', async () => {
        const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

        await waitFor(() => {
            expect(result.current.documentSections).toEqual(documentSections);
        });
    });

    it('should filter sections with null and unreadable titles from navigation items', async () => {
        const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

        await waitFor(() => {
            expect(result.current.navigationItems).toEqual([documentSections[1]]);
        });
    });

    it('should add and remove event listener correctly', () => {
        vi.spyOn(window.emitter, 'on');
        vi.spyOn(window.emitter, 'off');

        const { unmount } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

        const handleSectionEvent = (window.emitter.on as Mock).mock.calls[0][1];

        expect(window.emitter.on).toHaveBeenCalledWith('AppBridge:GuidelineDocumentSection:Action', handleSectionEvent);

        unmount();

        expect(window.emitter.off).toHaveBeenCalledWith(
            'AppBridge:GuidelineDocumentSection:Action',
            handleSectionEvent,
        );
    });

    describe('when a document section is added', () => {
        it('should add the document section to the start of the documentSections if previousSectionId is null', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    documentSection: NEW_SECTION,
                    previousDocumentSectionId: null,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([NEW_SECTION, ...documentSections]);
                expect(result.current.navigationItems).toEqual([NEW_SECTION, documentSections[1]]);
            });
        });

        it('should add the document section after the section matching previousSectionId', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    documentSection: NEW_SECTION,
                    previousDocumentSectionId: documentSections[1].id,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([
                    documentSections[0],
                    documentSections[1],
                    NEW_SECTION,
                    documentSections[2],
                    documentSections[3],
                ]);
                expect(result.current.navigationItems).toEqual([documentSections[1], NEW_SECTION]);
            });
        });

        it('should not add the document section to the array if the documentPageId is incorrect', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID + 1,
                    documentSection: NEW_SECTION,
                    previousDocumentSectionId: documentSections[1].id,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
                expect(result.current.navigationItems).toEqual([documentSections[1]]);
            });
        });

        it('should add the document section to the end of the array if no section matches previousSectionId', async () => {
            const NEW_SECTION = DocumentSectionDummy.with(535);

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    documentSection: NEW_SECTION,
                    previousDocumentSectionId: 123,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([...documentSections, NEW_SECTION]);
                expect(result.current.navigationItems).toEqual([documentSections[1], NEW_SECTION]);
            });
        });
    });

    describe('when a document section is updated', () => {
        it('should update the document section that matches sectionId', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[1].id,
                title: 'Updated Title',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    id: UPDATED_SECTION.id,
                    title: UPDATED_SECTION.title,
                    slug: UPDATED_SECTION.slug,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([
                    documentSections[0],
                    UPDATED_SECTION,
                    documentSections[2],
                    documentSections[3],
                ]);
                expect(result.current.navigationItems).toEqual([UPDATED_SECTION]);
            });
        });

        it('should remove document section from navigation items if title becomes unreadable', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[1].id,
                title: '  ',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    id: UPDATED_SECTION.id,
                    title: UPDATED_SECTION.title,
                    slug: UPDATED_SECTION.slug,
                },
            });

            await waitFor(() => {
                expect(result.current.navigationItems).toEqual([]);
            });
        });

        it('should add document section to navigation items if title becomes truthy', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[2].id,
                title: 'Updated Title',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    id: UPDATED_SECTION.id,
                    title: UPDATED_SECTION.title,
                    slug: UPDATED_SECTION.slug,
                },
            });

            await waitFor(() => {
                expect(result.current.navigationItems).toEqual([documentSections[1], UPDATED_SECTION]);
            });
        });

        it('should not adjust array if documentPageId is incorrect', async () => {
            const UPDATED_SECTION = DocumentSectionDummy.withFields({
                id: documentSections[2].id,
                title: 'Updated Title',
                slug: 'updated-slug',
            });

            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'update',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID + 1,
                    id: UPDATED_SECTION.id,
                    title: UPDATED_SECTION.title,
                    slug: UPDATED_SECTION.slug,
                },
            });

            await waitFor(() => {
                expect(result.current.navigationItems).toEqual([documentSections[1]]);
            });
        });
    });

    describe('when a document section is deleted', () => {
        it('should remove the section that matches sectionId', async () => {
            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'delete',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID,
                    id: documentSections[1].id,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual([
                    documentSections[0],
                    documentSections[2],
                    documentSections[3],
                ]);
                expect(result.current.navigationItems).toEqual([]);
            });
        });

        it('should not remove document section if documentPageId is incorrect', async () => {
            const { result } = renderHook(() => useDocumentSection(appBridge, DOCUMENT_PAGE_ID));

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
            });

            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'delete',
                payload: {
                    documentPageId: DOCUMENT_PAGE_ID + 1,
                    id: documentSections[1].id,
                },
            });

            await waitFor(() => {
                expect(result.current.documentSections).toEqual(documentSections);
                expect(result.current.navigationItems).toEqual([documentSections[1]]);
            });
        });
    });
});

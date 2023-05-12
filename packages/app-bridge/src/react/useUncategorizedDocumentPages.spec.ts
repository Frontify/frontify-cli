// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { DocumentPageDummy, getAppBridgeThemeStub } from '../tests';
import { useUncategorizedDocumentPages } from './useUncategorizedDocumentPages';
import { DocumentPage } from '../types';

const DOCUMENT_ID = 345346;
const ANOTHER_DOCUMENT_ID = 49385;
const DOCUMENT_PAGE_ID_1 = 24324;
const DOCUMENT_PAGE_ID_2 = 3532;
const DOCUMENT_PAGE_ID_3 = 98954;
const DOCUMENT_PAGE_ID_4 = 68445;
const DOCUMENT_CATEGORY_ID = 34656;

describe('useUncategorizedDocumentPages', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch document pages on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(DOCUMENT_ID);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documentPages).toEqual([
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
            ]);
        });
    });

    it('should not fetch document pages on mount if not enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documentPages).toEqual([]);
    });

    it('should fetch document pages if it gets enabled', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        let enabled = false;

        const { result, rerender } = renderHook(() =>
            useUncategorizedDocumentPages(appBridge, DOCUMENT_ID, { enabled }),
        );

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documentPages).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documentPages).toEqual([
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
            ]);
        });
    });

    it('should update document pages if a page is added in the current document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_4,
            DOCUMENT_ID,
            null,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_4, DOCUMENT_ID, null),
            ]),
        );

        // Trigger a "document page added" event in the current document
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'add',
            documentPage: DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_4, DOCUMENT_ID, null),
        ]);
    });

    it('should not update document pages if a page is added in another document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_1,
            ANOTHER_DOCUMENT_ID,
            null,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page added" event from another document
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'add',
            documentPage: DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should not update the document pages if a page is added in a category', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_1,
            DOCUMENT_ID,
            DOCUMENT_CATEGORY_ID,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page added" event from a category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'add',
            documentPage: DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should update document pages if a page is removed from the document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_1,
            DOCUMENT_ID,
            null,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page deleted" event in the current document
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'delete',
            documentPage: {
                id: DOCUMENT_PAGE.id,
                documentId: DOCUMENT_PAGE.documentId,
                categoryId: DOCUMENT_PAGE.categoryId,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should not update document pages if a page is removed from another document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_4,
            ANOTHER_DOCUMENT_ID,
            null,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page deleted" event in the current document
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'delete',
            documentPage: {
                id: DOCUMENT_PAGE.id,
                documentId: DOCUMENT_PAGE.documentId,
                categoryId: DOCUMENT_PAGE.categoryId,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should not update the document pages if a page is removed from a category', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_4,
            DOCUMENT_ID,
            DOCUMENT_CATEGORY_ID,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page deleted" event from another category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'delete',
            documentPage: {
                id: DOCUMENT_PAGE.id,
                documentId: DOCUMENT_PAGE.documentId,
                categoryId: DOCUMENT_PAGE.categoryId,
            },
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should update document pages if a page is updated in the document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const UPDATED_DOCUMENT_PAGE: DocumentPage = {
            ...DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            title: 'Updated title',
        };

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Mock the response of the second call
        spy.mockImplementationOnce(() =>
            Promise.resolve([
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
                UPDATED_DOCUMENT_PAGE,
                DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
            ]),
        );

        // Trigger a "document page updated" event in the specified category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'update',
            documentPage: UPDATED_DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            UPDATED_DOCUMENT_PAGE,
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should not update the document pages if a page is updated from another document', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const UPDATED_DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_4,
            ANOTHER_DOCUMENT_ID,
            DOCUMENT_CATEGORY_ID,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page updated" event from a category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'update',
            documentPage: UPDATED_DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });

    it('should not update the document pages if a page is updated in a category', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUncategorizedDocumentPagesByDocumentId');

        const UPDATED_DOCUMENT_PAGE = DocumentPageDummy.withDocumentAndDocumentCategoryId(
            DOCUMENT_PAGE_ID_4,
            DOCUMENT_ID,
            DOCUMENT_CATEGORY_ID,
        );

        const { result } = renderHook(() => useUncategorizedDocumentPages(appBridge, DOCUMENT_ID));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Trigger a "document page updated" event from a category
        window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
            action: 'update',
            documentPage: UPDATED_DOCUMENT_PAGE,
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledOnce();
        });

        expect(result.current.documentPages).toEqual([
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_1, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_2, DOCUMENT_ID, null),
            DocumentPageDummy.withDocumentAndDocumentCategoryId(DOCUMENT_PAGE_ID_3, DOCUMENT_ID, null),
        ]);
    });
});

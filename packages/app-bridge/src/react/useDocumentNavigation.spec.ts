/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { type DocumentPage, type DocumentSection, type GuidelineDocument, type DocumentCategory } from 'src/types';

import { getAppBridgeThemeStub, DocumentNavigationTreeDummy } from '../tests';

import { useDocumentNavigation } from './useDocumentNavigation';

describe('useDocumentNavigation', () => {
    const testInitialRender = async ({
        expectRefetch,
        options,
    }: {
        expectRefetch: boolean;
        options?: { enabled: boolean };
    }) => {
        const document = <GuidelineDocument>{ id: () => 1138 };
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api').mockResolvedValueOnce(DocumentNavigationTreeDummy.default());

        const { result } = renderHook(() => useDocumentNavigation(appBridge, document, options));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(!expectRefetch);
            expect(result.current.navigationItems).toEqual(expectRefetch ? DocumentNavigationTreeDummy.default() : []);
        });

        if (expectRefetch) {
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith({ name: 'getDocumentNavigation', payload: { document } });
        }
    };

    const testEventHandler = async (emitEvent: () => void) => {
        const document = <GuidelineDocument>{ id: () => 1138 };

        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'api').mockResolvedValue(DocumentNavigationTreeDummy.default());

        const { result } = renderHook(() => useDocumentNavigation(appBridge, document));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.navigationItems).toEqual(DocumentNavigationTreeDummy.default());
        });

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({ name: 'getDocumentNavigation', payload: { document } });

        spy.mockResolvedValueOnce(DocumentNavigationTreeDummy.alternative());

        emitEvent();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(result.current.navigationItems).toEqual(DocumentNavigationTreeDummy.alternative());
        });
    };

    it('should not refetch on render when enabled is set to false', () =>
        testInitialRender({ expectRefetch: false, options: { enabled: false } }));

    it('should refetch on render when enabled is set to true', () =>
        testInitialRender({ expectRefetch: true, options: { enabled: true } }));

    it('should refetch on render when no options are given', () =>
        testInitialRender({ expectRefetch: true, options: undefined }));

    it('should refetch when the "AppBridge:GuidelineDocumentCategory:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentCategory:Action', {
                action: 'add',
                documentCategory: <DocumentCategory>{},
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentCategory:DocumentPageAction" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentCategory:DocumentPageAction', {
                action: 'add',
                documentPage: { categoryId: 0, id: 0, documentId: 0 },
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentCategory:MoveEvent" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentCategory:MoveEvent', {
                action: 'movePreview',
                documentId: 0,
                documentCategory: <DocumentCategory>{},
                position: 0,
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentPage:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPage:Action', {
                action: 'add',
                documentPage: <DocumentPage>{},
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentPage:MoveEvent" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPage:MoveEvent', {
                action: 'movePreview',
                documentId: 0,
                documentPage: <DocumentPage>{},
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentPageTargets:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentPageTargets:Action', {
                action: 'update',
                payload: { targets: [], pageIds: [] },
            });
        }));

    it('should refetch when the "AppBridge:GuidelineDocumentSection:Action" event occurs', () =>
        testEventHandler(() => {
            window.emitter.emit('AppBridge:GuidelineDocumentSection:Action', {
                action: 'add',
                payload: { documentPageId: 0, documentSection: <DocumentSection>{}, previousDocumentSectionId: 0 },
            });
        }));
});

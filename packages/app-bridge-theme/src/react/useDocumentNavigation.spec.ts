/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import {
    type DocumentPageNavigationItem,
    type DocumentChildNavigationItem,
    type DocumentNavigationItem,
} from '../types';

import { useDocumentNavigation } from './useDocumentNavigation';

const DocumentPageDummy = (id: number) =>
    ({
        type: 'document',

        id: () => {
            return id;
        },
        slug: (language: string) => {
            return `dummy-page-slug-${id}-${language}`;
        },

        title: (language: string) => {
            return `Dummy Page title - ${id} - ${language}`;
        },

        url: (language: string) => {
            return `page-${id}-${language}`;
        },
    }) as unknown as DocumentPageNavigationItem;

const DocumentDummy = (id: number, children: DocumentChildNavigationItem[]) =>
    ({
        type: 'document',

        id: () => {
            return id;
        },

        children: () => {
            return children;
        },

        slug: (language: string) => {
            return `dummy-doc-slug-${id}-${language}`;
        },

        title: (language: string) => {
            return `Dummy Doc title - ${id} - ${language}`;
        },

        url: (language: string) => {
            return `https://blah/doc/${id}/${language}`;
        },
    }) as unknown as DocumentNavigationItem;

const DOCUMENT_ID = 120;
const DOCUMENT_ID_2 = 130;
const DOCUMENT_PAGE_ID = 121;
const DOCUMENT_PAGE_ID_2 = 131;

const DOCUMENT_DUMMY = DocumentDummy(DOCUMENT_ID, [DocumentPageDummy(DOCUMENT_PAGE_ID)]);
const DOCUMENT_DUMMY_2 = DocumentDummy(DOCUMENT_ID_2, [DocumentPageDummy(DOCUMENT_PAGE_ID_2)]);
const DOCUMENT_NAVIGATION = {
    [DOCUMENT_ID]: [DocumentPageDummy(DOCUMENT_PAGE_ID)],
};

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
    dispatch: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(DOCUMENT_NAVIGATION),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
        dispatch: stubs.dispatch,
    }) as unknown as AppBridgeTheme;

describe('useDocumentNavigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with DocumentNavigation', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useDocumentNavigation(appBridgeTheme, DOCUMENT_DUMMY));

        expect(stubs.contextStub).toHaveBeenCalled();
        expect(stubs.dispatch).toHaveBeenCalled();
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useDocumentNavigation(appBridgeTheme, DOCUMENT_DUMMY));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial DocumentNavigation state', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useDocumentNavigation(appBridgeTheme, DOCUMENT_DUMMY));

        expect(result.current).toEqual(DOCUMENT_NAVIGATION[DOCUMENT_ID]);
    });

    it('should update the DocumentNavigation state on change', async () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useDocumentNavigation(appBridgeTheme, DOCUMENT_DUMMY));

        expect(result.current).toEqual(DOCUMENT_NAVIGATION[DOCUMENT_ID]);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(DOCUMENT_DUMMY_2);
                stubs.subscribeStub.mock.calls[0][0](DOCUMENT_DUMMY_2);
            }
        });

        expect(stubs.dispatch).toHaveBeenCalled();
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useDocumentNavigation(appBridgeTheme, DOCUMENT_DUMMY));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

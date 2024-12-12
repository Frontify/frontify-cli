/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type CoverPage, type DocumentLibrary, type TemplateContext } from '../types';

import { useTemplateContext } from './useTemplateContext';

const CoverPageDummy = (id: number) =>
    ({
        type: 'cover',

        id: () => {
            return id;
        },
    }) as unknown as CoverPage;

const DocumentLibraryDummy = (id: number) =>
    ({
        type: 'document-library',

        id: () => {
            return id;
        },
    }) as unknown as DocumentLibrary;

const INITIAL_TEMPLATE: TemplateContext = { type: 'cover', coverPage: CoverPageDummy(56), templateId: 'default' };
const UPDATED_TEMPLATE: TemplateContext = {
    type: 'library',
    document: DocumentLibraryDummy(78),
    templateId: 'default',
};

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_TEMPLATE),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useTemplateContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with template', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useTemplateContext(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('template');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useTemplateContext(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial template', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useTemplateContext(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_TEMPLATE);
    });

    it('should update the template on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useTemplateContext(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_TEMPLATE);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_TEMPLATE);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_TEMPLATE);
            }
        });

        expect(result.current).toEqual(UPDATED_TEMPLATE);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useTemplateContext(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type DocumentNavigationItem } from '../types';

import { usePortalNavigation } from './usePortalNavigation';

const DocumentDummy = (id: number) =>
    ({
        type: 'document',

        id: () => {
            return id;
        },
    }) as unknown as DocumentNavigationItem;

const INITIAL_PORTAL_NAVIGATION = [DocumentDummy(532), DocumentDummy(682), DocumentDummy(746)];
const UPDATED_PORTAL_NAVIGATION = [DocumentDummy(8425), DocumentDummy(9634)];

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_PORTAL_NAVIGATION),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('usePortalNavigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with portalNavigation', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => usePortalNavigation(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('portalNavigation');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => usePortalNavigation(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial portalNavigation state', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => usePortalNavigation(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_PORTAL_NAVIGATION);
    });

    it('should update the portalNavigation state on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => usePortalNavigation(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_PORTAL_NAVIGATION);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_PORTAL_NAVIGATION);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_PORTAL_NAVIGATION);
            }
        });

        expect(result.current).toEqual(UPDATED_PORTAL_NAVIGATION);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => usePortalNavigation(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

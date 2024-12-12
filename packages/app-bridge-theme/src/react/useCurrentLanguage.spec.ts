/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useCurrentLanguage } from './useCurrentLanguage';

const INITIAL_LANGUAGE = 'de';
const UPDATED_LANGUAGE = 'es';

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_LANGUAGE),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useCurrentLanguage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with currentLanguage', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useCurrentLanguage(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('currentLanguage');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useCurrentLanguage(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial currentLanguage', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useCurrentLanguage(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_LANGUAGE);
    });

    it('should update the currentLanguage on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useCurrentLanguage(appBridgeTheme));

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_LANGUAGE);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_LANGUAGE);
            }
        });

        expect(result.current).toEqual(UPDATED_LANGUAGE);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useCurrentLanguage(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

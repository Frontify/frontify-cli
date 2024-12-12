/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useDefaultLanguage } from './useDefaultLanguage';

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

describe('useDefaultLanguage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with defaultLanguage', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useDefaultLanguage(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('defaultLanguage');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useDefaultLanguage(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial defaultLanguage', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useDefaultLanguage(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_LANGUAGE);
    });

    it('should update the defaultLanguage on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useDefaultLanguage(appBridgeTheme));

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

        const { unmount } = renderHook(() => useDefaultLanguage(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

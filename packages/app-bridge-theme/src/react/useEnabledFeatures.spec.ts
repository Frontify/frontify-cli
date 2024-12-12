/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useEnabledFeatures } from './useEnabledFeatures';

const INITIAL_ENABLED_FEATURES: string[] = [];
const UPDATED_ENABLED_FEATURES = ['feature1', 'feature2'];

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_ENABLED_FEATURES),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useEnabledFeatures', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with enabledFeatures', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useEnabledFeatures(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('enabledFeatures');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useEnabledFeatures(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial enabled features', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useEnabledFeatures(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_ENABLED_FEATURES);
    });

    it('should update the enabled features on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useEnabledFeatures(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_ENABLED_FEATURES);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_ENABLED_FEATURES);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_ENABLED_FEATURES);
            }
        });

        expect(result.current).toEqual(UPDATED_ENABLED_FEATURES);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useEnabledFeatures(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

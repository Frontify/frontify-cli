/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useSettings } from './useSettings';

const INITIAL_SETTINGS = { templateSettings: { color: 'red' }, templateAssets: { logo: [] } };
const UPDATED_SETTINGS = { templateSettings: { color: 'blue', isSticky: false }, templateAssets: {} };

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_SETTINGS),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with settings', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useSettings(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('settings');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useSettings(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial settings', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useSettings(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_SETTINGS);
    });

    it('should update the settings on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useSettings(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_SETTINGS);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_SETTINGS);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_SETTINGS);
            }
        });

        expect(result.current).toEqual(UPDATED_SETTINGS);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useSettings(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

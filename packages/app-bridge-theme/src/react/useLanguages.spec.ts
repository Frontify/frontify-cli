/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useLanguages } from './useLanguages';

const INITIAL_LANGUAGES = [
    {
        isoCode: 'en',
        name: 'English',
        isDefault: true,
        isDraft: false,
    },
    {
        isoCode: 'de',
        name: 'Deutsch',
        isDefault: false,
        isDraft: false,
    },
];
const UPDATED_LANGUAGES = [
    {
        isoCode: 'en',
        name: 'English',
        isDefault: false,
        isDraft: false,
    },
    {
        isoCode: 'de',
        name: 'Deutsch',
        isDefault: true,
        isDraft: false,
    },
    {
        isoCode: 'fr',
        name: 'Français',
        isDefault: false,
        isDraft: true,
    },
];

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_LANGUAGES),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useLanguages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with languages', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useLanguages(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('languages');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useLanguages(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial languages state', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useLanguages(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_LANGUAGES);
    });

    it('should update the languages state on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useLanguages(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_LANGUAGES);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_LANGUAGES);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_LANGUAGES);
            }
        });

        expect(result.current).toEqual(UPDATED_LANGUAGES);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useLanguages(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

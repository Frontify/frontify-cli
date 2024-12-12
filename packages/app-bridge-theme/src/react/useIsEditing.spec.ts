/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { useIsEditing } from './useIsEditing';

const INITIAL_EDITOR_STATE = false;
const UPDATED_EDITOR_STATE = true;

const stubs = vi.hoisted(() => ({
    contextStub: vi.fn(),
    contextGetStub: vi.fn(),
    subscribeStub: vi.fn(),
    unsubscribeObserverStub: vi.fn(),
}));

const stubbedAppBridgeTheme = () =>
    ({
        context: stubs.contextStub.mockReturnValue({
            get: stubs.contextGetStub.mockReturnValue(INITIAL_EDITOR_STATE),
            subscribe: stubs.subscribeStub.mockReturnValue(stubs.unsubscribeObserverStub),
        }),
    }) as unknown as AppBridgeTheme;

describe('useIsEditing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call the context with isEditing', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useIsEditing(appBridgeTheme));

        expect(stubs.contextStub).toHaveBeenCalledWith('isEditing');
    });

    it('should subscribe to context updates', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        renderHook(() => useIsEditing(appBridgeTheme));

        expect(stubs.subscribeStub).toHaveBeenCalledOnce();
    });

    it('should return the correct initial editor state', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useIsEditing(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_EDITOR_STATE);
    });

    it('should update the editor state on change', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { result } = renderHook(() => useIsEditing(appBridgeTheme));

        expect(result.current).toEqual(INITIAL_EDITOR_STATE);

        act(() => {
            if (vi.isMockFunction(stubs.subscribeStub)) {
                stubs.contextGetStub.mockReturnValue(UPDATED_EDITOR_STATE);
                stubs.subscribeStub.mock.calls[0][0](UPDATED_EDITOR_STATE);
            }
        });

        expect(result.current).toEqual(UPDATED_EDITOR_STATE);
    });

    it('should unsubscribe on unmount', () => {
        const appBridgeTheme = stubbedAppBridgeTheme();

        const { unmount } = renderHook(() => useIsEditing(appBridgeTheme));

        unmount();

        expect(stubs.unsubscribeObserverStub).toHaveBeenCalledOnce();
    });
});

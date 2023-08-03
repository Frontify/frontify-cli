/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { SinonStub } from 'sinon';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AssetDummy, getAppBridgeThemeStub } from '../tests';
import { useThemeAssets } from './useThemeAssets';

describe('useThemeAssets hook', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseThemeAssets = async (existingAssets = [AssetDummy.with(1)]) => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeThemeStub({
            pageTemplateAssets: { key: existingAssets },
        });

        const { result, rerender } = renderHook(() => useThemeAssets(appBridgeStub));

        await act(async () => {
            rerender();
        });

        return { result, appBridgeStub, asset };
    };

    it('should delete an asset', async () => {
        const { result, appBridgeStub } = await loadUseThemeAssets([]);
        await act(async () => {
            await result.current.deleteAssetIdsFromKey('key', [1]);
        });

        const call = appBridgeStub.deleteAssetIdsFromThemeAssetKey.getCall(0);
        await waitFor(() => {
            expect(call.firstArg).toEqual('key');
            expect(call.lastArg).toEqual([1]);
            expect(result.current.themeAssets).toStrictEqual({ key: [] });
        });
    });

    it('should sort assets', async () => {
        const { result, appBridgeStub } = await loadUseThemeAssets([AssetDummy.with(1), AssetDummy.with(2)]);

        await act(async () => {
            await result.current.updateAssetIdsFromKey('key', [2, 1]);
        });

        const deleteCall = appBridgeStub.deleteAssetIdsFromThemeAssetKey.getCall(0);
        const addCall = appBridgeStub.addAssetIdsToThemeAssetKey.getCall(0);

        await waitFor(async () => {
            expect(deleteCall.firstArg).toEqual('key');
            expect(deleteCall.lastArg).toEqual([1, 2]);
            expect(addCall.firstArg).toEqual('key');
            expect(addCall.lastArg).toEqual([2, 1]);
            expect(result.current.themeAssets['key'].map((asset) => asset.id)).toEqual([2, 1]);
        });
    });

    it('should not sort assets if api call throws error', async () => {
        const { result, appBridgeStub } = await loadUseThemeAssets([AssetDummy.with(1), AssetDummy.with(2)]);
        (appBridgeStub.deleteAssetIdsFromThemeAssetKey as unknown as Mock) = vi
            .fn()
            .mockRejectedValue('Unsuccessful API call');

        await act(async () => {
            await result.current.updateAssetIdsFromKey('key', [2, 1]);
        });

        await waitFor(async () => {
            expect(result.current.themeAssets['key'].map((asset) => asset.id)).toEqual([1, 2]);
        });

        expect(console.error).toHaveBeenCalledOnce();
    });

    it('should notify about updated assets on delete', async () => {
        const { result, asset } = await loadUseThemeAssets();

        await act(async () => {
            await result.current.deleteAssetIdsFromKey('key', [1]);
        });

        const call = (window.emitter.emit as SinonStub).getCall(0);

        await waitFor(() => {
            expect(call.firstArg).toEqual('AppBridge:ThemeAssetsUpdated');
            expect(call.lastArg.themeAssets).toStrictEqual({ key: [] });
            expect(call.lastArg.prevThemeAssets).toMatchObject({ key: [asset] });
        });
    });

    it('should add asset ids', async () => {
        const { result, appBridgeStub } = await loadUseThemeAssets();
        await act(async () => {
            await result.current.addAssetIdsToKey('key', [2]);
        });

        const call = appBridgeStub.addAssetIdsToThemeAssetKey.getCall(0);
        await waitFor(() => {
            expect(call.firstArg).toEqual('key');
            expect(call.lastArg).toEqual([2]);
            expect(result.current.themeAssets['key'].map(({ id }) => id)).toEqual([1, 2]);
        });
    });

    it('should notify about updated assets on add asset ids to key', async () => {
        const { result, asset } = await loadUseThemeAssets();
        const assetToAdd = AssetDummy.with(2);
        await act(async () => {
            await result.current.addAssetIdsToKey('key', [assetToAdd.id]);
        });

        const call = (window.emitter.emit as SinonStub).getCall(0);
        await waitFor(() => {
            expect(call.firstArg).toEqual('AppBridge:ThemeAssetsUpdated');
            expect(call.lastArg.themeAssets).toMatchObject({ key: [asset, assetToAdd] });
            expect(call.lastArg.prevThemeAssets).toMatchObject({ key: [asset] });
        });
    });
});

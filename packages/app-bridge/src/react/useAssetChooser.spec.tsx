/* (c) Copyright Frontify Ltd., all rights reserved. */

import React from 'react';
import sinon, { SinonStub } from 'sinon';
import { afterEach, describe, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import type { Asset } from '../types';
import { AppBridgeBlock } from '../AppBridgeBlock';
import { useAssetChooser } from './useAssetChooser';
import { withAppBridgeBlockStubs } from '../tests';

const OPEN_ASSET_CHOOSER_BUTTON_ID = 'open-asset-chooser';
const CLOSE_ASSET_CHOOSER_BUTTON_ID = 'close-asset-chooser';

const AssetChooserDummy = ({
    appBridge,
    onAssetChosen,
}: {
    appBridge: AppBridgeBlock;
    onAssetChosen?: (selectedAssets: Asset[]) => void;
}) => {
    const { openAssetChooser, closeAssetChooser } = useAssetChooser(appBridge);

    return (
        <>
            <button
                data-test-id={OPEN_ASSET_CHOOSER_BUTTON_ID}
                onClick={() => openAssetChooser(onAssetChosen ?? (() => null), {})}
            />
            <button data-test-id={CLOSE_ASSET_CHOOSER_BUTTON_ID} onClick={() => closeAssetChooser()} />
        </>
    );
};

describe('useReadyForPrint hook', () => {
    afterEach(() => {
        cleanup();
    });

    it('should open the asset chooser', async () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(AssetChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openAssetChooserButton = getByTestId(OPEN_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openAssetChooserButton.click();
        await sinon.assert.calledOnce(appBridge.dispatch);
    });

    it.skip('should close the asset chooser', async () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(AssetChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openAssetChooserButton = getByTestId(OPEN_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        const closeAssetChooserButton = getByTestId(CLOSE_ASSET_CHOOSER_BUTTON_ID) as HTMLButtonElement;

        openAssetChooserButton.click();

        const dispatchResponse = await appBridge.dispatch('AssetChooser.Open');
        const closeSpy = dispatchResponse.close;

        closeAssetChooserButton.click();

        await sinon.assert.calledOnce(closeSpy as SinonStub);
    });
});

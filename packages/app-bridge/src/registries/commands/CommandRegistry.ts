/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CommandNameValidator } from '../../AppBridge';
import type { Asset, AssetChooserOptions, OpenNewPublicationPayload } from '../../types';

type OpenAssetChooserPayload = AssetChooserOptions;
type CloseAssetChooserPayload = void;
type OpenAssetViewerPayload = { token: string };
type OpenTemplateChooser = void;
type CloseTemplateChooser = void;
type OpenNavigationManager = void;
type DownloadAsset = Asset;
type DownloadAssets = { downloadUrl: string; assets: Asset[] };

export type CommandRegistry = CommandNameValidator<{
    openAssetChooser?: OpenAssetChooserPayload;
    closeAssetChooser: CloseAssetChooserPayload;
    openAssetViewer: OpenAssetViewerPayload;
    openTemplateChooser: OpenTemplateChooser;
    closeTemplateChooser: CloseTemplateChooser;
    downloadAsset: DownloadAsset;
    downloadAssets: DownloadAssets;
    openNavigationManager: OpenNavigationManager;
    openNewPublication: OpenNewPublicationPayload;
}>;

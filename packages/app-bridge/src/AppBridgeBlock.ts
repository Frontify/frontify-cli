/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    Asset,
    AssetChooserOptions,
    Color,
    ColorCreate,
    ColorPalette,
    ColorPaletteCreate,
    ColorPalettePatch,
    ColorPatch,
    Template,
    User,
    GenerateBulkDownloadTokenRequest,
    BulkDownload,
} from './types';

export interface AppBridgeBlock {
    getBlockId(): number;

    getSectionId(): number | undefined;

    getProjectId(): number;

    getTranslationLanguage(): string;

    getEditorState(): boolean;

    getBlockAssets(): Promise<Record<string, Asset[]>>;

    getAssetById(assetId: number): Promise<Asset>;

    deleteAssetIdsFromBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    addAssetIdsToBlockAssetKey(key: string, assetIds: number[]): Promise<void>;

    openAssetViewer(token: string): void;

    getTemplateById(templateId: number): Promise<Template>;

    getColorsByIds(colorIds: number[]): Promise<Color[]>;

    getColors(): Promise<Color[]>;

    /**
     * @deprecated Use `getColors` instead.
     */
    getAvailableColors(): Promise<Color[]>;

    /**
     * @deprecated Use `getColorPalettes` instead.
     */
    getAvailablePalettes(): Promise<ColorPalette[]>;

    getColorPalettes(): Promise<ColorPalette[]>;

    getColorPalettesWithColors(colorPaletteIds?: number[]): Promise<ColorPalette[]>;

    getColorsByColorPaletteId(colorPaletteId: number): Promise<Color[]>;

    createColorPalette(colorPaletteCreate: ColorPaletteCreate): Promise<ColorPalette>;

    updateColorPalette(colorPaletteId: number, colorPalettePatch: ColorPalettePatch): Promise<ColorPalette>;

    deleteColorPalette(colorPaletteId: number): Promise<void>;

    createColor(colorCreate: ColorCreate): Promise<Color>;

    updateColor(colorId: number, colorPatch: ColorPatch): Promise<Color>;

    deleteColor(colorId: number): Promise<void>;

    downloadColorKit(selectedColorPalettes: number[]): string;

    getBlockSettings<T = Record<string, unknown>>(): Promise<T>;

    updateBlockSettings<T = Record<string, unknown>>(newSettings: T): Promise<void>;

    openAssetChooser(callback: (selectedAssets: Asset[]) => void, options?: AssetChooserOptions): void;

    closeAssetChooser(): void;

    openTemplateChooser(callback: (selectedTemplate: Template) => void): void;

    closeTemplateChooser(): void;

    getCurrentLoggedUser(): Promise<User>;

    generateBulkDownloadToken(data: GenerateBulkDownloadTokenRequest): Promise<string>;

    generateBulkDownloadRequest(token: string): Promise<string>;

    getBulkDownloadBySignature(signature: string): Promise<BulkDownload>;
}

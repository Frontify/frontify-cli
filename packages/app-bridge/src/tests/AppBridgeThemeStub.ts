/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt, { type Emitter } from 'mitt';
import { type SinonStubbedInstance, spy, stub } from 'sinon';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type Asset, type ThemeTemplate } from '../types';
import { type EmitterEvents } from '../types/Emitter';
import { mergeDeep } from '../utilities';

import { GuidelineSearchResultDummy } from './GuidelineSearchResultDummy';

import {
    AssetDummy,
    BrandportalLinkDummy,
    ColorDummy,
    ColorPaletteDummy,
    CoverPageDummy,
    DocumentCategoryDummy,
    DocumentDummy,
    DocumentGroupDummy,
    DocumentPageDummy,
    DocumentPageTargetsDummy,
    DocumentSectionDummy,
    DocumentTargetsDummy,
    UpdateTargetsDummy,
} from '.';

const BRAND_ID = 234551;
const PROJECT_ID = 3452;
const PORTAL_ID = 7777;
const DOCUMENT_GROUP_ID_1 = 5332;
const DOCUMENT_GROUP_ID_2 = 95694;
const DOCUMENT_GROUP_ID_3 = 345882;
const DOCUMENT_ID_1 = 6456;
const DOCUMENT_ID_2 = 34532;
const DOCUMENT_ID_3 = 3455345;
const DOCUMENT_ID_4 = 2342;
const DOCUMENT_ID_5 = 2343445;
const GROUPED_DOCUMENT_ID_1 = 2434;
const GROUPED_DOCUMENT_ID_2 = 552;
const GROUPED_DOCUMENT_ID_3 = 1145;
const GROUPED_DOCUMENT_ID_4 = 32345;
const DOCUMENT_CATEGORY_ID_1 = 147;
const DOCUMENT_CATEGORY_ID_2 = 258;
const DOCUMENT_CATEGORY_ID_3 = 369;
const DOCUMENT_PAGE_ID_1 = 23442;
const DOCUMENT_PAGE_ID_2 = 235345;
const DOCUMENT_PAGE_ID_3 = 12352;
const DOCUMENT_PAGE_ID_4 = 55221;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_1 = 24324;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_2 = 3532;
const UNCATEGORIZED_DOCUMENT_PAGE_ID_3 = 98954;
const DOCUMENT_SECTION_ID_1 = 3421;
const DOCUMENT_SECTION_ID_2 = 65725;
const DOCUMENT_SECTION_ID_3 = 95934;
const DOCUMENT_PAGE_DUPLICATE_ID_1 = 2341;
const TARGET_ID_1 = 653543;
const TARGET_ID_2 = 23411;
const TARGET_ID_3 = 56657;

export type getAppBridgeThemeStubProps = {
    editorState?: boolean;
    brandId?: number;
    portalId?: number;
    projectId?: number;
    pageTemplateSettings?: Record<string, unknown>;
    pageTemplateAssets?: Record<string, Asset[]>;
    themeSettings?: Record<ThemeTemplate, Record<string, unknown>>;
    themeAssets?: Record<string, Asset[]>;
    language?: string;
    openAssetChooser?: (callback: Parameters<AppBridgeTheme['openAssetChooser']>[0]) => void;
    closeAssetChooser?: () => void;
};

export const getAppBridgeThemeStub = ({
    editorState = false,
    brandId = BRAND_ID,
    portalId = PORTAL_ID,
    projectId = PROJECT_ID,
    pageTemplateSettings = {},
    pageTemplateAssets = {},
    themeSettings = { cover: {}, documentPage: {}, library: {} },
    themeAssets = {},
    language = 'en',
    openAssetChooser = () => null,
    closeAssetChooser = () => null,
}: getAppBridgeThemeStubProps = {}): SinonStubbedInstance<AppBridgeTheme> => {
    window.emitter = spy(mitt()) as unknown as Emitter<EmitterEvents>;

    let localPageTemplateSettings = pageTemplateSettings;
    let localThemeSettings = themeSettings;

    const deletedAssetIds: Record<string, number[]> = {};
    const addedAssetIds: Record<string, number[]> = {};

    const getAssets = async (themeOrTemplateAssets: Record<string, Asset[]>) => {
        return Object.entries(themeOrTemplateAssets).reduce<Record<string, Asset[]>>((assetsDiff, [key, assets]) => {
            const addedAssetIdsList = addedAssetIds[key] ?? [];
            const deletedAssetIdsList = deletedAssetIds[key] ?? [];
            assetsDiff[key] = [
                ...assets.filter((asset) => !deletedAssetIdsList.includes(asset.id)),
                ...addedAssetIdsList.map((id) => AssetDummy.with(id)),
            ];
            return assetsDiff;
        }, {});
    };

    const getTemplateAssets = async () => getAssets(pageTemplateAssets);

    const getThemeAssets = async () => getAssets(themeAssets);

    return {
        getPortalId: stub<Parameters<AppBridgeTheme['getPortalId']>>().returns(portalId),
        getProjectId: stub<Parameters<AppBridgeTheme['getProjectId']>>().returns(projectId),
        getEditorState: stub<Parameters<AppBridgeTheme['getEditorState']>>().returns(editorState),
        getCoverPage: stub<Parameters<AppBridgeTheme['getCoverPage']>>().resolves(CoverPageDummy.with(PORTAL_ID)),
        getAllDocuments: stub<Parameters<AppBridgeTheme['getAllDocuments']>>().resolves([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]),
        getUngroupedDocuments: stub<Parameters<AppBridgeTheme['getUngroupedDocuments']>>().resolves([
            DocumentDummy.with(DOCUMENT_ID_1),
            DocumentDummy.with(DOCUMENT_ID_2),
            DocumentDummy.with(DOCUMENT_ID_3),
            DocumentDummy.with(DOCUMENT_ID_4),
            DocumentDummy.with(DOCUMENT_ID_5),
        ]),
        getDocumentsByDocumentGroupId: stub<Parameters<AppBridgeTheme['getDocumentsByDocumentGroupId']>>().resolves([
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_1, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_2, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_3, DOCUMENT_GROUP_ID_1),
            DocumentDummy.withDocumentGroupId(GROUPED_DOCUMENT_ID_4, DOCUMENT_GROUP_ID_1),
        ]),
        getDocumentGroups: stub<Parameters<AppBridgeTheme['getDocumentGroups']>>().resolves([
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_1, 3),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_2, 0),
            DocumentGroupDummy.with(DOCUMENT_GROUP_ID_3, 2),
        ]),
        getDocumentPagesByDocumentId: stub<Parameters<AppBridgeTheme['getDocumentPagesByDocumentId']>>().resolves([
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_1),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_3),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_2),
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_4),
            DocumentPageDummy.with(UNCATEGORIZED_DOCUMENT_PAGE_ID_3),
        ]),
        getDocumentPagesByDocumentCategoryId: stub<
            Parameters<AppBridgeTheme['getDocumentPagesByDocumentCategoryId']>
        >().callsFake((documentCategoryId) =>
            Promise.resolve([
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_1, categoryId: documentCategoryId, sort: 1 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_2, categoryId: documentCategoryId, sort: 2 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_3, categoryId: documentCategoryId, sort: 3 }),
                DocumentPageDummy.withFields({ id: DOCUMENT_PAGE_ID_4, categoryId: documentCategoryId, sort: 4 }),
            ]),
        ),
        getDocumentCategoriesByDocumentId: stub<
            Parameters<AppBridgeTheme['getDocumentCategoriesByDocumentId']>
        >().callsFake((documentId) =>
            Promise.resolve([
                DocumentCategoryDummy.withDocumentIdAndNumberOfDocumentPages(DOCUMENT_CATEGORY_ID_1, documentId, 2),
                DocumentCategoryDummy.withDocumentIdAndNumberOfDocumentPages(DOCUMENT_CATEGORY_ID_2, documentId, 0),
                DocumentCategoryDummy.withDocumentIdAndNumberOfDocumentPages(DOCUMENT_CATEGORY_ID_3, documentId, 2),
            ]),
        ),
        getUncategorizedDocumentPagesByDocumentId: stub<
            Parameters<AppBridgeTheme['getUncategorizedDocumentPagesByDocumentId']>
        >().callsFake((documentId) =>
            Promise.resolve([
                DocumentPageDummy.withFields({
                    id: UNCATEGORIZED_DOCUMENT_PAGE_ID_1,
                    documentId,
                    categoryId: null,
                    sort: 1,
                }),
                DocumentPageDummy.withFields({
                    id: UNCATEGORIZED_DOCUMENT_PAGE_ID_2,
                    documentId,
                    categoryId: null,
                    sort: 2,
                }),
                DocumentPageDummy.withFields({
                    id: UNCATEGORIZED_DOCUMENT_PAGE_ID_3,
                    documentId,
                    categoryId: null,
                    sort: 3,
                }),
            ]),
        ),
        getDocumentSectionsByDocumentPageId: stub<
            Parameters<AppBridgeTheme['getDocumentSectionsByDocumentPageId']>
        >().resolves([
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_1),
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_2),
            DocumentSectionDummy.with(DOCUMENT_SECTION_ID_3),
        ]),
        getColorPalettes: stub<Parameters<AppBridgeTheme['getColorPalettes']>>().resolves([
            ColorPaletteDummy.with(678, 'Palette 1'),
            ColorPaletteDummy.with(427, 'Palette 2'),
            ColorPaletteDummy.with(679, 'Palette 3'),
        ]),
        getColorsByColorPaletteId: stub<Parameters<AppBridgeTheme['getColorsByColorPaletteId']>>().resolves([
            ColorDummy.red(9834),
            ColorDummy.green(342),
            ColorDummy.yellow(9314),
        ]),
        duplicateDocumentPage: stub<Parameters<AppBridgeTheme['duplicateDocumentPage']>>().resolves(
            DocumentPageDummy.with(DOCUMENT_PAGE_DUPLICATE_ID_1),
        ),
        getDocumentTargets: stub<Parameters<AppBridgeTheme['getDocumentTargets']>>().resolves(
            DocumentTargetsDummy.with(DOCUMENT_ID_1),
        ),
        getDocumentPageTargets: stub<Parameters<AppBridgeTheme['getDocumentPageTargets']>>().resolves(
            DocumentPageTargetsDummy.with(DOCUMENT_PAGE_ID_1),
        ),
        addAssetIdsToCoverPageTemplateAssetKey: stub<
            Parameters<AppBridgeTheme['addAssetIdsToCoverPageTemplateAssetKey']>
        >().callsFake(async (key: string, assetsIds: number[]) => {
            addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
            return pageTemplateAssets;
        }),
        addAssetIdsToThemeAssetKey: stub<Parameters<AppBridgeTheme['addAssetIdsToThemeAssetKey']>>().callsFake(
            async (key: string, assetsIds: number[]) => {
                addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
                return pageTemplateAssets;
            },
        ),
        addAssetIdsToLibraryPageTemplateAssetKey: stub<
            Parameters<AppBridgeTheme['addAssetIdsToLibraryPageTemplateAssetKey']>
        >().callsFake(async (_documentId: number, key: string, assetsIds: number[]) => {
            addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
            return pageTemplateAssets;
        }),
        addAssetIdsToDocumentPageTemplateAssetKey: stub<
            Parameters<AppBridgeTheme['addAssetIdsToDocumentPageTemplateAssetKey']>
        >().callsFake(async (_documentPageId: number, key: string, assetsIds: number[]) => {
            addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
            return pageTemplateAssets;
        }),
        getCoverPageTemplateAssets:
            stub<Parameters<AppBridgeTheme['getCoverPageTemplateAssets']>>().callsFake(getTemplateAssets),
        getThemeAssets: stub<Parameters<AppBridgeTheme['getThemeAssets']>>().callsFake(getThemeAssets),
        getLibraryPageTemplateAssets:
            stub<Parameters<AppBridgeTheme['getLibraryPageTemplateAssets']>>().callsFake(getTemplateAssets),
        getDocumentPageTemplateAssets:
            stub<Parameters<AppBridgeTheme['getDocumentPageTemplateAssets']>>().callsFake(getTemplateAssets),
        deleteAssetIdsFromCoverPageTemplateAssetKey: stub<
            Parameters<AppBridgeTheme['deleteAssetIdsFromCoverPageTemplateAssetKey']>
        >().callsFake(async (key, assetIds) => {
            deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
        }),
        deleteAssetIdsFromThemeAssetKey: stub<
            Parameters<AppBridgeTheme['deleteAssetIdsFromThemeAssetKey']>
        >().callsFake(async (key, assetIds) => {
            deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
        }),
        deleteAssetIdsFromLibraryPageTemplateAssetKey: stub<
            Parameters<AppBridgeTheme['deleteAssetIdsFromLibraryPageTemplateAssetKey']>
        >().callsFake(async (_documentId: number, key, assetIds) => {
            deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
        }),
        deleteAssetIdsFromDocumentPageTemplateAssetKey: stub<
            Parameters<AppBridgeTheme['deleteAssetIdsFromDocumentPageTemplateAssetKey']>
        >().callsFake(async (_documentPageId: number, key, assetIds) => {
            deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
        }),
        getCoverPageTemplateSettings:
            stub<Parameters<AppBridgeTheme['getCoverPageTemplateSettings']>>().resolves(localPageTemplateSettings),
        getDocumentPageTemplateSettings:
            stub<Parameters<AppBridgeTheme['getDocumentPageTemplateSettings']>>().resolves(localPageTemplateSettings),
        getLibraryPageTemplateSettings:
            stub<Parameters<AppBridgeTheme['getLibraryPageTemplateSettings']>>().resolves(localPageTemplateSettings),
        getThemeSettings: stub<Parameters<AppBridgeTheme['getThemeSettings']>>().resolves(localThemeSettings),
        createLink: stub<Parameters<AppBridgeTheme['createLink']>>().resolves(DocumentDummy.with(1)),
        createLibrary: stub<Parameters<AppBridgeTheme['createLibrary']>>().resolves(DocumentDummy.with(1)),
        createStandardDocument: stub<Parameters<AppBridgeTheme['createStandardDocument']>>().resolves(
            DocumentDummy.with(1),
        ),
        createDocumentPage: stub<Parameters<AppBridgeTheme['createDocumentPage']>>().resolves(
            DocumentPageDummy.with(1),
        ),
        createDocumentGroup: stub<Parameters<AppBridgeTheme['createDocumentGroup']>>().resolves(
            DocumentGroupDummy.with(1, 0),
        ),
        createDocumentCategory: stub<Parameters<AppBridgeTheme['createDocumentCategory']>>().resolves(
            DocumentCategoryDummy.with(1),
        ),
        createCoverPage: stub<Parameters<AppBridgeTheme['createCoverPage']>>().resolves(CoverPageDummy.with(1)),
        updateLink: stub<Parameters<AppBridgeTheme['updateLink']>>().resolves(DocumentDummy.with(1)),
        updateLibrary: stub<Parameters<AppBridgeTheme['updateLibrary']>>().resolves(DocumentDummy.with(1)),
        updateStandardDocument: stub<Parameters<AppBridgeTheme['updateStandardDocument']>>().resolves(
            DocumentDummy.with(1),
        ),
        updateDocumentPage: stub<Parameters<AppBridgeTheme['updateDocumentPage']>>().resolves(
            DocumentPageDummy.with(1),
        ),
        updateDocumentGroup: stub<Parameters<AppBridgeTheme['updateDocumentGroup']>>().resolves(
            DocumentGroupDummy.with(1, 0),
        ),
        updateDocumentCategory: stub<Parameters<AppBridgeTheme['updateDocumentCategory']>>().resolves(
            DocumentCategoryDummy.with(1),
        ),
        updateCoverPage: stub<Parameters<AppBridgeTheme['updateCoverPage']>>().resolves(CoverPageDummy.with(1)),
        updateLegacyCoverPage: stub<Parameters<AppBridgeTheme['updateLegacyCoverPage']>>().resolves(
            CoverPageDummy.withLegacy(1),
        ),
        updateBrandportalLink: stub<Parameters<AppBridgeTheme['updateBrandportalLink']>>().resolves(
            BrandportalLinkDummy.with(),
        ),
        updateCoverPageTemplateSettings: stub<
            Parameters<AppBridgeTheme['updateCoverPageTemplateSettings']>
        >().callsFake(async (pageTemplateSettingsUpdate) => {
            localPageTemplateSettings = mergeDeep(localPageTemplateSettings, pageTemplateSettingsUpdate);
        }),
        updateDocumentPageTemplateSettings: stub<
            Parameters<AppBridgeTheme['updateDocumentPageTemplateSettings']>
        >().callsFake(async (pageTemplateSettingsUpdate) => {
            localPageTemplateSettings = mergeDeep(localPageTemplateSettings, pageTemplateSettingsUpdate);
        }),
        updateLibraryPageTemplateSettings: stub<
            Parameters<AppBridgeTheme['updateLibraryPageTemplateSettings']>
        >().callsFake(async (pageTemplateSettingsUpdate) => {
            localPageTemplateSettings = mergeDeep(localPageTemplateSettings, pageTemplateSettingsUpdate);
        }),
        updateThemeSettings: stub<Parameters<AppBridgeTheme['updateThemeSettings']>>().callsFake(
            async (themeSettingsUpdate) => {
                localThemeSettings = mergeDeep(localThemeSettings, themeSettingsUpdate);
            },
        ),
        deleteCoverPage: stub<Parameters<AppBridgeTheme['deleteCoverPage']>>().resolves(),
        deleteDocumentCategory: stub<Parameters<AppBridgeTheme['deleteDocumentCategory']>>().resolves(),
        deleteDocumentGroup: stub<Parameters<AppBridgeTheme['deleteDocumentGroup']>>().resolves(),
        deleteDocumentPage: stub<Parameters<AppBridgeTheme['deleteDocumentPage']>>().resolves(),
        deleteLibrary: stub<Parameters<AppBridgeTheme['deleteLibrary']>>().resolves(),
        deleteLink: stub<Parameters<AppBridgeTheme['deleteLink']>>().resolves(),
        deleteStandardDocument: stub<Parameters<AppBridgeTheme['deleteStandardDocument']>>().resolves(),
        getBrandId: stub<Parameters<AppBridgeTheme['getBrandId']>>().returns(brandId),
        getBrandportalLink: stub<Parameters<AppBridgeTheme['getBrandportalLink']>>().resolves(
            BrandportalLinkDummy.with(),
        ),
        getTranslationLanguage: stub<Parameters<AppBridgeTheme['getTranslationLanguage']>>().returns(language),
        moveDocument: stub<Parameters<AppBridgeTheme['moveDocument']>>().resolves(DocumentDummy.with(DOCUMENT_ID_1)),
        moveDocumentCategory: stub<Parameters<AppBridgeTheme['moveDocumentCategory']>>().resolves(
            DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID_1),
        ),
        moveDocumentGroup: stub<Parameters<AppBridgeTheme['moveDocumentGroup']>>().resolves(
            DocumentGroupDummy.with(DOCUMENT_CATEGORY_ID_1, 0),
        ),
        moveDocumentPage: stub<Parameters<AppBridgeTheme['moveDocumentPage']>>().resolves(
            DocumentPageDummy.with(DOCUMENT_PAGE_ID_1),
        ),
        openNavigationManager: stub<Parameters<AppBridgeTheme['openNavigationManager']>>(),
        updateDocumentPageTargets: stub<Parameters<AppBridgeTheme['updateDocumentPageTargets']>>().resolves(
            UpdateTargetsDummy.with([TARGET_ID_1, TARGET_ID_2, TARGET_ID_3]),
        ),
        updateDocumentTargets: stub<Parameters<AppBridgeTheme['updateDocumentTargets']>>().resolves(
            UpdateTargetsDummy.with([TARGET_ID_1, TARGET_ID_2, TARGET_ID_3]),
        ),
        searchInGuideline: stub<Parameters<AppBridgeTheme['searchInGuideline']>>().callsFake(async (query) => {
            return Promise.resolve([
                GuidelineSearchResultDummy.with(`${query}-1`),
                GuidelineSearchResultDummy.with(`${query}-1`),
                GuidelineSearchResultDummy.with(`${query}-3`),
            ]);
        }),
        closeAssetChooser: stub<Parameters<AppBridgeTheme['closeAssetChooser']>>().callsFake(() => {
            closeAssetChooser();
        }),
        openAssetChooser: stub<Parameters<AppBridgeTheme['openAssetChooser']>>().callsFake((callback) => {
            openAssetChooser(callback);
        }),
        api: stub<Parameters<AppBridgeTheme['api']>>().resolves(),
        context: stub<Parameters<AppBridgeTheme['context']>>().callsFake((args) => {
            if (args === undefined) {
                return {
                    get: () => ({ portalId, brandId, projectId, isEditing: editorState }),
                };
            } else {
                switch (args) {
                    case 'portalId':
                        return {
                            get: () => portalId,
                        };
                    case 'brandId':
                        return {
                            get: () => brandId,
                        };
                    case 'projectId':
                        return {
                            get: () => projectId,
                        };
                    case 'isEditing':
                        return {
                            get: () => editorState,
                        };
                    default:
                        return {
                            get: () => {
                                throw new Error(`Unknown context key: ${args}`);
                            },
                        };
                }
            }
        }),
        state: stub<Parameters<AppBridgeTheme['state']>>().callsFake((args) => {
            if (args === undefined) {
                return {
                    get: () => [themeSettings],
                    set: () => undefined,
                };
            } else {
                switch (args) {
                    case 'settings':
                        return {
                            get: () => themeSettings,
                            set: () => undefined,
                        };
                    default:
                        return {
                            get: () => {
                                throw new Error(`Unknown context key: ${args}`);
                            },
                            set: () => {
                                throw new Error(`Unknown context key: ${args}`);
                            },
                        };
                }
            }
        }),
        subscribe: stub<Parameters<AppBridgeTheme['subscribe']>>().resolves(),
        dispatch: stub<Parameters<AppBridgeTheme['dispatch']>>().resolves(),
    };
};

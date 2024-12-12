/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BlockSettingsUpdateEvent } from '../react/useBlockSettings';

import { type Asset } from './Asset';
import { type BrandportalLink } from './BrandportalLink';
import { type Color } from './Color';
import { type ColorPalette } from './ColorPalette';
import { type CoverPage } from './CoverPage';
import { type Document } from './Document';
import { type DocumentCategory } from './DocumentCategory';
import { type DocumentGroup } from './DocumentGroup';
import { type DocumentPage } from './DocumentPage';
import {
    type AddDocumentSectionPayload,
    type DeleteDocumentSectionPayload,
    type UpdateDocumentSectionPayload,
} from './DocumentSection';
import { type PrivacySettings } from './PrivacySettings';
import { type Template } from './Template';
import { type AssetViewerOptions } from './Terrific';
import { type ThemeTemplate } from './ThemeTemplate';

export type EmitterAction = 'add' | 'update' | 'delete';

export type EmitterEvents = {
    'AppBridge:PageTemplateSettingsUpdated': { pageTemplateSettings: Record<string, unknown> };
    'AppBridge:ThemeSettingsUpdated': { themeSettings: Record<ThemeTemplate, Record<string, unknown>> };
    'AppBridge:BlockSettingsUpdated': BlockSettingsUpdateEvent;

    'AppBridge:BlockAssetsUpdated': {
        blockId: number;
        blockAssets: Record<string, Asset[]>;
        prevBlockAssets: Record<string, Asset[]>;
    };

    'AppBridge:TemplateAssetsUpdated': {
        template: ThemeTemplate;
        documentId?: number;
        documentPageId?: number;
        templateAssets: Record<string, Asset[]>;
        prevTemplateAssets: Record<string, Asset[]>;
    };

    'AppBridge:ThemeAssetsUpdated': {
        portalId: number;
        themeAssets: Record<string, Asset[]>;
        prevThemeAssets: Record<string, Asset[]>;
        template: ThemeTemplate;
    };

    'AppBridge:BlockTemplatesUpdated': {
        blockId: number;
        blockTemplates: Record<string, Template[]>;
        prevBlockTemplates: Record<string, Template[]>;
    };

    'AppBridge:ColorsUpdated': {
        blockId: number;
        colors: Color[];
        prevColors: Color[];
    };

    'AppBridge:ColorPalettesUpdated': {
        blockId: number;
        colorPalettes: ColorPalette[];
        prevColorPalettes: ColorPalette[];
    };

    'AppBridge:GuidelineDocument:Action':
        | {
              document: Document;
              action: 'add' | 'update' | 'move';
          }
        | {
              document: { id: number; documentGroupId?: Nullable<number> };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentGroup:Action':
        | {
              documentGroup: DocumentGroup;
              action: 'add' | 'update';
          }
        | {
              documentGroup: { id: number };
              action: 'delete';
          };

    'AppBridge:GuidelineCoverPage:Action':
        | {
              coverPage: CoverPage;
              action: 'add' | 'update';
          }
        | {
              action: 'delete';
          };

    'AppBridge:GuidelineBrandportalLink:Action': {
        brandportalLink: BrandportalLink;
        action: 'update';
    };

    'AppBridge:PrivacySettingsChanged': PrivacySettings;

    'AppBridge:OpenNavigationManager': void;

    'AppBridge:OpenSearchDialog': void;
    'AppBridge:CloseSearchDialog': void;

    'AppBridge:GuidelineDocumentPage:Action':
        | {
              documentPage: DocumentPage;
              action: 'add' | 'update' | 'move';
          }
        | {
              documentPage: { id: number; documentId: number; categoryId?: Nullable<number> };
              action: 'delete';
          };
    'AppBridge:GuidelineDocumentSection:Action':
        | {
              action: 'add';
              payload: AddDocumentSectionPayload;
          }
        | {
              action: 'update';
              payload: UpdateDocumentSectionPayload;
          }
        | {
              action: 'delete';
              payload: DeleteDocumentSectionPayload;
          };

    'AppBridge:GuidelineDocumentCategory:Action':
        | {
              documentCategory: DocumentCategory;
              action: 'add' | 'update';
          }
        | {
              documentCategory: { id: number; documentId: number };
              action: 'delete';
          };

    'AppBridge:GuidelineDocumentCategory:DocumentPageAction': {
        documentPage: { id: number; categoryId: number; documentId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocument:DocumentPageAction': {
        documentPage: { id: number; documentId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocument:DocumentCategoryAction': {
        documentCategory: { id: number; documentId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocumentGroup:DocumentAction': {
        document: { id: number; documentGroupId: number };
        action: 'add' | 'delete';
    };

    'AppBridge:GuidelineDocumentPageTargets:Action': {
        action: 'update';
        payload: {
            targets: number[];
            pageIds: number[];
        };
    };

    'AppBridge:GuidelineDocumentTargets:Action': {
        payload: {
            targets: number[];
            documentIds: number[];
        };
        action: 'update';
    };

    'AppBridge:ViewerOpened': AssetViewerOptions;

    'AppBridge:GuidelineDocumentPage:MoveEvent': {
        documentPage: DocumentPage | { id: number; sort?: Nullable<number> };
        documentId: number;
        categoryId?: Nullable<number>;
        position?: number;
        action: 'movePreview';
    };

    'AppBridge:GuidelineDocumentCategory:MoveEvent': {
        documentCategory: DocumentCategory | { id: number; sort?: Nullable<number> };
        documentId: number;
        position: number;
        action: 'movePreview';
    };

    'AppBridge:GuidelineDocument:MoveEvent': {
        document: Document | { id: number; sort?: Nullable<number>; documentGroupId?: Nullable<number> };
        position: number;
        newGroupId?: Nullable<number>;
        action: 'movePreview';
    };

    'AppBridge:GuidelineDocumentGroup:MoveEvent': {
        documentGroup: DocumentGroup | { id: number; sort?: Nullable<number> };
        position: number;
        action: 'movePreview';
    };
};

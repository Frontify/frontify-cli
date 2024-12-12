/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from './Asset';
import { type EventUnsubscribeFunction } from './Event';
import {
    type PortalNavigationItem,
    type BrandPortalLink,
    type CoverPage,
    type Document,
    type DocumentLibrary,
    type DocumentPage,
    type DocumentChildNavigationItem,
} from './Guideline';
import { type Language } from './Language';
import { type ThemeTemplate } from './ThemeTemplate';

export type TemplateContext = { templateId: string; type: ThemeTemplate } & (
    | { type: 'documentPage'; document: Document; documentPage: DocumentPage }
    | { type: 'library'; document: DocumentLibrary }
    | { type: 'cover'; coverPage: CoverPage }
);

export type Context = {
    brandId: number;
    brandPortalLink: BrandPortalLink | null;
    projectId: number;
    portalId: number;
    portalNavigation: PortalNavigationItem[] | null;
    documentNavigation: Record<number, DocumentChildNavigationItem[] | undefined>;
    portalToken: string | null;
    currentLanguage: string;
    defaultLanguage: string;
    enabledFeatures: string[];
    isEditing: boolean;
    isPublicLink: boolean;
    isAuthenticated: boolean;
    isAiBrandAssistantDialogOpen: boolean;
    isSearchDialogOpen: boolean;
    languages: Language[];
    template: TemplateContext | null;
    settings: {
        templateSettings: Record<string, unknown>;
        templateAssets: Record<string, Asset[]>;
    };
};

export type ContextReturn<Context, Key> = Key extends keyof Context
    ? {
          /**
           * Gets the current value of the context object at the given key.
           */
          get(): Readonly<Context[Key]>;
          /**
           * Subscribes to changes in the context object at the given key.
           */
          subscribe(
              callbackFunction: (nextContext: Context[Key], previousContext: Context[Key]) => void,
          ): EventUnsubscribeFunction;
      }
    : {
          /**
           * Gets the current value of the context object.
           */
          get(): Readonly<Context>;
          /**
           * Subscribes to changes in the context object.
           */
          subscribe(
              callbackFunction: (nextContext: Context, previousContext: Context) => void,
          ): EventUnsubscribeFunction;
      };

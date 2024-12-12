/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type ObjectNameValidator } from '../types';

export type CommandRegistry = CommandNameValidator<{
    openSearchDialog: void;
    closeSearchDialog: void;
    openAiBrandAssistantDialog: void;
    closeAiBrandAssistantDialog: void;
    navigate: string;
    navigateToDocumentSection: number | string;
    hydrateContextDocumentNavigation: number;
}>;

type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };

type CommandVerb = 'open' | 'close' | 'navigate' | 'hydrateContext';

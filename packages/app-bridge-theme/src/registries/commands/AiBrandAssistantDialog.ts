/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const openAiBrandAssistantDialog = (): DispatchHandlerParameter<
    'openAiBrandAssistantDialog',
    CommandRegistry
> => ({ name: 'openAiBrandAssistantDialog' });

export const closeAiBrandAssistantDialog = (): DispatchHandlerParameter<
    'closeAiBrandAssistantDialog',
    CommandRegistry
> => ({ name: 'closeAiBrandAssistantDialog' });

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DispatchHandlerParameter } from '../../types';
import { type CommandRegistry } from '../CommandRegistry';

export const navigate = (path: CommandRegistry['navigate']): DispatchHandlerParameter<'navigate', CommandRegistry> => ({
    name: 'navigate',
    payload: path,
});

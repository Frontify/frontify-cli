/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandRegistry } from '../registries';

import { type WrongNamePattern } from './Common';

type DispatchHandler<
    CommandName extends keyof CommandRegistry,
    TCommand extends CommandRegistry,
> = TCommand[CommandName] extends void ? { name: CommandName } : { name: CommandName; payload: TCommand[CommandName] };

export type DispatchHandlerParameter<
    CommandName,
    TCommand extends CommandRegistry,
> = CommandName extends keyof CommandRegistry
    ? DispatchHandler<CommandName, TCommand>
    : WrongNamePattern<CommandName, 'Command'>;

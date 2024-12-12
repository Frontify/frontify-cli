/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CommandRegistry } from './registries';
import {
    type AppBridgeThemeEvent,
    type Context,
    type ContextReturn,
    type DispatchHandlerParameter,
    type EventCallbackParameter,
    type EventNameParameter,
    type EventUnsubscribeFunction,
    type GuidelineSearchResult,
} from './types';

export interface AppBridgeTheme {
    dispatch<CommandName extends keyof CommandRegistry>(
        dispatchHandler: DispatchHandlerParameter<CommandName, CommandRegistry>,
    ): Promise<void>;

    context(): ContextReturn<Context, void>;
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context(key?: keyof Context | void): unknown;

    subscribe<EventName extends keyof AppBridgeThemeEvent>(
        eventName: EventNameParameter<EventName, AppBridgeThemeEvent>,
        callback: EventCallbackParameter<EventName, AppBridgeThemeEvent>,
    ): EventUnsubscribeFunction;

    /**
     * @deprecated
     * Search in the current Guideline for a given query.
     * @param query - The query to search for.
     * @param order - The order in which the results should be returned. Defaults to 'relevance'.
     */
    searchInGuideline(query: string, order?: 'relevance' | 'newest' | 'oldest'): Promise<GuidelineSearchResult[]>;
}

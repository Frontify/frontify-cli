/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    ApiHandlerParameter,
    ApiMethodNameValidator,
    ApiReturn,
    AppBridge,
    CommandNameValidator,
    ContextAsEventName,
    ContextReturn,
    DispatchHandlerParameter,
    EventCallbackParameter,
    EventNameParameter,
    EventNameValidator,
    EventUnsubscribeFunction,
    StateAsEventName,
    StateReturn,
    SubscribeMap,
} from './AppBridge';
import { Topic } from './types';
import { ErrorMessageBus, IMessageBus, MessageBus } from './utilities/MessageBus';
import { generateRandomString, notify, subscribe } from './utilities';
import { getQueryParameters } from './utilities/queryParams';
import type { ApiMethodRegistry } from './registries';
import { connection } from './registries';
import { InitializationError } from './errors';

export type PlatformAppApiMethod = ApiMethodNameValidator<Pick<ApiMethodRegistry, 'getCurrentUser'>>;

export type PlatformAppCommandRegistry = CommandNameValidator<{
    openConnection: void;
}>;

export type PlatformAppCommand = CommandNameValidator<Pick<PlatformAppCommandRegistry, 'openConnection'>>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
};

type InitializeEvent = {
    port: MessagePort;
};

type AppBaseProps = {
    token: string;
    marketplaceServiceAppId: string;
    connected: boolean;
};

export type PlatformAppContext = AppBaseProps & {
    type: 'ASSET_ACTION';
    assetId: string;
    parentId: string;
    directory: string;
    domain: string;
};

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export class AppBridgePlatformApp implements IAppBridgePlatformApp {
    private messageBus: IMessageBus = new ErrorMessageBus();
    private initialized: boolean = false;

    private readonly subscribeMap: SubscribeMap<PlatformAppEvent> = {
        'State.*': new Map(),
        'State.settings': new Map(),
        'Context.*': new Map(),
        'Context.marketplaceServiceAppId': new Map(),
        'Context.token': new Map(),
        'Context.assetId': new Map(),
        'Context.parentId': new Map(),
        'Context.directory': new Map(),
        'Context.domain': new Map(),
        'Context.type': new Map(),
        'Context.connected': new Map(),
    };

    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName, PlatformAppApiMethod> {
        return this.messageBus.post({
            method: 'api',
            parameter: apiHandler,
        }) as ApiReturn<ApiMethodName, PlatformAppApiMethod>;
    }

    async dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, PlatformAppCommand>,
    ): Promise<void> {
        if (dispatchHandler.name === connection().name) {
            const initialContext = getQueryParameters(window.location.href);

            if (initialContext.token && !this.initialized) {
                this.initialized = true;
                const PUBSUB_CHECKSUM = generateRandomString();

                notify(Topic.Init, PUBSUB_CHECKSUM, { token: initialContext.token, appBridgeVersion: 'v3' });
                subscribe<InitializeEvent>(Topic.Init, PUBSUB_CHECKSUM).then(({ port }) => {
                    this.messageBus = new MessageBus(port);
                    this.callSubscribedTopic('Context.connected', [false, true]);
                });
            } else {
                if (this.initialized) {
                    return;
                }
                throw new InitializationError();
            }
        }
    }

    context(): ContextReturn<PlatformAppContext, void>;
    context(): unknown {
        return this.messageBus.post({
            method: 'context',
            parameter: 'smth',
        });
    }

    state(): StateReturn<PlatformAppState, void>;
    state(): unknown {
        return undefined;
    }

    subscribe<EventName extends keyof PlatformAppEvent>(
        eventName: EventNameParameter<EventName, PlatformAppEvent>,
        callback: EventCallbackParameter<EventName, PlatformAppEvent>,
    ): EventUnsubscribeFunction {
        if (!(eventName in this.subscribeMap)) {
            this.subscribeMap[eventName] = new Map();
        }

        this.subscribeMap[eventName].set(callback, true);

        return () => {
            this.subscribeMap[eventName].delete(callback);
        };
    }

    callSubscribedTopic<EventName extends keyof PlatformAppEvent>(
        eventName: EventNameParameter<EventName, PlatformAppEvent>,
        callbackParameters: PlatformAppEvent[EventName],
    ) {
        const callbackMap = this.subscribeMap[eventName];
        if (callbackMap && callbackMap?.size !== undefined) {
            for (const [callback] of callbackMap.entries()) {
                // @ts-expect-error if there are multiple parameters, we spread them in the callback call
                callback(...(Array.isArray(callbackParameters) ? callbackParameters : [callbackParameters]));
            }
        }
    }
}

export interface IAppBridgePlatformApp<
    State extends PlatformAppState = PlatformAppState,
    Context extends PlatformAppContext = PlatformAppContext,
    Event extends PlatformAppEvent = PlatformAppEvent,
> extends AppBridge<PlatformAppApiMethod, PlatformAppCommand, State, Context, Event> {
    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName, PlatformAppApiMethod>;

    dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, PlatformAppCommand>,
    ): Promise<void>;

    state(): StateReturn<State, void>;

    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;

    state(key?: keyof State | void): unknown;

    context(): ContextReturn<Context, void>;

    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;

    context(key?: keyof Context | void): unknown;

    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName, Event>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;
}

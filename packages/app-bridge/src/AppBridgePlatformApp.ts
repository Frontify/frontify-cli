/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type ApiHandlerParameter,
    type ApiMethodNameValidator,
    type ApiReturn,
    type AppBridge,
    type CommandNameValidator,
    type ContextAsEventName,
    type ContextReturn,
    type DispatchHandlerParameter,
    type EventCallbackParameter,
    type EventNameParameter,
    type EventNameValidator,
    type EventUnsubscribeFunction,
    type StateAsEventName,
    type StateReturn,
    type SubscribeMap,
} from './AppBridge';
import { InitializationError } from './errors';
import { type ApiMethodRegistry, openConnection } from './registries';
import { Topic } from './types';
import { generateRandomString, notify, subscribe } from './utilities';
import { ErrorMessageBus, type IMessageBus, MessageBus } from './utilities/MessageBus';
import { getQueryParameters } from './utilities/queryParams';

export type PlatformAppApiMethod = ApiMethodNameValidator<
    Pick<
        ApiMethodRegistry,
        'getCurrentUser' | 'getAssetResourceInformation' | 'createAsset' | 'getSecureRequest' | 'getProxiedFetch'
    >
>;

export type PlatformAppCommandRegistry = CommandNameValidator<{
    openConnection: void;
}>;

export type PlatformAppCommand = CommandNameValidator<Pick<PlatformAppCommandRegistry, 'openConnection'>>;

export type PlatformAppState = {
    settings: Record<string, unknown>;
    userState: Record<string, unknown>;
};

type InitializeEvent = {
    apiPort: MessagePort;
    statePort: MessagePort;
    context: PlatformAppContext;
    state: PlatformAppState;
};

type AppBaseProps = {
    token: string;
    marketplaceServiceAppId: string;
    connected: boolean;
    brandId: number;
    domain: string;
    parentId: string;
};

export type AssetActionContext = {
    surface: 'assetAction';
    assetId: string;
} & AppBaseProps;

export type AssetCreationContext = {
    surface: 'assetCreation';
} & AppBaseProps;

export type PlatformAppContext = AssetActionContext | AssetCreationContext;

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export class AppBridgePlatformApp implements IAppBridgePlatformApp {
    private apiMessageBus: IMessageBus = new ErrorMessageBus();
    private stateMessageBus: IMessageBus = new ErrorMessageBus();
    private initialized: boolean = false;
    private localContext?: PlatformAppContext;
    private localState: PlatformAppState = { settings: {}, userState: {} };
    private maxRetries: number = 5;

    private readonly subscribeMap: SubscribeMap<PlatformAppEvent> = {
        'State.*': new Map(),
        'State.settings': new Map(),
        'State.userState': new Map(),
        'Context.*': new Map(),
        'Context.marketplaceServiceAppId': new Map(),
        'Context.token': new Map(),
        'Context.assetId': new Map(),
        'Context.brandId': new Map(),
        'Context.parentId': new Map(),
        'Context.domain': new Map(),
        'Context.surface': new Map(),
        'Context.connected': new Map(),
    };

    constructor() {
        if (window.appBridgePlatformApp) {
            return window.appBridgePlatformApp;
        }

        window.appBridgePlatformApp = this;
    }

    api<ApiMethodName extends keyof PlatformAppApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, PlatformAppApiMethod>,
    ): ApiReturn<ApiMethodName, PlatformAppApiMethod> {
        return this.apiMessageBus.post({
            parameter: apiHandler,
        }) as ApiReturn<ApiMethodName, PlatformAppApiMethod>;
    }

    private guardForInitialization() {
        const initialContext = getQueryParameters(window.location.href);
        if (!initialContext.token) {
            throw new InitializationError();
        }
        return this.initialized;
    }

    async dispatch<CommandName extends keyof PlatformAppCommand>(
        dispatchHandler: DispatchHandlerParameter<CommandName, PlatformAppCommand>,
    ): Promise<void> {
        if (dispatchHandler.name === openConnection().name) {
            if (this.guardForInitialization()) {
                return;
            }

            const checksum = generateRandomString();

            notify(Topic.Init, checksum, {
                token: getQueryParameters(window.location.href).token,
                appBridgeVersion: 'v4',
            });

            await this.attemptSubscription(1, checksum);
        }
    }

    private async attemptSubscription(attempt: number, checksum: string): Promise<void> {
        try {
            const { statePort, apiPort, context, state } = await subscribe<InitializeEvent>(Topic.Init, checksum);

            this.apiMessageBus = new MessageBus(apiPort);
            this.stateMessageBus = new MessageBus(statePort);

            this.localContext = context;
            this.localState = state;
            this.initialized = true;

            this.callSubscribedTopic('Context.connected', [true, false]);
            this.callSubscribedTopic('Context.*', [this.localContext, this.localContext]);
            this.callSubscribedTopic('State.*', [this.localState, this.localState]);
        } catch (error) {
            if (attempt < this.maxRetries) {
                await this.attemptSubscription(attempt + 1, checksum);
            } else {
                console.error('Could not connect to the platform.');
            }
        }
    }

    context(key?: void): ContextReturn<PlatformAppContext, void>;
    context<Key extends keyof PlatformAppContext>(key?: Key): ContextReturn<PlatformAppContext, Key>;
    context<Key extends keyof PlatformAppContext>(key?: keyof PlatformAppContext | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localContext,
                subscribe: (
                    callback: (nextContext: PlatformAppContext, previousContext: PlatformAppContext) => void,
                ) => {
                    return this.subscribe('Context.*', callback);
                },
            };
        }
        return {
            get: () => (this.localContext ? this.localContext[key] : {}),
            subscribe: (
                callback: (nextContext: PlatformAppContext[Key], previousContext: PlatformAppContext[Key]) => void,
            ) => {
                // @ts-expect-error typing is correct, but TS doesn't like it
                return this.subscribe(`Context.${key}`, callback);
            },
        };
    }

    private async setInternalState(
        state: Promise<PlatformAppState>,
        key?: keyof PlatformAppState | void,
    ): Promise<void> {
        const prevState = this.localState;
        this.localState = await state;
        if (key) {
            this.callSubscribedTopic(`State.${key}`, [this.localState, prevState]);
        } else {
            this.callSubscribedTopic('State.*', [this.localState, prevState]);
        }
    }

    state(): StateReturn<PlatformAppState, void>;
    state<Key extends keyof PlatformAppState>(key: Key): StateReturn<PlatformAppState, Key>;
    state<Key extends keyof PlatformAppState>(key?: keyof PlatformAppState | void): unknown {
        if (typeof key === 'undefined') {
            return {
                get: () => this.localState,
                set: (nextState: PlatformAppState) => {
                    const newState = this.stateMessageBus.post({
                        parameter: { nextState },
                    }) as Promise<PlatformAppState>;
                    this.setInternalState(newState);
                },
                subscribe: (callback: (nextState: PlatformAppState, previousState: PlatformAppState) => void) => {
                    return this.subscribe('State.*', callback);
                },
            };
        }

        return {
            get: () => this.localState[key],
            set: (nextState: PlatformAppState[Key]) => {
                const newState = this.stateMessageBus.post({
                    parameter: { key, nextState },
                }) as Promise<PlatformAppState>;

                this.setInternalState(newState, key);
            },
            subscribe: (callback: (nextState: PlatformAppState[Key], previousState: PlatformAppState[Key]) => void) => {
                return this.subscribe(`State.${key}`, callback);
            },
        };
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

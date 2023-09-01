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
} from './AppBridge';
import { PlatformAppContext, Topic } from './types';
import { ErrorMessageBus, IMessageBus, MessageBus } from './utilities/MessageBus';
import { generateRandomString, notify, subscribe } from './utilities';
import { getQueryParameters } from './utilities/queryParams';
import { InitializationError } from './errors';
import type { ApiMethodRegistry } from './registries';

export type PlatformAppApiMethod = ApiMethodNameValidator<
    Pick<ApiMethodRegistry, 'getCurrentUser' | 'getAssetResourceInfo'>
>;

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

export type PlatformAppEvent = EventNameValidator<
    StateAsEventName<PlatformAppState & { '*': PlatformAppState }> &
        ContextAsEventName<PlatformAppContext & { '*': PlatformAppContext }>
>;

export class AppBridgePlatformApp implements IAppBridgePlatformApp {
    private messageBus: IMessageBus = new ErrorMessageBus();
    private initialized: boolean = false;

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
        if (dispatchHandler.name === 'openConnection') {
            const { get } = this.context();

            if (get().token && !this.initialized) {
                this.initialized = true;
                const PUBSUB_CHECKSUM = generateRandomString();

                notify(Topic.Init, PUBSUB_CHECKSUM, { token: get().token });
                const { port } = await subscribe<InitializeEvent>(Topic.Init, PUBSUB_CHECKSUM);
                this.messageBus = new MessageBus(port);
                return Promise.resolve<void>(void 0);
            } else {
                throw new InitializationError();
            }
        }
    }

    context(): ContextReturn<PlatformAppContext, void>;
    context(): unknown {
        return {
            get: () => getQueryParameters(window.location.href),
        };
    }

    state(): StateReturn<PlatformAppState, void>;
    state(): unknown {
        return undefined;
    }

    subscribe(): EventUnsubscribeFunction {
        return () => void 0;
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

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type ApiVerb, type CommandVerb, type EventVerb } from './registries/verbs';

type NameContextList = 'Command' | 'API Method' | 'Event';
type WrongNamePattern<ApiMethodName, NameContext extends NameContextList> = ApiMethodName extends string
    ? `The following ${NameContext} do not match the naming pattern: ${ApiMethodName}`
    : never;

type ObjectNameValidator<
    NameObject,
    PatternObject,
    NameContext extends NameContextList,
> = keyof NameObject extends keyof PatternObject
    ? NameObject
    : WrongNamePattern<
          `${Exclude<Extract<keyof NameObject, string>, Extract<keyof PatternObject, string>>}`,
          NameContext
      >;

type ApiMethodNamePattern = { [apiMethod: `${ApiVerb}${string}`]: { payload: unknown; response: unknown } };
export type ApiMethodNameValidator<ApiMethodNameObject> = Simplify<
    ObjectNameValidator<ApiMethodNameObject, ApiMethodNamePattern, 'API Method'>
>;

type CommandNamePattern = { [commandName: `${CommandVerb}${string}`]: unknown };
export type CommandNameValidator<CommandNameObject> = Simplify<
    ObjectNameValidator<CommandNameObject, CommandNamePattern, 'Command'>
>;

type ApiHandler<
    ApiMethodName extends keyof ApiMethodNamePattern,
    ApiMethod extends ApiMethodNamePattern,
> = ApiMethod[ApiMethodName]['payload'] extends void
    ? { name: ApiMethodName }
    : { name: ApiMethodName; payload: ApiMethod[ApiMethodName]['payload'] };

type DispatchHandler<
    CommandName extends keyof CommandNamePattern,
    Command extends CommandNamePattern,
> = Command[CommandName] extends void ? { name: CommandName } : { name: CommandName; payload: Command[CommandName] };

export type ApiHandlerParameter<
    ApiMethodName,
    ApiMethod extends ApiMethodNamePattern,
> = ApiMethodName extends keyof ApiMethodNamePattern
    ? ApiHandler<ApiMethodName, ApiMethod>
    : WrongNamePattern<ApiMethodName, 'API Method'>;

export type ApiReturn<
    ApiMethodName extends keyof ApiMethod,
    ApiMethod extends ApiMethodNamePattern,
> = ApiMethodName extends keyof ApiMethod
    ? ApiMethod[ApiMethodName] extends { response: infer Response }
        ? Promise<Response>
        : never
    : never;

export type DispatchHandlerParameter<
    CommandName,
    Command extends CommandNamePattern,
> = CommandName extends keyof CommandNamePattern
    ? DispatchHandler<CommandName, Command>
    : WrongNamePattern<CommandName, 'Command'>;

export type SubscribeMap<Event> = {
    [EventName in keyof Event as EventName]: Map<EventCallbackParameter<keyof Event, Event>, boolean>;
};

export type StateReturn<State, Key> = Key extends keyof State
    ? {
          /**
           * Gets the current value of the state object at the given key.
           */
          get(): Readonly<State[Key]>;
          /**
           * Sets the value of the state object at the given key.
           * The operation replaces the entire reference.
           */
          set(nextState: State[Key]): void;
          /**
           * Subscribes to changes in the state object at the given key.
           */
          subscribe(
              callbackFunction: (nextState: State[Key], previousState: State[Key]) => void,
          ): EventUnsubscribeFunction;
      }
    : {
          /**
           * Gets the current value of the state object.
           */
          get(): Readonly<State>;
          /**
           * Sets the value of the state object.
           * The operation replaces the entire reference.
           */
          set(nextState: State): void;
          /**
           * Subscribes to changes in the state object.
           */
          subscribe(callbackFunction: (nextState: State, previousState: State) => void): EventUnsubscribeFunction;
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

export type EventNamePattern = {
    [eventName: `State.${string}` | `Context.${string}` | `${string}${Capitalize<EventVerb>}`]: unknown;
};
export type EventNameValidator<EventNameObject> = Simplify<
    ObjectNameValidator<EventNameObject, EventNamePattern, 'Event'>
>;

export type StateAsEventName<State> = {
    [StateKey in keyof State as StateKey extends string ? `State.${StateKey}` : never]: [
        State[StateKey],
        State[StateKey],
    ];
};

export type ContextAsEventName<Context> = {
    [ContextKey in keyof Context as ContextKey extends string ? `Context.${ContextKey}` : never]: [
        Context[ContextKey],
        Context[ContextKey],
    ];
};

export type EventNameParameter<
    EventName,
    EventNameParameter extends EventNamePattern,
> = EventName extends keyof EventNameParameter ? EventName : WrongNamePattern<EventName, 'Event'>;

export type EventCallbackParameter<EventName, Event> = EventName extends keyof Event
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Event[EventName] extends any[]
        ? (...eventReturn: Event[EventName]) => void
        : (eventReturn: Event[EventName]) => void
    : () => void;

export type EventUnsubscribeFunction = () => void;

export interface AppBridge<
    ApiMethod extends ApiMethodNamePattern,
    Command extends CommandNamePattern,
    State extends Record<string, Record<string, unknown>>,
    Context extends Record<string, unknown>,
    Event extends EventNamePattern,
> {
    /**
     * Makes a request to the Frontify platform with the given API method name
     */
    api<ApiMethodName extends keyof ApiMethod>(
        apiHandler: ApiHandlerParameter<ApiMethodName, ApiMethod>,
    ): ApiReturn<ApiMethodName, ApiMethod>;

    /**
     * Sends a command to the Frontify platform.
     *
     * @returns A promise that resolves to acknowledge the dispatch.
     * The event will be triggered at a later stage and can be subscribed to
     */
    dispatch<CommandName extends keyof Command>(
        dispatchHandler: DispatchHandlerParameter<CommandName, Command>,
    ): Promise<void>;

    /**
     * Returns a state utility object that can be used to get and set state values.
     *
     * @returns the state utility object.
     */
    state(): StateReturn<State, void>;
    /**
     * Returns a state utility object that can be used to get and set state values.
     *
     * @returns the state utility object focused on the given key is returned.
     */
    state<Key extends keyof State>(key: Key): StateReturn<State, Key>;
    state(key?: keyof State | void): unknown;
    /**
     * Returns a context utility object that can be used to get context values.
     *
     * @returns the context utility object.
     */
    context(): ContextReturn<Context, void>;
    /**
     * Returns a context utility object that can be used to get context values.
     *
     * @returns the context utility object focused on the given key is returned.
     */
    context<Key extends keyof Context>(key: Key): ContextReturn<Context, Key>;
    context(key?: keyof Context | void): unknown;

    /**
     * Subscribes to an event with the given name and callback function.
     *
     * @returns Function that can be used to unsubscribe from an event.
     * When called, this function will remove the subscription to the event and prevent any further callbacks from being executed.
     */
    subscribe<EventName extends keyof Event>(
        eventName: EventNameParameter<EventName, Event>,
        callback: EventCallbackParameter<EventName, Event>,
    ): EventUnsubscribeFunction;
}

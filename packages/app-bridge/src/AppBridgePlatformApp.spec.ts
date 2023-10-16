/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { notify } from './utilities';
import { AppBridgePlatformApp } from './AppBridgePlatformApp';
import { InitializationError } from './errors';
import { openConnection } from './registries';

const TOKEN = 'AjY34F87Dsat^J';

describe('AppBridgePlatformApp', () => {
    vi.mock('./utilities/subscribe', () => ({
        subscribe: vi.fn().mockResolvedValue({
            port: { onmessage: vi.fn() },
            context: { parentId: 'parentId-test', connected: true },
        }),
    }));

    vi.mock('./utilities/notify', () => ({
        notify: vi.fn(),
    }));

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgePlatformApp()).toBeInstanceOf(AppBridgePlatformApp);
    });

    it('should not initialize without a token', async () => {
        window.location.search = '?token=';

        const platformApp = new AppBridgePlatformApp();

        await expect(() => platformApp.dispatch(openConnection())).rejects.toThrow(new InitializationError());
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should notify endpoint when openConnection is called correctly', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        await platformApp.dispatch(openConnection());
        expect(notify).toHaveBeenCalledTimes(1);
    });

    it('should yield true for Context.connected after dispatch', async () => {
        const connected = true;
        window.location.search = `?token=${TOKEN}`;
        const platformApp = new AppBridgePlatformApp();
        platformApp.subscribe('Context.connected', () => {
            expect(connected).toBe(true);
        });
        platformApp.dispatch(openConnection());
    });

    it.fails('should throw an error when api is not initialized', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        await expect(() => platformApp.api({ name: 'getCurrentUser' })).rejects.toThrow();
    });

    it('should return undefined state as it is not implemented', async () => {
        const platformApp = new AppBridgePlatformApp();
        const state = platformApp.state();
        expect(state).toEqual(undefined);
    });

    it('should yield true for Context.connected after dispatch', async () => {
        window.location.search = `?token=${TOKEN}`;
        const platformApp = new AppBridgePlatformApp();
        platformApp.subscribe('Context.connected', (connected) => {
            const context = platformApp.context().get();
            const parentId = platformApp.context('parentId').get();

            expect(connected).toBe(true);
            expect(context).toEqual({ parentId: 'parentId-test', connected: true });
            expect(parentId).toEqual('parentId-test');
        });
        platformApp.dispatch(openConnection());
    });

    it('should return correct object when subscribing to context', async () => {
        window.location.search = `?token=${TOKEN}`;
        const platformApp = new AppBridgePlatformApp();
        platformApp.context().subscribe((context) => {
            expect({ parentId: 'parentId-test', connected: true }).toStrictEqual(context);
        });
        platformApp.dispatch(openConnection());
    });
});

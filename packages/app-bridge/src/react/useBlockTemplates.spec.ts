/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { SinonStub } from 'sinon';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TemplateDummy, getAppBridgeBlockStub } from '../tests';
import { useBlockTemplates } from './useBlockTemplates';

describe('useBlockTemplates hook', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseBlockTemplates = async (existingTemplates = [TemplateDummy.with(1)]) => {
        const template = TemplateDummy.with(1);
        const appBridgeStub = getAppBridgeBlockStub({
            blockId: 123,
            blockTemplates: { key: existingTemplates },
        });

        const { result } = renderHook(() => useBlockTemplates(appBridgeStub));
        return { result, appBridgeStub, template };
    };

    it('should delete a template', async () => {
        const { result, appBridgeStub } = await loadUseBlockTemplates();
        await act(async () => {
            await result.current.deleteTemplateIdsFromKey('key', [1]);
        });

        const call = appBridgeStub.deleteTemplateIdsFromBlockTemplateKey.getCall(0);
        waitFor(() => {
            expect(call.firstArg).toEqual('key');
            expect(call.lastArg).toEqual([1]);
            expect(result.current.blockTemplates).toStrictEqual({ key: [] });
        });
    });

    it('should sort templates', async () => {
        const { result, appBridgeStub } = await loadUseBlockTemplates([TemplateDummy.with(1), TemplateDummy.with(2)]);

        await act(async () => {
            await result.current.updateTemplateIdsFromKey('key', [2, 1]);
        });

        const deleteCall = appBridgeStub.deleteTemplateIdsFromBlockTemplateKey.getCall(0);
        const addCall = appBridgeStub.addTemplateIdsToBlockTemplateKey.getCall(0);

        await waitFor(async () => {
            expect(deleteCall.firstArg).toEqual('key');
            expect(deleteCall.lastArg).toEqual([1, 2]);
            expect(addCall.firstArg).toEqual('key');
            expect(addCall.lastArg).toEqual([2, 1]);
            expect(result.current.blockTemplates['key'].map((template) => template.id)).toEqual([2, 1]);
        });
    });

    it('should not sort templates if api call throws error', async () => {
        const { result, appBridgeStub } = await loadUseBlockTemplates([TemplateDummy.with(1), TemplateDummy.with(2)]);
        (appBridgeStub.deleteTemplateIdsFromBlockTemplateKey as unknown as Mock) = vi
            .fn()
            .mockRejectedValue('Unsuccessful API call');

        await act(async () => {
            await result.current.updateTemplateIdsFromKey('key', [2, 1]);
        });

        await waitFor(async () => {
            expect(result.current.blockTemplates['key'].map((template) => template.id)).toEqual([1, 2]);
        });

        expect(console.error).toHaveBeenCalledOnce();
    });

    it('should notify about updated templates on delete', async () => {
        const { result, template } = await loadUseBlockTemplates();

        await act(async () => {
            await result.current.deleteTemplateIdsFromKey('key', [1]);
        });

        const call = (window.emitter.emit as SinonStub).getCall(0);

        waitFor(() => {
            expect(call.firstArg).toEqual('AppBridge:BlockTemplatesUpdated');
            expect(call.lastArg.blockId).toEqual(123);
            expect(call.lastArg.prevBlockTemplates).toMatchObject({ key: [template] });
            expect(call.lastArg.blockTemplates).toStrictEqual({ key: [] });
        });
    });

    it('should add template ids', async () => {
        const { result, appBridgeStub } = await loadUseBlockTemplates();
        await act(async () => {
            await result.current.addTemplateIdsToKey('key', [2]);
        });

        const call = appBridgeStub.addTemplateIdsToBlockTemplateKey.getCall(0);
        waitFor(() => {
            expect(call.firstArg).toEqual('key');
            expect(call.lastArg).toEqual([2]);
            expect(result.current.blockTemplates['key'].map(({ id }) => id)).toEqual([1, 2]);
        });
    });

    it('should notify about updated templates on add template ids to key', async () => {
        const { result, template } = await loadUseBlockTemplates();
        const templateToAdd = TemplateDummy.with(2);
        await act(async () => {
            await result.current.addTemplateIdsToKey('key', [templateToAdd.id]);
        });

        const call = (window.emitter.emit as SinonStub).getCall(0);
        waitFor(() => {
            expect(call.firstArg).toEqual('AppBridge:BlockTemplatesUpdated');
            expect(call.lastArg.blockId).toEqual(123);
            expect(call.lastArg.blockTemplates).toMatchObject({ key: [template, templateToAdd] });
            expect(call.lastArg.prevBlockTemplates).toMatchObject({ key: [template] });
        });
    });
});

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset, type EventNameValidator } from '../types';

export type EventRegistry = EventNameValidator<{
    assetsChosen: { assets: Asset[] };
}>;

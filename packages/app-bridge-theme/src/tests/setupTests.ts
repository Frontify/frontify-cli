/* (c) Copyright Frontify Ltd., all rights reserved. */

import { configure } from '@testing-library/react';
import { beforeAll } from 'vitest';

beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' });
});

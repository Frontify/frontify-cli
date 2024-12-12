/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { DocumentSectionDummy } from '../tests/DocumentSectionDummy';

import { filterDocumentSectionsWithUnreadableTitles } from './navigation';

const documentSections = [
    DocumentSectionDummy.withFields({ id: 464, title: null }),
    DocumentSectionDummy.withFields({ id: 356, title: 'New Title' }),
    DocumentSectionDummy.withFields({ id: 37675, title: ' ' }),
    DocumentSectionDummy.withFields({ id: 37675, title: '' }),
];

describe('filterDocumentSectionsWithUnreadableTitles', () => {
    it("should filter out document sections that don't have a readable title", () => {
        const sections = filterDocumentSectionsWithUnreadableTitles(documentSections);
        expect(sections).toEqual([documentSections[1]]);
    });
});

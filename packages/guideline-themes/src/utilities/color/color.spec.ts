/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { rgbObjectToRgbString } from './color';

describe('Color', () => {
    describe('rgbObjectToRgbString', () => {
        it('should return a valid RGB string when given an object with R, G, and B.', () => {
            const color = { red: 255, green: 99, blue: 71 };
            expect(rgbObjectToRgbString(color)).toBe('rgb(255, 99, 71)');
        });

        it('should return a valid RGBA string when given an object with R, G, B, and A.', () => {
            const color = { red: 255, green: 99, blue: 71, alpha: 0.5 };
            expect(rgbObjectToRgbString(color)).toBe('rgba(255, 99, 71, 0.5)');
        });

        it('should return a valid RGB string when given an object with 255 R, G, and B.', () => {
            const color = { red: 255, green: 255, blue: 255 };
            expect(rgbObjectToRgbString(color)).toBe('rgb(255, 255, 255)');
        });

        it('should return a valid RGB string when given an object with 0 R, G, and B.', () => {
            const color = { red: 0, green: 0, blue: 0 };
            expect(rgbObjectToRgbString(color)).toBe('rgb(0, 0, 0)');
        });

        it('should return a valid RGBA string when given an object with 255 R, G, B and a valid A.', () => {
            const color = { red: 255, green: 255, blue: 255, alpha: 1 };
            expect(rgbObjectToRgbString(color)).toBe('rgba(255, 255, 255, 1)');
        });

        it('should return a valid RGBA string when given an object with 0 R, G, B and a valid A.', () => {
            const color = { red: 0, green: 0, blue: 0, alpha: 1 };
            expect(rgbObjectToRgbString(color)).toBe('rgba(0, 0, 0, 1)');
        });
    });
});

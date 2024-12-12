/* (c) Copyright Frontify Ltd., all rights reserved. */

export const rgbObjectToRgbString = (color: { red: number; green: number; blue: number; alpha?: number }): string => {
    if ('alpha' in color) {
        return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
    }

    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
};

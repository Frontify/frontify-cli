/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Color, type ColorCreate, type ColorPatch } from '../types/Color';

export class ColorDummy {
    static red(id = 767): Color {
        return {
            id,
            sort: 1,
            title: 'Red',
            revision: {
                nameCss: 'red',
                hex: 'ff0000',
                hue: 361,
                saturation: 100,
                lightness: 46,
                rgba: { red: 255, green: 0, blue: 0, alpha: 255 },
                cmyk: {
                    cyan: 0,
                    magenta: 100,
                    yellow: 100,
                    black: 0,
                    coated: null,
                    uncoated: null,
                    newspaper: null,
                },
                pantone: {
                    code: null,
                    coated: null,
                    uncoated: null,
                    cp: null,
                    plastics: null,
                    textile: null,
                },
                ral: null,
                oracal: null,
                ncs: null,
                hks: null,
                threeM: null,
                lab: null,
            },
        };
    }

    static yellow(id = 768): Color {
        return {
            id,
            sort: 2,
            title: 'Yellow',
            revision: {
                nameCss: 'yellow',
                hex: 'ffff00',
                hue: 361,
                saturation: 100,
                lightness: 46,
                ral: null,
                oracal: null,
                ncs: null,
                hks: null,
                threeM: null,
                lab: null,
                rgba: {
                    red: 255,
                    green: 255,
                    blue: 0,
                    alpha: 255,
                },
                cmyk: {
                    cyan: 0,
                    magenta: 0,
                    yellow: 100,
                    black: 0,
                    coated: null,
                    uncoated: null,
                    newspaper: null,
                },
                pantone: {
                    code: null,
                    coated: null,
                    uncoated: null,
                    cp: null,
                    plastics: null,
                    textile: null,
                },
            },
        };
    }

    static green(id = 769): Color {
        return {
            id,
            sort: 3,
            title: 'Green',
            revision: {
                nameCss: 'green',
                hex: '00ff00',
                ral: null,
                oracal: null,
                ncs: null,
                hks: null,
                threeM: null,
                lab: null,
                hue: 361,
                saturation: 100,
                lightness: 46,
                rgba: {
                    red: 0,
                    green: 255,
                    blue: 0,
                    alpha: 255,
                },
                cmyk: {
                    cyan: 100,
                    magenta: 0,
                    yellow: 100,
                    black: 0,
                    coated: null,
                    uncoated: null,
                    newspaper: null,
                },
                pantone: {
                    code: null,
                    coated: null,
                    uncoated: null,
                    cp: null,
                    plastics: null,
                    textile: null,
                },
            },
        };
    }
}

export class ColorCreateDummy {
    static red(): ColorCreate {
        return {
            colorPaletteId: 23,
            red: 255,
            green: 0,
            blue: 0,
            alpha: 255,
        };
    }
}

export class ColorPatchDummy {
    static red(): ColorPatch {
        return {
            title: 'Red',
            sort: 1,
            nameCss: 'red',
            ral: null,
            oracal: null,
            ncs: null,
            hks: null,
            threeM: null,
            lab: null,
            rgba: {
                red: 255,
                green: 0,
                blue: 0,
                alpha: 255,
            },
            cmyk: {
                cyan: 0,
                magenta: 100,
                yellow: 100,
                black: 0,
                coated: null,
                uncoated: null,
                newspaper: null,
            },
            pantone: {
                code: null,
                coated: null,
                uncoated: null,
                cp: null,
                plastics: null,
                textile: null,
            },
        };
    }
}

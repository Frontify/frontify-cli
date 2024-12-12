/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PartialDeep } from 'type-fest';

export type ColorApi = {
    id: number;
    creator: number;
    created: string;
    modifier: Nullable<number>;
    modified: Nullable<string>;
    valid_from: Nullable<string>;
    valid_to: Nullable<string>;
    project: number;
    reference_color: Nullable<number>;
    group: Nullable<string>;
    palette: Nullable<number>;
    type: Nullable<string>;
    name: Nullable<string>;
    name_css: Nullable<string>;
    sort: number;
    hex: Nullable<string>;
    r: Nullable<number>;
    g: Nullable<number>;
    b: Nullable<number>;
    alpha: Nullable<number>;
    hue: number;
    saturation: number;
    lightness: Nullable<number>;
    gradient_direction: Nullable<string>;
    gradient_color_one: Nullable<number>;
    gradient_color_two: Nullable<number>;
    gradient_type: Nullable<string>;
    usage: string;
    priority: Nullable<number>;
    c: Nullable<number>;
    m: Nullable<number>;
    y: Nullable<number>;
    k: Nullable<number>;
    pantone: Nullable<string>;
    ral: Nullable<string>;
    oracal: Nullable<string>;
    pantone_coated: Nullable<string>;
    pantone_uncoated: Nullable<string>;
    cmyk_coated: Nullable<string>;
    cmyk_uncoated: Nullable<string>;
    cmyk_newspaper: Nullable<string>;
    ncs: Nullable<string>;
    pantone_cp: Nullable<string>;
    pantone_plastics: Nullable<string>;
    pantone_textile: Nullable<string>;
    hks: Nullable<string>;
    three_m: Nullable<string>;
    lab: Nullable<string>;
    opacity: Nullable<number>;
    opacity_css: Nullable<number>;
    css_value: Nullable<string>;
};

export type ColorApiCreate = {
    project_color_palette_id: number;
    red: number;
    green: number;
    blue: number;
    alpha: number;
};

export type ColorApiPatch = Partial<{
    language: Nullable<string>;
    name: Nullable<string>;
    name_css: Nullable<string>;
    sort: Nullable<number>;
    red: Nullable<number>;
    green: Nullable<number>;
    blue: Nullable<number>;
    alpha: Nullable<number>;
    c: Nullable<number>;
    m: Nullable<number>;
    y: Nullable<number>;
    k: Nullable<number>;
    pantone: Nullable<string>;
    ral: Nullable<string>;
    oracal: Nullable<string>;
    pantone_coated: Nullable<string>;
    pantone_uncoated: Nullable<string>;
    cmyk_coated: Nullable<string>;
    cmyk_uncoated: Nullable<string>;
    cmyk_newspaper: Nullable<string>;
    ncs: Nullable<string>;
    pantone_cp: Nullable<string>;
    pantone_plastics: Nullable<string>;
    pantone_textile: Nullable<string>;
    hks: Nullable<string>;
    three_m: Nullable<string>;
    lab: Nullable<string>;
}>;

export type Color = {
    id: number;
    sort: number;
} & ColorAsset;

// This type should be evolved to Asset in the long run
export type ColorAsset = {
    title: Nullable<string>;
    revision: ColorRevision;
};

export type ColorRevision = {
    nameCss: Nullable<string>;
    hex: Nullable<string>;
    hue: number;
    saturation: number;
    lightness: Nullable<number>;
    ral: Nullable<string>;
    oracal: Nullable<string>;
    ncs: Nullable<string>;
    hks: Nullable<string>;
    threeM: Nullable<string>;
    lab: Nullable<string>;
    cmyk: CmykColor;
    rgba: RgbaColor;
    pantone: PantoneColor;
};

export type ColorCreate = {
    colorPaletteId: number;
    red: number;
    green: number;
    blue: number;
    alpha: number;
};

export type ColorPatch = PartialDeep<
    Omit<ColorRevision, 'hex' | 'hue' | 'saturation' | 'lightness'> & {
        title: Nullable<string>;
        sort: number;
    }
>;

type RgbaColor = {
    red: Nullable<number>;
    green: Nullable<number>;
    blue: Nullable<number>;
    alpha: Nullable<number>;
};

type CmykColor = {
    cyan: Nullable<number>;
    magenta: Nullable<number>;
    yellow: Nullable<number>;
    black: Nullable<number>;
    coated: Nullable<string>;
    uncoated: Nullable<string>;
    newspaper: Nullable<string>;
};

type PantoneColor = {
    code: Nullable<string>;
    coated: Nullable<string>;
    uncoated: Nullable<string>;
    cp: Nullable<string>;
    plastics: Nullable<string>;
    textile: Nullable<string>;
};

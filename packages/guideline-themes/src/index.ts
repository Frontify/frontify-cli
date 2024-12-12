/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeTheme, type ThemeTemplate } from '@frontify/app-bridge-theme';
import {
    type AssetInputBlock as AssetInputBlockSidebarSettings,
    type BaseBlock as BaseBlockSidebarSettings,
    type Bundle as BundleSidebarSettings,
    type ChecklistBlock as ChecklistBlockSidebarSettings,
    type ChoicesType as ChoicesTypeSidebarSettings,
    type ColorInputBlock as ColorInputBlockSidebarSettings,
    type DropdownBlock as DropdownBlockSidebarSettings,
    type DynamicSettingBlock as DynamicSettingBlockSidebarSettings,
    type DynamicSupportedBlock as DynamicSupportedBlockSidebarSettings,
    type InputBlock as InputBlockSidebarSettings,
    type LegacyAssetInputBlock as LegacyAssetInputBlockSidebarSettings,
    type LinkChooserBlock as LinkChooserBlockSidebarSettings,
    type MultiInputBlock as MultiInputBlockSidebarSettings,
    type NotificationBlock as NotificationBlockSidebarSettings,
    type SectionHeadingBlock as SectionHeadingBlockSidebarSettings,
    type SegmentedControlsBlock as SegmentedControlsBlockSidebarSettings,
    type SettingBlock as SettingBlockSidebarSettings,
    type SimpleSettingBlock as SimpleSettingBlockSidebarSettings,
    type SwitchBlock as SwitchBlockSidebarSettings,
    type TemplateInputBlock as TemplateInputBlockSidebarSettings,
    type TextareaBlock as TextareaBlockSidebarSettings,
    type ValueOrPromisedValue as ValueOrPromisedValueSidebarSettings,
} from '@frontify/sidebar-settings';
import { type FC } from 'react';

export * from '@frontify/sidebar-settings';

export * from './utilities';

export type AssetInputBlock = AssetInputBlockSidebarSettings<AppBridgeTheme>;
export type BaseBlock<T = undefined> = BaseBlockSidebarSettings<AppBridgeTheme, T>;
export type Bundle = BundleSidebarSettings<AppBridgeTheme>;
export type ChecklistBlock = ChecklistBlockSidebarSettings<AppBridgeTheme>;
export type ChoicesType = ChoicesTypeSidebarSettings<AppBridgeTheme>;
export type ColorInputBlock = ColorInputBlockSidebarSettings<AppBridgeTheme>;
export type DropdownBlock = DropdownBlockSidebarSettings<AppBridgeTheme>;
export type DynamicSettingBlock<Block extends DynamicSupportedBlock = DynamicSupportedBlock> =
    DynamicSettingBlockSidebarSettings<AppBridgeTheme, Block>;
export type DynamicSupportedBlock = DynamicSupportedBlockSidebarSettings<AppBridgeTheme>;
export type InputBlock = InputBlockSidebarSettings<AppBridgeTheme>;
export type LegacyAssetInputBlock = LegacyAssetInputBlockSidebarSettings<AppBridgeTheme>;
export type LinkChooserBlock = LinkChooserBlockSidebarSettings<AppBridgeTheme>;
export type MultiInputBlock = MultiInputBlockSidebarSettings<AppBridgeTheme>;
export type NotificationBlock = NotificationBlockSidebarSettings<AppBridgeTheme>;
export type SectionHeadingBlock = SectionHeadingBlockSidebarSettings<AppBridgeTheme>;
export type SegmentedControlsBlock = SegmentedControlsBlockSidebarSettings<AppBridgeTheme>;
export type SettingBlock = SettingBlockSidebarSettings<AppBridgeTheme>;
export type SimpleSettingBlock = SimpleSettingBlockSidebarSettings<AppBridgeTheme>;
export type SwitchBlock = SwitchBlockSidebarSettings<AppBridgeTheme>;
export type TemplateInputBlock = TemplateInputBlockSidebarSettings<AppBridgeTheme>;
export type TextareaBlock = TextareaBlockSidebarSettings<AppBridgeTheme>;
export type ValueOrPromisedValue<T> = ValueOrPromisedValueSidebarSettings<AppBridgeTheme, T>;

export type ContentAreaWidthChoice = `${number}${'px' | '%' | 'vw'}`;
export type ContentAreaWidthTemplateSettings = {
    contentAreaWidthChoice?: ContentAreaWidthChoice;
    contentAreaWidthCustom?: `${number}${string}`;
    contentAreaWidthCustomEnabled?: boolean;
};
export type ContentAreaPaddingChoice = `${number}${'px' | '%' | 'vw'}`;
export type ContentAreaPaddingTemplateSettings = {
    contentAreaPaddingChoice?: ContentAreaPaddingChoice;
    contentAreaPaddingCustom?: `${number}${string}`;
    contentAreaPaddingCustomEnabled?: boolean;
};
export type ContentAreaAlignmentChoice = 'left' | 'center' | 'right';
export type ContentAreaAlignmentSetting = { contentAreaAlignmentChoice?: ContentAreaAlignmentChoice };

export type ThemeSettingsStructureExport = { [customSectionName: string]: SettingBlock[] };
export type ThemeSettingsStructure = Record<ThemeTemplate, ThemeSettingsStructureExport>;

export type ThemeProps = {
    appBridge: AppBridgeTheme;
    Content: FC;
    Footer: FC | null;
};

export type ThemeTemplateExport = {
    component: FC<ThemeProps>;
    settings: ThemeSettingsStructureExport;
};

export type ThemeConfigExport = {
    templates: {
        cover: { default: ThemeTemplateExport } & Record<string, ThemeTemplateExport>;
        documentPage: { default: ThemeTemplateExport } & Record<string, ThemeTemplateExport>;
        library: { default: ThemeTemplateExport } & Record<string, ThemeTemplateExport>;
    };
};

/**
 * Type helper to make it easier to export a theme, accepts a direct {@link ThemeConfigExport} object.
 */
export const defineTheme = (config: ThemeConfigExport): ThemeConfigExport => config;

/**
 * Type helper to make it easier to export theme's settings structure, accepts a direct {@link ThemeSettingsStructureExport} object.
 */
export const defineSettings = (settingsStructure: ThemeSettingsStructureExport): ThemeSettingsStructureExport =>
    settingsStructure;

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgePlatformApp } from '@frontify/app-bridge-app';
import {
    type ChecklistBlock as ChecklistBlockSettings,
    type ColorInputBlock as ColorInputBlockSettings,
    type DropdownBlock as DropdownBlockSettings,
    type DynamicSettingBlock,
    type InputBlock as InputBlockSettings,
    type MultiInputBlock as MultiInputBlockSettings,
    type NotificationBlock as NotificationBlockSettings,
    type SectionHeadingBlock as SectionHeadingBlockSettings,
    type SegmentedControlsBlock as SegmentedControlsBlockSettings,
    type SettingBlock as SettingBlockSettings,
    type SwitchBlock as SwitchBlockSettings,
    type TextareaBlock as TextareaBlockSettings,
} from '@frontify/sidebar-settings';
import { type FC } from 'react';

export type ChecklistBlock = ChecklistBlockSettings<AppBridgePlatformApp>;
export type ColorInputBlock = ColorInputBlockSettings<AppBridgePlatformApp>;
export type DropdownBlock = DropdownBlockSettings<AppBridgePlatformApp>;
export type InputBlock = InputBlockSettings<AppBridgePlatformApp>;
export type MultiInputBlock = MultiInputBlockSettings<AppBridgePlatformApp>;
export type NotificationBlock = NotificationBlockSettings<AppBridgePlatformApp>;
export type SectionHeadingBlock = SectionHeadingBlockSettings<AppBridgePlatformApp>;
export type SegmentedControlsBlock = SegmentedControlsBlockSettings<AppBridgePlatformApp>;
export type SettingBlock = SettingBlockSettings<AppBridgePlatformApp>;
export type SwitchBlock = SwitchBlockSettings<AppBridgePlatformApp>;
export type TextareaBlock = TextareaBlockSettings<AppBridgePlatformApp>;

export type PlatformAppSimpleBlock =
    | ColorInputBlock
    | ChecklistBlock
    | DropdownBlock
    | InputBlock
    | MultiInputBlock
    | NotificationBlock
    | SectionHeadingBlock
    | SegmentedControlsBlock
    | SwitchBlock
    | TextareaBlock;

export type PlatformAppSettings = PlatformAppSimpleBlock | DynamicSettingBlock<AppBridgePlatformApp>;

export type PlatformAppSettingsStructureExport = { [customSectionName: string]: PlatformAppSettings[] };
export type PlatformAppMultiSettingsStructureExport = {
    default: PlatformAppSettingsStructureExport;
    automation?: {
        actions?: {
            [customActionId: string]: PlatformAppSettingsStructureExport;
        };
    };
};

export type PlatformAppConfigExport = {
    app: FC;
    settings: PlatformAppMultiSettingsStructureExport | PlatformAppSettingsStructureExport;
};

/**
 * Type helper to export a platform-app, accepts a direct {@link PlatformAppConfigExport} object.
 */
export const defineApp = (config: PlatformAppConfigExport): PlatformAppConfigExport => config;

/**
 * Type helper to export platform-app settings structure, accepts a direct {@link PlatformAppSettingsStructureExport} object.
 */
export const defineSettings = (
    settingsStructure: PlatformAppSettingsStructureExport,
): PlatformAppSettingsStructureExport => settingsStructure;

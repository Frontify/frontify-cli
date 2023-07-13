/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type DispatchOption = {
    'AssetChooser.Open': AssetChooserOptions;
    'AssetChooser.Close': void;
    'PlatformAnalyticsTracker.Track': {
        name: 'download asset';
        data: {
            asset: Asset;
            downloadType: string;
        };
    };
};

export type DispatchHandler<CommandName extends keyof DispatchOption> = {
    commandName: CommandName;
    options?: DispatchOption[CommandName];
};

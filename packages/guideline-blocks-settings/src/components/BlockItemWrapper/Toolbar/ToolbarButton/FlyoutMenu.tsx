/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ActionMenu, MenuItemContentSize, MenuItemStyle } from '@frontify/fondue';
import { useCloseFlyoutContext } from '../context/FlyoutCloseContext';

export type FlyoutMenuItem = {
    title: string;
    onClick: () => void;
    icon: JSX.Element;
    style?: MenuItemStyle;
};

export type FlyoutMenuProps = {
    items: FlyoutMenuItem[][];
};

export const FlyoutMenu = ({ items }: FlyoutMenuProps) => {
    const closeFlyout = useCloseFlyoutContext();

    return (
        <ActionMenu
            menuBlocks={items.map((block, blockIndex) => ({
                id: blockIndex.toString(),
                menuItems: block.map((item, itemIndex) => ({
                    id: blockIndex.toString() + itemIndex.toString(),
                    size: MenuItemContentSize.XSmall,
                    title: item.title,
                    style: item.style,
                    onClick: () => {
                        closeFlyout();
                        item.onClick();
                    },
                    initialValue: true,
                    decorator: <div className="tw-mr-2">{item.icon}</div>,
                })),
            }))}
        />
    );
};

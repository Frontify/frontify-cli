/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateRenderElementProps } from '@udecode/plate-core';
import { Value } from '@udecode/slate';
import { CSSProperties, HTMLAttributeAnchorTarget, ReactElement, ReactNode, useState } from 'react';
import { TButtonElement } from '../types';
import { BlockButtonStyles } from '../utils';

export type ButtonRootProps = PlateRenderElementProps<Value, TButtonElement>;

export const ButtonMarkupElementNode = (props: ButtonRootProps) => {
    const { attributes, children } = props;
    const href = props.element.url || props.element.chosenLink?.searchResult?.link || '';
    const target = props.element.target || '_self';
    const buttonStyle = (props.element.buttonStyle as string) || 'primary';
    return (
        <HoverableButtonLink
            attributes={attributes}
            href={href}
            target={target}
            styles={BlockButtonStyles[`button${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)}`]}
        >
            {children}
        </HoverableButtonLink>
    );
};

type Props = {
    attributes: ButtonRootProps['attributes'];
    children: ReactNode;
    styles?: CSSProperties & { hover?: CSSProperties };
    href?: string;
    target?: HTMLAttributeAnchorTarget;
};

const HoverableButtonLink = ({
    attributes,
    styles = { hover: {} },
    children,
    href = '#',
    target,
}: Props): ReactElement => {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            {...attributes}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            href={href}
            target={target}
            style={hovered ? { ...styles, ...styles.hover } : styles}
        >
            {children}
        </a>
    );
};

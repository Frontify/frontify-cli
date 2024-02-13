/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TLinkElement as TPlateLinkElement } from '@udecode/plate-link';
import { LINK_PLUGIN } from '../id';
import { PlateRenderElementProps } from '@udecode/plate-core';
import { useRichTextEditorContext } from '@frontify/fondue';

export type TLinkElement = TPlateLinkElement & {
    chosenLink?: {
        searchResult?: {
            link?: string;
        };
        openInNewTab?: boolean;
    };
};

export const LinkMarkupElementNode = (props: PlateRenderElementProps & { element: TLinkElement }) => {
    const { attributes, children } = props;

    const { styles } = useRichTextEditorContext();
    const href = props.element.url || props.element.chosenLink?.searchResult?.link || '';
    const target = props.element.target || '_self';

    return (
        <a {...attributes} href={href} target={target} style={styles[LINK_PLUGIN]}>
            {children}
        </a>
    );
};

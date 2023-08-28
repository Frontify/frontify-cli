/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CSSProperties } from 'react';
import { LINK_PLUGIN } from './LinkPlugin/id';
import { BlockButtonStyles } from './ButtonPlugin';

export const enum TextStyles {
    heading1 = 'heading1',
    heading2 = 'heading2',
    heading3 = 'heading3',
    heading4 = 'heading4',
    custom1 = 'custom1',
    custom2 = 'custom2',
    custom3 = 'custom3',
    quote = 'quote',
    imageCaption = 'imageCaption',
    imageTitle = 'imageTitle',
    p = 'p',
}
export const BlockStyles: Record<string, CSSProperties & { hover?: CSSProperties }> = {
    [TextStyles.heading1]: {
        display: 'inline-block',
        fontSize: 'var(--f-theme-settings-heading1-font-size)',
        lineHeight: 'var(--f-theme-settings-heading1-line-height)',
        marginTop: 'var(--f-theme-settings-heading1-margin-top)',
        marginBottom: 'var(--f-theme-settings-heading1-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-heading1-text-decoration)',
        fontStyle: 'var(--f-theme-settings-heading1-font-style)',
        textTransform: 'var(--f-theme-settings-heading1-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-heading1-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-heading1-font-weight)',
        fontFamily: 'var(--f-theme-settings-heading1-font-family)',
        color: 'var(--f-theme-settings-heading1-color)',
    },
    [TextStyles.heading2]: {
        fontSize: 'var(--f-theme-settings-heading2-font-size)',
        lineHeight: 'var(--f-theme-settings-heading2-line-height)',
        marginTop: 'var(--f-theme-settings-heading2-margin-top)',
        marginBottom: 'var(--f-theme-settings-heading2-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-heading2-text-decoration)',
        fontStyle: 'var(--f-theme-settings-heading2-font-style)',
        textTransform: 'var(--f-theme-settings-heading2-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-heading2-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-heading2-font-weight)',
        fontFamily: 'var(--f-theme-settings-heading2-font-family)',
        color: 'var(--f-theme-settings-heading2-color)',
    },
    [TextStyles.heading3]: {
        fontSize: 'var(--f-theme-settings-heading3-font-size)',
        lineHeight: 'var(--f-theme-settings-heading3-line-height)',
        marginTop: 'var(--f-theme-settings-heading3-margin-top)',
        marginBottom: 'var(--f-theme-settings-heading3-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-heading3-text-decoration)',
        fontStyle: 'var(--f-theme-settings-heading3-font-style)',
        textTransform: 'var(--f-theme-settings-heading3-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-heading3-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-heading3-font-weight)',
        fontFamily: 'var(--f-theme-settings-heading3-font-family)',
        color: 'var(--f-theme-settings-heading3-color)',
    },
    [TextStyles.heading4]: {
        fontSize: 'var(--f-theme-settings-heading4-font-size)',
        lineHeight: 'var(--f-theme-settings-heading4-line-height)',
        marginTop: 'var(--f-theme-settings-heading4-margin-top)',
        marginBottom: 'var(--f-theme-settings-heading4-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-heading4-text-decoration)',
        fontStyle: 'var(--f-theme-settings-heading4-font-style)',
        textTransform: 'var(--f-theme-settings-heading4-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-heading4-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-heading4-font-weight)',
        fontFamily: 'var(--f-theme-settings-heading4-font-family)',
        color: 'var(--f-theme-settings-heading4-color)',
    },
    [TextStyles.custom1]: {
        fontSize: 'var(--f-theme-settings-custom1-font-size)',
        lineHeight: 'var(--f-theme-settings-custom1-line-height)',
        marginTop: 'var(--f-theme-settings-custom1-margin-top)',
        marginBottom: 'var(--f-theme-settings-custom1-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-custom1-text-decoration)',
        fontStyle: 'var(--f-theme-settings-custom1-font-style)',
        textTransform: 'var(--f-theme-settings-custom1-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-custom1-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-custom1-font-weight)',
        fontFamily: 'var(--f-theme-settings-custom1-font-family)',
        color: 'var(--f-theme-settings-custom1-color)',
    },
    [TextStyles.custom2]: {
        fontSize: 'var(--f-theme-settings-custom2-font-size)',
        lineHeight: 'var(--f-theme-settings-custom2-line-height)',
        marginTop: 'var(--f-theme-settings-custom2-margin-top)',
        marginBottom: 'var(--f-theme-settings-custom2-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-custom2-text-decoration)',
        fontStyle: 'var(--f-theme-settings-custom2-font-style)',
        textTransform: 'var(--f-theme-settings-custom2-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-custom2-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-custom2-font-weight)',
        fontFamily: 'var(--f-theme-settings-custom2-font-family)',
        color: 'var(--f-theme-settings-custom2-color)',
    },
    [TextStyles.custom3]: {
        fontSize: 'var(--f-theme-settings-custom3-font-size)',
        lineHeight: 'var(--f-theme-settings-custom3-line-height)',
        marginTop: 'var(--f-theme-settings-custom3-margin-top)',
        marginBottom: 'var(--f-theme-settings-custom3-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-custom3-text-decoration)',
        fontStyle: 'var(--f-theme-settings-custom3-font-style)',
        textTransform: 'var(--f-theme-settings-custom3-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-custom3-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-custom3-font-weight)',
        fontFamily: 'var(--f-theme-settings-custom3-font-family)',
        color: 'var(--f-theme-settings-custom3-color)',
    },
    [TextStyles.p]: {
        fontSize: 'var(--f-theme-settings-body-font-size)',
        lineHeight: 'var(--f-theme-settings-body-line-height)',
        marginTop: 'var(--f-theme-settings-body-margin-top)',
        marginBottom: 'var(--f-theme-settings-body-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-body-text-decoration)',
        fontStyle: 'var(--f-theme-settings-body-font-style)',
        textTransform: 'var(--f-theme-settings-body-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-body-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-body-font-weight)',
        fontFamily: 'var(--f-theme-settings-body-font-family)',
        color: 'var(--f-theme-settings-body-color)',
    },
    [TextStyles.quote]: {
        fontSize: 'var(--f-theme-settings-quote-font-size)',
        lineHeight: 'var(--f-theme-settings-quote-line-height)',
        marginTop: 'var(--f-theme-settings-quote-margin-top)',
        marginBottom: 'var(--f-theme-settings-quote-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-quote-text-decoration)',
        fontStyle: 'var(--f-theme-settings-quote-font-style)',
        textTransform: 'var(--f-theme-settings-quote-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-quote-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-quote-font-weight)',
        fontFamily: 'var(--f-theme-settings-quote-font-family)',
        color: 'var(--f-theme-settings-quote-color)',
    },
    [TextStyles.imageCaption]: {
        fontSize: 'var(--f-theme-settings-image-caption-font-size)',
        lineHeight: 'var(--f-theme-settings-image-caption-line-height)',
        marginTop: 'var(--f-theme-settings-image-caption-margin-top)',
        marginBottom: 'var(--f-theme-settings-image-caption-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-image-caption-text-decoration)',
        fontStyle: 'var(--f-theme-settings-image-caption-font-style)',
        textTransform: 'var(--f-theme-settings-image-caption-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-image-caption-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-image-caption-font-weight)',
        fontFamily: 'var(--f-theme-settings-image-caption-font-family)',
        color: 'var(--f-theme-settings-image-caption-color)',
    },
    [TextStyles.imageTitle]: {
        fontSize: 'var(--f-theme-settings-image-title-font-size)',
        lineHeight: 'var(--f-theme-settings-image-title-line-height)',
        marginTop: 'var(--f-theme-settings-image-title-margin-top)',
        marginBottom: 'var(--f-theme-settings-image-title-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-image-title-text-decoration)',
        fontStyle: 'var(--f-theme-settings-image-title-font-style)',
        textTransform: 'var(--f-theme-settings-image-title-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-image-title-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-image-title-font-weight)',
        fontFamily: 'var(--f-theme-settings-image-title-font-family)',
        color: 'var(--f-theme-settings-image-title-color)',
    },
    [LINK_PLUGIN]: {
        fontSize: 'var(--f-theme-settings-link-font-size)',
        lineHeight: 'var(--f-theme-settings-link-line-height)',
        marginTop: 'var(--f-theme-settings-link-margin-top)',
        marginBottom: 'var(--f-theme-settings-link-margin-bottom)',
        textDecoration: 'var(--f-theme-settings-link-text-decoration)',
        fontStyle: 'var(--f-theme-settings-link-font-style)',
        textTransform: 'var(--f-theme-settings-link-text-transform)' as CSSProperties['textTransform'],
        letterSpacing: 'var(--f-theme-settings-link-letter-spacing)',
        fontWeight: 'var(--f-theme-settings-link-font-weight)',
        fontFamily: 'var(--f-theme-settings-link-font-family)',
        color: 'var(--f-theme-settings-link-color)',
    },
    ...BlockButtonStyles,
};

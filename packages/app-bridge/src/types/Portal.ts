/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Language = {
    /**
     * The language code in ISO 639-1 format.
     */
    isoCode: string;

    /**
     * The name of the language.
     */
    name: string;

    /**
     * Indicates whether the language is the default language.
     */
    default: boolean;

    /**
     * Indicates whether the language is in draft status.
     */
    draft: boolean;
};

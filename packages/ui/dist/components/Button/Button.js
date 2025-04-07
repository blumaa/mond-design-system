import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { colors, radii, spacing, fontSizes, fontWeights } from '@comp-lib-proto/tokens';
const getVariantStyles = (variant) => {
    switch (variant) {
        case 'primary':
            return {
                backgroundColor: colors.primary[500],
                color: 'white',
                border: 'none',
                '&:hover': {
                    backgroundColor: colors.primary[600],
                },
                '&:active': {
                    backgroundColor: colors.primary[700],
                },
            };
        case 'secondary':
            return {
                backgroundColor: colors.neutral[200],
                color: colors.neutral[800],
                border: 'none',
                '&:hover': {
                    backgroundColor: colors.neutral[300],
                },
                '&:active': {
                    backgroundColor: colors.neutral[400],
                },
            };
        case 'outline':
            return {
                backgroundColor: 'transparent',
                color: colors.primary[500],
                border: `1px solid ${colors.primary[500]}`,
                '&:hover': {
                    backgroundColor: colors.primary[50],
                },
                '&:active': {
                    backgroundColor: colors.primary[100],
                },
            };
        case 'ghost':
            return {
                backgroundColor: 'transparent',
                color: colors.primary[500],
                border: 'none',
                '&:hover': {
                    backgroundColor: colors.primary[50],
                },
                '&:active': {
                    backgroundColor: colors.primary[100],
                },
            };
        default:
            return {};
    }
};
const getSizeStyles = (size) => {
    switch (size) {
        case 'sm':
            return {
                padding: `${spacing[1]} ${spacing[2]}`,
                fontSize: fontSizes.sm,
            };
        case 'md':
            return {
                padding: `${spacing[2]} ${spacing[4]}`,
                fontSize: fontSizes.base,
            };
        case 'lg':
            return {
                padding: `${spacing[3]} ${spacing[6]}`,
                fontSize: fontSizes.lg,
            };
        default:
            return {};
    }
};
export const Button = React.forwardRef(({ variant = 'primary', size = 'md', children, disabled = false, ...props }, ref) => {
    const variantStyles = getVariantStyles(variant);
    const sizeStyles = getSizeStyles(size);
    const buttonStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii.md,
        fontWeight: fontWeights.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 150ms ease',
        ...variantStyles,
        ...sizeStyles,
    };
    // Convert styles object to inline style for simplicity
    // In a real implementation, you'd use a styling solution like styled-components, emotion, etc.
    const inlineStyles = {};
    Object.entries(buttonStyles).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
            // @ts-ignore - dynamic styles
            inlineStyles[key] = value;
        }
    });
    return (_jsx("button", { ref: ref, disabled: disabled, style: inlineStyles, ...props, children: children }));
});
Button.displayName = 'Button';

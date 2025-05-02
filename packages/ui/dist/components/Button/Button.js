import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { colors, radii, spacing, fontSizes, fontWeights } from '@comp-lib-proto/tokens';
const getVariantStyles = (variant, isDarkMode = false) => {
    const themeColors = {
        primary: isDarkMode ? colors.primary[400] : colors.primary[50],
        text: isDarkMode ? colors.primary[700] : colors.primary[300],
        hover: isDarkMode ? colors.primary[500] : colors.primary[100],
        active: isDarkMode ? colors.primary[600] : colors.primary[200],
    };
    switch (variant) {
        case 'primary':
            return {
                backgroundColor: themeColors.primary,
                color: themeColors.text,
                border: 'none',
                '&:hover': {
                    backgroundColor: themeColors.hover,
                },
                '&:active': {
                    backgroundColor: themeColors.active,
                },
            };
        case 'secondary':
            return {
                backgroundColor: 'transparent',
                color: themeColors.text,
                border: `1px solid ${themeColors.text}`,
                '&:hover': {
                    backgroundColor: `${themeColors.text}1A`, // 10% opacity
                },
                '&:active': {
                    backgroundColor: `${themeColors.text}33`, // 20% opacity
                },
            };
        case 'outline':
            return {
                backgroundColor: 'transparent',
                color: themeColors.text,
                border: `1px solid ${themeColors.text}`,
                '&:hover': {
                    backgroundColor: `${themeColors.text}1A`, // 10% opacity
                },
                '&:active': {
                    backgroundColor: `${themeColors.text}33`, // 20% opacity
                },
            };
        case 'ghost':
            return {
                backgroundColor: 'transparent',
                color: themeColors.text,
                border: 'none',
                '&:hover': {
                    backgroundColor: `${themeColors.text}1A`, // 10% opacity
                },
                '&:active': {
                    backgroundColor: `${themeColors.text}33`, // 20% opacity
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
export const Button = React.forwardRef(({ variant = 'primary', size = 'md', children, disabled = false, isDarkMode = false, ...props }, ref) => {
    const variantStyles = getVariantStyles(variant, isDarkMode);
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

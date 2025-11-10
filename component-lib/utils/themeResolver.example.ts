// Example usage of semantic tokens and theme helper

import { useBasicTheme, resolveSemanticToken } from './themeResolver';

// Example 1: Using the theme hook in a React component
export function ExampleComponent({ isDarkMode }: { isDarkMode: boolean }) {
  const theme = useBasicTheme(isDarkMode);
  
  return {
    // Before: Direct color references
    // backgroundColor: colors.blue[700],
    // color: colors.white[50],
    
    // After: Semantic tokens that adapt to theme
    backgroundColor: theme('interactive.primary.background'), // blue-600 in light, blue-500 in dark
    color: theme('interactive.primary.text'),                 // white in both themes
    borderColor: theme('border.default'),                     // gray-300 in light, gray-600 in dark
  };
}

// Example 2: Direct semantic token resolution
export function getButtonStyles(isDarkMode: boolean) {
  return {
    primary: {
      background: resolveSemanticToken('interactive.primary.background', isDarkMode ? 'dark' : 'light'),
      text: resolveSemanticToken('interactive.primary.text', isDarkMode ? 'dark' : 'light'),
      hover: resolveSemanticToken('interactive.primary.backgroundHover', isDarkMode ? 'dark' : 'light'),
    },
    secondary: {
      background: resolveSemanticToken('interactive.secondary.background', isDarkMode ? 'dark' : 'light'),
      text: resolveSemanticToken('interactive.secondary.text', isDarkMode ? 'dark' : 'light'),
      border: resolveSemanticToken('interactive.secondary.border', isDarkMode ? 'dark' : 'light'),
    }
  };
}

// Example 3: Getting both theme values manually
export function getTextColors() {
  return {
    primary: {
      light: resolveSemanticToken('text.primary', 'light'),
      dark: resolveSemanticToken('text.primary', 'dark')
    },
    secondary: {
      light: resolveSemanticToken('text.secondary', 'light'),
      dark: resolveSemanticToken('text.secondary', 'dark')
    },
    error: {
      light: resolveSemanticToken('text.error', 'light'),
      dark: resolveSemanticToken('text.error', 'dark')
    },
    success: {
      light: resolveSemanticToken('text.success', 'light'),
      dark: resolveSemanticToken('text.success', 'dark')
    }
  };
}

// Example 4: Available semantic token paths
export const AVAILABLE_SEMANTIC_TOKENS = {
  text: [
    'text.primary',
    'text.secondary', 
    'text.tertiary',
    'text.disabled',
    'text.inverse',
    'text.link',
    'text.success',
    'text.warning',
    'text.error'
  ],
  surface: [
    'surface.background',
    'surface.elevated',
    'surface.overlay',
    'surface.card',
    'surface.input',
    'surface.disabled'
  ],
  border: [
    'border.default',
    'border.subtle',
    'border.strong',
    'border.focused',
    'border.success',
    'border.warning',
    'border.error'
  ],
  interactive: [
    'interactive.primary.background',
    'interactive.primary.backgroundHover',
    'interactive.primary.backgroundPressed',
    'interactive.primary.backgroundDisabled',
    'interactive.primary.text',
    'interactive.primary.textDisabled',
    'interactive.secondary.background',
    'interactive.secondary.backgroundHover',
    'interactive.secondary.backgroundPressed',
    'interactive.secondary.border',
    'interactive.secondary.borderHover',
    'interactive.secondary.text',
    'interactive.ghost.background',
    'interactive.ghost.backgroundHover',
    'interactive.ghost.backgroundPressed',
    'interactive.ghost.text'
  ],
  feedback: [
    'feedback.success.background',
    'feedback.success.border',
    'feedback.success.text',
    'feedback.warning.background',
    'feedback.warning.border',
    'feedback.warning.text',
    'feedback.error.background',
    'feedback.error.border',
    'feedback.error.text',
    'feedback.info.background',
    'feedback.info.border',
    'feedback.info.text'
  ]
} as const;
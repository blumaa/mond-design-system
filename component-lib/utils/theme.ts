import { tokens } from '../tokens';

export type Theme = 'light' | 'dark';

/**
 * Gets a nested property value from an object using dot notation
 * Example: getNestedValue(colors, 'blue.500') returns colors.blue[500]
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Resolves a semantic token to its actual color value based on the current theme
 * 
 * @param semanticTokenPath - Path to semantic token (e.g., 'text.primary')
 * @param theme - Current theme ('light' or 'dark')
 * @returns Resolved hex color value
 * 
 * @example
 * resolveSemanticToken('text.primary', 'light') // returns '#0f172a' (gray.900)
 * resolveSemanticToken('interactive.primary.background', 'dark') // returns '#0ea5e9' (blue.500)
 */
export function resolveSemanticToken(semanticTokenPath: string, theme: Theme = 'light'): string {
  // Get the semantic token definition
  const semanticToken = getNestedValue(tokens.semantic, semanticTokenPath);
  
  if (!semanticToken) {
    console.warn(`Semantic token not found: ${semanticTokenPath}`);
    return '#000000'; // Fallback to black
  }
  
  // If it's a direct value (not theme-aware), return it
  if (typeof semanticToken === 'string') {
    return semanticToken;
  }
  
  // Get the color reference for the current theme
  const colorReference = semanticToken[theme];
  
  if (!colorReference) {
    console.warn(`Theme '${theme}' not found for semantic token: ${semanticTokenPath}`);
    return '#000000'; // Fallback to black
  }
  
  // Resolve the color reference (e.g., 'gray.900' -> '#0f172a')
  const resolvedColor = getNestedValue(tokens.colors, colorReference);
  
  if (!resolvedColor) {
    console.warn(`Color reference not found: ${colorReference} for semantic token: ${semanticTokenPath}`);
    return '#000000'; // Fallback to black
  }
  
  return resolvedColor;
}

/**
 * Creates a theme resolver function that automatically uses the specified theme
 * 
 * @param theme - The theme to use for all resolutions
 * @returns Function that resolves semantic tokens for the specified theme
 * 
 * @example
 * const lightTheme = createThemeResolver('light');
 * const darkTheme = createThemeResolver('dark');
 * 
 * const textColor = lightTheme('text.primary'); // '#0f172a'
 * const darkTextColor = darkTheme('text.primary'); // '#f1f5f9'
 */
export function createThemeResolver(theme: Theme) {
  return (semanticTokenPath: string): string => {
    return resolveSemanticToken(semanticTokenPath, theme);
  };
}

/**
 * Gets both light and dark theme values for a semantic token
 * 
 * @param semanticTokenPath - Path to semantic token
 * @returns Object with light and dark theme values
 * 
 * @example
 * getThemeValues('text.primary') 
 * // returns { light: '#0f172a', dark: '#f1f5f9' }
 */
export function getThemeValues(semanticTokenPath: string): { light: string; dark: string } {
  return {
    light: resolveSemanticToken(semanticTokenPath, 'light'),
    dark: resolveSemanticToken(semanticTokenPath, 'dark'),
  };
}

/**
 * React hook for using semantic tokens with theme awareness
 * 
 * @param isDarkMode - Whether dark mode is active
 * @returns Theme resolver function for current theme
 * 
 * @example
 * function MyComponent({ isDarkMode }) {
 *   const theme = useTheme(isDarkMode);
 *   
 *   return (
 *     <div style={{ 
 *       color: theme('text.primary'),
 *       backgroundColor: theme('surface.background')
 *     }}>
 *       Content
 *     </div>
 *   );
 * }
 */
export function useTheme(isDarkMode: boolean = false) {
  const currentTheme: Theme = isDarkMode ? 'dark' : 'light';
  return createThemeResolver(currentTheme);
}

// Export semantic tokens for direct access if needed
export const semantic = tokens.semantic;

// Export core colors for fallback scenarios  
export const colors = tokens.colors;
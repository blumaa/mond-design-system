import { tokens } from '../tokens';
import type { BrandTheme } from '../components/providers/ThemeProvider';

export type Theme = 'light' | 'dark';

/**
 * Gets a nested property value from an object using dot notation
 * Example: getNestedValue(colors, 'blue.500') returns colors.blue[500]
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((current: Record<string, unknown>, key) => {
    return (current?.[key] as Record<string, unknown>) ?? {};
  }, obj) as unknown as string;
}


/**
 * Resolves a semantic token to its actual color value based on the current theme
 * 
 * @param semanticTokenPath - Path to semantic token (e.g., 'text.primary')
 * @param theme - Current theme ('light' or 'dark')
 * @param brandTheme - Optional brand theme for overrides
 * @returns Resolved hex color value
 * 
 * @example
 * resolveSemanticToken('text.primary', 'light') // returns '#0f172a' (gray.900)
 * resolveSemanticToken('interactive.primary.background', 'dark') // returns '#0ea5e9' (blue.500)
 * resolveSemanticToken('interactive.primary.background', 'light', cypherTheme) // returns brand primary
 */
export function resolveSemanticToken(
  semanticTokenPath: string, 
  theme: Theme = 'light',
  brandTheme?: BrandTheme
): string {
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
  const colorReference = (semanticToken as Record<string, string>)[theme];
  
  if (!colorReference) {
    console.warn(`Theme '${theme}' not found for semantic token: ${semanticTokenPath}`);
    return '#000000'; // Fallback to black
  }
  
  // Check if this is a brand color reference (e.g., 'brand.primary.600')
  if (colorReference.startsWith('brand.') && brandTheme) {
    const brandPath = colorReference.replace('brand.', '');
    const [colorType, shade] = brandPath.split('.');
    
    if (colorType && shade && brandTheme.colors.brand[colorType as keyof typeof brandTheme.colors.brand]) {
      const brandColorScale = brandTheme.colors.brand[colorType as keyof typeof brandTheme.colors.brand];
      const brandColor = (brandColorScale as unknown as Record<string, string>)?.[shade];
      
      if (brandColor) {
        return brandColor;
      }
    }
  }
  
  // Resolve the color reference from base tokens (e.g., 'gray.900' -> '#0f172a')
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
 * @param brandTheme - Optional brand theme for color overrides
 * @returns Function that resolves semantic tokens for the specified theme
 * 
 * @example
 * const lightTheme = createThemeResolver('light');
 * const darkTheme = createThemeResolver('dark');
 * const cypherTheme = createThemeResolver('light', cypherBrandTheme);
 * 
 * const textColor = lightTheme('text.primary'); // '#0f172a'
 * const darkTextColor = darkTheme('text.primary'); // '#f1f5f9'
 * const brandedButton = cypherTheme('interactive.primary.background'); // '#00ff94'
 */
export function createThemeResolver(theme: Theme, brandTheme?: BrandTheme) {
  return (semanticTokenPath: string): string => {
    return resolveSemanticToken(semanticTokenPath, theme, brandTheme);
  };
}


/**
 * Basic theme hook without brand context (legacy/standalone usage)
 * For new components, use useTheme from ThemeProvider instead
 * 
 * @param isDarkMode - Whether dark mode is active
 * @returns Theme resolver function for current theme (no brand context)
 * @deprecated Use useTheme from ThemeProvider for brand-aware components
 */
export function useBasicTheme(isDarkMode: boolean = false) {
  const currentTheme: Theme = isDarkMode ? 'dark' : 'light';
  
  // For components outside of ThemeProvider, use default (no brand)
  return createThemeResolver(currentTheme, undefined);
}

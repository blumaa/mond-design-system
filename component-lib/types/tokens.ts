/**
 * TypeScript-based Design Token Validation
 * 
 * Uses branded types and strict typing to prevent hardcoded values
 * at compile time instead of runtime validation.
 */

// Brand types to ensure only token values are used
export type SemanticColorToken = 
  | `text.${string}`
  | `surface.${string}` 
  | `interactive.${string}`
  | `feedback.${string}`
  | `border.${string}`
  | `brand.${string}`
  | `cyberpunk.${string}`
  | `effects.${string}`;

export type SemanticSpacingToken = 
  | `spacing.${string}`;

export type TokenValue<T extends string> = T & { __tokenBrand: never };

// Strict component prop types that only accept tokens
export interface StrictStyleProps {
  // Colors must use semantic tokens
  backgroundColor?: SemanticColorToken;
  color?: SemanticColorToken;
  borderColor?: SemanticColorToken;
  
  // Spacing must use semantic tokens  
  padding?: SemanticSpacingToken;
  margin?: SemanticSpacingToken;
  
  // Allow literal 'transparent' and 'inherit' for edge cases
  background?: SemanticColorToken | 'transparent' | 'inherit';
}

// Type helper to create theme-aware component props
export type ThemeAwareProps<T> = Omit<T, keyof StrictStyleProps> & StrictStyleProps;

// Utility type to restrict CSS properties to token values only
export type TokenOnlyCSSProperties = {
  [K in keyof React.CSSProperties]?: 
    K extends 'backgroundColor' | 'color' | 'borderColor' ? SemanticColorToken | 'transparent' | 'inherit' :
    K extends 'padding' | 'margin' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' |
             'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft' ? SemanticSpacingToken :
    React.CSSProperties[K];
};
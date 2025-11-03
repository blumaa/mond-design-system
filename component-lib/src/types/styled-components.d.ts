/**
 * Styled Components Theme Type Declarations
 *
 * Extends styled-components DefaultTheme with our theme structure
 */

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      [key: string]: string;
    };
    space: {
      [key: string]: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    fonts: {
      sans: string;
      mono: string;
    };
    lineHeights: {
      none: string;
      tight: string;
      normal: string;
      relaxed: string;
    };
    letterSpacings: {
      tight: string;
      normal: string;
      wide: string;
    };
    radii: {
      [key: string]: string;
    };
    shadows: {
      [key: string]: string;
    };
  }
}

import type { BrandTheme } from '../components/providers/ThemeProvider';

/**
 * CYPHER Brand Theme - Cyberpunk Developer Tools
 * 
 * External brand configuration for the CYPHER cyberpunk identity.
 * Dark, neon-focused design with high contrast for developer tools
 * and technical interfaces.
 */
export const cypherTheme: BrandTheme = {
  id: 'cypher',
  name: 'CYPHER Cyberpunk',
  description: 'Dark, neon cyberpunk design for developer tools and technical interfaces',
  colors: {
    brand: {
      primary: {
        50: '#0a0a0b',
        100: '#171719',
        200: '#2a2a2e',
        300: '#3d3d44',
        400: '#5a5a65',
        500: '#00ff94', // Base neon green
        600: '#00e085',
        700: '#00cc76',
        800: '#00b366',
        900: '#009955',
      },
      secondary: {
        50: '#0f0f12',
        100: '#1a1a20',
        200: '#2d2d38',
        300: '#404050',
        400: '#565670',
        500: '#6d6d90', // Base purple-gray
        600: '#5a5a7a',
        700: '#474764',
        800: '#34344e',
        900: '#212138',
      },
      success: {
        400: '#00ff94',
        500: '#00e085',
        600: '#00cc76',
        700: '#00b366',
      },
      warning: {
        400: '#ff9500',
        500: '#e0820a',
        600: '#cc7300',
        700: '#b36400',
      },
      error: {
        400: '#ff0055',
        500: '#e0004a',
        600: '#cc0042',
        700: '#b30039',
      },
    },
  },
};
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, ThemeProviderProps } from './components/providers/ThemeProvider';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Theme provider props for testing
   */
  themeProviderProps?: Partial<ThemeProviderProps>;
}

const AllTheProviders = ({ 
  children, 
  colorScheme = 'light',
  brandTheme,
}: { 
  children: React.ReactNode;
} & Partial<ThemeProviderProps>) => {
  return (
    <ThemeProvider colorScheme={colorScheme} brandTheme={brandTheme}>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => {
  const { themeProviderProps, ...renderOptions } = options || {};
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders {...themeProviderProps}>
      {children}
    </AllTheProviders>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Export a specific dark mode render function for convenience
const renderWithDarkMode = (
  ui: ReactElement,
  options?: Omit<CustomRenderOptions, 'themeProviderProps'>,
) => {
  return customRender(ui, {
    ...options,
    themeProviderProps: { colorScheme: 'dark' }
  });
};

export * from '@testing-library/react';
export { customRender as render, renderWithDarkMode };
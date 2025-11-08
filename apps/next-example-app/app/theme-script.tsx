'use client';

import { useEffect } from 'react';

/**
 * ThemeScript - Applies theme attributes to HTML element
 *
 * This component uses useEffect to apply data-theme and data-brand
 * attributes to the <html> element, ensuring CSS variables are
 * accessible to the entire document including <body>.
 *
 * This is necessary because:
 * 1. CSS variables are scoped to [data-theme] selector
 * 2. The <body> element needs access to these variables
 * 3. In Next.js, <html> and <body> are server-rendered
 * 4. We need client-side control for runtime theme switching
 */
export function ThemeScript() {
  useEffect(() => {
    // This effect runs only on mount to set initial theme
    // The actual theme value will be managed by ThemeWrapper
    const html = document.documentElement;

    // Set default theme if not already set
    if (!html.hasAttribute('data-theme')) {
      html.setAttribute('data-theme', 'light');
    }
  }, []);

  return null;
}

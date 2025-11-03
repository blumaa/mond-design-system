# Styled-Components Migration Guide

## Overview

This guide documents the migration of Mond Design System components from CSS classes to styled-components. The migration follows the pattern established by the Button component.

## Migration Status

### ✅ Completed Migrations (3/29)

1. **Button** - 42/42 tests passing
2. **Badge** - 24/24 tests passing
3. **Avatar** - 24/24 tests passing

**Total Tests Passing: 90/90 (100%)**

### 🔄 Pending Migrations (26/29)

#### Priority 1 - Simple Components (10 remaining)
4. Spinner
5. Divider
6. Text
7. Heading
8. Label
9. Link
10. Image
11. Icon
12. Box (utility component used by others)
13. Tag

#### Priority 2 - Form Components (6 remaining)
14. Input
15. Textarea
16. Checkbox
17. Radio
18. Switch
19. Select

#### Priority 3 - Complex Components (10 remaining)
20. Modal
21. Tooltip
22. Popover
23. Dropdown
24. DropdownItem
25. Tabs
26. Accordion
27. AccordionItem
28. Carousel
29. ToastContainer
30. Pagination

## Migration Pattern

### Step 1: Read Existing Component

```bash
# Read the component implementation
/Users/blumaa/code/mond-design-system/component-lib/components/ComponentName/ComponentName.tsx

# Read the CSS styles
/Users/blumaa/code/mond-design-system/component-lib/components/ComponentName/component-name.css

# Read the tests
/Users/blumaa/code/mond-design-system/component-lib/components/ComponentName/ComponentName.test.tsx
```

### Step 2: Component Structure Template

```tsx
import React from 'react';
import styled, { css } from 'styled-components';

export type ComponentNameVariant = 'default' | 'primary' | 'secondary';
export type ComponentNameSize = 'sm' | 'md' | 'lg';

export interface ComponentNameProps extends React.HTMLAttributes<HTMLElement> {
  'data-testid'?: string;
  variant?: ComponentNameVariant;
  size?: ComponentNameSize;
  children?: React.ReactNode;
}

// Styled Component
const StyledComponentName = styled.element<ComponentNameProps>`
  /* Reset */
  margin: 0;
  padding: 0;

  /* Base Styles */
  display: inline-flex;
  font-family: ${({ theme }) => theme.fonts.sans};

  /* === SIZES === */

  ${({ size, theme }) =>
    size === 'sm' &&
    css`
      font-size: ${theme.fontSizes.sm};
      padding: ${theme.space[1]} ${theme.space[2]};
    `}

  ${({ size, theme }) =>
    (size === 'md' || !size) &&
    css`
      font-size: ${theme.fontSizes.base};
      padding: ${theme.space[2]} ${theme.space[4]};
    `}

  ${({ size, theme }) =>
    size === 'lg' &&
    css`
      font-size: ${theme.fontSizes.lg};
      padding: ${theme.space[3]} ${theme.space[6]};
    `}

  /* === VARIANTS === */

  ${({ variant, theme }) =>
    (variant === 'default' || !variant) &&
    css`
      background-color: ${theme.colors.surfaceElevated};
      color: ${theme.colors.textPrimary};
    `}

  ${({ variant, theme }) =>
    variant === 'primary' &&
    css`
      background-color: ${theme.colors.brandPrimary600};
      color: ${theme.colors.white50};
    `}
`;

/**
 * ComponentName Component
 *
 * Description of the component.
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **SSR-Compatible**: Styles are generated at build time
 *
 * @example
 * <ComponentName variant="primary" size="md">Content</ComponentName>
 */
export const ComponentName = React.forwardRef<HTMLElement, ComponentNameProps>(
  (
    {
      variant = 'default',
      size = 'md',
      children,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledComponentName
        ref={ref}
        variant={variant}
        size={size}
        data-testid={dataTestId}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </StyledComponentName>
    );
  },
);

ComponentName.displayName = 'ComponentName';
```

### Step 3: Test File Template

```tsx
/**
 * ComponentName Tests - Styled Components Version
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { ComponentName } from './ComponentName';
import { defaultLightTheme } from '../../src/themes';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('ComponentName - Styled Components', () => {
  describe('SSR Compatibility', () => {
    it('renders without requiring "use client" directive', () => {
      const { container } = renderWithTheme(<ComponentName>Test</ComponentName>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('works without ThemeProvider context', () => {
      renderWithTheme(<ComponentName>No Provider</ComponentName>);
      expect(screen.getByText('No Provider')).toBeInTheDocument();
    });
  });

  describe('Styled Components Styling', () => {
    it('renders with styled-components classes', () => {
      renderWithTheme(<ComponentName>Test</ComponentName>);
      const element = screen.getByText('Test');
      expect(element).toBeInTheDocument();
      expect(element.className).toBeTruthy();
    });

    it('renders different variants', () => {
      const variants: Array<'default' | 'primary'> = ['default', 'primary'];

      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <ComponentName variant={variant}>{variant}</ComponentName>
        );
        const element = screen.getByText(variant);
        expect(element).toHaveAttribute('data-variant', variant);
        unmount();
      });
    });

    it('renders different sizes', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach(size => {
        const { unmount } = renderWithTheme(
          <ComponentName size={size}>{size}</ComponentName>
        );
        const element = screen.getByText(size);
        expect(element).toHaveAttribute('data-size', size);
        unmount();
      });
    });
  });

  describe('Data Attributes', () => {
    it('sets data-variant attribute', () => {
      renderWithTheme(<ComponentName variant="primary">Test</ComponentName>);
      expect(screen.getByText('Test')).toHaveAttribute('data-variant', 'primary');
    });

    it('sets data-size attribute', () => {
      renderWithTheme(<ComponentName size="lg">Test</ComponentName>);
      expect(screen.getByText('Test')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLElement>();
      renderWithTheme(<ComponentName ref={ref}>Test</ComponentName>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
```

## Theme Token Mappings

### Available Theme Tokens

```typescript
// Colors
theme.colors.brandPrimary600
theme.colors.brandPrimary700
theme.colors.textPrimary
theme.colors.textSecondary
theme.colors.surfaceElevated
theme.colors.surfaceBackground
theme.colors.borderDefault
theme.colors.borderFocused
theme.colors.white50
theme.colors.black900
// ... etc

// Spacing
theme.space[0]  // 0
theme.space[1]  // 0.25rem
theme.space[2]  // 0.5rem
theme.space[3]  // 0.75rem
theme.space[4]  // 1rem
theme.space[6]  // 1.5rem
theme.space[8]  // 2rem
// ... etc

// Font Sizes
theme.fontSizes.xs      // 0.75rem
theme.fontSizes.sm      // 0.875rem
theme.fontSizes.base    // 1rem
theme.fontSizes.lg      // 1.125rem
theme.fontSizes.xl      // 1.25rem
theme.fontSizes['2xl']  // 1.5rem
// ... etc

// Font Weights
theme.fontWeights.normal    // 400
theme.fontWeights.medium    // 500
theme.fontWeights.semibold  // 600
theme.fontWeights.bold      // 700

// Fonts
theme.fonts.sans  // System font stack
theme.fonts.mono  // Monospace font stack

// Radii
theme.radii.sm    // 0.125rem
theme.radii.md    // 0.25rem
theme.radii.lg    // 0.5rem
theme.radii.full  // 9999px

// Shadows
theme.shadows.sm
theme.shadows.md
theme.shadows.lg
theme.shadows['glow-success']
// ... etc
```

### CSS Variable to Theme Token Conversion

| CSS Variable | Styled-Components Theme Token |
|-------------|-------------------------------|
| `var(--mond-brand-primary-600)` | `${theme.colors.brandPrimary600}` |
| `var(--mond-spacing-4)` | `${theme.space[4]}` |
| `var(--mond-font-size-base)` | `${theme.fontSizes.base}` |
| `var(--mond-radii-full)` | `${theme.radii.full}` |
| `var(--mond-surface-elevated)` | `${theme.colors.surfaceElevated}` |

## Key Migration Rules

### 1. Import Changes
```tsx
// OLD
import React from 'react';

// NEW
import React from 'react';
import styled, { css } from 'styled-components';
```

### 2. Remove CSS Classes
```tsx
// OLD
const classNames = [
  'mond-badge',
  `mond-badge--${variant}`,
  `mond-badge--${size}`,
].join(' ');

return <span className={classNames}>{children}</span>;

// NEW
return (
  <StyledBadge
    variant={variant}
    size={size}
    data-variant={variant}
    data-size={size}
  >
    {children}
  </StyledBadge>
);
```

### 3. Add Data Attributes for Testing
```tsx
// Always add these for variant/size testing
data-variant={variant}
data-size={size}
```

### 4. Test File Changes
```tsx
// OLD
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

const { container } = render(<Badge>Test</Badge>);
expect(badge).toHaveClass('mond-badge--primary');

// NEW
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../src/themes';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

const { container } = renderWithTheme(<Badge>Test</Badge>);
expect(badge).toHaveAttribute('data-variant', 'primary');
```

## Testing Each Migration

```bash
# Test single component
npm test -- ComponentName.test.tsx --testPathPattern=ComponentName.test.tsx

# Ensure all tests pass before moving to next component
# Expected: X/X tests passing (100%)
```

## Common Patterns

### Conditional Styling
```tsx
${({ variant, theme }) =>
  variant === 'primary' &&
  css`
    background-color: ${theme.colors.brandPrimary600};
    color: ${theme.colors.white50};
  `}
```

### Default Values
```tsx
${({ size, theme }) =>
  (size === 'md' || !size) &&
  css`
    font-size: ${theme.fontSizes.base};
  `}
```

### Nested Elements
```tsx
const StyledContainer = styled.div`
  /* container styles */
`;

const StyledChild = styled.span`
  /* child styles */
`;

// In component:
return (
  <StyledContainer>
    <StyledChild>Text</StyledChild>
  </StyledContainer>
);
```

## Special Cases

### Client Components (useState/useEffect)
Keep `'use client'` directive for components that need React hooks:
```tsx
'use client';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

// Example: Avatar component uses useState for image loading
```

### Polymorphic Components (as prop)
```tsx
interface ComponentProps {
  as?: React.ElementType;
}

const StyledComponent = styled.button<ComponentProps>`
  /* styles */
`;

// Can render as different elements
<StyledComponent as="a" href="/link">Link</StyledComponent>
<StyledComponent as="button">Button</StyledComponent>
```

### Components with Dependencies
Some components depend on Box or other utilities. Migration order:
1. Migrate Box first (if converting Box)
2. Or keep Box usage and only migrate CSS classes to styled-components

## Verification Checklist

For each migrated component:

- [ ] Component file updated with styled-components
- [ ] All CSS classes removed
- [ ] Theme tokens used instead of CSS variables
- [ ] Data attributes added (data-variant, data-size, etc.)
- [ ] Test file updated with ThemeProvider
- [ ] All `toHaveClass` assertions changed to `toHaveAttribute`
- [ ] All tests passing (100%)
- [ ] TypeScript compiles without errors
- [ ] Component maintains same API (props)
- [ ] SSR compatibility maintained
- [ ] Ref forwarding works correctly

## Next Steps

1. **Continue with Priority 1 components** (simple components with few dependencies)
2. **Then Priority 2** (form components)
3. **Finally Priority 3** (complex components with more logic)

## Reference Implementations

See these files for complete examples:
- `/Users/blumaa/code/mond-design-system/component-lib/components/Button/Button.tsx`
- `/Users/blumaa/code/mond-design-system/component-lib/components/Button/Button.test.tsx`
- `/Users/blumaa/code/mond-design-system/component-lib/components/Badge/Badge.tsx`
- `/Users/blumaa/code/mond-design-system/component-lib/components/Badge/Badge.test.tsx`
- `/Users/blumaa/code/mond-design-system/component-lib/components/Avatar/Avatar.tsx`
- `/Users/blumaa/code/mond-design-system/component-lib/components/Avatar/Avatar.test.tsx`

## Benefits of Styled-Components Migration

1. **Type-Safe Theming**: Full TypeScript support for theme tokens
2. **Dynamic Styling**: Easier to create conditional styles based on props
3. **No Class Name Conflicts**: Scoped styles automatically
4. **Better DX**: Styles co-located with components
5. **Theme Switching**: Easier to switch between light/dark and brand themes
6. **SSR Compatible**: Works with Next.js and other SSR frameworks
7. **Smaller Bundle**: Eliminates unused CSS

## Migration Complete When

All 29 components have:
- ✅ 100% test coverage passing
- ✅ TypeScript compiles without errors
- ✅ No CSS class usage (only styled-components)
- ✅ Theme tokens used throughout
- ✅ Data attributes for testing
- ✅ SSR compatibility maintained

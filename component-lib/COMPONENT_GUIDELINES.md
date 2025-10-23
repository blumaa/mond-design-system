# Mond Design System - Component Guidelines

This document provides comprehensive guidelines for developing, using, and maintaining components in the Mond Design System (MDS). It covers atomic design principles, component patterns, and best practices.

## Table of Contents

1. [Atomic Design Principles](#atomic-design-principles)
2. [Component Classification](#component-classification)
3. [Component Patterns](#component-patterns)
4. [File Structure & Organization](#file-structure--organization)
5. [Development Standards](#development-standards)
6. [Storybook Organization](#storybook-organization)
7. [Testing Guidelines](#testing-guidelines)
8. [Best Practices](#best-practices)

---

## Atomic Design Principles

The Mond Design System follows Brad Frost's **Atomic Design** methodology, organizing components into a hierarchical structure:

### **Layout Components**
*Structural primitives for positioning and spacing*
- **Purpose**: Fundamental building blocks for layout and positioning
- **Examples**: Box, Stack, Grid, Card
- **Characteristics**: No visual styling, focus on spacing and positioning
- **Usage**: Foundation for all other components

### **Atoms** 
*Basic HTML elements that cannot be broken down further*
- **Purpose**: Smallest functional units of the interface
- **Examples**: Button, Input, Text, Icon, Badge
- **Characteristics**: Single responsibility, no dependencies on other components
- **Usage**: Building blocks for molecules and organisms

### **Molecules**
*Simple groups of atoms functioning together*
- **Purpose**: Combinations of atoms that form functional units
- **Examples**: SearchForm (Input + Button), ButtonGroup, InputGroup
- **Characteristics**: Composed of 2-5 atoms, specific functionality
- **Usage**: Reusable functional components

### **Organisms**
*Complex interface sections combining molecules and atoms*
- **Purpose**: Major sections of an interface
- **Examples**: Header, Modal, Dropdown, Accordion, Tabs
- **Characteristics**: Complex functionality, can contain multiple molecules
- **Usage**: Complete interface sections

### **Templates**
*Page-level objects showing content structure*
- **Purpose**: Full-page layouts demonstrating component usage
- **Examples**: Dashboard, FormTemplate, ListTemplate, DetailTemplate  
- **Characteristics**: Complete page layouts, real-world examples
- **Usage**: Reference implementations and starting points

---

## Component Classification

### When to Use Component.tsx vs ComponentItem.tsx Pattern

Some organisms require **compositional patterns** where individual items are separate atoms:

#### **Use ComponentItem Pattern When:**
✅ The component has **repeated child elements** that can exist independently  
✅ Users need **fine-grained control** over individual items  
✅ Child items have **different props or states**  
✅ **Accessibility** requires separate focusable elements  

**Examples:**
- `Accordion` (organism) + `AccordionItem` (atom)
- `Breadcrumb` (organism) + `BreadcrumbItem` (atom)
- `Dropdown` (organism) + `DropdownItem` (atom)

#### **Use Single Component When:**
✅ Component has **simple, uniform children**  
✅ **Array-based API** is sufficient  
✅ No need for individual item customization  

**Examples:**
- `ButtonGroup` - simple array of buttons
- `AvatarGroup` - uniform avatar display
- `TagList` - simple tag collection

### Classification Criteria

| **Level** | **Criteria** | **Dependencies** | **Complexity** |
|-----------|--------------|------------------|----------------|
| **Layout** | Structural, no styling | None | Very Low |
| **Atom** | Single HTML element or simple group | Layout components only | Low |
| **Molecule** | 2-5 atoms working together | Atoms + Layout | Medium |
| **Organism** | Complex interface sections | Molecules + Atoms + Layout | High |
| **Template** | Complete page layouts | All levels | Very High |

---

## Component Patterns

### 1. Foundation Pattern (All Components)
All components must use `Box` as their foundational element:

```tsx
import { Box } from '../../layout/Box/Box';

export const MyComponent = ({ children, ...props }) => {
  return (
    <Box {...props}>
      {children}
    </Box>
  );
};
```

**Benefits:**
- Consistent styling API
- Design token integration
- Unified spacing and layout props

### 2. Simple Component Pattern
For basic atoms and molecules:

```tsx
export interface ComponentProps extends BoxProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...boxProps
}) => {
  // Component applies its own CSS classes internally
  const classNames = [
    'mond-component',
    `mond-component--${variant}`,
    `mond-component--${size}`
  ].join(' ');

  return (
    <Box className={classNames} {...boxProps}>
      {children}
    </Box>
  );
};
```

**Usage:**
```tsx
// Users don't need to manually add classes
<Component variant="primary" size="lg">
  Content
</Component>
```

### 3. Compositional Pattern
For organisms that need flexible composition:

```tsx
// Main component with context
export const Tabs = ({ children }) => {
  return (
    <TabsContext.Provider value={contextValue}>
      <Box>{children}</Box>
    </TabsContext.Provider>
  );
};

// Sub-components
export const TabsList = ({ children }) => {
  const context = useTabsContext();
  return <Box role="tablist">{children}</Box>;
};

export const TabsTrigger = ({ value, children }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button 
      role="tab" 
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};
```

### 4. Dual API Pattern
Support both array-based and compositional APIs:

```tsx
export const Tabs = ({ tabs, children }) => {
  return (
    <TabsContext.Provider value={contextValue}>
      <Box>
        {children ? (
          children // Compositional usage
        ) : tabs ? (
          // Array-based usage
          <>
            <TabsList>
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </>
        ) : null}
      </Box>
    </TabsContext.Provider>
  );
};
```

---

## File Structure & Organization

### Directory Structure
```
components/
├── layout/           # Structural components
│   ├── Box/
│   ├── Stack/
│   └── Grid/
├── atoms/            # Basic elements
│   ├── Button/
│   ├── Input/
│   └── AccordionItem/
├── molecules/        # Atom combinations
│   ├── SearchForm/
│   └── ButtonGroup/
├── organisms/        # Complex sections
│   ├── Header/
│   ├── Modal/
│   └── Accordion/
└── templates/        # Page layouts
    ├── Dashboard/
    └── FormTemplate/
```

### Required Files (Per Component)
```
Component/
├── Component.tsx         # Main implementation
├── Component.test.tsx    # Jest tests
├── Component.stories.tsx # Storybook stories
└── index.ts             # Exports
```

### Export Pattern
```typescript
// index.ts
export { Component } from './Component';
export type { ComponentProps } from './Component';

// For sub-components
export { ComponentItem } from './ComponentItem';  
export type { ComponentItemProps } from './ComponentItem';
```

---

## Development Standards

### TypeScript Requirements
✅ **Strict typing** - no `any` types except for necessary callbacks  
✅ **Interface extension** - extend `BoxProps` when possible  
✅ **Proper generics** - use generics for flexible, type-safe APIs  
✅ **JSDoc comments** - document all props with descriptions  

```typescript
export interface ComponentProps extends BoxProps {
  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  
  /**
   * Size variant
   * @default 'md'  
   */
  size?: 'sm' | 'md' | 'lg';
}
```

### Styling Standards
✅ **CSS Variables** - use CSS variables via `var(--mond-*)` for theming
✅ **Design tokens** - reference tokens from `tokens/index.ts` for TypeScript types
✅ **Box foundation** - build on Box component
✅ **Responsive design** - support mobile and desktop

```css
/* component.css */
.mond-component {
  background-color: var(--mond-surface-primary);
  color: var(--mond-text-primary);
  padding: var(--mond-spacing-4);
  border-radius: var(--mond-radii-md);
}

.mond-component--primary {
  background-color: var(--mond-brand-primary);
  color: var(--mond-brand-on-primary);
}
```

**Import CSS in component:**
```tsx
import './component.css';
```

### Accessibility Requirements
✅ **WCAG 2.1 AA compliance**  
✅ **Proper ARIA attributes** - roles, labels, states  
✅ **Keyboard navigation** - Tab, Enter, Space, Arrows  
✅ **Focus management** - visible focus indicators  
✅ **Screen reader support** - descriptive labels  

```typescript
<button
  role="tab"
  aria-selected={isActive}
  aria-disabled={disabled}
  aria-label="Open user menu"
  tabIndex={isActive ? 0 : -1}
  onKeyDown={handleKeyDown}
>
```

---

## Storybook Organization

### Story Structure
Stories should follow atomic design hierarchy:

```
Storybook/
├── Tokens/          # Design foundations
├── Layout/          # Structural components  
├── Atoms/           # Basic elements
├── Molecules/       # Atom combinations
├── Organisms/       # Complex sections
└── Templates/       # Page layouts
```

### Story Naming Convention
```typescript
export default {
  title: 'Atoms/Button',  // Follow atomic hierarchy
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Button component description...'
      }
    }
  }
};
```

### Required Stories
Each component should have:
✅ **Default** - basic usage  
✅ **Variants** - all visual variants  
✅ **Sizes** - all size options  
✅ **States** - disabled, loading, error  
✅ **Dark Mode** - dark theme examples  
✅ **Interactive** - with realistic interactions  

---

## Testing Guidelines

### Test Requirements
✅ **90%+ coverage** - comprehensive test coverage  
✅ **Accessibility tests** - screen reader, keyboard navigation  
✅ **Visual regression** - consistent rendering  
✅ **Interaction tests** - user event simulation  
✅ **Edge cases** - error states, empty data  

### Test Structure
```typescript
describe('Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {});
    it('renders with custom props', () => {});
  });
  
  describe('Variants', () => {
    it('renders primary variant', () => {});
    it('renders secondary variant', () => {});  
  });
  
  describe('Interactions', () => {
    it('handles click events', () => {});
    it('handles keyboard navigation', () => {});
  });
  
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {});
    it('supports keyboard navigation', () => {});
  });
  
  describe('Dark Mode', () => {
    it('renders in dark mode', () => {});
  });
});
```

### Testing Utilities
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Accessibility testing
expect(screen.getByRole('button')).toBeInTheDocument();
expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();

// Keyboard testing  
await user.keyboard('{Enter}');
await user.keyboard('{ArrowDown}');
```

---

## Best Practices

### Performance
✅ **Lazy loading** - use React.lazy for large components  
✅ **Memoization** - useMemo/useCallback for expensive operations  
✅ **Bundle optimization** - avoid unnecessary dependencies  
✅ **Tree shaking** - proper module exports  

### Error Handling
✅ **Graceful degradation** - handle missing props  
✅ **Error boundaries** - catch component errors  
✅ **Validation** - validate props in development  
✅ **Fallbacks** - provide sensible defaults  

### Documentation
✅ **JSDoc comments** - comprehensive prop documentation  
✅ **Usage examples** - real-world code samples  
✅ **Migration guides** - breaking change documentation  
✅ **Design rationale** - explain design decisions  

### Versioning & Compatibility
✅ **Semantic versioning** - follow semver for releases  
✅ **Backward compatibility** - avoid breaking changes  
✅ **Deprecation warnings** - give advance notice  
✅ **Migration paths** - clear upgrade instructions  

---

## Composition vs Inheritance

### Prefer Composition
✅ **Flexible APIs** - combine simple components  
✅ **Reusable logic** - share behavior through hooks  
✅ **Clear interfaces** - explicit prop contracts  

```typescript
// Good - Composition
<Modal>
  <Modal.Header>
    <Modal.Title>Dialog Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button>Cancel</Button>
    <Button variant="primary">Save</Button>
  </Modal.Footer>
</Modal>
```

### Avoid Complex Inheritance
❌ **Deep hierarchies** - avoid nested inheritance chains  
❌ **Tight coupling** - components should be independent  
❌ **Magic behavior** - prefer explicit over implicit  

---

## Conclusion

The Mond Design System follows **atomic design principles** with a focus on:

🎯 **Consistency** - unified patterns and standards  
🎯 **Flexibility** - compositional APIs for complex needs  
🎯 **Quality** - comprehensive testing and accessibility  
🎯 **Developer Experience** - clear documentation and examples  

By following these guidelines, we maintain a **scalable, maintainable, and user-friendly** design system that serves both developers and end users effectively.

---

*For questions or suggestions about these guidelines, please refer to the project documentation or create an issue in the repository.*
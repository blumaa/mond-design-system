# Component Styling Patterns

## 🎯 **Core Principle**

**Components must use CSS variables for all styling - no hardcoded colors, spacing, or typography values.**

All design tokens are available as CSS variables in the format `var(--mond-*)`. Components use CSS classes and import their own `.css` files.

## 📋 **Token Categories**

### **1. Interactive States**
Use for buttons, inputs, and interactive elements:

```css
/* ✅ CORRECT - Brand-aware interactive tokens */
.component {
  background-color: var(--mond-brand-interactive-background);
  color: var(--mond-brand-interactive-text);
}

/* ✅ CORRECT - Standard interactive tokens */
.component--primary {
  background-color: var(--mond-interactive-primary-background);
  color: var(--mond-interactive-primary-text);
}

/* ❌ WRONG - Hardcoded colors */
.component {
  background-color: #3b82f6;
  color: #ffffff;
}
```

### **2. Feedback States**
Use for success/error/warning states:

```css
/* ✅ CORRECT - Semantic feedback tokens */
.component--success {
  background-color: var(--mond-feedback-success-background);
  color: var(--mond-feedback-success-text);
  border: 1px solid var(--mond-feedback-success-border);
}

/* ❌ WRONG - Hardcoded feedback colors */
.component--success {
  background-color: #22c55e;
  color: #ffffff;
}
```

### **3. Surface & Background**
Use for cards, containers, overlays:

```css
/* ✅ CORRECT - Semantic surface tokens */
.card {
  background-color: var(--mond-surface-elevated);
}

.overlay {
  background-color: var(--mond-surface-overlay);
}

.terminal {
  background-color: var(--mond-surface-terminal); /* Brand-specific */
}

/* ❌ WRONG - Hardcoded backgrounds */
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
```

### **4. Text Colors**
Use semantic text tokens:

```css
/* ✅ CORRECT - Semantic text tokens */
.text {
  color: var(--mond-text-primary);
}

.text--secondary {
  color: var(--mond-text-secondary);
}

.text--accent {
  color: var(--mond-text-accent); /* Brand-aware accent text */
}

/* ❌ WRONG - Hardcoded text colors */
.text {
  color: #6b7280;
}
```

### **5. Spacing & Layout**
Use semantic spacing tokens:

```css
/* ✅ CORRECT - Semantic spacing */
.component {
  padding: var(--mond-spacing-md);
  margin: var(--mond-spacing-lg);
  gap: var(--mond-spacing-sm);
}

/* ❌ WRONG - Hardcoded spacing */
.component {
  padding: 16px;
  margin: 24px;
}
```

### **6. Brand-Aware Patterns**
For components that should adapt to brand identity:

```css
/* ✅ CORRECT - Brand-aware tokens (auto-adapts to CYPHER/FLUX/MOND) */
.button--primary {
  background-color: var(--mond-brand-interactive-background);
  box-shadow: var(--mond-effects-brand-glow-subtle);
  border-color: var(--mond-border-brand-accent);
}

/* ❌ WRONG - Fixed colors (doesn't adapt to brand) */
.button--primary {
  background-color: var(--mond-feedback-success-background);
}
```

## 🏗️ **Implementation Patterns**

### **Variant-Based Styling**
```css
/* component.css */
.mond-component {
  /* Base styles */
  font-family: var(--mond-font-family-sans);
  font-size: var(--mond-font-size-md);
  border-radius: var(--mond-radii-md);
}

.mond-component--primary {
  background-color: var(--mond-brand-interactive-background);
  color: var(--mond-brand-interactive-text);
  border: 1px solid var(--mond-brand-interactive-background);
  box-shadow: var(--mond-effects-brand-glow-subtle);
}

.mond-component--secondary {
  background-color: var(--mond-interactive-secondary-background);
  color: var(--mond-interactive-secondary-text);
  border: 1px solid var(--mond-interactive-secondary-border);
}
```

```tsx
// Component.tsx
import './component.css';

export const Component = ({ variant = 'primary', ...props }) => {
  const className = `mond-component mond-component--${variant}`;
  return <div className={className} {...props} />;
};
```

### **State-Based Styling**
```css
.mond-component {
  /* Base styles */
  background-color: var(--mond-brand-interactive-background);
  transition: background-color 0.2s;
}

/* Hover states */
.mond-component:hover:not(:disabled) {
  background-color: var(--mond-brand-interactive-backgroundHover);
}

/* Focus states */
.mond-component:focus {
  outline: 2px solid var(--mond-border-focused);
  outline-offset: 2px;
}

/* Disabled states */
.mond-component:disabled {
  background-color: var(--mond-interactive-primary-backgroundDisabled);
  color: var(--mond-interactive-primary-textDisabled);
  cursor: not-allowed;
}
```

## 🚫 **Anti-Patterns to Avoid**

### **❌ Hardcoded Values**
```css
/* NEVER do this */
.component {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### **❌ Inline Styles with Raw Values**
```tsx
// NEVER do this
<div style={{
  backgroundColor: '#22c55e',
  color: '#000000',
  padding: '12px 16px'
}}>
```

### **❌ Mixed CSS Variables and Hardcoded**
```css
/* NEVER mix approaches */
.component {
  background-color: var(--mond-surface-elevated); /* ✅ Good */
  color: #6b7280; /* ❌ Wrong - should use var(--mond-text-secondary) */
  padding: var(--mond-spacing-md); /* ✅ Good */
  margin: 8px; /* ❌ Wrong - should use var(--mond-spacing-sm) */
}
```

## ✅ **Component Checklist**

Before considering a component complete, verify:

- [ ] **No hardcoded colors** (hex, rgb, rgba, named colors)
- [ ] **No hardcoded spacing** (px, rem, em values)
- [ ] **No hardcoded typography** (font-size, font-weight values)
- [ ] **Uses appropriate semantic tokens** (interactive, feedback, surface, text)
- [ ] **Brand-aware where appropriate** (uses brand.* tokens for primary actions)
- [ ] **Supports theme switching** (light/dark modes work correctly)
- [ ] **Responsive spacing** (uses semantic spacing that scales)

## 🎨 **Brand Token Decision Matrix**

| Component Type | Primary Variant | Secondary Variant | States |
|---|---|---|---|
| **Button** | `brand.interactive.*` | `interactive.secondary.*` | `feedback.*` |
| **Badge** | `brand.interactive.*` | `feedback.*` | N/A |
| **Input** | `interactive.primary.*` | N/A | `feedback.*` |
| **Card** | `surface.elevated` | `surface.card` | N/A |
| **Alert** | `feedback.*` | N/A | N/A |

## 🔧 **Migration Guide**

### **Converting from Inline Styles to CSS Variables**

1. **Create a CSS file** for your component
2. **Identify hardcoded values** in inline styles: Search for `#`, `rgb`, `rgba`, `px` patterns
3. **Map to CSS variables**: Use `var(--mond-*)` format with the token categories above
4. **Import CSS** in your component: `import './component.css'`
5. **Test with brand themes**: Verify component works with CYPHER, FLUX, MOND themes using `ThemeProvider`
6. **Update tests**: Ensure tests check for CSS classes, not inline styles

### **Example Migration**

**Before:**
```tsx
// ❌ Old inline style approach
<div style={{
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '16px',
  borderRadius: '8px'
}}>
```

**After:**
```css
/* component.css */
.mond-component {
  background-color: var(--mond-brand-interactive-background);
  color: var(--mond-brand-interactive-text);
  padding: var(--mond-spacing-md);
  border-radius: var(--mond-radii-md);
}
```

```tsx
// ✅ New CSS class approach
import './component.css';

<div className="mond-component">
```

This ensures all components are truly brand-agnostic and automatically adapt to any brand context via CSS variables.
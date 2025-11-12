# Component Token-Only Styling Patterns

## 🎯 **Core Principle**

**Components must use semantic tokens exclusively - no hardcoded colors, spacing, or typography values.**

## 📋 **Token Categories**

### **1. Interactive States**
Use for buttons, inputs, and interactive elements:

```tsx
// ✅ CORRECT - Brand-aware interactive tokens
backgroundColor: theme('brand.interactive.background'),
color: theme('brand.interactive.text'),

// ✅ CORRECT - Standard interactive tokens  
backgroundColor: theme('interactive.primary.background'),
color: theme('interactive.primary.text'),

// ❌ WRONG - Hardcoded colors
backgroundColor: '#3b82f6',
color: '#ffffff',
```

### **2. Feedback States**
Use for success/error/warning states:

```tsx
// ✅ CORRECT - Semantic feedback tokens
backgroundColor: theme('feedback.success.background'),
color: theme('feedback.success.text'),
border: `1px solid ${theme('feedback.success.border')}`,

// ❌ WRONG - Hardcoded feedback colors
backgroundColor: '#22c55e',
color: '#ffffff',
```

### **3. Surface & Background**
Use for cards, containers, overlays:

```tsx
// ✅ CORRECT - Semantic surface tokens
backgroundColor: theme('surface.elevated'),
backgroundColor: theme('surface.overlay'),
backgroundColor: theme('surface.terminal'), // Brand-specific

// ❌ WRONG - Hardcoded backgrounds
backgroundColor: 'rgba(0, 0, 0, 0.5)',
backgroundColor: '#ffffff',
```

### **4. Text Colors**
Use semantic text tokens:

```tsx
// ✅ CORRECT - Semantic text tokens
color: theme('text.primary'),
color: theme('text.secondary'), 
color: theme('text.accent'), // Brand-aware accent text

// ❌ WRONG - Hardcoded text colors
color: '#6b7280',
color: '#000000',
```

### **5. Spacing & Layout**
Use semantic spacing tokens:

```tsx
// ✅ CORRECT - Semantic spacing
padding: theme('spacing.md'),
margin: theme('spacing.lg'),
gap: theme('spacing.sm'),

// ❌ WRONG - Hardcoded spacing
padding: '16px',
margin: '24px',
```

### **6. Brand-Aware Patterns**
For components that should adapt to brand identity:

```tsx
// ✅ CORRECT - Brand-aware tokens (auto-adapts to CYPHER/FLUX/MOND)
backgroundColor: theme('brand.interactive.background'),
boxShadow: theme('effects.brand.glow.subtle'),
borderColor: theme('border.brand.accent'),

// ❌ WRONG - Fixed colors (doesn't adapt to brand)
backgroundColor: theme('feedback.success.background'),
```

## 🏗️ **Implementation Patterns**

### **Variant-Based Styling**
```tsx
const getVariantStyles = (variant: ComponentVariant, theme: Theme) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme('brand.interactive.background'),
        color: theme('brand.interactive.text'),
        border: `1px solid ${theme('brand.interactive.background')}`,
        boxShadow: theme('effects.brand.glow.subtle'),
      };
    case 'secondary': 
      return {
        backgroundColor: theme('interactive.secondary.background'),
        color: theme('interactive.secondary.text'),
        border: `1px solid ${theme('interactive.secondary.border')}`,
      };
  }
};
```

### **State-Based Styling**
```tsx
const styles = {
  // Base styles
  ...baseStyles,
  
  // Hover states
  '&:hover': {
    backgroundColor: theme('brand.interactive.backgroundHover'),
  },
  
  // Focus states
  '&:focus': {
    outline: `2px solid ${theme('border.focused')}`,
    outlineOffset: '2px',
  },
  
  // Disabled states
  '&:disabled': {
    backgroundColor: theme('interactive.primary.backgroundDisabled'),
    color: theme('interactive.primary.textDisabled'),
  },
};
```

## 🚫 **Anti-Patterns to Avoid**

### **❌ Hardcoded Values**
```tsx
// NEVER do this
const styles = {
  backgroundColor: '#3b82f6',
  color: '#ffffff', 
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};
```

### **❌ CSS-in-JS with Raw Values**
```tsx
// NEVER do this
<div style={{
  backgroundColor: '#22c55e',
  color: '#000000',
  padding: '12px 16px'
}}>
```

### **❌ Mixed Token and Hardcoded**
```tsx
// NEVER mix approaches
const styles = {
  backgroundColor: theme('surface.elevated'), // ✅ Good
  color: '#6b7280', // ❌ Wrong - should use theme('text.secondary')
  padding: theme('spacing.md'), // ✅ Good  
  margin: '8px', // ❌ Wrong - should use theme('spacing.sm')
};
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

1. **Identify hardcoded values**: Search for `#`, `rgb`, `rgba`, `px` patterns
2. **Map to semantic tokens**: Use the token categories above
3. **Test with brand themes**: Verify component works with CYPHER, FLUX, MOND themes  
4. **Update tests**: Ensure tests don't rely on hardcoded values

This ensures all components are truly brand-agnostic and automatically adapt to any brand context.
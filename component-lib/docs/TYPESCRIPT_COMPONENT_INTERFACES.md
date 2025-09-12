# TypeScript Component Interface Guidelines

## 🎯 **Core Principle**

**Design system components should NOT accept arbitrary `style` props. All styling should be controlled through semantic variants and token-based props.**

## 🚫 **What NOT to Do**

```tsx
// ❌ BAD - Allows arbitrary style overrides
interface BadComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  // Inherits `style` prop from HTMLAttributes - BAD!
}

// ❌ BAD - Explicit style prop
interface BadComponentProps {
  style?: React.CSSProperties; // Allows any CSS - BAD!
}
```

## ✅ **What TO Do**

```tsx
// ✅ GOOD - Only semantic props, no style overrides
interface GoodComponentProps {
  /**
   * Visual variant - controls all styling through tokens
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  
  /**
   * Size variant - controls spacing, typography through tokens  
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Content alignment - semantic, not arbitrary
   */
  align?: 'left' | 'center' | 'right';
  
  // Standard React props
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  
  // NO style prop!
}
```

## 🏗️ **Component Categories**

### **1. Atoms (Badge, Button, Input)**
- **No style props**: Use only variant, size, and semantic props
- **Variants control all styling**: primary, secondary, success, warning, error
- **Size controls spacing**: sm, md, lg

```tsx
// ✅ CORRECT
interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

// Usage
<Badge variant="success" size="md">Status</Badge>
// Automatically gets: brand.interactive.background, brand.interactive.text, effects.brand.glow
```

### **2. Layout Components (Box, Stack, Grid)**
- **Exception**: Layout components CAN accept semantic token props
- **Restricted**: Only allow specific, token-mapped props
- **No arbitrary CSS**: Use union types for allowed values

```tsx
// ✅ CORRECT - Semantic token props only
interface BoxProps {
  // Semantic spacing props (mapped to tokens internally)
  p?: 'spacing.xs' | 'spacing.sm' | 'spacing.md' | 'spacing.lg' | 'spacing.xl';
  m?: 'spacing.xs' | 'spacing.sm' | 'spacing.md' | 'spacing.lg' | 'spacing.xl';
  
  // Semantic color props (mapped to tokens internally)
  bg?: 'surface.background' | 'surface.elevated' | 'surface.terminal' | 'transparent';
  color?: 'text.primary' | 'text.secondary' | 'text.tertiary' | 'text.accent';
  
  // Layout props (limited set)
  display?: 'block' | 'flex' | 'grid' | 'inline-flex';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  
  // Standard props
  children?: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}
```

### **3. Complex Components (Modal, Card, Form)**
- **Composition over configuration**: Use multiple simple components
- **Semantic variants**: success, warning, error states
- **No style overrides**: All styling through variants

```tsx
// ✅ CORRECT
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  children: React.ReactNode;
}
```

## 🎨 **Token Prop Patterns**

### **Color Props**
```tsx
// Define allowed color tokens as union types
type SemanticColor = 
  | 'text.primary' | 'text.secondary' | 'text.tertiary' | 'text.accent'
  | 'surface.background' | 'surface.elevated' | 'surface.terminal'
  | 'interactive.primary.background' | 'interactive.primary.text'
  | 'feedback.success.background' | 'feedback.warning.background'
  | 'brand.interactive.background' | 'brand.interactive.text';

interface ComponentProps {
  textColor?: SemanticColor;
  backgroundColor?: SemanticColor;
  borderColor?: SemanticColor;
}
```

### **Spacing Props**
```tsx
type SemanticSpacing = 
  | 'spacing.xs' | 'spacing.sm' | 'spacing.md' | 'spacing.lg' | 'spacing.xl';

interface ComponentProps {
  padding?: SemanticSpacing;
  margin?: SemanticSpacing;
  gap?: SemanticSpacing;
}
```

## 🛡️ **Type Safety Enforcement**

### **Prevent HTML Attributes**
```tsx
// ❌ BAD - Inherits style prop
interface BadProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
}

// ✅ GOOD - Explicit props only
interface GoodProps {
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  // Explicitly choose what HTML attributes to support
}
```

### **Utility Type for Safe HTML Props**
```tsx
// Helper type for safe HTML attributes (without style)
type SafeHTMLProps<T extends keyof React.JSX.IntrinsicElements> = Omit<
  React.ComponentPropsWithoutRef<T>,
  'style' | 'color' | 'width' | 'height' // Remove style-related props
>;

interface ComponentProps extends SafeHTMLProps<'div'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}
```

## 📋 **Component Interface Checklist**

Before shipping a component, verify:

- [ ] **No `style` prop** in interface
- [ ] **No `React.HTMLAttributes` inheritance** (unless explicitly filtered)
- [ ] **Only semantic variants** (primary, success, warning, error)
- [ ] **Only semantic sizes** (sm, md, lg)
- [ ] **Union types for token props** (no arbitrary strings)
- [ ] **Clear prop documentation** with examples
- [ ] **TypeScript strict mode** compliance

## 🔧 **Migration Strategy**

1. **Audit existing interfaces**: Find components with `style` props
2. **Replace with variants**: Create semantic variants for common styles
3. **Update prop types**: Use union types for token values
4. **Remove HTML inheritance**: Use explicit props instead
5. **Add TypeScript strict checks**: Enable strict mode compilation

This approach ensures **compile-time safety** without runtime overhead, and **prevents style prop abuse** by design rather than validation.
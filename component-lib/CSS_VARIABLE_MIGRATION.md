# CSS Variable Migration Map

This document maps old `--mond-*` variables to new token system variables.

## Complete Variable Mapping

### Text Colors
```
--mond-text-primary          → --color-text-primary
--mond-text-secondary        → --color-text-secondary
--mond-text-tertiary         → --color-text-tertiary
--mond-text-disabled         → --color-text-disabled
--mond-text-inverse          → --color-text-inverse
--mond-text-link             → --color-text-link
--mond-text-error            → --color-text-error
--mond-text-success          → --color-text-success
--mond-text-warning          → --color-text-warning
--mond-text-accent           → --color-brand-primary-600 (or appropriate brand color)
--mond-text-on-color         → --color-text-inverse
```

### Surface/Background Colors
```
--mond-surface-background    → --color-surface-background
--mond-surface-card          → --color-surface-card
--mond-surface-elevated      → --color-surface-elevated
--mond-surface-input         → --color-surface-input
--mond-surface-secondary     → --color-surface-card
--mond-surface-disabled      → --color-gray-100 (light) / --color-gray-800 (dark)
--mond-surface-overlay       → rgba(0, 0, 0, 0.5) or custom
```

### Border Colors
```
--mond-border-default        → --color-border-default
--mond-border-subtle         → --color-border-subtle
--mond-border-strong         → --color-border-strong
--mond-border-focused        → --color-border-focused
--mond-border-error          → --color-brand-error-500
--mond-border-success        → --color-brand-success-500
```

### Interactive/Brand Colors
```
--mond-brand-interactive-background       → --color-brand-primary-600
--mond-brand-interactive-backgroundHover  → --color-brand-primary-700
--mond-brand-interactive-text             → --color-white-50
--mond-interactive-primary-background     → --color-brand-primary-600
--mond-interactive-secondary-background   → --color-gray-100
--mond-interactive-secondary-backgroundHover → --color-gray-200
--mond-interactive-ghost-backgroundHover  → --color-gray-100
```

### Feedback/Status Colors
```
--mond-feedback-error-background    → --color-brand-error-50
--mond-feedback-error-border        → --color-brand-error-500
--mond-feedback-error-text          → --color-brand-error-700
--mond-feedback-success-background  → --color-brand-success-50
--mond-feedback-success-border      → --color-brand-success-500
--mond-feedback-success-text        → --color-brand-success-700
--mond-feedback-warning-background  → --color-brand-warning-50
--mond-feedback-warning-border      → --color-brand-warning-500
--mond-feedback-warning-text        → --color-brand-warning-700
--mond-feedback-info-background     → --color-blue-50
--mond-feedback-info-border         → --color-blue-500
--mond-feedback-info-text           → --color-blue-700
```

### Typography
```
--mond-font-family-sans       → --font-family-sans
--mond-font-family-mono       → (needs to be added to tokens or use system mono)
--mond-font-size-xs           → --font-size-xs
--mond-font-size-sm           → --font-size-sm
--mond-font-size-base         → --font-size-base
--mond-font-size-lg           → --font-size-lg
--mond-font-size-xl           → --font-size-xl
--mond-font-size-2xl          → --font-size-2xl
--mond-font-size-3xl          → --font-size-3xl
--mond-font-size-4xl          → --font-size-4xl
--mond-font-size-5xl          → --font-size-5xl
--mond-font-size-6xl          → --font-size-6xl
--mond-font-weight-normal     → --font-weight-normal
--mond-font-weight-medium     → --font-weight-medium
--mond-font-weight-semibold   → --font-weight-semibold
--mond-font-weight-bold       → --font-weight-bold
--mond-letter-spacing-tight   → --letter-spacing-tight
--mond-letter-spacing-normal  → --letter-spacing-normal
--mond-letter-spacing-wide    → --letter-spacing-wide
--mond-letter-spacing-wider   → --letter-spacing-wider
--mond-line-height-none       → --line-height-none
--mond-line-height-tight      → --line-height-tight
--mond-line-height-snug       → --line-height-snug
--mond-line-height-normal     → --line-height-normal
--mond-line-height-relaxed    → --line-height-relaxed
```

### Spacing
```
--mond-spacing-1  → --spacing-1
--mond-spacing-2  → --spacing-2
--mond-spacing-3  → --spacing-3
--mond-spacing-4  → --spacing-4
--mond-spacing-5  → --spacing-5
--mond-spacing-6  → --spacing-6
--mond-spacing-8  → --spacing-8
--mond-spacing-10 → --spacing-10
```

### Border Radius
```
--mond-radii-sm   → --radii-sm
--mond-radii-md   → --radii-md
--mond-radii-lg   → --radii-lg
--mond-radii-full → --radii-full
```

### Shadows
```
--mond-shadow-sm   → --shadow-sm
--mond-shadow-md   → --shadow-md
--mond-shadow-lg   → --shadow-lg
--mond-shadow-2xl  → --shadow-2xl
--mond-effects-shadow-md     → --shadow-md
--mond-effects-brand-glow-subtle → --shadow-glow
```

### Component-Specific Variables

#### Tag Component
```
--mond-tag-*  → Need to map to appropriate --color-* tokens
(These appear to be component-specific and may need custom semantic tokens)
```

#### Carousel Component
```
--mond-carousel-arrow-background    → --color-gray-800 (or custom)
--mond-carousel-arrow-text          → --color-white-50
--mond-carousel-indicator-active    → --color-brand-primary-600
--mond-carousel-indicator-inactive  → --color-gray-300
```

#### Icons
```
--mond-icon-primary → --color-text-primary
```

#### Popover
```
--mond-popover-offset → 8px (or add to spacing tokens)
```

### Primitives Used Directly
```
--mond-white-50  → --color-white-50
--mond-gray-900  → --color-gray-900
```

## Migration Strategy

1. Create missing semantic tokens for component-specific needs (Tag, Carousel, etc.)
2. Use find/replace with the mappings above across all CSS files
3. Test each component in Storybook
4. Verify both light and dark modes work correctly

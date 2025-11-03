#!/bin/bash

# CSS Variable Migration Script
# Migrates from --mond-* variables to new token system variables

echo "Starting CSS variable migration..."

# Find all CSS files in components directory
CSS_FILES=$(find components -name "*.css")

for file in $CSS_FILES; do
  echo "Processing: $file"

  # Text Colors
  sed -i '' 's/--mond-text-primary/--color-text-primary/g' "$file"
  sed -i '' 's/--mond-text-secondary/--color-text-secondary/g' "$file"
  sed -i '' 's/--mond-text-tertiary/--color-text-tertiary/g' "$file"
  sed -i '' 's/--mond-text-disabled/--color-text-disabled/g' "$file"
  sed -i '' 's/--mond-text-inverse/--color-text-inverse/g' "$file"
  sed -i '' 's/--mond-text-link/--color-text-link/g' "$file"
  sed -i '' 's/--mond-text-error/--color-text-error/g' "$file"
  sed -i '' 's/--mond-text-success/--color-text-success/g' "$file"
  sed -i '' 's/--mond-text-warning/--color-text-warning/g' "$file"
  sed -i '' 's/--mond-text-accent/--color-brand-primary-600/g' "$file"
  sed -i '' 's/--mond-text-on-color/--color-text-inverse/g' "$file"

  # Surface Colors
  sed -i '' 's/--mond-surface-background/--color-surface-background/g' "$file"
  sed -i '' 's/--mond-surface-card/--color-surface-card/g' "$file"
  sed -i '' 's/--mond-surface-elevated/--color-surface-elevated/g' "$file"
  sed -i '' 's/--mond-surface-input/--color-surface-input/g' "$file"
  sed -i '' 's/--mond-surface-secondary/--color-surface-card/g' "$file"
  sed -i '' 's/--mond-surface-disabled/--color-gray-100/g' "$file"
  sed -i '' 's/--mond-surface-overlay/rgba(0, 0, 0, 0.5)/g' "$file"

  # Border Colors
  sed -i '' 's/--mond-border-default/--color-border-default/g' "$file"
  sed -i '' 's/--mond-border-subtle/--color-border-subtle/g' "$file"
  sed -i '' 's/--mond-border-strong/--color-border-strong/g' "$file"
  sed -i '' 's/--mond-border-focused/--color-border-focused/g' "$file"
  sed -i '' 's/--mond-border-error/--color-brand-error-500/g' "$file"
  sed -i '' 's/--mond-border-success/--color-brand-success-500/g' "$file"

  # Interactive/Brand Colors
  sed -i '' 's/--mond-brand-interactive-background/--color-brand-primary-600/g' "$file"
  sed -i '' 's/--mond-brand-interactive-backgroundHover/--color-brand-primary-700/g' "$file"
  sed -i '' 's/--mond-brand-interactive-text/--color-white-50/g' "$file"
  sed -i '' 's/--mond-interactive-primary-background/--color-brand-primary-600/g' "$file"
  sed -i '' 's/--mond-interactive-secondary-background/--color-gray-100/g' "$file"
  sed -i '' 's/--mond-interactive-secondary-backgroundHover/--color-gray-200/g' "$file"
  sed -i '' 's/--mond-interactive-ghost-backgroundHover/--color-gray-100/g' "$file"

  # Feedback Colors
  sed -i '' 's/--mond-feedback-error-background/--color-brand-error-50/g' "$file"
  sed -i '' 's/--mond-feedback-error-border/--color-brand-error-500/g' "$file"
  sed -i '' 's/--mond-feedback-error-text/--color-brand-error-700/g' "$file"
  sed -i '' 's/--mond-feedback-success-background/--color-brand-success-50/g' "$file"
  sed -i '' 's/--mond-feedback-success-border/--color-brand-success-500/g' "$file"
  sed -i '' 's/--mond-feedback-success-text/--color-brand-success-700/g' "$file"
  sed -i '' 's/--mond-feedback-warning-background/--color-brand-warning-50/g' "$file"
  sed -i '' 's/--mond-feedback-warning-border/--color-brand-warning-500/g' "$file"
  sed -i '' 's/--mond-feedback-warning-text/--color-brand-warning-700/g' "$file"
  sed -i '' 's/--mond-feedback-info-background/--color-blue-50/g' "$file"
  sed -i '' 's/--mond-feedback-info-border/--color-blue-500/g' "$file"
  sed -i '' 's/--mond-feedback-info-text/--color-blue-700/g' "$file"

  # Typography
  sed -i '' 's/--mond-font-family-sans/--font-family-sans/g' "$file"
  sed -i '' 's/--mond-font-family-mono/monospace/g' "$file"
  sed -i '' 's/--mond-font-size-xs/--font-size-xs/g' "$file"
  sed -i '' 's/--mond-font-size-sm/--font-size-sm/g' "$file"
  sed -i '' 's/--mond-font-size-base/--font-size-base/g' "$file"
  sed -i '' 's/--mond-font-size-lg/--font-size-lg/g' "$file"
  sed -i '' 's/--mond-font-size-xl/--font-size-xl/g' "$file"
  sed -i '' 's/--mond-font-size-2xl/--font-size-2xl/g' "$file"
  sed -i '' 's/--mond-font-size-3xl/--font-size-3xl/g' "$file"
  sed -i '' 's/--mond-font-size-4xl/--font-size-4xl/g' "$file"
  sed -i '' 's/--mond-font-size-5xl/--font-size-5xl/g' "$file"
  sed -i '' 's/--mond-font-size-6xl/--font-size-6xl/g' "$file"
  sed -i '' 's/--mond-font-weight-normal/--font-weight-normal/g' "$file"
  sed -i '' 's/--mond-font-weight-medium/--font-weight-medium/g' "$file"
  sed -i '' 's/--mond-font-weight-semibold/--font-weight-semibold/g' "$file"
  sed -i '' 's/--mond-font-weight-bold/--font-weight-bold/g' "$file"
  sed -i '' 's/--mond-letter-spacing-tight/--letter-spacing-tight/g' "$file"
  sed -i '' 's/--mond-letter-spacing-normal/--letter-spacing-normal/g' "$file"
  sed -i '' 's/--mond-letter-spacing-wide/--letter-spacing-wide/g' "$file"
  sed -i '' 's/--mond-letter-spacing-wider/--letter-spacing-wider/g' "$file"
  sed -i '' 's/--mond-line-height-none/--line-height-none/g' "$file"
  sed -i '' 's/--mond-line-height-tight/--line-height-tight/g' "$file"
  sed -i '' 's/--mond-line-height-snug/--line-height-snug/g' "$file"
  sed -i '' 's/--mond-line-height-normal/--line-height-normal/g' "$file"
  sed -i '' 's/--mond-line-height-relaxed/--line-height-relaxed/g' "$file"

  # Spacing
  sed -i '' 's/--mond-spacing-1/--spacing-1/g' "$file"
  sed -i '' 's/--mond-spacing-2/--spacing-2/g' "$file"
  sed -i '' 's/--mond-spacing-3/--spacing-3/g' "$file"
  sed -i '' 's/--mond-spacing-4/--spacing-4/g' "$file"
  sed -i '' 's/--mond-spacing-5/--spacing-5/g' "$file"
  sed -i '' 's/--mond-spacing-6/--spacing-6/g' "$file"
  sed -i '' 's/--mond-spacing-8/--spacing-8/g' "$file"
  sed -i '' 's/--mond-spacing-10/--spacing-10/g' "$file"

  # Border Radius
  sed -i '' 's/--mond-radii-sm/--radii-sm/g' "$file"
  sed -i '' 's/--mond-radii-md/--radii-md/g' "$file"
  sed -i '' 's/--mond-radii-lg/--radii-lg/g' "$file"
  sed -i '' 's/--mond-radii-full/--radii-full/g' "$file"

  # Shadows
  sed -i '' 's/--mond-shadow-sm/--shadow-sm/g' "$file"
  sed -i '' 's/--mond-shadow-md/--shadow-md/g' "$file"
  sed -i '' 's/--mond-shadow-lg/--shadow-lg/g' "$file"
  sed -i '' 's/--mond-shadow-2xl/--shadow-2xl/g' "$file"
  sed -i '' 's/--mond-effects-shadow-md/--shadow-md/g' "$file"
  sed -i '' 's/--mond-effects-brand-glow-subtle/--shadow-glow/g' "$file"

  # Component-specific
  sed -i '' 's/--mond-carousel-arrow-background/--color-gray-800/g' "$file"
  sed -i '' 's/--mond-carousel-arrow-text/--color-white-50/g' "$file"
  sed -i '' 's/--mond-carousel-indicator-active/--color-brand-primary-600/g' "$file"
  sed -i '' 's/--mond-carousel-indicator-inactive/--color-gray-300/g' "$file"
  sed -i '' 's/--mond-icon-primary/--color-text-primary/g' "$file"
  sed -i '' 's/--mond-popover-offset/8px/g' "$file"

  # Primitives
  sed -i '' 's/--mond-white-50/--color-white-50/g' "$file"
  sed -i '' 's/--mond-gray-900/--color-gray-900/g' "$file"

  # Tag component (preserve for manual review)
  # These need component-specific semantic tokens

done

echo "Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review Tag component CSS manually - it has many component-specific variables"
echo "2. Rebuild tokens: yarn build:tokens"
echo "3. Test in Storybook"
echo "4. Verify light/dark mode switching"

/**
 * ESLint rule to prevent hardcoded colors, spacing, and other style values
 * that should use design tokens instead.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent hardcoded style values that should use design tokens',
      category: 'Design System',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      hardcodedColor: 'Use semantic color tokens instead of hardcoded colors. Consider using theme(\'{{suggestion}}\')',
      hardcodedSpacing: 'Use semantic spacing tokens instead of hardcoded values. Consider using theme(\'spacing.{{suggestion}}\')',
      hardcodedSize: 'Use semantic size tokens instead of hardcoded pixel values',
    },
  },

  create(context) {
    // Color patterns to detect
    const colorPatterns = [
      /#[0-9a-fA-F]{3,6}\b/, // Hex colors
      /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/, // RGB colors
      /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/, // RGBA colors
      /hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)/, // HSL colors
    ];
    
    // Spacing patterns (px, rem, em values)
    const spacingPatterns = [
      /\d+px\b/, // Pixel values
      /\d+\.?\d*rem\b/, // Rem values  
      /\d+\.?\d*em\b/, // Em values
    ];

    // Common CSS properties that should use tokens
    const stylePropNames = new Set([
      'backgroundColor', 'background', 'color', 
      'borderColor', 'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'fontSize', 'lineHeight', 'letterSpacing',
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      'gap', 'rowGap', 'columnGap'
    ]);

    function checkStringForHardcodedStyles(node, value) {
      // Check for hardcoded colors
      for (const pattern of colorPatterns) {
        if (pattern.test(value)) {
          let suggestion = 'text.primary';
          if (value.includes('rgba(0, 0, 0,')) suggestion = 'surface.overlay';
          if (value.match(/#(3b82f6|2563eb)/i)) suggestion = 'interactive.primary.background';
          if (value.match(/#(22c55e|16a34a)/i)) suggestion = 'feedback.success.background';
          
          context.report({
            node,
            messageId: 'hardcodedColor',
            data: { suggestion },
          });
          return;
        }
      }

      // Check for hardcoded spacing
      for (const pattern of spacingPatterns) {
        if (pattern.test(value)) {
          const match = value.match(/(\d+)px/);
          let suggestion = 'md';
          if (match) {
            const px = parseInt(match[1]);
            if (px <= 4) suggestion = 'xs';
            else if (px <= 8) suggestion = 'sm';
            else if (px <= 16) suggestion = 'md';
            else if (px <= 24) suggestion = 'lg';
            else suggestion = 'xl';
          }
          
          context.report({
            node,
            messageId: 'hardcodedSpacing',
            data: { suggestion },
          });
          return;
        }
      }
    }

    return {
      // Check object properties in style objects
      Property(node) {
        if (node.key && node.key.type === 'Identifier' && stylePropNames.has(node.key.name)) {
          if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
            checkStringForHardcodedStyles(node.value, node.value.value);
          }
        }
      },

      // Check JSX style prop attributes  
      JSXExpressionContainer(node) {
        if (node.parent && node.parent.type === 'JSXAttribute' && 
            node.parent.name && node.parent.name.name === 'style') {
          // Handle inline styles
          if (node.expression.type === 'ObjectExpression') {
            node.expression.properties.forEach(prop => {
              if (prop.type === 'Property' && prop.key.type === 'Identifier' && 
                  stylePropNames.has(prop.key.name)) {
                if (prop.value.type === 'Literal' && typeof prop.value.value === 'string') {
                  checkStringForHardcodedStyles(prop.value, prop.value.value);
                }
              }
            });
          }
        }
      },
    };
  },
};
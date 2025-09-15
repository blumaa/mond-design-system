# Component Usage Guidelines

## 🎯 Purpose
This document provides essential guidelines for using design system components consistently throughout the codebase. Following these guidelines ensures visual consistency, accessibility compliance, and maintainability.

## ⚠️ Critical Rules: Semantic Components Only

**NEVER use native HTML elements, style props, or className. ALWAYS use design system components with semantic props.**

### 🚫 Forbidden Patterns
1. **Native HTML elements** with styling
2. **`style` props** on any component  
3. **`className` props** on design system components
4. **Hardcoded values** instead of semantic tokens

### ❌ Incorrect Usage

```tsx
// DON'T DO THIS - Native elements with style props
<input type="text" placeholder="Enter name" style={{ 
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db'
}} />

// DON'T DO THIS - Design system components with style props  
<Box style={{ backgroundColor: '#000', padding: '16px' }}>
  Content
</Box>

// DON'T DO THIS - Design system components with className
<Box className="custom-styles">
  Content  
</Box>

// DON'T DO THIS - Hardcoded colors
<Text color="#00ff41">Matrix Green Text</Text>
```

### ✅ Correct Usage - Semantic Props Only

```tsx
// DO THIS INSTEAD - Only semantic props
import { Input, Select, Button, Box, Text } from '@mond-design-system/theme';

<Input 
  type="text" 
  placeholder="Enter name" 
/>

<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>

<Button variant="primary">
  Click me
</Button>

// Spacing and layout with semantic props
<Box bg="surface.primary" p="lg" m="md">
  <Text variant="heading" color="text.primary">
    Matrix Green Text
  </Text>
</Box>
```

## 📋 Component Conversion Reference

| Native Element | Design System Component | Import Path |
|---------------|------------------------|-------------|
| `<input>` | `<Input>` | `atoms/Input/Input` |
| `<select>` | `<Select>` | `atoms/Select/Select` |
| `<textarea>` | `<Textarea>` | `atoms/Textarea/Textarea` |
| `<button>` | `<Button>` | `atoms/Button/Button` |
| `<label>` | `<Label>` | `atoms/Label/Label` |
| `<input type="checkbox">` | `<Checkbox>` | `atoms/Checkbox/Checkbox` |
| `<input type="radio">` | `<Radio>` | `atoms/Radio/Radio` |

## 🔧 Common Conversion Patterns

### Input Elements

```tsx
// Before
<input 
  type="text" 
  value={formData.name}
  onChange={(e) => setName(e.target.value)}
  onBlur={(e) => validateField('name', e.target.value)}
  placeholder="Enter name"
  style={customInputStyles}
/>

// After
<Input
  type="text"
  value={formData.name}
  onChange={(e) => setName(e.target.value)}
  onBlur={(e) => validateField('name', e.target.value)}
  placeholder="Enter name"
/>
```

### Select Elements

```tsx
// Before
<select 
  value={selectedValue}
  onChange={(e) => onChange(e.target.value)}
  style={customSelectStyles}
>
  <option value="">Choose option</option>
  <option value="opt1">Option 1</option>
  <option value="opt2">Option 2</option>
</select>

// After
<Select
  value={selectedValue}
  onChange={(value) => onChange(value)} // Note: Direct value, not event
  placeholder="Choose option"
  options={[
    { value: '', label: 'Choose option' },
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
  ]}
/>
```

### Button Elements

```tsx
// Before
<button 
  onClick={handleClick}
  disabled={isLoading}
  style={{ 
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  }}
>
  Submit
</button>

// After
<Button
  onClick={handleClick}
  disabled={isLoading}
>
  Submit
</Button>
```

## 🎨 Styling Guidelines

### Use Component Props, Not Inline Styles

Design system components provide props for customization:

```tsx
// ❌ Don't use inline styles
<Button style={{ width: '100%', fontSize: '14px' }}>
  Click me
</Button>

// ✅ Use component props when available
<Button size="sm" style={{ width: '100%' }}>
  Click me
</Button>
```

### Dark Mode Support

Always use the `isDarkMode` prop for theme consistency:

```tsx
<Input 
  placeholder="Search..."
  isDarkMode={isDarkMode}
/>

<Select
  options={options}
  isDarkMode={isDarkMode}
/>

<Button isDarkMode={isDarkMode}>
  Submit
</Button>
```

## 🧪 Form Field Integration

When using form inputs, wrap them with `FormField` for proper labeling and validation:

```tsx
import { FormField, Input, Select } from '@mond-design-system/theme';

<FormField label="Username" required error={errors.username}>
  <Input 
    type="text"
    value={formData.username}
    onChange={(e) => handleChange('username', e.target.value)}
    placeholder="Enter username"
  />
</FormField>

<FormField label="Country" helpText="Select your country">
  <Select
    value={formData.country}
    onChange={(value) => handleChange('country', value)}
    options={countryOptions}
  />
</FormField>
```

## 🚨 ESLint Rules (Future Implementation)

To prevent future violations, consider adding these ESLint rules:

```json
{
  "rules": {
    "no-native-form-elements": "error",
    "prefer-design-system-components": "error"
  }
}
```

## ✅ Code Review Checklist

Before submitting code, verify:

- [ ] No native `<input>`, `<select>`, `<textarea>`, or `<button>` elements with inline styles
- [ ] All form elements use design system components
- [ ] Dark mode support is implemented via `isDarkMode` prop
- [ ] Form fields are wrapped with `FormField` when appropriate
- [ ] Component imports use correct paths

## 📖 Storybook Documentation

When creating Storybook stories, ensure:

- Quick Start code snippets use design system components
- Example code demonstrates proper component usage
- No native HTML elements with inline styling in stories

### Example Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';
import { Input, Button } from '../../atoms';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  parameters: {
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { MyComponent, Input, Button } from '@mond-design-system/theme';

function Example() {
  return (
    <MyComponent>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </MyComponent>
  );
}
\`\`\`
        `,
      },
    },
  },
};

export const Default: Story = {
  args: {
    children: (
      <>
        <Input placeholder="Example input" />
        <Button>Example button</Button>
      </>
    ),
  },
};
```

## 🎯 Success Metrics

Component consistency is maintained when:

- ✅ Zero native HTML form elements with inline styling
- ✅ All components use design system imports
- ✅ TypeScript compilation passes without errors
- ✅ Visual consistency across all UI elements
- ✅ Accessibility standards met through component APIs

## 🔍 Monitoring

Run these commands to check for violations:

```bash
# Check for native HTML elements with inline styling
grep -r "input.*style=\|select.*style=\|button.*style=\|textarea.*style=" components/

# Should return zero results for clean codebase
```

---

**Remember**: Consistency is key to a successful design system. Always prefer design system components over native HTML elements!
'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Badge,
  Avatar,
  Text,
  Heading,
  Input,
  Select,
  Radio,
  Switch,
  Textarea,
  Label,
  Checkbox,
} from '@mond-design-system/theme';
import { ThemeWrapper } from './theme-wrapper';
import styles from './layout.module.css';

/**
 * Home Page - Comprehensive MDS Component Showcase
 *
 * This page demonstrates that all MDS components work perfectly with Next.js 16.
 * Shows theme switching, brand switching, and SSR compatibility.
 */
export default function Home() {
  // Form state for interactive components
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
  ];

  return (
    <ThemeWrapper>
      <Box padding="6" className={styles.pageContainer}>
        {/* Page Header */}
        <div className={styles.section}>
          <Heading level={1} size="4xl" align="center">
            MDS Component Library
          </Heading>
          <Box marginTop="2">
            <Text variant="body" align="center">
              A comprehensive demonstration of Mond Design System components working with Next.js 16 Server-Side Rendering.
              All components are theme-aware and respond to light/dark mode and brand theme changes.
            </Text>
          </Box>
        </div>

        <div className={styles.flexColumn}>
          {/* Button Variants */}
          <div>
            <Box marginBottom="3">
              <Heading level={2} size="2xl">
                Button Component
              </Heading>
              <Box marginTop="1">
                <Text variant="body-sm" semantic="secondary">
                  Interactive buttons with multiple variants and sizes
                </Text>
              </Box>
            </Box>
            <Box marginBottom="2">
              <Label>Standard Variants</Label>
            </Box>
            <div className={styles.flexRow}>
              <Button variant="primary" size="md">Primary</Button>
              <Button variant="outline" size="md">Outline</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="destructive" size="md">Destructive</Button>
              <Button variant="warning" size="md">Warning</Button>
            </div>
            <Box marginTop="2" marginBottom="2">
              <Label>Button Sizes</Label>
            </Box>
            <div className={styles.flexRow}>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <Box marginTop="2" marginBottom="2">
              <Label>States</Label>
            </Box>
            <div className={styles.flexRow}>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>

          {/* Badge Variants */}
          <div>
            <Box marginBottom="3">
              <Heading level={2} size="2xl">
                Badge Component
              </Heading>
              <Box marginTop="1">
                <Text variant="body-sm" semantic="secondary">
                  Status and label badges with semantic colors
                </Text>
              </Box>
            </Box>
            <div className={styles.flexRowCentered}>
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
          </div>

          {/* Avatar Component */}
          <div>
            <Box marginBottom="3">
              <Heading level={2} size="2xl">
                Avatar Component
              </Heading>
              <Box marginTop="1">
                <Text variant="body-sm" semantic="secondary">
                  User avatars with multiple sizes and fallback support
                </Text>
              </Box>
            </Box>
            <div className={styles.flexRowCentered}>
              <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" size="sm" />
              <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" size="md" />
              <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" size="lg" />
              <Avatar alt="Fallback Avatar" size="md" />
            </div>
          </div>

          {/* Text and Heading Variants */}
          <div>
            <Box marginBottom="3">
              <Heading level={2} size="2xl">
                Typography Components
              </Heading>
              <Box marginTop="1">
                <Text variant="body-sm" semantic="secondary">
                  Text and Heading components with multiple variants and semantic colors
                </Text>
              </Box>
            </Box>
            <div className={styles.flexColumnTight}>
              <Heading level={3} size="3xl">Heading 3XL</Heading>
              <Heading level={4} size="2xl">Heading 2XL</Heading>
              <Heading level={5} size="xl">Heading XL</Heading>
              <Heading level={6} size="lg">Heading LG</Heading>
              <Box marginTop="2">
                <Text variant="display">Display Text</Text>
                <Text variant="headline">Headline Text</Text>
                <Text variant="title">Title Text</Text>
                <Text variant="body">Body Text - Regular paragraph text with default styling for content</Text>
                <Text variant="body-sm">Body Small Text - Smaller body text variant</Text>
                <Text variant="caption">Caption Text - Small supplementary text</Text>
              </Box>
              <Box marginTop="2">
                <Text variant="body" semantic="secondary">Secondary Color</Text>
                <Text variant="body" semantic="success">Success Color</Text>
                <Text variant="body" semantic="error">Error Color</Text>
                <Text variant="body" semantic="warning">Warning Color</Text>
              </Box>
            </div>
          </div>

          {/* Form Components */}
          <div>
            <Box marginBottom="3">
              <Heading level={2} size="2xl">
                Form Components
              </Heading>
              <Box marginTop="1">
                <Text variant="body-sm" semantic="secondary">
                  Complete form controls with validation states
                </Text>
              </Box>
            </Box>

            {/* Input Component */}
            <Box marginBottom="4">
              <Heading level={3} size="lg">Input</Heading>
              <Box marginTop="2">
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    helperText="Choose a unique username"
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="user@example.com"
                    inputSize="md"
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    error="Password must be at least 8 characters"
                    inputSize="md"
                  />
                  <Input
                    label="Verified Email"
                    type="email"
                    placeholder="verified@example.com"
                    success="Email verified successfully!"
                    inputSize="md"
                  />
                  <Box marginTop="1">
                    <Label>Input Sizes</Label>
                  </Box>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input placeholder="Small" inputSize="sm" />
                    <Input placeholder="Medium" inputSize="md" />
                    <Input placeholder="Large" inputSize="lg" />
                  </div>
                </div>
              </Box>
            </Box>

            {/* Select Component */}
            <Box marginBottom="4">
              <Heading level={3} size="lg">Select</Heading>
              <Box marginTop="2">
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <Select
                    label="Choose an option"
                    options={selectOptions}
                    value={selectValue}
                    onChange={setSelectValue}
                    placeholder="Select one..."
                    helperText="Pick your preferred option"
                  />
                  <Select
                    label="Required field"
                    options={selectOptions}
                    error="This field is required"
                    required
                  />
                  <Box marginTop="1">
                    <Label>Select Sizes</Label>
                  </Box>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Select options={selectOptions} size="sm" placeholder="Small" />
                    <Select options={selectOptions} size="md" placeholder="Medium" />
                    <Select options={selectOptions} size="lg" placeholder="Large" />
                  </div>
                </div>
              </Box>
            </Box>

            {/* Textarea Component */}
            <Box marginBottom="4">
              <Heading level={3} size="lg">Textarea</Heading>
              <Box marginTop="2">
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <Textarea
                    label="Description"
                    placeholder="Enter your description here..."
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    helperText="Provide a detailed description"
                    rows={4}
                  />
                  <Textarea
                    label="Comments"
                    placeholder="Add your comments"
                    error="Comments are required"
                    rows={3}
                  />
                  <Textarea
                    label="Feedback"
                    placeholder="Thank you for your feedback"
                    success="Feedback submitted successfully"
                    rows={3}
                  />
                </div>
              </Box>
            </Box>

            {/* Radio Component */}
            <Box marginBottom="4">
              <Heading level={3} size="lg">Radio</Heading>
              <Box marginTop="2">
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <Box>
                    <Label>Choose an option</Label>
                    <Box marginTop="2">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Radio
                          label="Option 1"
                          name="radio-group"
                          value="option1"
                          checked={radioValue === 'option1'}
                          onChange={(e) => setRadioValue(e.target.value)}
                          helperText="This is the first option"
                        />
                        <Radio
                          label="Option 2"
                          name="radio-group"
                          value="option2"
                          checked={radioValue === 'option2'}
                          onChange={(e) => setRadioValue(e.target.value)}
                          helperText="This is the second option"
                        />
                        <Radio
                          label="Option 3 (Disabled)"
                          name="radio-group"
                          value="option3"
                          disabled
                        />
                      </div>
                    </Box>
                  </Box>
                  <Box marginTop="2">
                    <Label>Radio Sizes</Label>
                    <Box marginTop="2">
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Radio label="Small" name="size-group" size="sm" />
                        <Radio label="Medium" name="size-group" size="md" />
                        <Radio label="Large" name="size-group" size="lg" />
                      </div>
                    </Box>
                  </Box>
                </div>
              </Box>
            </Box>

            {/* Switch Component */}
            <Box marginBottom="4">
              <Heading level={3} size="lg">Switch</Heading>
              <Box marginTop="2">
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <Switch
                    label="Enable notifications"
                    checked={switchChecked}
                    onChange={(e) => setSwitchChecked(e.target.checked)}
                    helperText="Receive email notifications"
                  />
                  <Switch
                    label="Dark mode"
                    helperText="Toggle dark mode theme"
                  />
                  <Switch
                    label="Disabled switch"
                    disabled
                  />
                  <Switch
                    label="Error state"
                    error="This feature is not available"
                  />
                  <Box marginTop="2">
                    <Label>Switch Sizes</Label>
                    <Box marginTop="2">
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Switch label="Small" size="sm" />
                        <Switch label="Medium" size="md" />
                        <Switch label="Large" size="lg" />
                      </div>
                    </Box>
                  </Box>
                </div>
              </Box>
            </Box>

            {/* Checkbox Component */}
            <Box marginBottom="4">
              <Heading level={3} size="lg">Checkbox</Heading>
              <Box marginTop="2">
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <Checkbox
                    label="Accept terms and conditions"
                    checked={checkboxChecked}
                    onChange={(e) => setCheckboxChecked(e.target.checked)}
                  />
                  <Checkbox
                    label="Subscribe to newsletter"
                    helperText="Get weekly updates"
                  />
                  <Checkbox
                    label="Disabled checkbox"
                    disabled
                  />
                  <Checkbox
                    label="Checked and disabled"
                    checked
                    disabled
                  />
                </div>
              </Box>
            </Box>
          </div>

          {/* Box Component for Layout */}
          <div>
            <Box marginBottom="3">
              <Heading level={2} size="2xl">
                Box Component (Layout)
              </Heading>
              <Box marginTop="1">
                <Text variant="body-sm" semantic="secondary">
                  Layout primitive with spacing utilities
                </Text>
              </Box>
            </Box>
            <div className={styles.gridCards}>
              <Box padding="4" className={styles.card}>
                <Heading level={4} size="md">Card 1</Heading>
                <Box marginTop="2">
                  <Text variant="body-sm">This card uses Box padding and CSS variables for styling</Text>
                </Box>
              </Box>
              <Box padding="4" className={styles.card}>
                <Heading level={4} size="md">Card 2</Heading>
                <Box marginTop="2">
                  <Text variant="body-sm">All cards respond to theme changes</Text>
                </Box>
              </Box>
              <Box padding="4" className={styles.card}>
                <Heading level={4} size="md">Card 3</Heading>
                <Box marginTop="2">
                  <Text variant="body-sm">Dark mode and brand themes work seamlessly</Text>
                </Box>
              </Box>
            </div>
          </div>
        </div>
      </Box>

      {/* SSR Compatibility Info Card */}
      <Box padding="4" className={styles.infoCard}>
        <Box marginBottom="2">
          <Heading level={3} size="xl">
            SSR Compatibility Test Results
          </Heading>
        </Box>
        <ul className={styles.infoList}>
          <li>
            <Text variant="body">
              All components render correctly with Next.js 16 Server-Side Rendering
            </Text>
          </li>
          <li>
            <Text variant="body">
              Theme switching works at runtime (light/dark mode)
            </Text>
          </li>
          <li>
            <Text variant="body">
              Brand switching works at runtime (default/BSF brand)
            </Text>
          </li>
          <li>
            <Text variant="body">
              CSS variables enable SSR compatibility without runtime theme resolution
            </Text>
          </li>
          <li>
            <Text variant="body">
              No React Context required for theming in child components
            </Text>
          </li>
          <li>
            <Text variant="body">
              All form components are fully interactive and maintain state
            </Text>
          </li>
          <li>
            <Text variant="body">
              Components use proper semantic HTML and accessibility attributes
            </Text>
          </li>
        </ul>
      </Box>
    </ThemeWrapper>
  );
}

/**
 * Client Components Entry Point
 *
 * This file exports components that use React hooks and require 'use client' in Next.js.
 * Import from '@mond-design-system/theme/client' when using these in Next.js applications.
 *
 * These components require client-side JavaScript and cannot be used in Server Components.
 */

// Form components (use hooks for state management)
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Checkbox';
export * from './components/Radio';
export * from './components/Select';
export * from './components/Switch';

// Interactive components (use hooks for interactivity)
export * from './components/Tooltip';
export * from './components/Popover';
export * from './components/Modal';
export * from './components/Tabs';

// Accordion exports - handle naming conflict between AccordionItem type and component
export { Accordion, type AccordionProps, type AccordionMode, type AccordionVariant, type AccordionSize } from './components/Accordion';
export { AccordionItem, type AccordionItemProps, type AccordionItemSize, type AccordionItemVariant } from './components/AccordionItem';

export * from './components/Dropdown';
export * from './components/DropdownItem';
export * from './components/Carousel';
export * from './components/ToastContainer';
export * from './components/Pagination';

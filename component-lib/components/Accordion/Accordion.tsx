'use client';
import React, { useState } from 'react';
import { radii, fontFamilies } from '../../tokens';
import { useThemeContext } from '../providers/ThemeProvider';
import { Box } from '../Box/Box';
import { AccordionItem } from '../AccordionItem/AccordionItem';

export type AccordionMode = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'bordered' | 'filled';
export type AccordionSize = 'sm' | 'md' | 'lg';

export interface AccordionItem {
  /**
   * Unique identifier for the accordion item
   */
  id: string;
  
  /**
   * Title content for the accordion header
   */
  title: string | React.ReactNode;
  
  /**
   * Content to display when expanded
   */
  content: React.ReactNode;
  
  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom icon for this specific item
   */
  icon?: React.ReactNode;
  
  /**
   * Default expanded state for uncontrolled mode
   * @default false
   */
  defaultExpanded?: boolean;
}

export interface AccordionProps {
  /**
   * Array of accordion items
   */
  items: AccordionItem[];
  
  /**
   * Expand behavior mode
   * @default 'single'
   */
  mode?: AccordionMode;
  
  /**
   * Controlled expanded state (array of item IDs)
   */
  expandedIds?: string[];
  
  /**
   * Handler for controlled mode
   */
  onExpandedChange?: (expandedIds: string[]) => void;
  
  /**
   * Allow all sections to be closed in single mode
   * @default true
   */
  allowToggleOff?: boolean;
  
  /**
   * Visual styling variant
   * @default 'default'
   */
  variant?: AccordionVariant;
  
  /**
   * Size variants affecting padding and text sizes
   * @default 'md'
   */
  size?: AccordionSize;
  
  /**
   * Enable/disable animations
   * @default true
   */
  animated?: boolean;
  
  /**
   * Default expand/collapse icon
   */
  icon?: React.ReactNode;
  
  /**
   * Icon position
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Dark mode support
   * @default false
   */
  
  /**
   * Custom className
   */
  className?: string;
}


const getVariantStyles = (variant: AccordionVariant, theme: ReturnType<typeof useThemeContext>['theme']) => {
  switch (variant) {
    case 'bordered':
      return {
        containerBorder: `1px solid ${theme('border.default')}`,
        containerBorderRadius: radii.md,
        itemBorder: 'none',
        itemBorderBottom: `1px solid ${theme('border.default')}`,
        headerBackground: 'transparent',
        headerBackgroundHover: theme('interactive.secondary.backgroundHover'),
        contentBackground: 'transparent',
      };
    case 'filled':
      return {
        containerBorder: 'none',
        containerBorderRadius: '0',
        itemBorder: 'none',
        itemBorderBottom: 'none',
        headerBackground: theme('surface.elevated'),
        headerBackgroundHover: theme('interactive.secondary.backgroundHover'),
        contentBackground: theme('surface.background'),
      };
    case 'default':
    default:
      return {
        containerBorder: 'none',
        containerBorderRadius: '0',
        itemBorder: `1px solid ${theme('border.default')}`,
        itemBorderBottom: 'none',
        headerBackground: 'transparent',
        headerBackgroundHover: theme('interactive.secondary.backgroundHover'),
        contentBackground: 'transparent',
      };
  }
};


export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({
    items,
    mode = 'single',
    expandedIds,
    onExpandedChange,
    allowToggleOff = true,
    variant = 'default',
    size = 'md',
    animated = true,
    icon,
    iconPosition = 'right',
    
    className,
    ...props
  }, ref) => {
    const { theme } = useThemeContext();
    const variantStyles = getVariantStyles(variant, theme);
    const isControlled = expandedIds !== undefined && onExpandedChange !== undefined;
    
    // Internal state for uncontrolled mode
    const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(() => {
      if (isControlled) return [];
      return items
        .filter(item => item.defaultExpanded && !item.disabled)
        .map(item => item.id);
    });
    
    // Use controlled or internal state
    const activeExpandedIds = isControlled ? expandedIds : internalExpandedIds;
    
    const handleToggle = (itemId: string, disabled?: boolean) => {
      if (disabled) return;
      
      let newExpandedIds: string[];
      
      if (mode === 'single') {
        // Single mode: only one item can be expanded
        const isCurrentlyExpanded = activeExpandedIds.includes(itemId);
        
        if (isCurrentlyExpanded) {
          // Collapse if toggle off is allowed
          newExpandedIds = allowToggleOff ? [] : [itemId];
        } else {
          // Expand this item (collapsing others)
          newExpandedIds = [itemId];
        }
      } else {
        // Multiple mode: toggle individual items
        newExpandedIds = activeExpandedIds.includes(itemId)
          ? activeExpandedIds.filter(id => id !== itemId)
          : [...activeExpandedIds, itemId];
      }
      
      if (isControlled) {
        onExpandedChange!(newExpandedIds);
      } else {
        setInternalExpandedIds(newExpandedIds);
      }
    };
    
    const containerStyles: React.CSSProperties = {
      fontFamily: fontFamilies.sans,
      border: variantStyles.containerBorder,
      borderRadius: variantStyles.containerBorderRadius,
      overflow: 'hidden',
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentTarget = event.target as HTMLElement;
      const currentButton = currentTarget.closest('button[data-accordion-header]') as HTMLButtonElement;
      
      if (!currentButton) return;
      
      const currentId = currentButton.getAttribute('data-accordion-header');
      if (!currentId) return;
      
      const currentIndex = items.findIndex(item => item.id === currentId);
      let targetIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          // Find next non-disabled item
          targetIndex = currentIndex;
          do {
            targetIndex = (targetIndex + 1) % items.length;
          } while (items[targetIndex].disabled && targetIndex !== currentIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          // Find previous non-disabled item  
          targetIndex = currentIndex;
          do {
            targetIndex = targetIndex === 0 ? items.length - 1 : targetIndex - 1;
          } while (items[targetIndex].disabled && targetIndex !== currentIndex);
          break;
        case 'Home':
          event.preventDefault();
          // Find first non-disabled item
          targetIndex = items.findIndex(item => !item.disabled);
          if (targetIndex === -1) targetIndex = 0; // fallback
          break;
        case 'End':
          event.preventDefault();
          // Find last non-disabled item
          for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i].disabled) {
              targetIndex = i;
              break;
            }
          }
          break;
        default:
          return;
      }
      
      // Focus the target item if it's different from current
      if (targetIndex !== currentIndex) {
        const targetButton = document.querySelector(`[data-accordion-header="${items[targetIndex].id}"]`) as HTMLElement;
        targetButton?.focus();
      }
    };

    return (
      <Box
        ref={ref}
        className={className}
        style={containerStyles}
        role="region"
        aria-label="Accordion"
        data-mond-accordion
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.map((item, index) => {
          const isExpanded = activeExpandedIds.includes(item.id);
          const isLast = index === items.length - 1;
          
          const itemStyles: React.CSSProperties = {
            border: variantStyles.itemBorder,
            borderBottom: isLast ? 'none' : variantStyles.itemBorderBottom,
          };
          
          const displayIcon = item.icon || icon;
          
          return (
            <Box key={item.id} style={itemStyles}>
              <AccordionItem
                title={item.title}
                expanded={isExpanded}
                onExpandedChange={() => handleToggle(item.id, item.disabled)}
                disabled={item.disabled}
                size={size}
                variant={variant}
                animated={animated}
                icon={displayIcon}
                iconPosition={iconPosition}
                
                itemId={item.id}
                style={{
                  border: 'none',
                  borderRadius: 0,
                  overflow: 'visible'
                }}
              >
                {item.content}
              </AccordionItem>
            </Box>
          );
        })}
      </Box>
    );
  }
);

Accordion.displayName = 'Accordion';

export default Accordion;
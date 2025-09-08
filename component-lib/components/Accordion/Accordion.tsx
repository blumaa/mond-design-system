'use client';
import React, { useState } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';
import { Box } from '../Box/Box';

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
  isDarkMode?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

const getSizeStyles = (size: AccordionSize) => {
  switch (size) {
    case 'sm':
      return {
        headerPadding: `${spacing[2]} ${spacing[3]}`,
        contentPadding: `${spacing[2]} ${spacing[3]}`,
        fontSize: fontSizes.sm,
        iconSize: 16,
        minHeight: '40px',
      };
    case 'md':
      return {
        headerPadding: `${spacing[3]} ${spacing[4]}`,
        contentPadding: `${spacing[3]} ${spacing[4]}`,
        fontSize: fontSizes.base,
        iconSize: 20,
        minHeight: '48px',
      };
    case 'lg':
      return {
        headerPadding: `${spacing[4]} ${spacing[6]}`,
        contentPadding: `${spacing[4]} ${spacing[6]}`,
        fontSize: fontSizes.lg,
        iconSize: 24,
        minHeight: '56px',
      };
    default:
      return {
        headerPadding: `${spacing[3]} ${spacing[4]}`,
        contentPadding: `${spacing[3]} ${spacing[4]}`,
        fontSize: fontSizes.base,
        iconSize: 20,
        minHeight: '48px',
      };
  }
};

const getVariantStyles = (variant: AccordionVariant, theme: ReturnType<typeof useTheme>) => {
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

// Default chevron down icon
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    isDarkMode = false,
    className,
    ...props
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
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
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, itemId: string, disabled?: boolean) => {
      if (disabled) return;
      
      const currentIndex = items.findIndex(item => item.id === itemId);
      let targetIndex = currentIndex;
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleToggle(itemId, disabled);
          break;
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
    
    const containerStyles: React.CSSProperties = {
      fontFamily: fontFamilies.sans,
      border: variantStyles.containerBorder,
      borderRadius: variantStyles.containerBorderRadius,
      overflow: 'hidden',
    };
    
    return (
      <Box
        ref={ref}
        className={className}
        style={containerStyles}
        role="region"
        aria-label="Accordion"
        data-mond-accordion
        {...props}
      >
        {items.map((item, index) => {
          const isExpanded = activeExpandedIds.includes(item.id);
          const isLast = index === items.length - 1;
          
          const itemStyles: React.CSSProperties = {
            border: variantStyles.itemBorder,
            borderBottom: isLast ? 'none' : variantStyles.itemBorderBottom,
          };
          
          const headerStyles: React.CSSProperties = {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: sizeStyles.headerPadding,
            backgroundColor: variantStyles.headerBackground,
            border: 'none',
            fontSize: sizeStyles.fontSize,
            fontWeight: fontWeights.medium,
            fontFamily: fontFamilies.sans,
            color: theme('text.primary'),
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            opacity: item.disabled ? 0.6 : 1,
            minHeight: sizeStyles.minHeight,
            textAlign: 'left' as const,
            transition: animated ? 'all 150ms ease' : 'none',
            outline: 'none',
          };
          
          const iconStyles: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme('text.secondary'),
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: animated ? 'transform 200ms ease' : 'none',
          };
          
          const contentWrapperStyles: React.CSSProperties = {
            overflow: 'hidden',
            maxHeight: isExpanded ? '1000px' : '0',
            transition: animated ? 'max-height 200ms ease' : 'none',
          };
          
          const contentStyles: React.CSSProperties = {
            padding: sizeStyles.contentPadding,
            backgroundColor: variantStyles.contentBackground,
            borderTop: isExpanded ? `1px solid ${theme('border.default')}` : 'none',
          };
          
          const displayIcon = item.icon || icon || <ChevronDownIcon />;
          
          const handleHeaderMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!item.disabled) {
              e.currentTarget.style.backgroundColor = variantStyles.headerBackgroundHover;
            }
          };
          
          const handleHeaderMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!item.disabled) {
              e.currentTarget.style.backgroundColor = variantStyles.headerBackground;
            }
          };
          
          const handleHeaderFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
            if (!item.disabled) {
              e.currentTarget.style.outline = `2px solid ${theme('border.focused')}`;
              e.currentTarget.style.outlineOffset = '2px';
            }
          };
          
          const handleHeaderBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
            if (!item.disabled) {
              e.currentTarget.style.outline = 'none';
            }
          };
          
          return (
            <Box key={item.id} style={itemStyles}>
              {/* Header Button */}
              <button
                id={`accordion-header-${item.id}`}
                data-accordion-header={item.id}
                style={headerStyles}
                onClick={() => handleToggle(item.id, item.disabled)}
                onKeyDown={(e) => handleKeyDown(e, item.id, item.disabled)}
                onMouseEnter={handleHeaderMouseEnter}
                onMouseLeave={handleHeaderMouseLeave}
                onFocus={handleHeaderFocus}
                onBlur={handleHeaderBlur}
                aria-expanded={isExpanded}
                aria-controls={`accordion-content-${item.id}`}
                aria-disabled={item.disabled}
                disabled={item.disabled}
                type="button"
              >
                {/* Content with icon positioning */}
                <Box
                  display="flex"
                  alignItems="center"
                  width="100%"
                  justifyContent={iconPosition === 'left' ? 'space-between' : 'flex-start'}
                  flexDirection={iconPosition === 'left' ? 'row-reverse' : 'row'}
                  gap={spacing[2]}
                >
                  <Box display="flex" alignItems="center" flex="1">
                    {item.title}
                  </Box>
                  
                  <Box style={iconStyles}>
                    {displayIcon}
                  </Box>
                </Box>
              </button>
              
              {/* Content Panel */}
              <Box style={contentWrapperStyles}>
                <Box
                  id={`accordion-content-${item.id}`}
                  role="region"
                  aria-labelledby={`accordion-header-${item.id}`}
                  style={contentStyles}
                >
                  {item.content}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }
);

Accordion.displayName = 'Accordion';

export default Accordion;
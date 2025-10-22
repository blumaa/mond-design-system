'use client';
import React, { useState, useContext } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useThemeContext } from '../providers/ThemeProvider';
import { Box } from '../Box/Box';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'line' | 'card';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsProps {
  /**
   * Tab items (for simple usage)
   */
  tabs?: TabItem[];
  
  /**
   * Children components for compositional usage
   */
  children?: React.ReactNode;
  
  /**
   * Initially active tab ID
   */
  defaultActiveTab?: string;
  
  /**
   * Controlled active tab ID
   */
  activeTab?: string;
  
  /**
   * Callback when tab changes
   */
  onChange?: (tabId: string) => void;
  
  /**
   * Tabs variant
   * @default 'line'
   */
  variant?: TabsVariant;
  
  /**
   * Tabs size
   * @default 'md'
   */
  size?: TabsSize;
  
  /**
   * Dark mode
   * @default false
   */
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Test ID
   */
  'data-testid'?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  theme: (path: string) => string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

const getSizeStyles = (size: TabsSize) => {
  switch (size) {
    case 'sm':
      return {
        fontSize: fontSizes.sm,
        padding: `${spacing[2]} ${spacing[3]}`,
        minHeight: '32px',
      };
    case 'md':
      return {
        fontSize: fontSizes.base,
        padding: `${spacing[3]} ${spacing[4]}`,
        minHeight: '40px',
      };
    case 'lg':
      return {
        fontSize: fontSizes.lg,
        padding: `${spacing[4]} ${spacing[6]}`,
        minHeight: '48px',
      };
    default:
      return {};
  }
};

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const { variant, theme } = useTabsContext();
  
  const listStyles = {
    display: 'flex',
    position: 'relative' as const,
    borderBottom: variant === 'line' ? `1px solid ${theme('border.default')}` : 'none',
    backgroundColor: variant === 'card' ? theme('surface.elevated') : 'transparent',
    borderRadius: variant === 'card' ? radii.md : '0',
    border: variant === 'card' ? `1px solid ${theme('border.default')}` : 'none',
    overflow: 'hidden',
  };

  return (
    <Box className={className} style={listStyles} role="tablist">
      {children}
    </Box>
  );
};

const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}> = ({ value, children, disabled = false, className }) => {
  const { activeTab, setActiveTab, variant, size, theme } = useTabsContext();
  const sizeStyles = getSizeStyles(size);
  const isActive = activeTab === value;

  const triggerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: sizeStyles.fontSize,
    fontFamily: fontFamilies.sans,
    fontWeight: isActive ? fontWeights.semibold : fontWeights.normal,
    color: disabled 
      ? theme('text.disabled') 
      : isActive 
        ? theme('text.primary') 
        : theme('text.secondary'),
    backgroundColor: variant === 'card' && isActive 
      ? theme('interactive.secondary.background') 
      : 'transparent',
    border: 'none',
    borderRadius: variant === 'card' ? radii.md : '0',
    padding: sizeStyles.padding,
    minHeight: sizeStyles.minHeight,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    position: 'relative' as const,
    outline: 'none',
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    opacity: disabled ? 0.5 : 1,
    
    // Hover states
    ...(variant === 'line' && !disabled && !isActive && {
      ':hover': {
        color: theme('text.primary'),
        backgroundColor: theme('interactive.ghost.backgroundHover'),
      }
    }),
  };

  // Active indicator styles
  const indicatorStyles = variant === 'line' ? {
    position: 'absolute' as const,
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: isActive ? theme('interactive.primary.background') : 'transparent',
    transition: 'background-color 150ms ease',
  } : {};

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={className}
      style={triggerStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
      {variant === 'line' && <Box style={indicatorStyles} />}
    </button>
  );
};

const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const { activeTab, theme } = useTabsContext();
  const isActive = activeTab === value;

  const contentStyles = {
    display: isActive ? 'block' : 'none',
    padding: spacing[4],
    color: theme('text.primary'),
    outline: 'none',
  };

  return (
    <Box
      className={className}
      style={contentStyles}
      role="tabpanel"
      aria-hidden={!isActive}
      tabIndex={0}
    >
      {children}
    </Box>
  );
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  children,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'line',
  size = 'md',
  
  className,
  'data-testid': dataTestId,
}) => {
  const { theme } = useThemeContext();
  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    return controlledActiveTab || defaultActiveTab || tabs?.[0]?.id || '';
  });

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const setActiveTab = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const contextValue: TabsContextValue = {
    activeTab,
    setActiveTab,
    variant,
    size,
    theme,
  };

  const containerStyles = {
    width: '100%',
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <Box className={className} style={containerStyles} data-testid={dataTestId}>
        {children ? (
          // Compositional usage - render children directly
          children
        ) : tabs ? (
          // Array-based usage - render from tabs prop
          <>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </>
        ) : (
          // No content provided
          null
        )}
      </Box>
    </TabsContext.Provider>
  );
};

// Export sub-components for compositional usage
export { TabsList, TabsTrigger, TabsContent };

export default Tabs;
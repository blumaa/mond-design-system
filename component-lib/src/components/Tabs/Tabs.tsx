import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'line' | 'card';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsProps {
  tabs?: TabItem[];
  children?: React.ReactNode;
  defaultActiveTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  'data-testid'?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  variant: TabsVariant;
  size: TabsSize;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

const StyledTabsContainer = styled.div`
  width: 100%;
`;

interface StyledTabsListProps {
  $variant: TabsVariant;
}

const StyledTabsList = styled.div<StyledTabsListProps>`
  display: flex;
  position: relative;

  ${({ $variant, theme }) =>
    $variant === 'line' &&
    css`
      border-bottom: 1px solid ${theme.colors.borderDefault};
      background-color: transparent;
    `}

  ${({ $variant, theme }) =>
    $variant === 'card' &&
    css`
      background-color: ${theme.colors.surfaceElevated};
      border-radius: ${theme.radii.md};
      border: 1px solid ${theme.colors.borderDefault};
      overflow: hidden;
    `}
`;

interface StyledTabsTriggerProps {
  $variant: TabsVariant;
  $size: TabsSize;
  $active: boolean;
}

const StyledTabsTrigger = styled.button<StyledTabsTriggerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  position: relative;
  outline: none;
  user-select: none;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textSecondary};

  /* Size variants */
  ${({ $size, theme }) =>
    $size === 'sm' &&
    css`
      font-size: ${theme.fontSizes.sm};
      padding: ${theme.space[2]} ${theme.space[3]};
      min-height: 32px;
    `}

  ${({ $size, theme }) =>
    $size === 'md' &&
    css`
      font-size: ${theme.fontSizes.base};
      padding: ${theme.space[3]} ${theme.space[4]};
      min-height: 40px;
    `}

  ${({ $size, theme }) =>
    $size === 'lg' &&
    css`
      font-size: ${theme.fontSizes.lg};
      padding: ${theme.space[4]} ${theme.space[6]};
      min-height: 48px;
    `}

  /* Active state */
  ${({ $active, theme }) =>
    $active &&
    css`
      font-weight: ${theme.fontWeights.semibold};
      color: ${theme.colors.textPrimary};
    `}

  /* Active state for card variant */
  ${({ $active, $variant, theme }) =>
    $active && $variant === 'card' &&
    css`
      background-color: ${theme.colors.gray200};
      border-radius: ${theme.radii.md};
    `}

  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: ${({ theme }) => theme.colors.textDisabled};
  }

  /* Hover state (line variant only, not active or disabled) */
  ${({ $variant, $active, theme }) =>
    $variant === 'line' && !$active &&
    css`
      &:hover:not(:disabled) {
        color: ${theme.colors.textPrimary};
        background-color: ${theme.colors.gray100};
      }
    `}
`;

interface StyledIndicatorProps {
  $active: boolean;
}

const StyledIndicator = styled.div<StyledIndicatorProps>`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: transparent;
  transition: background-color 150ms ease;

  ${({ $active, theme }) =>
    $active &&
    css`
      background-color: ${theme.colors.blue600};
    `}
`;

interface StyledTabsContentProps {
  $active: boolean;
}

const StyledTabsContent = styled.div<StyledTabsContentProps>`
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  padding: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
`;

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  const { variant } = useTabsContext();

  return (
    <StyledTabsList $variant={variant} className={className} role="tablist">
      {children}
    </StyledTabsList>
  );
};

const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}> = ({ value, children, disabled = false, className }) => {
  const { activeTab, setActiveTab, variant, size } = useTabsContext();
  const isActive = activeTab === value;

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
    <StyledTabsTrigger
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? 'active' : 'inactive'}
      $variant={variant}
      $size={size}
      $active={isActive}
    >
      {children}
      {variant === 'line' && (
        <StyledIndicator $active={isActive} />
      )}
    </StyledTabsTrigger>
  );
};

const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <StyledTabsContent
      className={className}
      role="tabpanel"
      aria-hidden={!isActive}
      tabIndex={0}
      $active={isActive}
    >
      {children}
    </StyledTabsContent>
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
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <StyledTabsContainer className={className} data-testid={dataTestId}>
        {children ? (
          children
        ) : tabs ? (
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
        ) : null}
      </StyledTabsContainer>
    </TabsContext.Provider>
  );
};

export { TabsList, TabsTrigger, TabsContent };

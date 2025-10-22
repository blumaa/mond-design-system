'use client';
import React, { useState, useContext } from 'react';

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

const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  const { variant } = useTabsContext();

  const listClassNames = [
    'mond-tabs__list',
    `mond-tabs__list--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={listClassNames} role="tablist">
      {children}
    </div>
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

  const triggerClassNames = [
    'mond-tabs__trigger',
    `mond-tabs__trigger--${variant}`,
    `mond-tabs__trigger--${size}`,
    isActive && 'mond-tabs__trigger--active',
    disabled && 'mond-tabs__trigger--disabled',
    className,
  ].filter(Boolean).join(' ');

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
      className={triggerClassNames}
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
      {variant === 'line' && (
        <div className={`mond-tabs__indicator ${isActive ? 'mond-tabs__indicator--active' : ''}`} />
      )}
    </button>
  );
};

const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className }) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  const contentClassNames = [
    'mond-tabs__content',
    isActive && 'mond-tabs__content--active',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={contentClassNames}
      role="tabpanel"
      aria-hidden={!isActive}
      tabIndex={0}
    >
      {children}
    </div>
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
      <div className={`mond-tabs ${className || ''}`} data-testid={dataTestId}>
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
      </div>
    </TabsContext.Provider>
  );
};

export { TabsList, TabsTrigger, TabsContent };
export default Tabs;

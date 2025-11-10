import React, { useState, useContext } from 'react';
import './tabs.css';

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

  const listClassName = [
    'mond-tabs__list',
    `mond-tabs__list--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={listClassName} role="tablist">
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

  const triggerClassName = [
    'mond-tabs__trigger',
    `mond-tabs__trigger--${variant}`,
    `mond-tabs__trigger--${size}`,
    isActive && 'mond-tabs__trigger--active',
    className
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
      className={triggerClassName}
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
      {variant === 'line' && <div className="mond-tabs__indicator" />}
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

  const contentClassName = [
    'mond-tabs__content',
    !isActive && 'mond-tabs__content--hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={contentClassName}
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
      </div>
    </TabsContext.Provider>
  );
};

// Export sub-components for compositional usage
export { TabsList, TabsTrigger, TabsContent };

export default Tabs;

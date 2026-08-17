import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useId, useState } from "react";
import { cx } from "../../internal/cx";
import styles from "./Tabs.module.css";

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  baseId: string;
  /** Values whose TabPanel is currently mounted. A tab only claims
   *  aria-controls over a panel that exists — the strip is also used as a
   *  filter over one shared region, where there are no panels at all. */
  panels: ReadonlySet<string>;
  registerPanel: (value: string) => () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (context === null) throw new Error(`${component} must sit inside <Tabs>`);
  return context;
}

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

/**
 * Controlled tabs root. Compose with TabList, Tab, TabPanel.
 *
 * ```tsx
 * <Tabs value={tab} onChange={setTab}>
 *   <TabList label="Session details">
 *     <Tab value="info">Info</Tab>
 *     <Tab value="notes">Notes</Tab>
 *   </TabList>
 *   <TabPanel value="info">…</TabPanel>
 *   <TabPanel value="notes">…</TabPanel>
 * </Tabs>
 * ```
 */
export function Tabs({ value, onChange, children }: TabsProps): ReactElement {
  const baseId = useId();
  const [panels, setPanels] = useState<ReadonlySet<string>>(new Set());
  const registerPanel = useCallback((panel: string) => {
    setPanels((prev) => new Set(prev).add(panel));
    return () => {
      setPanels((prev) => {
        const next = new Set(prev);
        next.delete(panel);
        return next;
      });
    };
  }, []);
  return (
    <TabsContext.Provider value={{ value, onChange, baseId, panels, registerPanel }}>
      {children}
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the tab set. */
  label: string;
  children: ReactNode;
}

/* Selection follows focus (WAI-APG "automatic activation") — panels here are
   local content, not expensive loads. */
function onArrow(event: KeyboardEvent<HTMLDivElement>, onChange: (v: string) => void): void {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const current = tabs.findIndex((tab) => tab === document.activeElement);
  if (current === -1) return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  const tab = tabs[next];
  if (!tab) return;
  tab.focus();
  const value = tab.dataset.value;
  if (value !== undefined) onChange(value);
}

export function TabList({ label, className, children, ...rest }: TabListProps): ReactElement {
  const { onChange } = useTabs("TabList");
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx(styles.list, className)}
      onKeyDown={(event) => onArrow(event, onChange)}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
  value: string;
  children: ReactNode;
}

export function Tab({ value, className, children, ...rest }: TabProps): ReactElement {
  const tabs = useTabs("Tab");
  const selected = tabs.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={tabs.panels.has(value) ? `${tabs.baseId}-panel-${value}` : undefined}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      className={cx(styles.tab, selected && styles.selected, className)}
      onClick={() => tabs.onChange(value)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function TabPanel({ value, className, children, ...rest }: TabPanelProps): ReactElement {
  const tabs = useTabs("TabPanel");
  const selected = tabs.value === value;
  const { registerPanel } = tabs;
  useEffect(() => registerPanel(value), [registerPanel, value]);
  return (
    <div
      role="tabpanel"
      id={`${tabs.baseId}-panel-${value}`}
      aria-labelledby={`${tabs.baseId}-tab-${value}`}
      hidden={!selected}
      className={cx(styles.panel, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

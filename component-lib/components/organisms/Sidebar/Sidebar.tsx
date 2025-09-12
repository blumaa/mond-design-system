'use client';
import React, { useState, ReactNode } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Link } from '../../atoms/Link/Link';
import { tokens } from '../../../tokens/tokens';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface SidebarSection {
  id: string;
  title: string;
  icon?: ReactNode;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
  subItems?: SidebarItem[];
}

export interface SidebarProps extends Omit<BoxProps, 'children' | 'position'> {
  /**
   * Sidebar sections with navigation items
   */
  sections: SidebarSection[];
  
  /**
   * Whether the sidebar is collapsed
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Whether the sidebar can be collapsed
   * @default true
   */
  collapsible?: boolean;
  
  /**
   * Sidebar width when expanded
   * @default '280px'
   */
  width?: string;
  
  /**
   * Sidebar width when collapsed
   * @default '60px'
   */
  collapsedWidth?: string;
  
  /**
   * Sidebar position
   * @default 'left'
   */
  position?: 'left' | 'right';
  
  /**
   * Whether to show overlay on mobile
   * @default true
   */
  showOverlay?: boolean;
  
  /**
   * Whether sidebar is open on mobile
   * @default false
   */
  mobileOpen?: boolean;
  
  /**
   * Dark mode styling
   * @default false
   */
  
  /**
   * Custom header content
   */
  header?: ReactNode;
  
  /**
   * Custom footer content
   */
  footer?: ReactNode;
  
  /**
   * Show collapse toggle button
   * @default true
   */
  showToggle?: boolean;
  
  /**
   * Callback when collapse state changes
   */
  onCollapseChange?: (collapsed: boolean) => void;
  
  /**
   * Callback when mobile open state changes
   */
  onMobileToggle?: (open: boolean) => void;
  
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: SidebarItem) => void;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({
  sections,
  collapsed = false,
  collapsible = true,
  width = '280px',
  collapsedWidth = '60px',
  position = 'left',
  showOverlay = true,
  mobileOpen = false,
  
  header,
  footer,
  showToggle = true,
  onCollapseChange,
  onMobileToggle,
  onItemClick,
  className = '',
  style,
  ...props
}, ref) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === 'dark';
  
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  const [sectionStates, setSectionStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach(section => {
      if (section.collapsible !== false) {
        initial[section.id] = section.defaultCollapsed ?? false;
      }
    });
    return initial;
  });

  const isCollapsed = collapsible ? internalCollapsed : false;
  const effectiveWidth = isCollapsed ? collapsedWidth : width;

  const handleToggleCollapse = () => {
    const newCollapsed = !internalCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const handleMobileToggle = () => {
    onMobileToggle?.(!mobileOpen);
  };

  const handleSectionToggle = (sectionId: string) => {
    if (isCollapsed) return; // Don't allow section toggle when sidebar is collapsed
    
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;
    
    item.onClick?.();
    onItemClick?.(item);
    
    // Close mobile sidebar when item is clicked
    if (mobileOpen) {
      onMobileToggle?.(false);
    }
  };

  const sidebarColors = {
    background: isDark ? tokens.colors.gray['900'] : tokens.colors.white['50'],
    border: isDark ? tokens.colors.gray['800'] : tokens.colors.gray['200'],
    text: {
      primary: isDark ? tokens.colors.gray['100'] : tokens.colors.gray['900'],
      secondary: isDark ? tokens.colors.gray['400'] : tokens.colors.gray['600'],
      disabled: isDark ? tokens.colors.gray['600'] : tokens.colors.gray['400'],
    },
    active: {
      background: isDark ? tokens.colors.blue['900'] : tokens.colors.blue['50'],
      text: isDark ? tokens.colors.blue['400'] : tokens.colors.blue['600'],
    },
    hover: {
      background: isDark ? tokens.colors.gray['800'] : tokens.colors.gray['50'],
    }
  };

  const sidebarStyle = {
    position: 'fixed' as const,
    top: 0,
    [position]: 0,
    height: '100vh',
    width: effectiveWidth,
    backgroundColor: sidebarColors.background,
    borderRight: position === 'left' ? `1px solid ${sidebarColors.border}` : undefined,
    borderLeft: position === 'right' ? `1px solid ${sidebarColors.border}` : undefined,
    transition: 'width 0.3s ease, transform 0.3s ease',
    transform: mobileOpen ? 'translateX(0)' : `translateX(${position === 'left' ? '-100%' : '100%'})`,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    ...style,
  };

  const desktopSidebarStyle = {
    ...sidebarStyle,
    position: 'relative' as const,
    transform: 'translateX(0)',
    height: 'auto',
    minHeight: '500px',
  };

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: mobileOpen ? 'block' : 'none',
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const itemPadding = tokens.spacing['3'];
    const subItemPadding = `${tokens.spacing['2']} ${tokens.spacing['3']} ${tokens.spacing['2']} ${tokens.spacing['6']}`;
    
    const itemStyle = {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: level === 0 ? itemPadding : subItemPadding,
      border: 'none',
      background: item.active ? sidebarColors.active.background : 'transparent',
      color: item.disabled 
        ? sidebarColors.text.disabled 
        : item.active 
          ? sidebarColors.active.text 
          : sidebarColors.text.primary,
      textDecoration: 'none',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      fontSize: tokens.fontSizes.sm,
      fontWeight: item.active ? tokens.fontWeights.medium : tokens.fontWeights.normal,
      transition: 'all 0.2s ease',
      textAlign: 'left' as const,
      gap: tokens.spacing['3'],
      opacity: item.disabled ? 0.5 : 1,
    };

    const handleHover = (e: React.MouseEvent, isEntering: boolean) => {
      if (!item.disabled && !item.active) {
        (e.target as HTMLElement).style.backgroundColor = isEntering 
          ? sidebarColors.hover.background 
          : 'transparent';
      }
    };

    const ItemContent = () => (
      <Box
        style={itemStyle}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
        onClick={() => handleItemClick(item)}
      >
        {item.icon && !isCollapsed && (
          <Icon size="sm" >
            {item.icon}
          </Icon>
        )}
        
        {(!isCollapsed || level > 0) && (
          <>
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            
            {item.badge && (
              <Box
                style={{
                  backgroundColor: isDark ? tokens.colors.red['600'] : tokens.colors.red['500'],
                  color: tokens.colors.white['50'],
                  fontSize: tokens.fontSizes.xs,
                  padding: `${tokens.spacing['1']} ${tokens.spacing['2']}`,
                  borderRadius: tokens.radii.full,
                  minWidth: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.badge}
              </Box>
            )}
          </>
        )}
      </Box>
    );

    if (item.href && !item.disabled) {
      return (
        <div key={item.id}>
          <Link href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
            <ItemContent />
          </Link>
          {hasSubItems && !isCollapsed && (
            <div>
              {item.subItems!.map(subItem => renderItem(subItem, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.id}>
        <Box as={item.onClick || !item.disabled ? 'button' : 'div'}>
          <ItemContent />
        </Box>
        {hasSubItems && !isCollapsed && (
          <div>
            {item.subItems!.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: SidebarSection) => {
    const isSectionCollapsed = section.collapsible !== false && sectionStates[section.id];
    const showSectionHeader = !isCollapsed && section.title;

    return (
      <div key={section.id}>
        {showSectionHeader && (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `${tokens.spacing['4']} ${tokens.spacing['3']} ${tokens.spacing['2']}`,
              fontSize: tokens.fontSizes.xs,
              fontWeight: tokens.fontWeights.semibold,
              color: sidebarColors.text.secondary,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              cursor: section.collapsible !== false ? 'pointer' : 'default',
              gap: tokens.spacing['2'],
            }}
            onClick={() => section.collapsible !== false && handleSectionToggle(section.id)}
          >
            {section.icon && (
              <Icon size="xs" >
                {section.icon}
              </Icon>
            )}
            
            <span style={{ flex: 1 }}>{section.title}</span>
            
            {section.collapsible !== false && (
              <Icon size="xs" >
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  style={{
                    transform: isSectionCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <path 
                    d="M3 4.5L6 7.5L9 4.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Icon>
            )}
          </Box>
        )}
        
        {(!isSectionCollapsed || isCollapsed) && (
          <div>
            {section.items.map(item => renderItem(item))}
          </div>
        )}
      </div>
    );
  };

  // Mobile view
  const MobileSidebar = () => (
    <>
      {showOverlay && (
        <div 
          style={overlayStyle} 
          onClick={handleMobileToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMobileToggle();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      <Box
        ref={ref}
        className={`mond-sidebar mond-sidebar--mobile ${className}`}
        style={sidebarStyle}
        {...props}
      >
        {header && (
          <Box style={{ padding: tokens.spacing['4'], borderBottom: `1px solid ${sidebarColors.border}` }}>
            {header}
          </Box>
        )}
        
        <Box style={{ flex: 1, overflow: 'auto' }}>
          {sections.map(renderSection)}
        </Box>
        
        {footer && (
          <Box style={{ padding: tokens.spacing['4'], borderTop: `1px solid ${sidebarColors.border}` }}>
            {footer}
          </Box>
        )}
      </Box>
    </>
  );

  // Desktop view
  const DesktopSidebar = () => (
    <Box
      ref={ref}
      className={`mond-sidebar mond-sidebar--desktop ${isCollapsed ? 'mond-sidebar--collapsed' : ''} ${className}`}
      style={desktopSidebarStyle}
      {...props}
    >
      {header && (
        <Box style={{ 
          padding: isCollapsed ? tokens.spacing['2'] : tokens.spacing['4'], 
          borderBottom: `1px solid ${sidebarColors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}>
          {!isCollapsed && header}
          
          {showToggle && collapsible && (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={handleToggleCollapse}
              style={{
                color: sidebarColors.text.secondary,
                marginLeft: isCollapsed ? 0 : tokens.spacing['2'],
              }}
            >
              <Icon size="sm" >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path 
                    d={position === 'left' 
                      ? (isCollapsed ? "M6 4L10 8L6 12" : "M10 4L6 8L10 12")
                      : (isCollapsed ? "M10 4L6 8L10 12" : "M6 4L10 8L6 12")
                    }
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Icon>
            </Button>
          )}
        </Box>
      )}
      
      <Box style={{ flex: 1, overflow: 'auto' }}>
        {sections.map(renderSection)}
      </Box>
      
      {footer && (
        <Box style={{ 
          padding: isCollapsed ? tokens.spacing['2'] : tokens.spacing['4'], 
          borderTop: `1px solid ${sidebarColors.border}`,
          display: 'flex',
          justifyContent: 'center',
        }}>
          {!isCollapsed && footer}
        </Box>
      )}
    </Box>
  );

  // Check if we should render mobile or desktop version based on window width
  // For Storybook/testing purposes, we'll use a simple approach
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
});

Sidebar.displayName = 'Sidebar';
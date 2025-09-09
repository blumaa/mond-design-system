'use client';
import React, { useState } from 'react';
import { spacing, fontSizes, fontWeights, fontFamilies, radii } from '../../../tokens';
import { useTheme } from '../../../utils/theme';
import { Box } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';
import { Link } from '../../atoms/Link/Link';

export interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface HeaderAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Logo content (text, image, or custom element)
   */
  logo?: React.ReactNode;
  
  /**
   * Logo href for link wrapper
   */
  logoHref?: string;
  
  /**
   * Navigation items
   */
  navigationItems?: NavigationItem[];
  
  /**
   * Action buttons/elements
   */
  actions?: HeaderAction[];
  
  /**
   * Additional content to display on the right side
   */
  rightContent?: React.ReactNode;
  
  /**
   * Whether to show mobile menu toggle
   * @default true
   */
  showMobileToggle?: boolean;
  
  /**
   * Whether mobile menu is open (controlled)
   */
  isMobileMenuOpen?: boolean;
  
  /**
   * Callback when mobile menu toggle is clicked
   */
  onMobileMenuToggle?: (isOpen: boolean) => void;
  
  /**
   * Header height
   * @default '64px'
   */
  height?: string;
  
  /**
   * Whether header is sticky
   * @default false
   */
  sticky?: boolean;
  
  /**
   * Background style variant
   * @default 'solid'
   */
  variant?: 'solid' | 'transparent' | 'blur';
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ 
    logo,
    logoHref,
    navigationItems = [],
    actions = [],
    rightContent,
    showMobileToggle = true,
    isMobileMenuOpen: controlledMobileMenuOpen,
    onMobileMenuToggle,
    height = '64px',
    sticky = false,
    variant = 'solid',
    isDarkMode = false,
    'data-testid': dataTestId,
    className,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
    
    // Controlled vs uncontrolled mobile menu state
    const isControlled = controlledMobileMenuOpen !== undefined;
    const isMobileMenuOpen = isControlled ? controlledMobileMenuOpen : internalMobileMenuOpen;
    
    const setMobileMenuOpen = (open: boolean) => {
      if (!isControlled) {
        setInternalMobileMenuOpen(open);
      }
      onMobileMenuToggle?.(open);
    };

    const handleMobileToggle = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'transparent':
          return {
            backgroundColor: 'transparent',
            borderBottom: 'none',
            backdropFilter: 'none',
          };
        case 'blur':
          return {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderBottom: `1px solid ${theme('border.default')}`,
            backdropFilter: 'blur(10px)',
          };
        case 'solid':
        default:
          return {
            backgroundColor: theme('surface.primary'),
            borderBottom: `1px solid ${theme('border.default')}`,
            backdropFilter: 'none',
          };
      }
    };

    const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
      const content = (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? `${spacing[3]} ${spacing[4]}` : `${spacing[2]} ${spacing[3]}`,
            color: item.active ? theme('text.accent') : (item.disabled ? theme('text.disabled') : theme('text.primary')),
            textDecoration: 'none',
            fontSize: fontSizes.sm,
            fontFamily: fontFamilies.sans,
            fontWeight: item.active ? fontWeights.medium : fontWeights.normal,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            borderRadius: radii.md,
            transition: 'background-color 150ms ease, color 150ms ease',
            ...(isMobile && {
              width: '100%',
              justifyContent: 'flex-start',
            }),
          }}
          onClick={item.disabled ? undefined : item.onClick}
          onMouseEnter={(e) => {
            if (!item.disabled) {
              (e.target as HTMLElement).style.backgroundColor = theme('surface.hover');
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          {item.label}
          {item.children && (
            <Box style={{ marginLeft: spacing[2], fontSize: fontSizes.xs }}>
              ▼
            </Box>
          )}
        </Box>
      );

      if (item.href && !item.disabled) {
        return (
          <Link 
            key={item.label}
            href={item.href} 
            style={{ textDecoration: 'none' }}
          >
            {content}
          </Link>
        );
      }

      return (
        <Box key={item.label} as={item.onClick ? 'button' : 'div'}>
          {content}
        </Box>
      );
    };

    const variantStyles = getVariantStyles();

    return (
      <Box
        ref={ref}
        as="header"
        className={className}
        data-testid={dataTestId}
        style={{
          position: sticky ? 'sticky' : 'static',
          top: sticky ? 0 : 'auto',
          zIndex: sticky ? 1000 : 'auto',
          width: '100%',
          height,
          ...variantStyles,
        }}
        {...props}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            padding: `0 ${spacing[6]}`,
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Logo Section */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {logo && (
              logoHref ? (
                <Link href={logoHref} style={{ textDecoration: 'none' }}>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: theme('text.primary'),
                      fontWeight: fontWeights.bold,
                      fontSize: fontSizes.lg,
                    }}
                  >
                    {logo}
                  </Box>
                </Link>
              ) : (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme('text.primary'),
                    fontWeight: fontWeights.bold,
                    fontSize: fontSizes.lg,
                  }}
                >
                  {logo}
                </Box>
              )
            )}
          </Box>

          {/* Desktop Navigation */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
            className="header-desktop-nav"
          >
            {navigationItems.map(item => renderNavigationItem(item))}
          </Box>

          {/* Actions and Right Content */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              flexShrink: 0,
            }}
          >
            {/* Desktop Actions */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
              className="header-desktop-actions"
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                  isDarkMode={isDarkMode}
                >
                  {action.icon && (
                    <Box style={{ marginRight: action.label ? spacing[1] : 0 }}>
                      {action.icon}
                    </Box>
                  )}
                  {action.label}
                </Button>
              ))}
            </Box>

            {rightContent}

            {/* Mobile Menu Toggle */}
            {showMobileToggle && (
              <Box
                className="header-mobile-toggle"
                style={{
                  display: 'none',
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMobileToggle}
                  isDarkMode={isDarkMode}
                  aria-label="Toggle mobile menu"
                >
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      width: '18px',
                      height: '14px',
                    }}
                  >
                    <Box
                      style={{
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'currentColor',
                        transition: 'all 150ms ease',
                        transformOrigin: 'center',
                        ...(isMobileMenuOpen && {
                          transform: 'rotate(45deg) translate(4px, 4px)',
                        }),
                      }}
                    />
                    <Box
                      style={{
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'currentColor',
                        transition: 'all 150ms ease',
                        opacity: isMobileMenuOpen ? 0 : 1,
                      }}
                    />
                    <Box
                      style={{
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'currentColor',
                        transition: 'all 150ms ease',
                        transformOrigin: 'center',
                        ...(isMobileMenuOpen && {
                          transform: 'rotate(-45deg) translate(4px, -4px)',
                        }),
                      }}
                    />
                  </Box>
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Box
            className="header-mobile-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: theme('surface.primary'),
              borderBottom: `1px solid ${theme('border.default')}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: spacing[4],
              zIndex: 999,
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[1],
              }}
            >
              {navigationItems.map(item => renderNavigationItem(item, true))}
              
              {actions.length > 0 && (
                <>
                  <Box
                    style={{
                      height: '1px',
                      backgroundColor: theme('border.default'),
                      margin: `${spacing[3]} 0`,
                    }}
                  />
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'ghost'}
                      size="sm"
                      onClick={() => {
                        action.onClick();
                        setMobileMenuOpen(false);
                      }}
                      isDarkMode={isDarkMode}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {action.icon && (
                        <Box style={{ marginRight: action.label ? spacing[2] : 0 }}>
                          {action.icon}
                        </Box>
                      )}
                      {action.label}
                    </Button>
                  ))}
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

Header.displayName = 'Header';

export default Header;
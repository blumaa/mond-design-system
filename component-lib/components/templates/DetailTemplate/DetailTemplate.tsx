'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '../../layout/Box/Box';
import { Card } from '../../layout/Card/Card';
import { Grid } from '../../layout/Grid/Grid';
import { Stack } from '../../layout/Stack/Stack';
import { Header } from '../../organisms/Header/Header';
import { Sidebar, SidebarSection } from '../../organisms/Sidebar/Sidebar';
import { Breadcrumb } from '../../organisms/Breadcrumb/Breadcrumb';
import { Button } from '../../atoms/Button/Button';
import { Text } from '../../atoms/Text/Text';
import { Heading } from '../../atoms/Heading/Heading';
import { Badge } from '../../atoms/Badge/Badge';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Image } from '../../atoms/Image/Image';
import { Tabs, TabItem } from '../../organisms/Tabs/Tabs';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface DetailAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  onClick: () => void;
}

export interface DetailMetaItem {
  id: string;
  label: string;
  value: React.ReactNode;
  icon?: string;
  copyable?: boolean;
}

export interface DetailSection {
  id: string;
  title: string;
  content: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface DetailTab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
  badge?: string;
}

export interface RelatedItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  date?: Date;
  author?: string;
  url?: string;
}

export interface DetailTemplateProps {
  /**
   * Page title
   */
  title: string;
  
  /**
   * Page subtitle or description
   */
  subtitle?: string;
  
  /**
   * Main hero image
   */
  heroImage?: string;
  
  /**
   * Status badge
   */
  status?: {
    label: string;
    variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  
  /**
   * Category or type
   */
  category?: string;
  
  /**
   * Tags associated with the item
   */
  tags?: string[];
  
  /**
   * Author information
   */
  author?: {
    name: string;
    avatar?: string;
    role?: string;
    url?: string;
  };
  
  /**
   * Creation/publication date
   */
  date?: Date;
  
  /**
   * Last updated date
   */
  lastUpdated?: Date;
  
  /**
   * Primary action buttons
   */
  actions?: DetailAction[];
  
  /**
   * Secondary action buttons (overflow menu)
   */
  secondaryActions?: DetailAction[];
  
  /**
   * Metadata items to display
   */
  metadata?: DetailMetaItem[];
  
  /**
   * Main content sections
   */
  sections?: DetailSection[];
  
  /**
   * Tabbed content
   */
  tabs?: DetailTab[];
  
  /**
   * Related items to show
   */
  relatedItems?: RelatedItem[];
  
  /**
   * Breadcrumb items
   */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  
  /**
   * Whether to show the sidebar
   * @default false
   */
  showSidebar?: boolean;
  
  /**
   * Sidebar collapsed state
   * @default false
   */
  sidebarCollapsed?: boolean;
  
  /**
   * Navigation items for sidebar
   */
  navigationItems?: SidebarSection[];
  
  /**
   * Header actions
   */
  headerActions?: React.ReactNode;
  
  /**
   * Layout variant
   * @default 'default'
   */
  layout?: 'default' | 'wide' | 'centered';
  
  /**
   * Whether to show related items section
   * @default true
   */
  showRelatedItems?: boolean;
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Error state
   */
  error?: {
    title: string;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  
  /**
   * Custom content for sidebar
   */
  sidebarContent?: React.ReactNode;
  
  /**
   * Callback when related item is clicked
   */
  onRelatedItemClick?: (item: RelatedItem) => void;
  
  
  /**
   * Dark mode
   * @default false
   */
  
  /**
   * Callback when navigation item is clicked
   */
  onNavigationClick?: (itemId: string) => void;
  
  /**
   * Callback when sidebar toggle is clicked
   */
  onSidebarToggle?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
}

export const DetailTemplate: React.FC<DetailTemplateProps> = ({
  title,
  subtitle,
  heroImage,
  status,
  category,
  tags = [],
  author,
  date,
  lastUpdated,
  actions = [],
  metadata = [],
  sections = [],
  tabs = [],
  relatedItems = [],
  breadcrumbs = [],
  showSidebar = false,
  sidebarCollapsed = false,
  navigationItems,
  headerActions,
  layout = 'default',
  showRelatedItems = true,
  loading = false,
  error,
  sidebarContent,
  onRelatedItemClick,
  
  onNavigationClick,
  onSidebarToggle,
  className,
}) => {
  const { theme } = useThemeContext();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultCollapsed).map(s => s.id))
  );

  // Handle section collapse toggle
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Format date helper
  const formatDate = useCallback((date: Date, includeTime = false): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }, []);

  // Get layout constraints
  const layoutStyles = useMemo(() => {
    switch (layout) {
      case 'wide':
        return { maxWidth: '1400px', margin: '0 auto' };
      case 'centered':
        return { maxWidth: '800px', margin: '0 auto' };
      default:
        return { maxWidth: '1200px', margin: '0 auto' };
    }
  }, [layout]);

  // Render loading state
  if (loading) {
    return (
      <Box
        className={className}
        style={{
          minHeight: '100vh',
          backgroundColor: theme('surface.primary'),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          title="Loading..."
          rightContent={headerActions}
          
          onMobileMenuToggle={onSidebarToggle}
        />
        <Box
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 16px',
          }}
        >
          <Stack spacing={16} align="center">
            <Box
              style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${theme('border.default')}`,
                borderTop: `3px solid ${theme('interactive.primary.background')}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <Text variant="body-lg" semantic="secondary" >
              Loading content...
            </Text>
          </Stack>
        </Box>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box
        className={className}
        style={{
          minHeight: '100vh',
          backgroundColor: theme('surface.primary'),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          title="Error"
          rightContent={headerActions}
          
          onMobileMenuToggle={onSidebarToggle}
        />
        <Box
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 16px',
          }}
        >
          <Stack spacing={24} align="center">
            <Text
              variant="body-lg"
              semantic="tertiary"
              
              style={{ fontSize: '48px' }}
            >
              ⚠️
            </Text>
            <Stack spacing={8} align="center">
              <Heading level={3} style={{ textAlign: 'center' }}>
                {error.title}
              </Heading>
              <Text
                variant="body-lg"
                semantic="secondary"
                
                style={{ textAlign: 'center', maxWidth: '400px' }}
              >
                {error.message}
              </Text>
            </Stack>
            {error.action && (
              <Button onClick={error.action.onClick} >
                {error.action.label}
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    );
  }

  // Render hero section
  const renderHero = () => (
    <Box>
      {heroImage && (
        <Box style={{ marginBottom: '24px' }}>
          <Image
            src={heroImage}
            alt={title}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            
          />
        </Box>
      )}
      
      <Stack spacing={16}>
        {/* Status and Category */}
        {(status || category) && (
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {status && (
              <Badge variant={status.variant} >
                {status.label}
              </Badge>
            )}
            {category && (
              <Badge variant="secondary" >
                {category}
              </Badge>
            )}
          </Box>
        )}

        {/* Title and Subtitle */}
        <Box>
          <Heading level={1} style={{ marginBottom: subtitle ? '8px' : '0' }}>
            {title}
          </Heading>
          {subtitle && (
            <Text variant="body-lg" semantic="secondary" >
              {subtitle}
            </Text>
          )}
        </Box>

        {/* Author and Date */}
        {(author || date) && (
          <Box style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {author && (
              <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {author.avatar && (
                  <Avatar
                    src={author.avatar}
                    alt={author.name}
                    size="sm"
                    
                  />
                )}
                <Box>
                  <Text variant="body-sm" semantic="primary"  style={{ fontWeight: 'medium' }}>
                    {author.name}
                  </Text>
                  {author.role && (
                    <Text variant="caption" semantic="secondary" >
                      {author.role}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
            {date && (
              <Text variant="body-sm" semantic="secondary" >
                {formatDate(date)}
              </Text>
            )}
            {lastUpdated && (
              <Text variant="caption" semantic="tertiary" >
                Updated {formatDate(lastUpdated)}
              </Text>
            )}
          </Box>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" size="sm" >
                {tag}
              </Badge>
            ))}
          </Box>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <Box style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {actions.map(action => (
              <Button
                key={action.id}
                variant={action.variant || 'primary'}
                disabled={action.disabled}
                onClick={action.onClick}
                
              >
                {action.icon && <span style={{ marginRight: '8px' }}>{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );

  // Render metadata section
  const renderMetadata = () => {
    if (metadata.length === 0) return null;

    return (
      <Card padding={24} >
        <Stack spacing={16}>
          <Heading level={4}>Details</Heading>
          <Stack spacing={12}>
            {metadata.map(item => (
              <Box key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="body-sm" semantic="secondary" >
                  {item.icon && <span style={{ marginRight: '8px' }}>{item.icon}</span>}
                  {item.label}
                </Text>
                <Box style={{ textAlign: 'right' }}>
                  {typeof item.value === 'string' ? (
                    <Text variant="body-sm" semantic="primary" >
                      {item.value}
                    </Text>
                  ) : (
                    item.value
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Card>
    );
  };

  // Render sections
  const renderSections = () => {
    if (sections.length === 0) return null;

    return (
      <Stack spacing={24}>
        {sections.map(section => {
          const isCollapsed = collapsedSections.has(section.id);
          
          return (
            <Box key={section.id}>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  ...(section.collapsible && { cursor: 'pointer' }),
                }}
                onClick={section.collapsible ? () => toggleSection(section.id) : undefined}
              >
                <Heading level={3}>{section.title}</Heading>
                {section.collapsible && (
                  <Text variant="body-lg" semantic="secondary" >
                    {isCollapsed ? '▶' : '▼'}
                  </Text>
                )}
              </Box>
              {!isCollapsed && (
                <Box>{section.content}</Box>
              )}
            </Box>
          );
        })}
      </Stack>
    );
  };

  // Render tabs
  const renderTabs = () => {
    if (tabs.length === 0) return null;

    const tabItems: TabItem[] = tabs.map(tab => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      badge: tab.badge,
      content: tab.content,
    }));

    return (
      <Tabs
        tabs={tabItems}
        defaultActiveTab={activeTab}
        onChange={setActiveTab}
        
      />
    );
  };

  // Render related items
  const renderRelatedItems = () => {
    if (!showRelatedItems || relatedItems.length === 0) return null;

    return (
      <Box>
        <Heading level={3} style={{ marginBottom: '16px' }}>
          Related Items
        </Heading>
        <Grid columns={3} gap={16}>
          {relatedItems.map(item => (
            <Card
              key={item.id}
              padding={16}
              
              style={{
                cursor: onRelatedItemClick ? 'pointer' : 'default',
                transition: 'all 150ms ease',
              }}
              onClick={() => onRelatedItemClick?.(item)}
            >
              <Stack spacing={12}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                    
                  />
                )}
                <Box>
                  <Text
                    variant="body-sm"
                    semantic="primary"
                    
                    style={{ fontWeight: 'medium', lineHeight: 1.3 }}
                  >
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text
                      variant="caption"
                      semantic="secondary"
                      
                      style={{ marginTop: '4px', lineHeight: 1.3 }}
                    >
                      {item.description}
                    </Text>
                  )}
                </Box>
                {(item.category || item.date) && (
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.category && (
                      <Badge variant="secondary" size="sm" >
                        {item.category}
                      </Badge>
                    )}
                    {item.date && (
                      <Text variant="caption" semantic="tertiary" >
                        {formatDate(item.date)}
                      </Text>
                    )}
                  </Box>
                )}
              </Stack>
            </Card>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box
      className={className}
      style={{
        minHeight: '100vh',
        backgroundColor: theme('surface.primary'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Header
        title={title}
        rightContent={headerActions}
        
        onMobileMenuToggle={onSidebarToggle}
      />

      {/* Main Content */}
      <Box style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {showSidebar && navigationItems && (
          <Sidebar
            sections={navigationItems}
            collapsed={sidebarCollapsed}
            
            onItemClick={(item) => onNavigationClick?.(item.id)}
          />
        )}

        {/* Content Area */}
        <Box style={{ flex: 1 }}>
          <Box style={{ ...layoutStyles, padding: '24px' }}>
            <Stack spacing={32}>
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <Breadcrumb
                  items={breadcrumbs}
                  
                />
              )}

              {/* Main content with sidebar */}
              <Box style={{ display: 'flex', gap: '32px' }}>
                {/* Primary content */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Stack spacing={32}>
                    {/* Hero section */}
                    {renderHero()}

                    {/* Tabs */}
                    {renderTabs()}

                    {/* Sections */}
                    {renderSections()}

                    {/* Related items */}
                    {renderRelatedItems()}
                  </Stack>
                </Box>

                {/* Metadata sidebar */}
                {(metadata.length > 0 || sidebarContent) && (
                  <Box style={{ width: '300px', flexShrink: 0 }}>
                    <Stack spacing={24}>
                      {renderMetadata()}
                      {sidebarContent}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailTemplate;
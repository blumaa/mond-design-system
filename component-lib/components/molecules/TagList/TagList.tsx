import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { Tag, TagProps } from '../../atoms/Tag/Tag';
import { tokens } from '../../../tokens/tokens';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface TagData {
  id: string;
  label: ReactNode;
  variant?: TagProps['variant'];
  semantic?: TagProps['semantic'];
  size?: TagProps['size'];
  disabled?: boolean;
  icon?: ReactNode;
  removable?: boolean;
}

export interface TagListProps extends Omit<BoxProps, 'children'> {
  /**
   * Array of tag data to render
   */
  tags: TagData[];
  
  /**
   * Default variant for all tags (can be overridden per tag)
   */
  variant?: TagProps['variant'];
  
  /**
   * Default semantic type for all tags (can be overridden per tag)
   */
  semantic?: TagProps['semantic'];
  
  /**
   * Default size for all tags (can be overridden per tag)
   */
  size?: TagProps['size'];
  
  /**
   * Whether tags are removable by default (can be overridden per tag)
   */
  removable?: boolean;
  
  /**
   * Whether tags are disabled by default (can be overridden per tag)
   */
  disabled?: boolean;
  
  /**
   * Dark mode
   */
  
  /**
   * Maximum number of tags to show before wrapping
   */
  maxRows?: number;
  
  /**
   * Gap between tags
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  
  /**
   * Callback when a tag is removed
   */
  onRemove?: (tagId: string) => void;
  
  /**
   * Callback when a tag is clicked
   */
  onTagClick?: (tagId: string) => void;
  
  /**
   * Custom empty state when no tags
   */
  emptyState?: ReactNode;
  
  /**
   * Show count of hidden tags when maxRows is exceeded
   */
  showOverflow?: boolean;
}

const getGapSize = (gap: string) => {
  const gapMap = {
    xs: tokens.spacing['1'], // 0.25rem
    sm: tokens.spacing['2'], // 0.5rem
    md: tokens.spacing['3'], // 0.75rem
    lg: tokens.spacing['4'], // 1rem
  };
  return gapMap[gap as keyof typeof gapMap];
};

export const TagList = forwardRef<HTMLDivElement, TagListProps>(({
  tags,
  variant = 'filled',
  semantic = 'default',
  size = 'md',
  removable = false,
  disabled = false,
  
  maxRows,
  gap = 'sm',
  onRemove,
  onTagClick,
  emptyState,
  showOverflow = false,
  className = '',
  style,
  ...props
}, ref) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === 'dark';
  
  const gapSize = getGapSize(gap);

  const handleTagRemove = (tagId: string) => {
    onRemove?.(tagId);
  };

  const handleTagClick = (tagId: string) => {
    onTagClick?.(tagId);
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: gapSize,
    alignItems: 'flex-start',
    maxHeight: maxRows ? `${maxRows * 2.5}rem` : undefined,
    overflow: maxRows ? 'hidden' : undefined,
    ...style,
  };

  // Show empty state if no tags
  if (tags.length === 0 && emptyState) {
    return (
      <Box
        ref={ref}
        className={`mond-tag-list mond-tag-list--empty ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: tokens.spacing['4'],
          color: isDark ? tokens.colors.gray['400'] : tokens.colors.gray['500'],
          fontStyle: 'italic',
          ...style,
        }}
        {...props}
      >
        {emptyState}
      </Box>
    );
  }

  const visibleTags = maxRows ? tags.slice(0, maxRows * 4) : tags; // Approximate 4 tags per row
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <Box
      ref={ref}
      className={`mond-tag-list mond-tag-list--${variant} mond-tag-list--${semantic} mond-tag-list--${size} ${className}`}
      style={containerStyle}
      {...props}
    >
      {visibleTags.map((tag) => (
        <Tag
          key={tag.id}
          variant={tag.variant ?? variant}
          semantic={tag.semantic ?? semantic}
          size={tag.size ?? size}
          removable={tag.removable ?? removable}
          disabled={tag.disabled ?? disabled}
          
          icon={tag.icon}
          onRemove={tag.removable !== false ? () => handleTagRemove(tag.id) : undefined}
          onClick={onTagClick && !tag.disabled ? () => handleTagClick(tag.id) : undefined}
          style={{
            cursor: onTagClick && !tag.disabled ? 'pointer' : undefined,
          }}
        >
          {tag.label}
        </Tag>
      ))}
      
      {showOverflow && hiddenCount > 0 && (
        <Tag
          variant="ghost"
          semantic="default"
          size={size}
          disabled={true}
          
        >
          +{hiddenCount} more
        </Tag>
      )}
    </Box>
  );
});

TagList.displayName = 'TagList';
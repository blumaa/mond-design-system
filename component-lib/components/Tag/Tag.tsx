import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '../Box/Box';
import { Icon } from '../Icon/Icon';

export interface TagProps extends Omit<BoxProps, 'children' | 'as'> {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  semantic?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
}

const getIconSize = (size: string) => {
  const sizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };
  return sizeMap[size as keyof typeof sizeMap] || 'sm' as const;
};

export const Tag = forwardRef<HTMLElement, TagProps>(({
  children,
  variant = 'filled',
  semantic = 'default',
  size = 'md',
  removable = false,
  disabled = false,
  icon,
  onRemove,
  className = '',
  ...props
}, ref) => {
  const tagClassNames = [
    'mond-tag',
    `mond-tag--${variant}`,
    `mond-tag--${semantic}`,
    `mond-tag--${size}`,
    removable && 'mond-tag--removable',
    disabled && 'mond-tag--disabled',
    className,
  ].filter(Boolean).join(' ');

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  const handleRemoveKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && onRemove) {
      e.preventDefault();
      e.stopPropagation();
      onRemove();
    }
  };

  const iconSize = getIconSize(size);

  return (
    <Box
      ref={ref}
      className={tagClassNames}
      {...props}
    >
      {icon && (
        <Icon size={iconSize}>
          {icon}
        </Icon>
      )}

      <div className="mond-tag__text">
        {children}
      </div>

      {removable && (
        <button
          type="button"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          disabled={disabled}
          className="mond-tag__remove-button"
          aria-label="Remove tag"
          tabIndex={disabled ? -1 : 0}
        >
          <Icon size="xs">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Icon>
        </button>
      )}
    </Box>
  );
});

Tag.displayName = 'Tag';

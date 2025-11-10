import { forwardRef, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import './tag.css';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  semantic?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
}

const getIconSize = (size: string): 'xs' | 'sm' | 'md' => {
  const sizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };
  return sizeMap[size as keyof typeof sizeMap];
};

export const Tag = forwardRef<HTMLDivElement, TagProps>(({
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
  const iconSize = getIconSize(size);

  const tagClassName = `mond-tag mond-tag--${variant} mond-tag--${semantic} mond-tag--${size} ${disabled ? 'mond-tag--disabled' : ''} ${removable ? 'mond-tag--removable' : ''} ${className}`.trim();

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

  return (
    <div
      ref={ref}
      className={tagClassName}
      {...props}
    >
      {icon && (
        <Icon size={iconSize} decorative>
          {icon}
        </Icon>
      )}

      <div className="mond-tag__content">
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
          <Icon size="xs" decorative>
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
    </div>
  );
});

Tag.displayName = 'Tag';
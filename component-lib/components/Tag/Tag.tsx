import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '../Box/Box';
import { Icon } from '../Icon/Icon';
import { tokens } from '../../tokens/tokens';

export interface TagProps extends Omit<BoxProps, 'children' | 'as'> {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  semantic?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  disabled?: boolean;
  isDarkMode?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
}

const getSizeStyles = (size: string) => {
  const sizeMap = {
    sm: {
      fontSize: tokens.fontSizes.xs,
      paddingX: tokens.spacing['2'], // 0.5rem
      paddingY: tokens.spacing['1'], // 0.25rem
      borderRadius: tokens.radii.sm,
      height: '24px',
      iconSize: 'xs' as const,
    },
    md: {
      fontSize: tokens.fontSizes.sm,
      paddingX: tokens.spacing['3'], // 0.75rem
      paddingY: tokens.spacing['1'], // 0.25rem
      borderRadius: tokens.radii.md,
      height: '28px',
      iconSize: 'sm' as const,
    },
    lg: {
      fontSize: tokens.fontSizes.base,
      paddingX: tokens.spacing['4'], // 1rem
      paddingY: tokens.spacing['2'], // 0.5rem
      borderRadius: tokens.radii.lg,
      height: '36px',
      iconSize: 'md' as const,
    },
  };
  return sizeMap[size as keyof typeof sizeMap];
};

const getSemanticColors = (semantic: string, variant: string, isDarkMode: boolean, disabled: boolean) => {
  if (disabled) {
    const disabledColors = {
      background: isDarkMode ? tokens.colors.gray['800'] : tokens.colors.gray['100'],
      text: isDarkMode ? tokens.colors.gray['600'] : tokens.colors.gray['400'],
      border: isDarkMode ? tokens.colors.gray['700'] : tokens.colors.gray['200'],
    };
    return disabledColors;
  }

  const colorMap = {
    default: {
      filled: {
        background: isDarkMode ? tokens.colors.gray['700'] : tokens.colors.gray['100'],
        text: isDarkMode ? tokens.colors.gray['200'] : tokens.colors.gray['800'],
        border: 'transparent',
      },
      outlined: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.gray['300'] : tokens.colors.gray['700'],
        border: isDarkMode ? tokens.colors.gray['600'] : tokens.colors.gray['300'],
      },
      ghost: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.gray['300'] : tokens.colors.gray['700'],
        border: 'transparent',
      },
    },
    primary: {
      filled: {
        background: isDarkMode ? tokens.colors.blue['600'] : tokens.colors.blue['500'],
        text: tokens.colors.white['50'],
        border: 'transparent',
      },
      outlined: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.blue['400'] : tokens.colors.blue['600'],
        border: isDarkMode ? tokens.colors.blue['400'] : tokens.colors.blue['500'],
      },
      ghost: {
        background: isDarkMode ? tokens.colors.blue['900'] : tokens.colors.blue['50'],
        text: isDarkMode ? tokens.colors.blue['300'] : tokens.colors.blue['700'],
        border: 'transparent',
      },
    },
    success: {
      filled: {
        background: isDarkMode ? tokens.colors.green['600'] : tokens.colors.green['500'],
        text: tokens.colors.white['50'],
        border: 'transparent',
      },
      outlined: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.green['400'] : tokens.colors.green['600'],
        border: isDarkMode ? tokens.colors.green['400'] : tokens.colors.green['500'],
      },
      ghost: {
        background: isDarkMode ? tokens.colors.green['900'] : tokens.colors.green['50'],
        text: isDarkMode ? tokens.colors.green['300'] : tokens.colors.green['700'],
        border: 'transparent',
      },
    },
    warning: {
      filled: {
        background: isDarkMode ? tokens.colors.amber['600'] : tokens.colors.amber['500'],
        text: tokens.colors.white['50'],
        border: 'transparent',
      },
      outlined: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.amber['400'] : tokens.colors.amber['600'],
        border: isDarkMode ? tokens.colors.amber['400'] : tokens.colors.amber['500'],
      },
      ghost: {
        background: isDarkMode ? tokens.colors.amber['900'] : tokens.colors.amber['50'],
        text: isDarkMode ? tokens.colors.amber['300'] : tokens.colors.amber['700'],
        border: 'transparent',
      },
    },
    error: {
      filled: {
        background: isDarkMode ? tokens.colors.red['600'] : tokens.colors.red['500'],
        text: tokens.colors.white['50'],
        border: 'transparent',
      },
      outlined: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.red['400'] : tokens.colors.red['600'],
        border: isDarkMode ? tokens.colors.red['400'] : tokens.colors.red['500'],
      },
      ghost: {
        background: isDarkMode ? tokens.colors.red['900'] : tokens.colors.red['50'],
        text: isDarkMode ? tokens.colors.red['300'] : tokens.colors.red['700'],
        border: 'transparent',
      },
    },
    info: {
      filled: {
        background: isDarkMode ? tokens.colors.blue['600'] : tokens.colors.blue['500'],
        text: tokens.colors.white['50'],
        border: 'transparent',
      },
      outlined: {
        background: 'transparent',
        text: isDarkMode ? tokens.colors.blue['400'] : tokens.colors.blue['600'],
        border: isDarkMode ? tokens.colors.blue['400'] : tokens.colors.blue['500'],
      },
      ghost: {
        background: isDarkMode ? tokens.colors.blue['900'] : tokens.colors.blue['50'],
        text: isDarkMode ? tokens.colors.blue['300'] : tokens.colors.blue['700'],
        border: 'transparent',
      },
    },
  };

  return colorMap[semantic as keyof typeof colorMap][variant as keyof typeof colorMap.default];
};

export const Tag = forwardRef<HTMLElement, TagProps>(({
  children,
  variant = 'filled',
  semantic = 'default',
  size = 'md',
  removable = false,
  disabled = false,
  isDarkMode = false,
  icon,
  onRemove,
  className = '',
  style,
  ...props
}, ref) => {
  const sizeStyles = getSizeStyles(size);
  const colors = getSemanticColors(semantic, variant, isDarkMode, disabled);

  const tagStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacing['1'],
    fontSize: sizeStyles.fontSize,
    fontWeight: tokens.fontWeights.medium,
    paddingLeft: sizeStyles.paddingX,
    paddingRight: removable ? tokens.spacing['1'] : sizeStyles.paddingX,
    paddingTop: sizeStyles.paddingY,
    paddingBottom: sizeStyles.paddingY,
    height: sizeStyles.height,
    borderRadius: sizeStyles.borderRadius,
    backgroundColor: colors.background,
    color: colors.text,
    border: colors.border === 'transparent' ? 'none' : `1px solid ${colors.border}`,
    cursor: disabled ? 'not-allowed' : 'default',
    opacity: disabled ? 0.6 : 1,
    whiteSpace: 'nowrap' as const,
    maxWidth: '100%',
    ...style,
  };

  const removeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: 'currentColor',
    opacity: 0.7,
    padding: '0',
    marginLeft: tokens.spacing['1'],
    transition: 'opacity 0.2s ease',
  };

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
    <Box
      ref={ref}
      className={`mond-tag mond-tag--${variant} mond-tag--${semantic} mond-tag--${size} ${disabled ? 'mond-tag--disabled' : ''} ${className}`}
      style={tagStyle}
      {...props}
    >
      {icon && (
        <Icon size={sizeStyles.iconSize} isDarkMode={isDarkMode}>
          {icon}
        </Icon>
      )}
      
      <Box
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
      
      {removable && (
        <button
          type="button"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          disabled={disabled}
          style={removeButtonStyle}
          aria-label="Remove tag"
          tabIndex={disabled ? -1 : 0}
        >
          <Icon size="xs" isDarkMode={isDarkMode}>
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
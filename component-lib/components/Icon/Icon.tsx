import { forwardRef } from 'react';
import type { ColorValue } from '../../tokens';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize;

  /**
   * SVG element to display
   */
  children: React.ReactNode;

  /**
   * Icon color - pass a value from the colors token object
   * @default 'currentColor'
   * @example
   * import { colors } from '@mond-design-system/theme';
   * <Icon color={colors.red["500"]}><HeartIcon /></Icon>
   * <Icon color={colors.brand.primary["600"]}><HeartIcon /></Icon>
   */
  color?: ColorValue;

  /**
   * Accessible label for the icon
   */
  label?: string;

  /**
   * Whether the icon is decorative (hidden from screen readers)
   * @default false
   */
  decorative?: boolean;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(({
  size = 'md',
  children,
  color,
  label,
  decorative = false,
  className = '',
  ...props
}, ref) => {
  const classes = [
    'mond-icon',
    `mond-icon--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      ref={ref}
      className={classes}
      style={color ? { color } : undefined}
      aria-label={!decorative && label ? label : undefined}
      aria-hidden={decorative}
      role={decorative ? 'presentation' : 'img'}
      {...props}
    >
      {children}
    </span>
  );
});

Icon.displayName = 'Icon';

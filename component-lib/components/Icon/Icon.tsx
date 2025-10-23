import { forwardRef } from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize;

  /**
   * SVG path data or React SVG element
   */
  children: React.ReactNode;

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

export const Icon = forwardRef<SVGSVGElement, IconProps>(({
  size = 'md',
  children,
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
    <svg
      ref={ref}
      className={classes}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-label={!decorative && label ? label : undefined}
      aria-hidden={decorative}
      role={decorative ? 'presentation' : 'img'}
      {...props}
    >
      {children}
    </svg>
  );
});

Icon.displayName = 'Icon';

import React from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';

export type LinkSize = 'small' | 'medium' | 'large';

export interface LinkProps extends Omit<BoxProps, 'as'>, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof React.HTMLAttributes<HTMLElement> | 'color'> {
  /**
   * Link size
   * @default 'medium'
   */
  size?: LinkSize;

  /**
   * Icon-only link (no text content)
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Icon element to display
   */
  icon?: React.ReactNode;

  /**
   * Link content
   */
  children?: React.ReactNode;

  /**
   * Link href
   */
  href: string;

  /**
   * Custom link component for framework-specific routing
   * @default 'a'
   */
  as?: React.ElementType;
}

interface StyledLinkProps {
  $size: LinkSize;
  $iconOnly: boolean;
}

const StyledLink = styled(Box).attrs({ as: 'a' })<StyledLinkProps>`
  /* Base Styles */
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.sans};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.textLink};
  text-underline-offset: 1px;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: text-decoration 150ms ease;

  /* Hover State */
  &:hover {
    text-decoration: none;
  }

  /* Active State */
  &:active {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.textLink};
  }

  /* Focus State */
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocused};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  /* Size Variants */
  ${({ $size, $iconOnly, theme }) => {
    const gap = $iconOnly ? 0 : theme.space[2];

    switch ($size) {
      case 'small':
        return css`
          font-size: ${theme.fontSizes.sm};
          gap: ${gap};
        `;
      case 'medium':
        return css`
          font-size: ${theme.fontSizes.base};
          gap: ${gap};
        `;
      case 'large':
        return css`
          font-size: ${theme.fontSizes.lg};
          gap: ${gap};
        `;
      default:
        return css`
          font-size: ${theme.fontSizes.base};
          gap: ${gap};
        `;
    }
  }}
`;

export const Link = React.forwardRef<HTMLElement, LinkProps>(
  ({
    as: Component = 'a',
    size = 'medium',
    iconOnly = false,
    icon,
    children,
    href,
    className = '',
    ...props
  }, ref) => {
    return (
      <StyledLink
        as={Component}
        ref={ref as React.Ref<HTMLElement>}
        href={href}
        $size={size}
        $iconOnly={iconOnly}
        className={className}
        data-mond-link
        data-size={size}
        data-icon-only={iconOnly}
        {...props}
      >
        {icon && icon}
        {!iconOnly && children}
      </StyledLink>
    );
  }
);

Link.displayName = 'Link';


import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { createContext, useContext } from "react";
import { cx } from "../../internal/cx";
import styles from "./Icon.module.css";

export interface IconRenderProps {
  /** Pixel size of the requested step. */
  size: number;
}

/** Brand-owned glyph resolver: name → rendered glyph (svg, font ligature, …). */
export type IconRender = (name: string, props: IconRenderProps) => ReactNode;

const IconContext = createContext<IconRender | null>(null);

export interface IconProviderProps {
  render: IconRender;
  children: ReactNode;
}

/**
 * Registry seam. The system never bundles an icon set — the app registers its
 * own (lucide, Material Symbols, …) once, at the root. Iconography is brand,
 * like color.
 *
 * ```tsx
 * // App root: map names to your icon set once.
 * <IconProvider render={(name, { size }) => <MyGlyph name={name} width={size} />}>
 *   <App />
 * </IconProvider>
 *
 * // Anywhere below:
 * <Icon name="check" size="sm" />
 * ```
 */
export function IconProvider({ render, children }: IconProviderProps): ReactElement {
  return <IconContext.Provider value={render}>{children}</IconContext.Provider>;
}

export type IconSize = "sm" | "md" | "lg";

/* Must match --mds-icon-* in core/layout.css — the renderer needs a number,
   a stylesheet cannot hand one over. */
const SIZE_PX: Record<IconSize, number> = { sm: 16, md: 20, lg: 24 };

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Glyph name in the app's registered set. */
  name: string;
  /** Default "md". */
  size?: IconSize;
  /** Accessible name. Omitted = decorative (aria-hidden). */
  label?: string;
}

const warned = new Set<string>();

/** A glyph from the app-registered set, sized on the core scale. */
export function Icon({ name, size = "md", label, className, ...rest }: IconProps): ReactElement {
  const render = useContext(IconContext);
  if (render === null && !warned.has(name)) {
    warned.add(name);
    console.error(
      `Icon "${name}": no IconProvider above this tree. Register the app's icon set once at the root.`,
    );
  }
  return (
    <span
      className={cx(styles.icon, styles[`size-${size}`], className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...rest}
    >
      {render?.(name, { size: SIZE_PX[size] })}
    </span>
  );
}

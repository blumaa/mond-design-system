import type { AnchorHTMLAttributes, ElementType, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Link.module.css";

export type LinkVariant = "inline" | "standalone";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** inline = underlined, lives in running text. standalone = nav/action link. */
  variant?: LinkVariant;
  /** Opens in a new tab with rel protection. */
  external?: boolean;
  /** Element override, e.g. a router's Link. */
  as?: ElementType;
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * Text link. Inline links keep their underline: color alone fails WCAG 1.4.1
 * for links inside prose.
 */
export function Link({
  variant = "inline",
  external = false,
  as: Element = "a",
  className,
  ...rest
}: LinkProps): ReactElement {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Element
      className={cx(styles.link, styles[`variant-${variant}`], className)}
      {...externalProps}
      {...rest}
    />
  );
}

import type { AnchorHTMLAttributes, ElementType, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Link.module.css";

export type LinkVariant = "inline" | "standalone" | "plain";

export type LinkSize = "xs" | "sm" | "base" | "lg" | "xl";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** inline = underlined, lives in running text. standalone = nav/action link.
      plain = inherits the surrounding color and weight, underlines on hover —
      for links whose context already marks them (a card title, a list row). */
  variant?: LinkVariant;
  /** Font size on the core text scale. Default inherits from context. */
  size?: LinkSize;
  /** Opens in a new tab with rel protection. */
  external?: boolean;
  /** Element override, e.g. a router's Link. */
  as?: ElementType;
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * Text link. Inline links keep their underline: color alone fails WCAG 1.4.1
 * for links inside prose.
 *
 * ```tsx
 * <Text>Read the <Link href="/terms">terms</Link>.</Text>
 * <Link variant="standalone" href="https://example.com" external>Docs</Link>
 * <Link as={NextLink} href="/about">About</Link>
 * ```
 */
export function Link({
  variant = "inline",
  size,
  external = false,
  as: Element = "a",
  className,
  ...rest
}: LinkProps): ReactElement {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  // A button-rendered link defaults to type="button" — inside a form, the
  // browser's "submit" default would fire on every click.
  const typeProps = Element === "button" ? { type: rest.type ?? "button" } : {};
  return (
    <Element
      className={cx(
        styles.link,
        styles[`variant-${variant}`],
        size && styles[`size-${size}`],
        className,
      )}
      {...externalProps}
      {...rest}
      {...typeProps}
    />
  );
}

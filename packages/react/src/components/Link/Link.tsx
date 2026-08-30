import type { ComponentPropsWithRef, ElementType, ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import styles from "./Link.module.css";

export type LinkVariant = "inline" | "standalone" | "plain";

export type LinkSize = "xs" | "sm" | "base" | "lg" | "xl";

type LinkOwnProps<E extends ElementType> = {
  /** inline = underlined, lives in running text. standalone = nav/action link.
      plain = inherits the surrounding color and weight, underlines on hover —
      for links whose context already marks them (a card title, a list row). */
  variant?: LinkVariant;
  /** Font size on the core text scale. Default inherits from context. */
  size?: LinkSize;
  /** Opens in a new tab with rel protection. */
  external?: boolean;
  /** Announced after the link text, unseen — a new tab is a context change a
      reader cannot see coming, e.g. "opens in new tab". The words are the
      app's, so they arrive here rather than being baked in English. */
  externalLabel?: string;
  /** Element override — `'button'` for a link-styled action, or a router's
      Link component, whose own props (`to`, `href`, …) then type-check. */
  as?: E;
  children?: ReactNode;
};

/* WithRef, not Without: the ref goes to whatever `as` rendered, and a link a
   caller cannot measure is a link a popover cannot anchor to. */
export type LinkProps<E extends ElementType = "a"> = LinkOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof LinkOwnProps<E>>;

/**
 * Text link. Inline links keep their underline: color alone fails WCAG 1.4.1
 * for links inside prose.
 *
 * ```tsx
 * <Text>Read the <Link href="/terms">terms</Link>.</Text>
 * <Link variant="standalone" href="https://example.com" external>Docs</Link>
 * <Link as={RouterLink} to="/about">About</Link>
 * ```
 */
export function Link<E extends ElementType = "a">({
  variant = "inline",
  size,
  external = false,
  externalLabel,
  as,
  children,
  ...rest
}: LinkProps<E>): ReactElement {
  const Element: ElementType = as ?? "a";
  // className and type live on the generic remainder — a plain destructure
  // cannot reach into ComponentPropsWithoutRef<E> while E is still open.
  const { className, type, ...others } = rest as {
    className?: string;
    type?: string;
  } & Record<string, unknown>;
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  // A button-rendered link defaults to type="button" — inside a form, the
  // browser's "submit" default would fire on every click.
  const typeProps = Element === "button" ? { type: type ?? "button" } : type !== undefined ? { type } : {};
  return (
    <Element
      className={cx(
        styles.link,
        styles[`variant-${variant}`],
        size && styles[`size-${size}`],
        className,
      )}
      {...externalProps}
      {...others}
      {...typeProps}
    >
      {children}
      {external && externalLabel !== undefined && (
        /* The leading space keeps the name "Docs opens in new tab", not
           "Docsopens…" — inline text concatenates without one. */
        <span className={styles.hiddenNote}>{` ${externalLabel}`}</span>
      )}
    </Element>
  );
}

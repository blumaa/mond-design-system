/* What `as` promises, kept by the type.
 *
 * A primitive whose root is a `<form>` takes a form's attributes, and one whose
 * root is a `<ul>` takes a list's. Typed as `HTMLAttributes<HTMLElement>` it
 * takes neither: `as="form"` compiles and `autoComplete` does not, so the
 * caller goes back to a hand-written `<form>` with a flex block in a
 * stylesheet — which is the thing the primitive exists to remove.
 *
 * `ref` comes with it. A layout box is what a scroll target, an intersection
 * observer and a focus manager reach for, and in React 19 the ref that reaches
 * it is an ordinary prop of whatever element `as` named.
 */
import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

/** A component's own props, plus every prop the element it renders takes. */
export type Polymorphic<T extends ElementType, Own> = Own & {
  /** Element to render. Default div. */
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof Own | "as">;

/**
 * The same props with `as` resolved to nothing in particular.
 *
 * TypeScript cannot destructure an intersection whose second half depends on an
 * unresolved `T`, so the implementation reads its props through this and the
 * caller keeps the precise one. The cast is the whole of the compromise, and it
 * is one line in each primitive rather than a lie in the exported type.
 */
export type AnyPolymorphic<Own> = Own & {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

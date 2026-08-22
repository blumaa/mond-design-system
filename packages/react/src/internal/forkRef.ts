import type { Ref, RefObject } from "react";

/**
 * One node, two holders. React hands the element to a single ref, so a
 * component that needs the node for itself — to set a DOM property no
 * attribute carries, to measure it — has to pass it on to the caller's ref
 * as well, and both kinds of ref have to be honoured.
 */
export function forkRef<T>(own: RefObject<T | null>, given: Ref<T> | undefined) {
  return (node: T | null) => {
    own.current = node;
    if (typeof given === "function") given(node);
    else if (given != null) given.current = node;
  };
}

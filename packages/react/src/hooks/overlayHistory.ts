import { createContext } from "react";

export interface OverlayHistory {
  /**
   * An overlay has opened. The implementation adds a history entry, and calls
   * `onPop` if the user goes back to it. Returns a dispose for when the
   * overlay closes some other way — its close button, Escape, the scrim, or
   * unmounting. The implementation owes the entry back: one left behind is a
   * back tap that does nothing.
   */
  register(onPop: () => void): () => void;
}

/**
 * On a phone, back is also the dismiss gesture: an open overlay that ignores
 * it costs the user the screen underneath instead. The library owns *when* an
 * overlay opens and closes; the app owns the history mechanism, because a raw
 * `history.pushState` from a library corrupts a router's own bookkeeping
 * (React Router keeps its index in `history.state`).
 *
 * Null wherever no app has supplied one — Storybook, a unit test, a consumer
 * that has not opted in. Overlays go on working; they just do not answer back.
 *
 * `useOverlay` registers every open overlay, so Modal, Sheet and
 * ConfirmDialog are covered with no per-call-site wiring:
 *
 * ```tsx
 * // App root — e.g. backed by the app router:
 * const overlayHistory = useMemo<OverlayHistory>(() => ({
 *   register(onPop) {
 *     pushOverlayEntry(onPop);      // app-owned, via the router
 *     return () => popOverlayEntry(); // give the entry back
 *   },
 * }), []);
 *
 * <OverlayHistoryContext.Provider value={overlayHistory}>
 *   <App />
 * </OverlayHistoryContext.Provider>
 * ```
 */
export const OverlayHistoryContext = createContext<OverlayHistory | null>(null);

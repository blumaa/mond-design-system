/* The surface is the system's own statement of where a brand's reach ends, and
   a statement that contradicts itself is worse than none: it answers every
   question confidently and half the answers are the wrong half. */
import { describe, expect, it } from "vitest";
import { loadSurface, SURFACE_VERSION, type SurfaceFile } from "./surface.js";

const FILE: SurfaceFile = {
  version: SURFACE_VERSION,
  settable: [
    { token: "--mds-radius-card", kind: "step", why: "a card's corner is the app's, on the shared ladder" },
    { token: "--mds-control-h-md", kind: "length", why: "control heights sit on no scale" },
  ],
  floors: [{ token: "--mds-tap-min", why: "44px is the smallest target a thumb reliably hits" }],
};

describe("loadSurface", () => {
  const surface = loadSurface(FILE);

  it("answers the kind of value a role takes", () => {
    expect(surface.kindOf("--mds-radius-card")).toBe("step");
    expect(surface.kindOf("--mds-control-h-md")).toBe("length");
  });

  it("has no kind for a token that is not a role", () => {
    expect(surface.kindOf("--mds-tap-min")).toBeUndefined();
    expect(surface.kindOf("--mds-surface-page")).toBeUndefined();
  });

  /* The reason travels with the finding: "this is a floor" moves nobody, and
     the person reading it is about to argue with the design. */
  it("answers why a floor is one, in the system's own words", () => {
    expect(surface.floorOf("--mds-tap-min")).toContain("thumb");
    expect(surface.floorOf("--mds-radius-card")).toBeUndefined();
  });

  it("hands back both lists whole, for a tool that prints them", () => {
    expect(surface.settable().map((role) => role.token)).toEqual([
      "--mds-radius-card",
      "--mds-control-h-md",
    ]);
    expect(surface.floors()).toHaveLength(1);
  });

  it("is empty, and says so, when the system published nothing", () => {
    const none = loadSurface(undefined);
    expect(none.declared).toBe(false);
    expect(none.kindOf("--mds-radius-card")).toBeUndefined();
    expect(none.floorOf("--mds-tap-min")).toBeUndefined();
    expect(none.settable()).toEqual([]);
    expect(none.floors()).toEqual([]);
  });

  /* A newer file read by an older dsbridge would silently mean something else:
     a kind this version does not know reads as no kind at all, and the rule
     that would have fired passes. */
  it("refuses a file written to a schema it does not know", () => {
    expect(() => loadSurface({ ...FILE, version: SURFACE_VERSION + 1 })).toThrow(
      `version ${SURFACE_VERSION}`,
    );
  });

  it("refuses a token the system calls settable and a floor at once", () => {
    const contradictory: SurfaceFile = {
      ...FILE,
      floors: [...FILE.floors, { token: "--mds-radius-card", why: "and also not settable" }],
    };
    expect(() => loadSurface(contradictory)).toThrow("--mds-radius-card");
  });
});

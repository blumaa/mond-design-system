import { describe, expect, it } from "vitest";
import {
  loadSemantics,
  semanticDifference,
  semanticsIn,
  SEMANTICS_VERSION,
  type SemanticsFile,
} from "./semantics.js";

describe("loadSemantics", () => {
  it("refuses a file written for another version rather than reading it wrong", () => {
    const file = { version: SEMANTICS_VERSION + 1, components: {} } as SemanticsFile;
    expect(() => loadSemantics(file)).toThrow(/version/);
  });

  it("says nothing was declared when the system published nothing", () => {
    expect(loadSemantics(undefined).declared).toBe(false);
  });

  it("keeps the order the system published, so the report reads as written", () => {
    const semantics = loadSemantics({
      version: SEMANTICS_VERSION,
      components: { Toast: { roles: ["status"] }, Sheet: { heading: "h2" } },
    });
    expect(semantics.names()).toEqual(["Toast", "Sheet"]);
    expect(semantics.of("Sheet")).toEqual({ heading: "h2" });
    expect(semantics.of("Missing")).toBeUndefined();
  });
});

describe("semanticsIn", () => {
  it("reads a role written as a string", () => {
    expect(semanticsIn(`const C = () => <div role="alertdialog" />;`)).toEqual({
      roles: ["alertdialog"],
    });
  });

  it("reads a role written as a braced string", () => {
    expect(semanticsIn(`const C = () => <div role={"status"} />;`)).toEqual({ roles: ["status"] });
  });

  it("says nothing for a role only the runtime knows", () => {
    expect(semanticsIn(`const C = () => <div role={tone} />;`)).toEqual({});
  });

  it("names both roles a condition chooses between", () => {
    expect(
      semanticsIn(`const C = () => <div role={tone === "danger" ? "alert" : "status"} />;`),
    ).toEqual({ roles: ["alert", "status"] });
  });

  it("takes the branch that announces nothing for what it is", () => {
    expect(semanticsIn(`const C = () => <div role={decorative ? undefined : "img"} />;`)).toEqual({
      roles: ["img"],
    });
  });

  it("does not mistake the condition for a role", () => {
    const found = semanticsIn(`const C = () => <div role={tone === "danger" ? "alert" : "status"} />;`);
    expect(found.roles).not.toContain("danger");
  });

  it("reads a heading written as a tag", () => {
    expect(semanticsIn(`const C = () => <h2>{title}</h2>;`)).toEqual({ heading: "h2" });
  });

  it("reads a heading a component takes as a level", () => {
    expect(semanticsIn(`const C = () => <Heading level={1}>{title}</Heading>;`)).toEqual({
      heading: "h1",
    });
  });

  it("reads a heading a polymorphic component renders", () => {
    expect(semanticsIn(`const C = () => <Text variant="subtitle" as="h2">{title}</Text>;`)).toEqual({
      heading: "h2",
    });
  });

  it("says nothing about markup that announces nothing", () => {
    expect(semanticsIn(`const C = () => <span className={s.label}>{text}</span>;`)).toEqual({});
  });
});

describe("semanticDifference", () => {
  it("names a role the swap changes", () => {
    expect(
      semanticDifference("ConfirmDialog", "ConfirmDialog", { roles: ["dialog"] }, { roles: ["alertdialog"] }),
    ).toEqual([
      { from: "ConfirmDialog", to: "ConfirmDialog", what: "role", was: "dialog", becomes: "alertdialog" },
    ]);
  });

  it("names a title the swap takes out of the outline", () => {
    expect(semanticDifference("ModalSheet", "Sheet", { heading: "h2" }, {})).toEqual([
      { from: "ModalSheet", to: "Sheet", what: "title", was: "h2", becomes: "—" },
    ]);
  });

  it("says nothing when the two sides announce the same thing", () => {
    const same = { roles: ["status"], heading: "h2" };
    expect(semanticDifference("Toast", "Toast", same, same)).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { readComponents } from "./structure.js";

const files = [
  "src/components/Button/Button.tsx",
  "src/components/Button/Button.test.tsx",
  "src/components/Card/Card.tsx",
  "src/components/Card/Card.module.css",
  "src/components/Card/Card.test.tsx",
  "src/components/Field/Field.tsx",
  "stories/Button.stories.tsx",
  "stories/Card.stories.tsx",
];

const sources: Record<string, string> = {
  "stories/Button.stories.tsx": `const meta = {\n  title: "Atoms/Button",\n};`,
  "stories/Card.stories.tsx": `const meta = {\n  component: Card,\n  title: "Molecules/Card",\n};`,
  "src/components/Card/Card.tsx": `import { useState } from "react";\nimport { Button } from "../Button/Button.js";\nimport { Field } from "../Field/Field.js";\n`,
  "src/components/Button/Button.tsx": `import type { ReactNode } from "react";\nimport { useFieldContext } from "../Field/Field.js";\nimport type { FieldProps } from "../Field/Field.js";\n`,
};

const read = (file: string) => sources[file] ?? "";
const components = readComponents(files, read);
const byName = (name: string) => components.find((component) => component.name === name)!;

describe("reading what a repo is made of", () => {
  it("finds a component wherever its directory lives", () => {
    expect(components.map((component) => component.name)).toEqual(["Button", "Card", "Field"]);
    expect(byName("Card").file).toBe("src/components/Card/Card.tsx");
  });

  it("pairs a component with its story and its test", () => {
    expect(byName("Button").story).toBe("stories/Button.stories.tsx");
    expect(byName("Button").test).toBe("src/components/Button/Button.test.tsx");
    expect(byName("Field").story).toBeUndefined();
    expect(byName("Field").test).toBeUndefined();
  });

  it("reads the level off the story title, singular and lowercased", () => {
    expect(byName("Button").level).toBe("atom");
    expect(byName("Card").level).toEqual("molecule");
    expect(byName("Card").levelLine).toBe(3);
  });

  it("counts a PascalCase import as composition", () => {
    expect(byName("Card").imports).toEqual([
      { name: "Button", line: 2 },
      { name: "Field", line: 3 },
    ]);
  });

  it("does not count a hook or a type as composition", () => {
    expect(byName("Button").imports).toEqual([]);
  });
});

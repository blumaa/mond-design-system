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

/* An app does not write `../Button/Button.js`. It writes `@/components/Card`,
   or `../Card`, and a composition graph that only reads the design system's own
   convention has nothing to say about the repo it was pointed at. */
describe("how an app writes an import", () => {
  const app = (source: string) =>
    readComponents(["src/components/Screen/Screen.tsx"], () => source).find(
      (component) => component.name === "Screen",
    )!.imports;

  it("counts an import through a path alias", () => {
    expect(app(`import { Card } from "@/components/Card";`)).toEqual([{ name: "Card", line: 1 }]);
  });

  it("counts a flat sibling, not only <Name>/<Name>", () => {
    expect(app(`import { Button } from "../Button";`)).toEqual([{ name: "Button", line: 1 }]);
  });

  it("looks past a barrel file to the directory it stands for", () => {
    expect(app(`import { Card } from "../Card/index.js";`)).toEqual([{ name: "Card", line: 1 }]);
  });

  it("does not count a package, which has no level in this repo's taxonomy", () => {
    expect(app(`import { Card } from "@mond-design-system/react";`)).toEqual([]);
    expect(app(`import { useState } from "react";`)).toEqual([]);
  });

  it("does not count a stylesheet, whose binding is not a component", () => {
    expect(app(`import styles from "./Screen.module.css";`)).toEqual([]);
  });
});

/* An app does not give every component a directory either. Fair Play's 51 are
   `src/components/<Name>.tsx`, and a recogniser that insists on `<Name>/<Name>`
   finds none of them — so every structural rule skips the repo entirely. */
describe("how an app files a component", () => {
  const flat = readComponents(
    [
      "src/components/DateBlock.tsx",
      "src/components/DateBlock.test.tsx",
      "src/components/Card/Card.tsx",
      "src/app/router.tsx",
      "src/layouts/MobileFrame.spec.tsx",
      "src/components/Screen.module.css",
    ],
    () => "",
  );

  it("takes a flat PascalCase file as a component", () => {
    expect(flat.map((component) => component.name)).toEqual(["Card", "DateBlock"]);
    expect(flat.find((component) => component.name === "DateBlock")!.file).toBe(
      "src/components/DateBlock.tsx",
    );
  });

  it("pairs a flat component with its test", () => {
    expect(flat.find((component) => component.name === "DateBlock")!.test).toBe(
      "src/components/DateBlock.test.tsx",
    );
  });

  it("does not take a lower-case module, a spec or a stylesheet for a component", () => {
    expect(flat.map((component) => component.name)).not.toContain("router");
    expect(flat.map((component) => component.name)).not.toContain("MobileFrame");
  });
});

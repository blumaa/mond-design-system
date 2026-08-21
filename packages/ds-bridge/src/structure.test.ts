import { describe, expect, it } from "vitest";
import { importedNames, readComponents } from "./structure.js";

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

describe("the names a file imports", () => {
  const source = [
    `import { Button, Card } from "@old/react";`,
    `import { Button as MdsButton, Sheet } from "@mds/react";`,
    `import { Sheet as Nested } from "@mds/react/sheet";`,
    `import type { ButtonProps } from "@mds/react";`,
    `import { useState } from "react";`,
    "",
  ].join("\n");

  it("takes every name when nothing says where from", () => {
    expect([...importedNames(source)].sort()).toEqual(["Button", "Card", "Sheet", "useState"]);
  });

  /* The name the system exports, not the one the importing file gave it: the question
     is whether that component was reached for, and `Button as MdsButton` reached for
     Button. Counting the alias too made every aliased import of the OLD system's
     Button read as an import of the new one's. */
  it("reads the name the system exports, not the one the file gave it", () => {
    expect([...importedNames(`import { Sheet as Nested } from "@mds/react";`)]).toEqual(["Sheet"]);
  });

  /* Two design systems are loaded at once for the length of a migration, and they
     share component names by design — that is what makes the migration mechanical.
     A count that cannot tell one Button from the other reads as adoption and
     measures nothing. */
  it("takes only the ones from the package named, when one is", () => {
    expect([...importedNames(source, "@mds/react")].sort()).toEqual(["Button", "Sheet"]);
  });

  it("counts a deep import from that package as the package", () => {
    expect([...importedNames(source, "@mds/react/sheet")]).toEqual(["Sheet"]);
  });

  it("does not take a package whose name merely starts the same way", () => {
    expect([...importedNames(source, "@mds/re")]).toEqual([]);
  });
});

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Icon, Input, Stack, Text } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Input",
  component: Input,
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Three control heights. The type size, the icon slots, the gutter and the
 * clear button all step with the one prop. */
export const Sizes: Story = {
  render: () => (
    <Stack gap="tight" className={story.frame}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </Stack>
  ),
};

/** Disabled is the native attribute — the field leaves the tab order and stops
 * taking events, which no styling can imitate. */
export const Disabled: Story = {
  args: { "aria-label": "Disabled", disabled: true, defaultValue: "Locked" },
};

/** The icon slots. Icons here are decorative — the input's own label does the
 * talking — so they carry no name and stay out of the accessibility tree. */
export const WithIcons: Story = {
  render: () => (
    <Stack gap="tight" className={story.frame}>
      <Input aria-label="Leading" placeholder="Leading glyph" iconLeft={<Icon name="search" />} />
      <Input aria-label="Trailing" placeholder="Trailing glyph" iconRight={<Icon name="check" />} />
      <Input
        aria-label="Both"
        placeholder="Both edges"
        iconLeft={<Icon name="search" />}
        iconRight={<Icon name="check" />}
      />
    </Stack>
  ),
};

/** An icon has to be sized by the control holding it: the glyph and the gutter
 * both step with the size, or an sm input wears an md glyph. */
export const IconSizes: Story = {
  render: () => (
    <Stack gap="loose" className={story.frame}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Stack key={size} gap="hairline">
          <Text tone="muted">size="{size}"</Text>
          <Input
            size={size}
            aria-label={`Search ${size}`}
            placeholder="Search"
            iconLeft={<Icon name="search" />}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

/** The clear affordance, which used to be a SearchField. It is the trailing
 * slot's only other occupant, so the type refuses `iconRight` alongside it, and
 * it needs words of its own — the glyph says nothing to a screen reader. */
export const Clearable: Story = {
  render: function Clearable() {
    const [query, setQuery] = useState("session notes");
    return (
      <Stack gap="tight" className={story.frame}>
        <Input
          type="search"
          aria-label="Search sessions"
          placeholder="Search"
          iconLeft={<Icon name="search" />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          clearLabel="Clear search"
          onClear={() => setQuery("")}
        />
        <Text tone="muted">Type to raise the clear button; it hides again when empty.</Text>
      </Stack>
    );
  },
};

/** Uncontrolled, and at each size — the button rides the same gutter the icons
 * do, so it steps with the control. */
export const ClearableSizes: Story = {
  render: () => (
    <Stack gap="loose" className={story.frame}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Stack key={size} gap="hairline">
          <Text tone="muted">size="{size}"</Text>
          <Input
            size={size}
            type="search"
            aria-label={`Search ${size}`}
            defaultValue="session notes"
            iconLeft={<Icon name="search" />}
            clearLabel="Clear search"
            onClear={() => {}}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

/** `type="search"` is a native type, not a variant of ours — it brings the
 * search keyboard on iOS, the Enter-to-search semantics, and a UA clear cross.
 * Pair it with `onClear` and ours replaces the native cross, which is named and
 * matches the rest of the system. Leave `onClear` off and the native cross
 * stays, because there it is the only way to empty the field. */
export const SearchType: Story = {
  render: function SearchType() {
    const [named, setNamed] = useState("session notes");
    return (
      <Stack gap="loose" className={story.frame}>
        <Stack gap="hairline">
          <Text tone="muted">type="search" with onClear — ours, named</Text>
          <Input
            type="search"
            aria-label="Search sessions"
            iconLeft={<Icon name="search" />}
            value={named}
            onChange={(event) => setNamed(event.target.value)}
            clearLabel="Clear search"
            onClear={() => setNamed("")}
          />
        </Stack>

        <Stack gap="hairline">
          <Text tone="muted">type="search" alone — the browser's cross, unstyled</Text>
          <Input
            type="search"
            aria-label="Search sessions, native clear"
            defaultValue="session notes"
            iconLeft={<Icon name="search" />}
          />
        </Stack>

        <Text tone="muted">
          Both rows hold text. In Chrome and Safari the second shows the UA cross and the first does
          not — one clear affordance either way, never two.
        </Text>
      </Stack>
    );
  },
};

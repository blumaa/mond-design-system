import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Heading, Inline, Stack, Text } from "@mond-design-system/react";
import story from "./story.module.css";

/* Live token browser. Values are read from the computed style of <html>, so
   the brand and theme toolbars change what you see — that is the contract
   working. */

const meta = {
  title: "Docs/Design tokens",
  parameters: { controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/* Read at render time — the toolbar decorators set data-brand/data-theme
   before the story renders, so a toolbar change shows fresh values. */
const tokenValue = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function Row({ name, preview }: { name: string; preview: React.ReactNode }) {
  const value = tokenValue(name);
  return (
    <Inline gap="base" align="center">
      <span className={story.tokenName}>
        <Text variant="note" as="code">{name}</Text>
      </span>
      {preview}
      <Text variant="meta" tone="muted">{value}</Text>
    </Inline>
  );
}

function Swatch({ name }: { name: string }) {
  return (
    <Row
      name={name}
      preview={
        <span
          className={story.swatch}
          style={{ "--specimen-color": `var(${name})` } as CSSProperties}
        />
      }
    />
  );
}

function ColorSection({ title, names }: { title: string; names: string[] }) {
  return (
    <Stack gap="tight">
      <Heading level={3}>{title}</Heading>
      {names.map((n) => (
        <Swatch key={n} name={n} />
      ))}
    </Stack>
  );
}

export const Colors: Story = {
  render: () => (
    <Stack gap="section">
      <ColorSection
        title="Surfaces"
        names={[
          "--mds-surface-page",
          "--mds-surface-card",
          "--mds-surface-raised",
          "--mds-surface-sunken",
          "--mds-surface-selected",
          "--mds-surface-inverse",
          "--mds-surface-media",
        ]}
      />
      <ColorSection
        title="Text"
        names={[
          "--mds-text-primary",
          "--mds-text-secondary",
          "--mds-text-muted",
          "--mds-text-accent",
          "--mds-text-inverse",
          "--mds-text-on-media",
        ]}
      />
      <ColorSection
        title="Accent & actions"
        names={[
          "--mds-accent",
          "--mds-accent-hover",
          "--mds-accent-soft",
          "--mds-accent-contrast",
          "--mds-action-bg",
          "--mds-action-bg-hover",
          "--mds-action-fg",
          "--mds-action-disabled-bg",
          "--mds-action-disabled-fg",
        ]}
      />
      <ColorSection
        title="Status"
        names={[
          "--mds-status-danger",
          "--mds-status-danger-soft",
          "--mds-status-success",
          "--mds-status-success-soft",
          "--mds-status-warning",
          "--mds-status-warning-soft",
        ]}
      />
      <ColorSection
        title="Borders & focus"
        names={[
          "--mds-border-subtle",
          "--mds-border-strong",
          "--mds-control-border",
          "--mds-focus-ring-color",
          "--mds-scrim",
        ]}
      />
    </Stack>
  ),
};

/* The roles above are what a brand sets. These are slots: each one passes
   through a role today, so the default look is unchanged, and a brand can move
   a screen title without moving a card heading with it. */
const TYPE_ROLES = [
  ["--mds-type-panel-title", "Panel title — a screen or overlay"],
  ["--mds-type-card-title", "Card title — a heading inside one"],
  ["--mds-type-item-title", "Item title — a list row"],
  ["--mds-type-pill", "Pill — type inside a chip or tag"],
  ["--mds-type-tab", "Tab — a tab or segment label"],
] as const;

export const Typography: Story = {
  render: () => (
    <Stack gap="loose">
      {(
        [
          ["--mds-type-display", "Display"],
          ["--mds-type-title", "Title"],
          ["--mds-type-subtitle", "Subtitle"],
          ["--mds-type-body", "Body"],
          ["--mds-type-label", "Label"],
          ["--mds-type-note", "Note"],
          ["--mds-type-meta", "Meta"],
          ["--mds-type-eyebrow", "Eyebrow"],
          ["--mds-type-code", "Code"],
        ] as const
      ).map(([token, label]) => (
        <Stack key={token} gap="hairline">
          <Text variant="meta" tone="muted" as="code">{token}</Text>
          <span style={{ font: `var(${token})`, color: "var(--mds-text-primary)" }}>
            {label} — The quick brown fox jumps over the lazy dog
          </span>
        </Stack>
      ))}
      <Stack gap="tight">
        <Heading level={3}>Slots</Heading>
        {TYPE_ROLES.map(([token, label]) => (
          <Stack key={token} gap="hairline">
            <Text variant="meta" tone="muted" as="code">{token}</Text>
            <span style={{ font: `var(${token})`, color: "var(--mds-text-primary)" }}>{label}</span>
          </Stack>
        ))}
      </Stack>
    </Stack>
  ),
};

const SPACE_TOKENS = Array.from({ length: 12 }, (_, i) => `--mds-space-${i + 1}`);

export const Spacing: Story = {
  render: () => (
    <Stack gap="section">
      <Stack gap="tight">
        <Heading level={3}>Space scale</Heading>
        {SPACE_TOKENS.map((n) => (
          <Row
            key={n}
            name={n}
            preview={
              <span className={story.bar} style={{ "--specimen-length": `var(${n})` } as CSSProperties} />
            }
          />
        ))}
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Gaps & padding</Heading>
        {[
          "--mds-gap-hairline",
          "--mds-gap-tight",
          "--mds-gap",
          "--mds-gap-loose",
          "--mds-pad-tight",
          "--mds-pad-control",
          "--mds-pad-card",
          "--mds-pad-page-x",
          "--mds-pad-page-y",
          "--mds-stack-item",
          "--mds-stack-group",
          "--mds-stack-section",
        ].map((n) => (
          <Row
            key={n}
            name={n}
            preview={
              <span className={story.bar} style={{ "--specimen-length": `var(${n})` } as CSSProperties} />
            }
          />
        ))}
      </Stack>
    </Stack>
  ),
};

export const RadiusAndElevation: Story = {
  name: "Radius & elevation",
  render: () => (
    <Stack gap="section">
      <Stack gap="tight">
        <Heading level={3}>Radius</Heading>
        <Inline gap="base" wrap>
          {[
            "--mds-radius-1",
            "--mds-radius-2",
            "--mds-radius-3",
            "--mds-radius-4",
            "--mds-radius-5",
            "--mds-radius-6",
            "--mds-radius-7",
            "--mds-radius-control",
            "--mds-radius-card",
            "--mds-radius-sheet",
            "--mds-radius-pill",
          ].map((n) => (
            <Stack key={n} gap="hairline" align="center">
              <span className={story.tile} style={{ "--specimen-radius": `var(${n})` } as CSSProperties} />
              <Text variant="meta" tone="muted">{n.replace("--mds-radius-", "")}</Text>
            </Stack>
          ))}
        </Inline>
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Elevation</Heading>
        <Inline gap="loose" wrap>
          {[
            "--mds-elevation-card",
            "--mds-elevation-raised",
            "--mds-elevation-hover",
            "--mds-elevation-modal",
            "--mds-elevation-sheet",
          ].map((n) => (
            <Stack key={n} gap="hairline" align="center">
              <span className={story.shadowTile} style={{ "--specimen-shadow": `var(${n})` } as CSSProperties} />
              <Text variant="meta" tone="muted">{n.replace("--mds-elevation-", "")}</Text>
            </Stack>
          ))}
        </Inline>
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Control sizes</Heading>
        {["--mds-control-h-sm", "--mds-control-h-md", "--mds-control-h-lg", "--mds-header-h", "--mds-tabbar-h", "--mds-tap-min"].map(
          (n) => (
            <Row
              key={n}
              name={n}
              preview={
                <span className={story.barUpright} style={{ "--specimen-length": `var(${n})` } as CSSProperties} />
              }
            />
          ),
        )}
      </Stack>
    </Stack>
  ),
};

/* Drawn to scale against each other rather than at size: 1920px of scoreboard
   does not fit in a docs page, and what the row is for is the comparison. */
function Ruler({ name, divisor }: { name: string; divisor: number }) {
  return (
    <Row
      name={name}
      preview={
        <span
          className={story.bar}
          style={{ "--specimen-length": `calc(var(${name}) / ${divisor})` } as CSSProperties}
        />
      }
    />
  );
}

export const Layout: Story = {
  render: () => (
    <Stack gap="section">
      <Stack gap="tight">
        <Heading level={3}>Breakpoints</Heading>
        <Text variant="note" tone="secondary">
          A media query is resolved before custom properties exist, so these are read, not used:
          a component sheet carries the literal px. Every @media prelude in the system breaks at
          one of these.
        </Text>
        {["--mds-bp-md", "--mds-bp-lg", "--mds-bp-xl", "--mds-bp-2xl"].map((n) => (
          <Ruler key={n} name={n} divisor={8} />
        ))}
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Widths</Heading>
        {[
          "--mds-content-max",
          "--mds-content-max-wide",
          "--mds-sidebar-w",
          "--mds-modal-w",
          "--mds-toast-w",
          "--mds-popover-w",
          "--mds-tooltip-w",
        ].map((n) => (
          <Ruler key={n} name={n} divisor={4} />
        ))}
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Stacking</Heading>
        <Text variant="note" tone="secondary">
          The order things paint in. Anything portalled to the body reads one of these; nothing
          in the system sets a bare z-index.
        </Text>
        {[
          "--mds-z-base",
          "--mds-z-raised",
          "--mds-z-header",
          "--mds-z-tabbar",
          "--mds-z-sheet",
          "--mds-z-modal",
          "--mds-z-popover",
          "--mds-z-toast",
          "--mds-z-tooltip",
        ].map((n) => (
          <Row key={n} name={n} preview={null} />
        ))}
      </Stack>
    </Stack>
  ),
};

export const Motion: Story = {
  render: () => (
    <Stack gap="section">
      <Stack gap="tight">
        <Heading level={3}>Duration</Heading>
        <Text variant="note" tone="secondary">
          All four collapse to 1ms under prefers-reduced-motion — turn it on in the OS and the
          values here change with it.
        </Text>
        {["--mds-dur-fast", "--mds-dur-base", "--mds-dur-slow", "--mds-dur-pulse"].map((n) => (
          <Row key={n} name={n} preview={null} />
        ))}
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Easing</Heading>
        {["--mds-ease-standard", "--mds-ease-exit"].map((n) => (
          <Row key={n} name={n} preview={null} />
        ))}
      </Stack>
      <Stack gap="tight">
        <Heading level={3}>Transitions</Heading>
        <Text variant="note" tone="secondary">
          A duration and an easing already paired. A component reaches for one of these rather
          than naming both.
        </Text>
        {[
          "--mds-transition-control",
          "--mds-transition-surface",
          "--mds-transition-sheet",
          "--mds-transition-reveal",
        ].map((n) => (
          <Row key={n} name={n} preview={null} />
        ))}
      </Stack>
    </Stack>
  ),
};

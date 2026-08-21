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
        ] as const
      ).map(([token, label]) => (
        <Stack key={token} gap="hairline">
          <Text variant="meta" tone="muted" as="code">{token}</Text>
          <span style={{ font: `var(${token})`, color: "var(--mds-text-primary)" }}>
            {label} — The quick brown fox jumps over the lazy dog
          </span>
        </Stack>
      ))}
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

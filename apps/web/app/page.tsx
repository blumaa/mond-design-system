"use client";
import { Box, Button, Divider, Heading } from "@mond-design-system/theme";
import { DarkModeToggle } from "./components/DarkModeToggle";

export default function Home() {
  return (
    <>
      <DarkModeToggle />
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
          padding: "2rem",
          backgroundColor: "var(--surface-background)",
          color: "var(--text-primary)",
          transition: "all 0.3s ease",
        }}
      >
        <Heading level={1} size="4xl" weight="bold">
          Mond Design System
        </Heading>

        <Box width="50%" mb="2rem">
          <Divider size="sm" variant="subtle" />
        </Box>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button size="sm">Small Button</Button>
          <Button size="md">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button variant="primary" corners="rounded">
            Rounded
          </Button>
          <Button variant="outline" corners="default">
            Default Corners
          </Button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button variant="primary" iconOnly>
            ✓
          </Button>
          <Button variant="ghost" iconOnly corners="rounded">
            ♥
          </Button>
          <Button variant="outline" iconOnly>
            ⚙
          </Button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Button disabled>Disabled Button</Button>
        </div>
      </main>
    </>
  );
}

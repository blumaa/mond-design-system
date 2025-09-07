"use client";
import { Button, resolveSemanticToken, fontFamilies, fontSizes, fontWeights } from "@mond-design-system/theme";
import { useTheme } from "./context/ThemeContext";
import { ThemeSwitch } from "./components/ThemeSwitch";

export default function Home() {
  const { isDarkMode, mounted } = useTheme();

  const theme = isDarkMode ? 'dark' : 'light';
  const backgroundColor = resolveSemanticToken('surface.background', theme);
  const textColor = resolveSemanticToken('text.primary', theme);

  // Show loading state until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            width: "40px",
            height: "40px",
          }}
        />
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "1rem",
            backgroundColor,
            color: textColor,
            fontFamily: fontFamilies.sans,
          }}
        >
          <h1
            style={{
              marginBottom: "2rem",
              fontSize: fontSizes["4xl"],
              fontWeight: fontWeights.bold,
            }}
          >
            Mond Design System
          </h1>
        </main>
      </>
    );
  }

  return (
    <>
      <ThemeSwitch />
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
          backgroundColor,
          color: textColor,
          fontFamily: fontFamilies.sans,
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <h1
          style={{ marginBottom: "2rem", fontSize: fontSizes["4xl"], fontWeight: fontWeights.bold }}
        >
          Mond Design System
        </h1>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button variant="primary" isDarkMode={isDarkMode}>
            Primary Button
          </Button>
          <Button variant="outline" isDarkMode={isDarkMode}>
            Outline Button
          </Button>
          <Button variant="ghost" isDarkMode={isDarkMode}>
            Ghost Button
          </Button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button size="sm" isDarkMode={isDarkMode}>
            Small Button
          </Button>
          <Button size="md" isDarkMode={isDarkMode}>
            Medium Button
          </Button>
          <Button size="lg" isDarkMode={isDarkMode}>
            Large Button
          </Button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button variant="primary" corners="rounded" isDarkMode={isDarkMode}>
            Rounded
          </Button>
          <Button variant="outline" corners="default" isDarkMode={isDarkMode}>
            Default Corners
          </Button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <Button variant="primary" iconOnly isDarkMode={isDarkMode}>
            ✓
          </Button>
          <Button
            variant="ghost"
            iconOnly
            corners="rounded"
            isDarkMode={isDarkMode}
          >
            ♥
          </Button>
          <Button variant="outline" iconOnly isDarkMode={isDarkMode}>
            ⚙
          </Button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Button disabled isDarkMode={isDarkMode}>
            Disabled Button
          </Button>
        </div>
      </main>
    </>
  );
}

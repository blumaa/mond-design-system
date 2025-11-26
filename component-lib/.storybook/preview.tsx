import React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { brand1Theme, brand2Theme } from "../brands";
import "./styles.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: "light",
      list: [
        { name: "light", class: "light", color: "#F2F3F4" },
        { name: "dark", class: "dark", color: "#27374D" },
      ],
    },
    backgrounds: {
      disable: true,
      grid: {
        disable: true,
      },
    },
  },
  globalTypes: {
    brand: {
      description: "Brand theme",
      defaultValue: "mond",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "mond", title: "MOND", left: "🏢" },
          { value: "brand-1", title: "Brand 1", left: "🎨" },
          { value: "brand-2", title: "Brand 2", left: "🎨" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story: any, context: any) => {
      const isDark = context.globals.theme === "dark";
      const selectedBrandId = context.globals.brand || "mond";

      // Map brand IDs to brand theme objects
      const brandThemes = {
        mond: undefined, // Use default theme
        "brand-1": brand1Theme,
        "brand-2": brand2Theme,
      };

      const brandTheme =
        brandThemes[selectedBrandId as keyof typeof brandThemes];

      return (
        <ThemeProvider
          brandTheme={brandTheme}
          colorScheme={isDark ? "dark" : "light"}
        >
          <Story args={{ ...context.args }} />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;

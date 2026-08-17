import React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import "@mond-design-system/tokens/styles.css";
import "@mond-design-system/react/styles.css";

/* Theme rides on the html element, same as in an app. Brand CSS is app-owned;
   Storybook gets a local demo brand in Phase 2 to prove the swap. */
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals.theme as string;
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    a11y: { test: "error" },
  },
};

export default preview;

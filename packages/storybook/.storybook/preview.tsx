import React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { IconProvider } from "@mond-design-system/react";
import "@mond-design-system/tokens/styles.css";
import "@mond-design-system/react/styles.css";
import "../src/demo-brand.css";

/* Theme and brand ride on the html element, same as in an app. "mond" is the
   neutral default the tokens package ships; "demo" is a Storybook-private
   skin proving the brand swap. */
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals.theme as string;
  const brand = context.globals.brand as string;
  if (brand === "mond") {
    delete document.documentElement.dataset.brand;
  } else {
    document.documentElement.dataset.brand = brand;
  }
  return <Story />;
};

/* Storybook-private glyphs. Apps register their own set the same way. */
const GLYPHS: Record<string, string> = {
  search: "M7 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm7 2-3.5-3.5",
  close: "M4 4l8 8M12 4l-8 8",
  "arrow-right": "M2 8h12M9 3l5 5-5 5",
  check: "M3 8.5l3.5 3.5L13 5",
  star: "M8 2l1.8 3.8L14 6.4l-3 3 .7 4.1L8 11.5l-3.7 2 .7-4.1-3-3 4.2-.6L8 2Z",
};

const withIcons: Decorator = (Story) => (
  <IconProvider
    render={(name, { size }) => (
      /* No step asked for means "take the slot", and an svg that states no
         size at all is 0x0 in WebKit. 1em reads the slot through font-size. */
      <svg viewBox="0 0 16 16" width={size ?? "1em"} height={size ?? "1em"} fill="none">
        <path
          d={GLYPHS[name] ?? GLYPHS.close}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  >
    <Story />
  </IconProvider>
);

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withTheme, withIcons],
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
    brand: {
      description: "Brand skin",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: ["mond", "demo"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    brand: "mond",
  },
  parameters: {
    a11y: { test: "error" },
  },
};

export default preview;

import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: [
          // Exact match only — the /styles.css subpath must keep resolving
          // through the package. Source (not dist) so react-docgen can read
          // prop types and JSDoc for autodocs.
          {
            find: /^@mond-design-system\/react$/,
            replacement: fileURLToPath(new URL("../../react/src/index.ts", import.meta.url)),
          },
        ],
      },
    }),
};

export default config;

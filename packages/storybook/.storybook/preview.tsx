import type { Decorator, Preview } from "@storybook/react-vite";

// Every brand stylesheet is imported; the decorator picks which one applies by
// setting data-brand on <html>. Brand files scope their primitives under
// :root[data-brand="<name>"] when loaded side by side — see tokens README.
import "@mond-design-system/tokens/brands/fairplay.css";
import "@mond-design-system/tokens/brands/kinbaku.css";
import "@mond-design-system/tokens/brands/comphq.css";
import "@mond-design-system/react/styles.css";

const withBrandAndTheme: Decorator = (Story, context) => {
  const { brand, theme } = context.globals;
  document.documentElement.dataset.brand = brand;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.background = "var(--mds-surface-page)";
  return <Story />;
};

const preview: Preview = {
  decorators: [withBrandAndTheme],
  globalTypes: {
    brand: {
      description: "Brand token set",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: ["fairplay", "kinbaku", "comphq"],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Color scheme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: "fairplay",
    theme: "light",
  },
};

export default preview;

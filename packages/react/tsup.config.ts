import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Each component owns a *.module.css. esbuild's "local-css" loader scopes
  // those class names and hands the component the generated map; the plain
  // "css" loader emits the selectors globally and makes the import an empty
  // object. Keyed on ".css" rather than ".module.css" because tsup's postcss
  // plugin claims every /\.css$/ in an onLoad hook and forwards only
  // `loader['.css']` to esbuild. Every stylesheet in this package is a module.
  loader: { ".css": "local-css" },
});

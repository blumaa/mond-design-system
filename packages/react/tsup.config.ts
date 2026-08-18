import { basename, dirname, resolve } from "node:path";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import { defineConfig, type Options } from "tsup";

// esbuild is tsup's own dependency, not ours — borrow the Plugin type through
// the option that accepts it rather than declaring a dependency for one type.
type Plugin = NonNullable<Options["esbuildPlugins"]>[number];

/**
 * Scope every stylesheet as a CSS Module with an `mds-` namespace.
 *
 * esbuild's built-in "local-css" loader scopes a class only as `File_local`
 * (e.g. `Sheet_panel`) — the same name any other library built the same way
 * emits, so two such stylesheets on one page silently restyle each other's
 * components in cascade order. PLAN.md chose CSS Modules to be
 * collision-proof, which the built-in loader does not deliver. postcss-modules
 * generates the names instead: `mds-Sheet__panel`, unique to this package and
 * stable across builds. Keyframes are scoped the same way.
 *
 * Shape: importing a stylesheet loads a JS stub that default-exports the
 * name map and imports the transformed CSS through the `mds-css` namespace,
 * where esbuild's plain "css" loader bundles it into dist/index.css.
 */
function scopedCssModules(): Plugin {
  const transformed = new Map<string, string>();
  // tsup registers its own postcss plugin ahead of user plugins, and its
  // onLoad claims every path ending in .css — in *any* namespace, since it
  // registers no namespace filter. Two dodges, both load-bearing: claim the
  // resolve step (which does run before tsup's loader), and suffix the
  // virtual paths so they no longer end in ".css" and its filter misses.
  const MARK = "?mds-scoped";
  return {
    name: "scoped-css-modules",
    setup(build) {
      build.onResolve({ filter: /\.css$/ }, (args) => {
        if (args.namespace !== "file") return undefined;
        return {
          path: resolve(args.resolveDir, args.path) + MARK,
          namespace: "mds-cssmod",
        };
      });
      // The JS stub imports the transformed CSS through this namespace, where
      // the plain "css" loader bundles it into dist/index.css.
      build.onResolve({ filter: /^mds-css:/ }, (args) => ({
        path: args.path.slice("mds-css:".length),
        namespace: "mds-css",
      }));
      build.onLoad({ filter: /.*/, namespace: "mds-css" }, (args) => {
        const css = transformed.get(args.path);
        if (css === undefined) {
          throw new Error(`no transformed CSS recorded for ${args.path}`);
        }
        return { contents: css, loader: "css" };
      });
      build.onLoad({ filter: /.*/, namespace: "mds-cssmod" }, async (args) => {
        const file = args.path.slice(0, -MARK.length);
        let names: Record<string, string> = {};
        const source = await readFile(file, "utf8");
        const result = await postcss([
          postcssModules({
            generateScopedName: (local, from) =>
              `mds-${basename(from).replace(/\.module\.css$/, "")}__${local}`,
            getJSON: (_file, map) => {
              names = map;
            },
          }),
        ]).process(source, { from: file });
        transformed.set(args.path, result.css);
        return {
          contents:
            `import ${JSON.stringify(`mds-css:${args.path}`)};\n` +
            `export default ${JSON.stringify(names)};`,
          loader: "js",
          resolveDir: dirname(file),
        };
      });
    },
  };
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  esbuildPlugins: [scopedCssModules()],
});

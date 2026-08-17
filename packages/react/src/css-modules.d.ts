// CSS Modules typing. The library builds with tsup/esbuild, which has no
// ambient types for style imports the way `vite/client` does for an app.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Vite's `?raw` suffix imports the file as source text — tests read a
// stylesheet's contents through it.
declare module "*.css?raw" {
  const src: string;
  export default src;
}

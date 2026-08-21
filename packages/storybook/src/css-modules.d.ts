// CSS Modules typing. Storybook typechecks with the repo's base tsconfig,
// which has no ambient types for style imports.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

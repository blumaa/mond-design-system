---
"@mond-design-system/tokens": major
---

Remove the `dsbridge/` manifests and publish the contrast contract under its own
name.

`dsbridge/semantics.json`, `roles.json` and `choosing.json` described the system
to a conformance CLI that no longer exists. They shipped in the package and were
never reachable through the `exports` map — the CLI read them off disk — so
nothing that imports this package by specifier can break. Anything resolving
them by path will.

`dsbridge/contract.json` was not the CLI's: it is the accessibility contract, 21
foreground/background pairs and the ratio each must clear, and the token tests
here are held to it. It moves to `src/contrast-contract.json` and is now a real
export:

```js
import contract from "@mond-design-system/tokens/contrast-contract.json" with { type: "json" };
```

A brand re-points every token in that matrix, so these defaults being accessible
says nothing about your app. Shipped, the pairs are yours to re-run.

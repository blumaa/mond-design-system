# @mond-design-system/ds-bridge

## 0.1.0

### Minor Changes

- First release. `dsbridge` reads a design system's token graph and checks an app
  against it: which tokens exist and what overrides them, which of the system's 31
  rules a file breaks, and what adopting the system would cost a codebase that has
  not started. `dsbridge rules --for <path>` answers what governs one file,
  `dsbridge tokens --grep` what the system already names, `dsbridge choosing` which
  of two components a case wants, and `dsbridge migrate` what stands between an app
  and the system today.

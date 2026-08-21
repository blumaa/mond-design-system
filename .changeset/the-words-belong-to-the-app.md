---
"@mond-design-system/react": major
---

Every user-facing string a component shows is now a required prop.

Three policies were in the library at once: some components took the words as a
required prop, some took an optional prop over an English default, and some
hardcoded them. The default is the one that looks safe and is not — it compiles
in every app, so no app is ever asked for the translation, and the missing
German is found by the person using a screen reader rather than by a build.
Making the prop required moves the question to `tsc`, which asks once per call
site and cannot be forgotten.

Migration — each of these is a type error until the prop is passed:

- `Spinner` takes `label`.
- `SearchField` takes `clearLabel`.
- `PasswordInput` takes `showLabel` and `hideLabel`.
- `Tag` takes `removeLabel` alongside `onRemove`. The two are a pair: a tag
  without a remove button is not asked for the words of one, and the label is
  no longer guessed from the children.
- `AvatarGroup` takes `overflowLabel: (hidden: number) => string` — a function,
  because only the app knows how its language counts what it hides.
- `ToastProvider` takes `regionLabel` and `dismissLabel`, which previously
  defaulted to "Notifications" and "Dismiss".
- `ConfirmDialog` takes `cancelLabel`, which previously defaulted to "Cancel".
- `DateTimePicker` takes the whole `labels` object rather than a partial over
  English defaults: a partial makes the one key nobody filled in look
  deliberate. `placeholder` stays optional but no longer defaults to "Select
  date & time" — the trigger shows nothing when neither a value nor a
  placeholder is given.

The rule is enforced from now on. `dsbridge`'s `user-facing-text-is-a-prop`
fails the build on a literal reaching `aria-label`, `alt`, `title`,
`placeholder`, `label`, a text node, or a defaulted prop whose name reads as
copy.

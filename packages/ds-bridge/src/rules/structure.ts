/* Rules about the shape of the repo rather than the shape of a value.
 *
 * A design system is a claim that its parts fit together in a stated order.
 * These rules ask the repo whether that claim is still true: does every
 * component say where it sits, is that somewhere the taxonomy has, and does it
 * only build on things simpler than itself. All of it is aimed at the system's
 * own source — an app groups its components by feature, and being told that
 * `EventCard` is not an atom would be noise.
 */
import { asLevel, type Component } from "../structure.js";
import type { Context, Finding, Rule } from "./types.js";

const target = "system" as const;

const needsComponents = (context: Context) =>
  context.components.length === 0 ? "no component directories under this root" : undefined;

const finding = (rule: string, file: string, message: string, line?: number): Finding => ({
  rule,
  file,
  message,
  ...(line !== undefined ? { line } : {}),
});

const named = (context: Context, name: string): Component | undefined =>
  context.components.find((component) => component.name === name);

export const everyComponentHasAStory: Rule = {
  id: "every-component-has-a-story",
  title: "Every component has a story.",
  why:
    "A component with no story is one nobody can look at without writing an app " +
    "around it. It has no level, so no structural rule can reach it; it has no " +
    "reviewed states, so the empty and error cases get discovered in production; " +
    "and it is invisible to anyone deciding whether the system already has what " +
    "they are about to build.",
  instead:
    "Write `<Name>.stories.tsx` with a title whose first segment is the level, and " +
    "one story per state worth arguing about — not one story per prop.",
  target,
  needs: needsComponents,
  check: (context) =>
    context.components
      .filter((component) => component.story === undefined)
      .filter((component) => !context.exempt("every-component-has-a-story", component.file))
      .map((component) => finding("every-component-has-a-story", component.file, `${component.name} has no story`)),
};

export const everyComponentHasATest: Rule = {
  id: "every-component-has-a-test",
  title: "Every component has a test.",
  why:
    "The system's promise to an app is that upgrading it is safe. Nothing backs " +
    "that promise except the tests: a component with none can be refactored, " +
    "re-themed or accidentally gutted and the pipeline stays green, and the app " +
    "finds out.",
  instead:
    "Write `<Name>.test.tsx` beside the component. Test what a consumer can " +
    "observe — rendered text, roles, what a click does — not the internals.",
  target,
  needs: needsComponents,
  check: (context) =>
    context.components
      .filter((component) => component.test === undefined)
      .filter((component) => !context.exempt("every-component-has-a-test", component.file))
      .map((component) => finding("every-component-has-a-test", component.file, `${component.name} has no test`)),
};

export const declaresItsLevel: Rule = {
  id: "declares-its-level",
  title: "A story title starts with the component's level.",
  why:
    "The level is what makes composition checkable. Without it a component is " +
    "just a file, and the question `may this import that` has no answer — which " +
    "is how a system ends up with an atom rendering a dialog and nobody noticing " +
    "until it is imported everywhere.",
  instead:
    "`title: \"Atoms/Button\"`. The story title is where the level lives, because " +
    "it is the one people already read; a separate manifest would be a second " +
    "answer to the same question, and the second answer goes stale.",
  target,
  needs: needsComponents,
  check: (context) =>
    context.components
      .filter((component) => component.story !== undefined && component.level === undefined)
      .filter((component) => !context.exempt("declares-its-level", component.story!))
      .map((component) =>
        finding("declares-its-level", component.story!, `${component.name} has a story with no level in its title`),
      ),
};

export const levelIsInTheTaxonomy: Rule = {
  id: "level-is-in-the-taxonomy",
  title: "A level is one the taxonomy declares.",
  why:
    "Every invented level is a tier nothing can be ordered against, and it " +
    "spreads: `Layout/Stack` and `Atoms/Button` are both true statements about " +
    "the sidebar and neither says which may contain the other. A taxonomy with " +
    "exceptions is a filing system, not a hierarchy.",
  instead:
    "Use a level from `levels` in the config, or add the tier there — deliberately, " +
    "in the order it belongs. Grouping in the sidebar is a job for the segments " +
    "after the first one.",
  target,
  needs: needsComponents,
  check: (context) => {
    const known = new Set([...context.levels, ...context.levelsIgnore.map(asLevel)]);
    return context.components
      .filter((component) => component.level !== undefined && !known.has(component.level))
      .filter((component) => !context.exempt("level-is-in-the-taxonomy", component.story!))
      .map((component) =>
        finding(
          "level-is-in-the-taxonomy",
          component.story!,
          `${component.name} is a "${component.level}", which is not in ${context.levels.join(", ")}`,
          component.levelLine,
        ),
      );
  },
};

export const composesDownward: Rule = {
  id: "composes-downward",
  title: "A component never composes something more complex than itself.",
  why:
    "An upward import inverts the hierarchy: the atom now cannot be understood, " +
    "tested or shipped without the molecule above it, and the two can reach each " +
    "other, so the cycle arrives as a stack overflow rather than as a design " +
    "review. It also breaks the one promise the levels make to a reader — that " +
    "you can learn this system from the bottom up.",
  instead:
    "Move the shared part down to the level that needs it, or move the importing " +
    "component up. What the rule deliberately allows is a peer: a Button that " +
    "renders a Spinner while it loads is using an affordance, and a ConfirmDialog " +
    "built out of Modal's parts is `composition-over-configuration` working as " +
    "intended. Whether a peer wrapper has earned its own level is a judgement, and " +
    "a checker that fired on it would be wrong more often than right.",
  target,
  needs: needsComponents,
  check: (context) => {
    const rank = (level?: string) => (level === undefined ? -1 : context.levels.indexOf(level));
    return context.components.flatMap((component) => {
      const own = rank(component.level);
      if (own < 0) return [];
      return component.imports
        .filter((edge) => rank(named(context, edge.name)?.level) > own)
        .filter(() => !context.exempt("composes-downward", component.file))
        .map((edge) =>
          finding(
            "composes-downward",
            component.file,
            `${component.name} (${component.level}) composes ${edge.name} (${named(context, edge.name)?.level})`,
            edge.line,
          ),
        );
    });
  },
};

export const structureRules: Rule[] = [
  everyComponentHasAStory,
  everyComponentHasATest,
  declaresItsLevel,
  levelIsInTheTaxonomy,
  composesDownward,
];

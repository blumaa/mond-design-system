/* `dsbridge migrate --semantics` — what the swap changes that nothing compiles.
 *
 * The rest of `migrate` measures values: which of the app's tokens the system
 * already names. This measures meaning. A component pair that type-checks can
 * still move the confirm prompt from `dialog` to `alertdialog`, or take a sheet
 * title out of the document outline — differences each side's own tests are
 * blind to, because each side is internally consistent.
 */
import { announces, semanticDifference, type SemanticDifference } from "../semantics.js";
import { bold, dim, plural } from "../text.js";
import type { Context } from "../rules/types.js";

export type SemanticsPlan = {
  /** Every difference, app component then system component. */
  differences: SemanticDifference[];
  /** Pairs that were compared and agree — the report's denominator. */
  agreed: number;
  /** The app's components the system describes nothing for. */
  unpaired: string[];
};

/**
 * The app's component name paired with the system's.
 *
 * Same name is the common case — an app replacing its own `Toast` with the
 * system's. `replaces` in the config carries the renames, because a `ModalSheet`
 * becoming a `Sheet` is a decision the app made and this tool cannot infer.
 */
const pairedWith = (context: Context, name: string): string | undefined => {
  const renamed = context.replaces[name];
  if (renamed !== undefined) return renamed;
  return context.semantics.of(name) === undefined ? undefined : name;
};

export function planSemantics(context: Context): SemanticsPlan {
  const source = new Map(context.sources.map((it) => [it.file, it.source]));
  const owned = new Map(
    context.components.flatMap((it) => {
      const text = source.get(it.file);
      return text === undefined ? [] : [[it.name, text] as const];
    }),
  );
  const differences: SemanticDifference[] = [];
  const unpaired: string[] = [];
  let agreed = 0;
  for (const component of context.components) {
    const to = pairedWith(context, component.name);
    const system = to === undefined ? undefined : context.semantics.of(to);
    if (to === undefined || system === undefined) {
      unpaired.push(component.name);
      continue;
    }
    if (!owned.has(component.name)) continue;
    const found = semanticDifference(component.name, to, announces(component.name, owned), system);
    if (found.length === 0) agreed += 1;
    differences.push(...found);
  }
  return { differences, agreed, unpaired };
}

export function renderSemantics(
  plan: SemanticsPlan,
  context: Context,
  options: { color?: boolean } = {},
): string {
  const color = options.color ?? true;
  if (!context.semantics.declared) {
    return (
      `${bold("what the swap announces", color)}  the system published no semantics.json,\n` +
      dim("  so there is nothing to compare the app's components against\n", color)
    );
  }
  const { differences, agreed, unpaired } = plan;
  const lines = [
    `${bold("what the swap announces", color)}  ${plural(differences.length, "difference")}, ${agreed} pairs agree`,
  ];
  if (differences.length === 0) {
    lines.push(dim("  every pair announces what the app's already does", color));
  } else {
    const pair = (d: SemanticDifference) => (d.from === d.to ? d.from : `${d.from} → ${d.to}`);
    const width = Math.max(...differences.map((d) => pair(d).length));
    const kind = Math.max(...differences.map((d) => d.what.length));
    lines.push(
      dim("  the app announces the left; the system announces the right", color),
      ...differences.map(
        (d) => `    ${pair(d).padEnd(width)}  ${d.what.padEnd(kind)}  ${d.was} → ${d.becomes}`,
      ),
    );
  }
  if (unpaired.length > 0) {
    lines.push(
      dim(
        `  ${plural(unpaired.length, "component")} the system describes nothing for` +
          " — name the pair in dsbridge.config.json under replaces",
        color,
      ),
    );
  }
  return lines.join("\n") + "\n";
}

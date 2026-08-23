/* Who owns the words.
 *
 * A design system component that contains its own text is a component no app
 * can translate. The string is inside `node_modules`, where an app's i18n gate
 * cannot see it, so the gate stays green while a German user hears an English
 * label — and the only person who finds out is the one using a screen reader.
 */
import { closingBrace, openingTags, textNodes } from "../jsx.js";
import { nothingToCheck, type Finding, type Rule } from "./types.js";

/** Attributes a person reads or hears. Everything else is for the machine. */
const SPEAKS = new Set([
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "aria-valuetext",
  "aria-placeholder",
  "alt",
  "title",
  "placeholder",
  "label",
]);

/** A prop whose name says what it holds is words. `variant` and `size` are
    choices the component offers; `label` and `placeholder` are copy. */
const NAMES_TEXT = /(?:labels?|placeholders?|titles?|texts?|descriptions?|messages?|captions?|hints?)$/i;

/** A default written for one of them: `label = "Loading"`. The name must stand
    on its own — the `label` in `aria-label="…"` is an attribute, read above. */
const DEFAULTS = /(?<![-\w$.])([A-Za-z_$][\w$]*)\s*=\s*("[^"]*"|'[^']*'|`[^`]*`)/g;

/** A bag of them: `const DEFAULT_LABELS = { … }`. The name says the object is
    copy, whatever the keys inside it are called. */
const BAGS = /(?<![-\w$.])([A-Za-z_$][\w$]*)\s*(?::[^=;]+)?=\s*\{/g;

/** A letter is what separates copy from a separator, a symbol or an empty alt. */
const isWords = (text: string) => /\p{L}/u.test(text);

/** The literals inside a value as written: a quoted string, or the static half
    of a template — `${…}` is a value and the words around it are the copy. */
const wordsIn = (value: string): string[] =>
  [...value.matchAll(/"[^"]*"|'[^']*'|`[^`]*`/g)]
    .map((match) => match[0])
    .filter((found) =>
      isWords(found.startsWith("`") ? found.replace(/\$\{[^}]*\}/g, "") : found.slice(1, -1)),
    );

export const userFacingTextIsAProp: Rule = {
  id: "user-facing-text-is-a-prop",
  title: "A component takes the words it shows; it does not contain them.",
  why:
    "A string written into a component is a string the app installing it cannot " +
    "reach: it sits in `node_modules`, where the app's translation check never " +
    "looks, so the check passes and the label stays English for everybody. The " +
    "ones that hurt most are the ones nobody sees — an `aria-label` on an icon " +
    "button is read aloud, in the wrong language, only to the person who depends " +
    "on it.",
  instead:
    "Take the text as a required prop. Required rather than optional-with-default: " +
    "a default compiles everywhere, so the one call site nobody passed a label to " +
    "is the one nobody finds, while a required prop makes `tsc` the gate. An " +
    "`alt=\"\"` is not copy — it is the mark of a decorative picture, and it stays.",
  target: "system",
  reads: "component",
  needs: (context) =>
    context.components.length === 0 ? nothingToCheck("no components under this root") : undefined,
  check: (context) => {
    const source = new Map(context.sources.map((it) => [it.file, it.source]));
    const out: Finding[] = [];
    for (const component of context.components) {
      const text = source.get(component.file);
      if (text === undefined || context.exempt("user-facing-text-is-a-prop", component.file)) continue;
      /* Where an attribute's value was written, so the same string is not
         reported a second time by the scan for defaults below. */
      const spoken = new Set<number>();
      for (const tag of openingTags(text)) {
        for (const attribute of tag.attributes) {
          if (!SPEAKS.has(attribute.name) || attribute.value === undefined) continue;
          if (attribute.at !== undefined) spoken.add(attribute.at);
          for (const words of wordsIn(attribute.value)) {
            out.push({
              rule: "user-facing-text-is-a-prop",
              file: component.file,
              line: attribute.line,
              message: `${attribute.name}=${words} is copy this component owns — take the text as a required prop`,
              property: attribute.name,
              value: words,
            });
          }
        }
      }
      for (const match of text.matchAll(DEFAULTS)) {
        const [, name, value] = match as unknown as [string, string, string];
        const at = match.index + match[0].length - value.length;
        if (spoken.has(at) || !NAMES_TEXT.test(name) || wordsIn(value).length === 0) continue;
        out.push({
          rule: "user-facing-text-is-a-prop",
          file: component.file,
          line: text.slice(0, at).split("\n").length,
          message:
            `${name} falls back to ${value} — a default is copy no app can translate ` +
            "and no compiler asks for; make the prop required",
          property: name,
          value,
        });
      }
      for (const match of text.matchAll(BAGS)) {
        if (!NAMES_TEXT.test(match[1]!)) continue;
        const open = match.index + match[0].length - 1;
        const body = text.slice(open, closingBrace(text, open) + 1);
        for (const words of wordsIn(body)) {
          out.push({
            rule: "user-facing-text-is-a-prop",
            file: component.file,
            line: text.slice(0, open + body.indexOf(words)).split("\n").length,
            message:
              `${match[1]} holds ${words} — a bag of copy inside the component is copy ` +
              "no app can translate; take the strings as a required prop",
            property: match[1]!,
            value: words,
          });
        }
      }
      for (const node of textNodes(text)) {
        if (!isWords(node.text)) continue;
        out.push({
          rule: "user-facing-text-is-a-prop",
          file: component.file,
          line: node.line,
          message: `"${node.text}" is copy this component owns — take the text as a required prop`,
          value: node.text,
        });
      }
    }
    return out;
  },
};

export const textRules: Rule[] = [userFacingTextIsAProp];

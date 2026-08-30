import type { KeyboardEvent, ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { ChevronLeftGlyph, ChevronRightGlyph } from "../../internal/glyphs";
import { useFieldContext } from "../Field/Field";
import { Button } from "../Button/Button";
import { Select } from "../Select/Select";
import { Sheet, SheetBody, SheetFooter, SheetHeader } from "../Sheet/Sheet";
import styles from "./DateTimePicker.module.css";

export interface DateTimePickerLabels {
  /** Accessible name of the picker dialog. */
  dialog: string;
  previousMonth: string;
  nextMonth: string;
  today: string;
  done: string;
  hour: string;
  minute: string;
  dayPeriod: string;
}

export interface DateTimePickerProps {
  /** Current value as an ISO 8601 string. */
  value?: string | undefined;
  /** Fires with the combined ISO string when the user confirms. */
  onChange: (iso: string) => void;
  /** Shown on the trigger when nothing is selected. Nothing is shown without
      it: the component ships no words of its own. */
  placeholder?: string | undefined;
  /** Earliest selectable moment as an ISO string. Default: now. */
  min?: string | undefined;
  /** Minute granularity. Default 5; use 30 for :00/:30 only. */
  minuteStep?: number | undefined;
  disabled?: boolean | undefined;
  /** Applied to the trigger button so a `<label htmlFor>` can point at it. */
  id?: string | undefined;
  /** Field name for the trigger, e.g. "Starts". Announced alongside the value. */
  "aria-label"?: string | undefined;
  /** BCP 47 tag for names, week start and hour cycle. Default: runtime locale. */
  locale?: string | undefined;
  /** Every string the picker says. Required and whole rather than a partial
      over English defaults: a default is a word no translation file reaches,
      and a partial makes the one nobody filled in look deliberate. */
  labels: DateTimePickerLabels;
}

/* --- Intl-derived locale facts, computed once per locale ------------------ */

interface LocaleData {
  /** JS day index (0 = Sunday) the week starts on. */
  firstDay: number;
  /** Weekday column headers, ordered from firstDay. */
  weekdays: string[];
  /** 12-hour clock? */
  hour12: boolean;
  /** Localized day-period labels, e.g. ["AM", "PM"]. */
  dayPeriods: [string, string];
  monthTitle: Intl.DateTimeFormat;
  dayLabel: Intl.DateTimeFormat;
  full: Intl.DateTimeFormat;
}

/* getWeekInfo is not in the TS lib yet; some engines expose it as an accessor. */
interface WeekInfoLocale extends Intl.Locale {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
}

function localeData(locale: string | undefined): LocaleData {
  const resolved = new Intl.DateTimeFormat(locale).resolvedOptions().locale;

  /* Spec counts 1 = Monday … 7 = Sunday; JS Date counts 0 = Sunday. Engines
     without weekInfo fall back to Monday — most of the world's week start. */
  const intlLocale = new Intl.Locale(resolved) as WeekInfoLocale;
  const weekInfo = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
  const firstDay = (weekInfo?.firstDay ?? 1) % 7;

  /* 2021-08-01 was a Sunday; format a known week to get the headers. */
  const weekdayFmt = new Intl.DateTimeFormat(resolved, { weekday: "short", timeZone: "UTC" });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(Date.UTC(2021, 7, 1 + ((firstDay + i) % 7)))),
  );

  const hourFmt = new Intl.DateTimeFormat(resolved, { hour: "numeric" });
  const { hourCycle } = hourFmt.resolvedOptions();
  const hour12 = hourCycle === "h11" || hourCycle === "h12";

  const periodOf = (hour: number): string =>
    new Intl.DateTimeFormat(resolved, { hour: "numeric", hour12: true })
      .formatToParts(new Date(2021, 0, 1, hour))
      .find((part) => part.type === "dayPeriod")?.value ?? (hour < 12 ? "AM" : "PM");

  return {
    firstDay,
    weekdays,
    hour12,
    dayPeriods: [periodOf(9), periodOf(21)],
    monthTitle: new Intl.DateTimeFormat(resolved, { month: "long", year: "numeric" }),
    dayLabel: new Intl.DateTimeFormat(resolved, { month: "long", day: "numeric", year: "numeric" }),
    full: new Intl.DateTimeFormat(resolved, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

/* --- date arithmetic ------------------------------------------------------ */

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function snapMinutes(d: Date, step: number): Date {
  const out = new Date(d);
  out.setMinutes(Math.round(out.getMinutes() / step) * step, 0, 0);
  return out;
}

function addDays(d: Date, n: number): Date {
  const o = new Date(d);
  o.setDate(o.getDate() + n);
  return o;
}

function addMonths(d: Date, n: number): Date {
  const o = new Date(d);
  o.setMonth(o.getMonth() + n);
  return o;
}

function minuteOptions(step: number): number[] {
  const s = Math.max(1, Math.min(60, Math.floor(step)));
  return Array.from({ length: Math.floor(60 / s) }, (_, i) => i * s);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/* --- glyphs this picker alone draws; the shared ones are in internal/glyphs --- */

const calendarGlyph = (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.glyph}>
    <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const clockGlyph = (
  <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.glyph}>
    <circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5v3.25l2 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Mobile-first date + time picker. A trigger styled like Input opens a bottom
 * sheet with a month calendar (roving-focus grid, arrow keys move the day)
 * and native Select time controls. Controlled via `value` (ISO); emits the
 * combined ISO string on confirm. All names, the week start and the 12/24-hour
 * clock come from `Intl` for the given locale.
 *
 * ```tsx
 * <Field label="Starts">
 *   <DateTimePicker
 *     value={startsAt}
 *     onChange={setStartsAt}
 *     labels={t("picker", { returnObjects: true })}
 *     min={new Date().toISOString()}
 *     minuteStep={30}
 *     locale={i18n.language}
 *   />
 * </Field>
 * ```
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder,
  min,
  minuteStep = 5,
  disabled = false,
  id,
  "aria-label": ariaLabel,
  locale,
  labels: text,
}: DateTimePickerProps): ReactElement {
  /* Inside a Field, claim its generated control id and message wiring, the
     same way Input/Select/Textarea do — the field's <label htmlFor> points at
     the control id, and without it the label names nothing. */
  const field = useFieldContext();
  const intl = useMemo(() => localeData(locale), [locale]);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(() => new Date());
  const [view, setView] = useState<{ y: number; m: number }>(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  /* The calendar grid is a single tab stop: `focusedDay` is the one day that
     carries tabIndex 0; arrow keys move it (roving focus), crossing months. */
  const [focusedDay, setFocusedDay] = useState<Date>(() => new Date());
  const dayRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const pendingFocusRef = useRef(false);

  const minDate = min ? new Date(min) : new Date();
  const minStart = startOfDay(minDate);

  /* Re-seed the draft + visible month from the current value each time the
     panel opens. When `value` precedes `min` the roving tab stop clamps to
     `min`, and the view must follow it or no day in the grid is focusable. */
  function openPicker(): void {
    const base = snapMinutes(value ? new Date(value) : new Date(), minuteStep);
    setDraft(base);
    const start = startOfDay(base) >= minStart ? base : new Date(minStart);
    setView({ y: start.getFullYear(), m: start.getMonth() });
    setFocusedDay(start);
    setOpen(true);
  }

  /* Move DOM focus onto the roving target after an arrow-key move (only then —
     never steal focus when the panel first opens). */
  useEffect(() => {
    if (!pendingFocusRef.current) return;
    pendingFocusRef.current = false;
    dayRefs.current.get(startOfDay(focusedDay))?.focus();
  }, [focusedDay, view]);

  const h24 = draft.getHours();
  const h12 = h24 % 12 || 12;
  const isPM = h24 >= 12;

  function setHour(v: string): void {
    const nd = new Date(draft);
    nd.setHours(intl.hour12 ? (Number(v) % 12) + (isPM ? 12 : 0) : Number(v));
    setDraft(nd);
  }
  function setMinute(v: string): void {
    const nd = new Date(draft);
    nd.setMinutes(Number(v), 0, 0);
    setDraft(nd);
  }
  function setMeridiem(v: string): void {
    const nd = new Date(draft);
    nd.setHours((h12 % 12) + (v === "pm" ? 12 : 0));
    setDraft(nd);
  }
  function pickDay(day: number): void {
    const nd = new Date(draft);
    nd.setFullYear(view.y, view.m, day);
    setDraft(nd);
  }
  /* First selectable day in a month — the 1st, or `min` when it falls
     mid-month. Keeps the roving tab stop pointed at an enabled, in-view day. */
  function firstFocusableInView(y: number, m: number): Date {
    const monthStart = new Date(y, m, 1);
    return startOfDay(monthStart) >= minStart ? monthStart : new Date(minStart);
  }
  function shiftMonth(delta: number): void {
    let m = view.m + delta;
    let y = view.y;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setView({ y, m });
    setFocusedDay(firstFocusableInView(y, m));
  }
  function goToday(): void {
    const t = new Date();
    setView({ y: t.getFullYear(), m: t.getMonth() });
    setFocusedDay(startOfDay(t) >= minStart ? t : new Date(minStart));
  }
  /* Move the roving focus to `next` (clamped to >= min), following it across a
     month boundary, then focus the target cell once it renders. */
  function focusDate(next: Date): void {
    if (startOfDay(next) < minStart) return;
    pendingFocusRef.current = true;
    if (next.getMonth() !== view.m || next.getFullYear() !== view.y) {
      setView({ y: next.getFullYear(), m: next.getMonth() });
    }
    setFocusedDay(next);
  }
  function onDayKeyDown(e: KeyboardEvent<HTMLButtonElement>, cell: Date): void {
    /* Home/End go to the locale's start/end of week, not Sunday/Saturday. */
    const weekOffset = (cell.getDay() - intl.firstDay + 7) % 7;
    switch (e.key) {
      case "ArrowLeft": e.preventDefault(); focusDate(addDays(cell, -1)); break;
      case "ArrowRight": e.preventDefault(); focusDate(addDays(cell, 1)); break;
      case "ArrowUp": e.preventDefault(); focusDate(addDays(cell, -7)); break;
      case "ArrowDown": e.preventDefault(); focusDate(addDays(cell, 7)); break;
      case "Home": e.preventDefault(); focusDate(addDays(cell, -weekOffset)); break;
      case "End": e.preventDefault(); focusDate(addDays(cell, 6 - weekOffset)); break;
      case "PageUp": e.preventDefault(); focusDate(addMonths(cell, -1)); break;
      case "PageDown": e.preventDefault(); focusDate(addMonths(cell, 1)); break;
      case "Enter":
      case " ":
        e.preventDefault();
        pickDay(cell.getDate());
        break;
      default: break;
    }
  }
  function confirm(): void {
    onChange(draft.toISOString());
    setOpen(false);
  }

  const first = new Date(view.y, view.m, 1);
  const startWeekday = (first.getDay() - intl.firstDay + 7) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const prevDisabled =
    view.y < minDate.getFullYear() || (view.y === minDate.getFullYear() && view.m <= minDate.getMonth());
  const todayStart = startOfDay(new Date());
  const draftStart = startOfDay(draft);

  /* Render the month's natural span of weeks: trailing days of the previous
     month, in-month days 1..N, then enough of the next month to complete the
     last week (4/5/6 rows). Neighbour-month days are dimmed + non-interactive;
     the grid reserves 6 rows of height so the panel never jumps. */
  const spanCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;
  const dayCells = Array.from({ length: spanCells }, (_, i) => {
    const cell = new Date(view.y, view.m, 1 - startWeekday + i);
    const inMonth = cell.getMonth() === view.m && cell.getFullYear() === view.y;
    const cellStart = cell.getTime();
    const isDisabled = !inMonth || cellStart < minStart;
    const isSelected = inMonth && cellStart === draftStart;
    const isToday = inMonth && cellStart === todayStart;
    const isFocusTarget = inMonth && !isDisabled && cellStart === startOfDay(focusedDay);
    return (
      <button
        key={`c-${i}`}
        type="button"
        disabled={isDisabled}
        /* Single tab stop: only the roving-focus day is tabbable; the rest are
           reached with the arrow keys (WCAG 2.1.1 / grid pattern). */
        tabIndex={isFocusTarget ? 0 : -1}
        ref={
          inMonth && !isDisabled
            ? (el): void => {
                if (el) dayRefs.current.set(cellStart, el);
                else dayRefs.current.delete(cellStart);
              }
            : undefined
        }
        aria-hidden={inMonth ? undefined : true}
        aria-label={intl.dayLabel.format(cell)}
        aria-pressed={isSelected}
        onClick={inMonth ? () => pickDay(cell.getDate()) : undefined}
        onKeyDown={inMonth && !isDisabled ? (e) => onDayKeyDown(e, cell) : undefined}
        className={cx(styles.day, isToday && styles.today, isSelected && styles.selected, !inMonth && styles.outside)}
      >
        {cell.getDate()}
      </button>
    );
  });

  /* The trigger shows the value, or the placeholder, or nothing: the
     placeholder is optional, and interpolating it while unset would print
     "undefined" into the accessible name. */
  const shown = value ? intl.full.format(new Date(value)) : placeholder;

  return (
    <>
      <button
        id={id ?? field?.id}
        type="button"
        disabled={disabled}
        aria-describedby={field?.describedBy}
        aria-haspopup="dialog"
        aria-expanded={open}
        /* Announce the field name (when given) alongside the current value. */
        aria-label={ariaLabel === undefined ? undefined : [ariaLabel, shown].filter(Boolean).join(": ")}
        onClick={openPicker}
        className={cx(styles.trigger, value && styles.hasValue)}
      >
        {calendarGlyph}
        <span className={styles.triggerLabel}>{shown}</span>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} label={ariaLabel ?? text.dialog}>
        <SheetHeader>{intl.full.format(draft)}</SheetHeader>
        <SheetBody>
          <div className={styles.timeRow}>
            {clockGlyph}
            {intl.hour12 ? (
              <>
                <Select aria-label={text.hour} value={String(h12)} onChange={(e) => setHour(e.target.value)} className={styles.grow}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
                <span className={styles.colon} aria-hidden="true">:</span>
                <Select aria-label={text.minute} value={String(draft.getMinutes())} onChange={(e) => setMinute(e.target.value)} className={styles.grow}>
                  {minuteOptions(minuteStep).map((m) => (
                    <option key={m} value={String(m)}>
                      {pad2(m)}
                    </option>
                  ))}
                </Select>
                <Select aria-label={text.dayPeriod} value={isPM ? "pm" : "am"} onChange={(e) => setMeridiem(e.target.value)} className={styles.meridiem}>
                  <option value="am">{intl.dayPeriods[0]}</option>
                  <option value="pm">{intl.dayPeriods[1]}</option>
                </Select>
              </>
            ) : (
              <>
                <Select aria-label={text.hour} value={String(h24)} onChange={(e) => setHour(e.target.value)} className={styles.grow}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i)}>
                      {pad2(i)}
                    </option>
                  ))}
                </Select>
                <span className={styles.colon} aria-hidden="true">:</span>
                <Select aria-label={text.minute} value={String(draft.getMinutes())} onChange={(e) => setMinute(e.target.value)} className={styles.grow}>
                  {minuteOptions(minuteStep).map((m) => (
                    <option key={m} value={String(m)}>
                      {pad2(m)}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </div>

          <div role="group" aria-label={intl.monthTitle.format(first)}>
            <div className={styles.calendarHeader}>
              <Button
                iconOnly
                aria-label={text.previousMonth}
                variant="ghost"
                size="sm"
                disabled={prevDisabled}
                onClick={() => shiftMonth(-1)}
              >
                <ChevronLeftGlyph className={styles.glyph} />
              </Button>
              {/* Live, because the arrows change the calendar without moving focus:
                  without an announcement the month flip is silent to a reader. */}
              <span className={styles.monthLabel} aria-live="polite">
                {intl.monthTitle.format(first)}
              </span>
              <Button iconOnly aria-label={text.nextMonth} variant="ghost" size="sm" onClick={() => shiftMonth(1)}>
                <ChevronRightGlyph className={styles.glyph} />
              </Button>
            </div>
            <div className={styles.weekdays}>
              {intl.weekdays.map((w, i) => (
                <span key={`wd-${i}`} aria-hidden="true" className={styles.weekday}>
                  {w}
                </span>
              ))}
            </div>
            <div className={styles.grid}>{dayCells}</div>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="ghost" onClick={goToday}>
            {text.today}
          </Button>
          <Button variant="primary" onClick={confirm}>
            {text.done}
          </Button>
        </SheetFooter>
      </Sheet>
    </>
  );
}

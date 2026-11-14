/** Declarative calculators (src/lib/tool-specs.ts), rendered by components/calc/SpecTool.tsx. */
export type V = Record<string, number | string>;
export interface NumIn { kind?: 'num'; id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; /** Always show the decimals ("1.00", not "1"). */ fixed?: boolean; help?: string; adv?: boolean; wide?: boolean; /** Short name in the summary of the folded fields. */ short?: string }
export interface ChoiceIn { kind: 'choice'; id: string; label: string; def: string; options: Array<{ value: string; label: string }>; help?: string; adv?: boolean; wide?: boolean; short?: string }
export interface SelectIn { kind: 'select'; id: string; label: string; def: string; options: Array<{ value: string; label: string }>; /** Options that depend on the other fields (states priced for the chosen trade). */ dyn?: (v: V) => Array<{ value: string; label: string }>; help?: string; adv?: boolean; wide?: boolean; short?: string }
export type Input = NumIn | ChoiceIn | SelectIn;
export interface ToolOut {
  label: string; value: string; sub?: string;
  rows: Array<[string, string, number?]>;
  table?: { caption?: string; headers: string[]; rows: string[][]; align?: Array<'l' | 'r'>;
    /** Long tables (naive testers 2026-11-14: 51 cards = 10 screens on a phone): only the first rows and these rows are shown until "more" is pressed; every row stays in the HTML. */
    keep?: number[]; more?: string;
    /** A few short columns: stays a table on a phone instead of one card per row (naive testers, third pass). */ compact?: boolean };
  note?: string;
  /** What the example case assumes, in plain words ("Example: a $60,000 salary, plan paid by your employer"), shown
   *  while the reader has changed nothing (brief of 2026-11-09, second pass: never a vague "Example"). */
  example?: string;
  /** Replaces the generic "change a figure to see yours" after the example (a survey figure is never "yours"). */
  exampleAide?: string;
}
/** A door by profile (brief of 2026-11-10, rule 2): a button above the fields that sets a few of them at once. */
export interface Profile { label: string; set: V }
export interface ToolSpec { inputs: Input[]; run: (v: V) => ToolOut; profiles?: Profile[] }

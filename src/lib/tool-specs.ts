/**
 * The calculators of the site, rendered by components/calc/SpecTool.tsx (full tool) and MiniSim.tsx (mini-simulator).
 * Every rate comes from the engine (lib/engine/comp.ts) and its data files: the Oregon DCBS study of rates in effect on
 * January 1, 2024 (51 jurisdictions, 53 classes, dollars per $100 of payroll) and the Washington L&I hourly rates.
 * The reader enters payroll, headcount and an experience modification; nothing is a quote. This file ships to the browser.
 */
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatMoney, formatNumber } from './format';
import {
  CLASSES, NAMES, STATE_CODES, STATES, MEDIAN, WA, RULES, CHANGES, N_STATES,
  rate, rankOf, statesWith, premium, classRanking, stateClasses, modEffect, perHead, waCost, required, applyChange, stateName, classOf,
} from './engine/comp';
import { MARKET, US, ARP_AVG, COMPETITIVE, EXCLUSIVE, FUND_LABEL, shares, costRanking, whereToBuy, impliedRate } from './engine/market';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
/** A rate per $100 as published, to the cent: "$1.09". */
export const r100 = (x: number) => `$${formatNumber(x, 2)}`;
/** An hourly rate of Washington, to the hundredth of a cent: "$0.2223". */
export const r4 = (x: number) => `$${formatNumber(x, 4)}`;
export const pct = (x: number, d = 0) => `${formatNumber(x * 100, d)}%`;
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;
export const ordinal = (k: number) => `${k}${k % 100 >= 11 && k % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] ?? 'th'}`;
/** "the most expensive of 51 states", "15th most expensive of 51 states" (naive testers 2026-11-14: "1st highest of 51"). */
export const rankText = (k: number, of: number) => (k === 1 ? `the most expensive of ${of} states` : k === of ? `the cheapest of ${of} states` : `${ordinal(k)} most expensive of ${of} states`);

/**
 * ONE example case for the whole site, so that a reader never sees two amounts for one case: a five-person
 * electrical contractor in California (class 5190) with $300,000 of payroll and an experience modification of 1.00.
 */
export const EX = { st: 'CA', code: '5190', payroll: 300000, mod: 1, employees: 5, hours: 2000 } as const;

const STATE_OPTIONS = STATE_CODES.map((c) => ({ value: c, label: NAMES[c] }));
/** Trades in plain words, sorted by name, the code after the name (naive testers 2026-11-14: "how do I find my code?"). */
const CLASS_OPTIONS = CLASSES.map((c) => ({ value: c.code, label: `${c.short} (${c.code})` })).sort((a, b) => a.label.localeCompare(b.label));
const ST = (def: string = EX.st, label = 'State where the work is done'): Input => ({ kind: 'select', id: 'st', label, def, options: STATE_OPTIONS, help: 'Rates follow the state where the employee works, not the head office' });
/** Class select limited to the 53 classes of the study; states without the class drop out of the state list. */
const CODE = (def: string = EX.code): Input => ({ kind: 'select', id: 'code', label: 'What kind of work? (class code)', def, options: CLASS_OPTIONS, help: 'Pick the work your employees do. The four-digit number is the class code printed on a policy; office staff are 8810', wide: true });
const STW = (def: string = EX.st, label = 'State where the work is done'): Input => ({ kind: 'select', id: 'st', label, def, options: STATE_OPTIONS, dyn: (v) => STATE_OPTIONS.filter((o) => rate(s(v, 'code'), o.value) !== null), help: 'Where the employee works' });
const PAYROLL = (def: number = EX.payroll): Input => ({ id: 'pay', label: 'Yearly payroll in this class', def, unit: '$', max: 50000000, help: 'Gross wages of the employees in that class; owners usually apart' });
const MOD: Input = { id: 'mod', label: 'Claims score (mod)', def: EX.mod, max: 5, decimals: 2, help: 'Leave 1.00 if you don’t know. Below 1 (few claims) lowers the premium, above 1 raises it', short: 'mod' };

/** A Washington class in plain words for a select: "NOC" (not otherwise classified) dropped, cut at 34 characters. */
const waDesc = (d: string) => { const x = d.replace(/,?\s*\bN\.?O\.?C\.?\b/g, '').replace(/\bHVAC-R\b/g, 'Heating/cooling').trim(); return x.length > 34 ? `${x.slice(0, 33).trim()}…` : x; };
function spec(inputs: Input[], arg: Record<string, number | string>, run: (v: V) => ToolOut): ToolSpec {
  return {
    inputs: inputs.map((i) => (arg[i.id] === undefined ? i : { ...i, def: (i.kind === 'choice' || i.kind === 'select') ? String(arg[i.id]) : Number(arg[i.id]) } as Input)),
    run,
  };
}
const caseText = (v: V) => `Example: ${classOf(s(v, 'code')).short.toLowerCase()} (${s(v, 'code')}) in ${stateName(s(v, 'st'))}, ${usd(n(v, 'pay'))} of payroll`;
/** One date sentence (naive testers 2026-11-14: "2024, 2023, 2022, 2026: which one counts?"). */
const STUDY = 'Rates: the latest study that compares all 50 states and DC, made by the state of Oregon every two years. It reads the rates in force on January 1, 2024 (published June 2025), averaged across insurers. Your insurer’s rate, minimum premium and fees differ: this is an order of magnitude, not a quote.';

/** Premium of a class in a state, and the same payroll in the cheapest and dearest states. */
function estimate(v: V): ToolOut {
  const code = s(v, 'code'), st = s(v, 'st'), pay = n(v, 'pay'), mod = n(v, 'mod') || 1;
  const r = rate(code, st);
  if (r === null) return { label: 'Estimated yearly premium', value: 'No rate', rows: [], note: `${stateName(st)} uses no class comparable to ${code} in the study. Pick another class or state.` };
  const k = classRanking(code), p = premium(pay, r, mod);
  return {
    label: 'Estimated yearly premium', value: usd(p), example: caseText(v),
    sub: `${r100(r)} per $100 of payroll · ${rankText(rankOf(code, st)!, k.count)} for this class`,
    rows: [
      ['Rate per $100 of payroll', r100(r), r],
      ['Per month', usd(p / 12)],
      [`Median state for class ${code}`, `${r100(k.median)}, so ${usd(premium(pay, k.median, mod))} a year`],
      [`Cheapest: ${stateName(k.low.st)}`, `${r100(k.low.rate)}, so ${usd(premium(pay, k.low.rate, mod))}`],
      [`Most expensive: ${stateName(k.high.st)}`, `${r100(k.high.rate)}, so ${usd(premium(pay, k.high.rate, mod))}`],
      ...(mod !== 1 ? [['Without your mod (1.00)', usd(premium(pay, r, 1))] as [string, string]] : []),
    ],
    note: STUDY,
  };
}

type Arg = Record<string, number | string>;
const SPECS: Record<string, (arg?: Arg) => ToolSpec> = {
  /** Home: the estimator, class by state, with an experience modification. */
  all: (arg = {}) => ({
    ...spec([CODE(), STW(), PAYROLL(), MOD], arg, estimate),
    profiles: [
      { label: 'Office staff', set: { code: '8810', pay: 300000 } },
      { label: 'Restaurant', set: { code: '9082', pay: 300000 } },
      { label: 'Roofer', set: { code: '5551', pay: 300000 } },
      { label: 'House framing', set: { code: '5645', pay: 300000 } },
    ],
  }),

  /** Same estimator for a page that starts from another case. */
  estimate: (arg = {}) => spec([CODE(), STW(), PAYROLL(), MOD], arg, estimate),

  /** One class across the 51 jurisdictions: the premium in the reader's state first (naive testers 2026-11-14: the big
   *  figure was a national range written high to low, and the state was hidden in a fold). */
  rank: (arg = {}) => spec([CODE(), STW(EX.st, 'Your state'), PAYROLL()], arg, (v) => {
    const code = s(v, 'code'), pay = n(v, 'pay'), st = s(v, 'st');
    const k = classRanking(code), mine = rate(code, st), name = classOf(code).short;
    const idx = k.list.findIndex((x) => x.st === st);
    return {
      label: `Yearly premium in ${stateName(st)}`, value: mine === null ? 'No rate' : usd(premium(pay, mine)),
      example: `Example: ${name.toLowerCase()} (${code}) in ${stateName(st)}, ${usd(pay)} of payroll`, exampleAide: 'pick your work and your state',
      sub: mine === null ? `${stateName(st)} uses no comparable class` : `${r100(mine)} per $100 of payroll · ${rankText(rankOf(code, st)!, k.count)} for this class`,
      rows: [
        [`Cheapest: ${stateName(k.low.st)}`, `${r100(k.low.rate)}, ${usd(premium(pay, k.low.rate))} a year`],
        ['Median state', `${r100(k.median)}, ${usd(premium(pay, k.median))} a year`],
        [`Most expensive: ${stateName(k.high.st)}`, `${r100(k.high.rate)}, ${usd(premium(pay, k.high.rate))} a year`],
        ['From the cheapest to the most expensive state', `${r100(k.low.rate)} to ${r100(k.high.rate)} per $100`],
      ],
      table: { caption: `${name} (${code}) in ${k.count} states, most expensive first`, headers: ['Rank', 'State', 'Per $100', 'Yearly premium'], align: ['r', 'l', 'r', 'r'], rows: k.list.map((x) => [String(x.rank), NAMES[x.st], r100(x.rate), usd(premium(pay, x.rate))]), keep: idx >= 0 ? [idx] : [], more: `Show all ${k.count} states` },
      note: `${k.missing.length ? `No comparable class in ${k.missing.map(stateName).join(', ')}. ` : ''}${STUDY}`,
    };
  }),

  /** One state: the premium of a class there, then its 53 classes. The state's index is shown as a price level only,
   *  never multiplied by a payroll (naive testers 2026-11-14: "Index on the same payroll $5,580 a year" contradicted
   *  "the index is not a rate to multiply your payroll by"). */
  state: (arg = {}) => spec([ST(), CODE(), PAYROLL()], arg, (v) => {
    const st = s(v, 'st'), pay = n(v, 'pay'), code = s(v, 'code'), x = STATES[st], list = stateClasses(st);
    const r = rate(code, st), name = classOf(code).short, k = classRanking(code);
    const idx = list.findIndex((c) => c.code === code);
    return {
      label: `Yearly premium in ${stateName(st)}`, value: r === null ? 'No rate' : usd(premium(pay, r)),
      example: `Example: ${name.toLowerCase()} (${code}) in ${stateName(st)}, ${usd(pay)} of payroll`, exampleAide: 'pick your state, your work and your payroll',
      sub: r === null ? `${stateName(st)} uses no class comparable to ${code}` : `${r100(r)} per $100 of payroll · ${rankText(rankOf(code, st)!, k.count)} for this class`,
      rows: [
        ['Per month', r === null ? 'no rate' : usd(premium(pay, r) / 12)],
        ['Same work, median state', `${r100(k.median)}, ${usd(premium(pay, k.median))} a year`],
        [`${stateName(st)} overall, all work mixed`, `${formatNumber(x.pctMedian, 0)}% of the median state, ${ordinal(x.rank)} most expensive of ${N_STATES}`],
        ['Date of these rates', `In force on January 1, 2024 (set on ${x.effective})`],
      ],
      table: { caption: `${stateName(st)}: ${list.length} kinds of work, yearly premium on ${usd(pay)} of payroll`, headers: ['Work', 'Class code', 'Per $100', 'Rank among states (1 = most expensive)', 'Yearly premium'], align: ['l', 'l', 'r', 'r', 'r'], rows: list.map((c) => [c.short, c.code, r100(c.rate), `${ordinal(c.rank)} of ${c.of}`, usd(premium(pay, c.rate))]), keep: idx >= 0 ? [idx] : [], more: `Show all ${list.length} kinds of work` },
      note: `“All work mixed” compares states on one footing, by weighting the 53 kinds of work the same way everywhere; it is a price level, not a rate any employer pays. ${STUDY}`,
    };
  }),

  /** Index ranking of the 51 jurisdictions. */
  index: (arg = {}) => spec([ST()], arg, (v) => {
    const st = s(v, 'st'), x = STATES[st];
    const all = STATE_CODES.map((c) => ({ c, ...STATES[c] })).sort((a, b) => a.rank - b.rank);
    return {
      label: `${stateName(st)}: rank among ${N_STATES}`, value: ordinal(x.rank), example: `Example: ${stateName(st)}`, exampleAide: 'pick your state',
      sub: `${x.rank === 1 ? 'the most expensive state' : `${ordinal(x.rank)} most expensive`} · price level ${formatNumber(x.pctMedian, 0)}% of the median state`,
      rows: [
        ['Price level (index)', `${r100(x.index)} per $100, against ${r100(MEDIAN)} in the median state`],
        [`Most expensive: ${stateName(all[0].c)}`, `${formatNumber(all[0].pctMedian, 0)}% of the median`],
        [`Cheapest: ${stateName(all[all.length - 1].c)}`, `${formatNumber(all[all.length - 1].pctMedian, 0)}% of the median`],
        ['Your own premium', 'follows your class code: use the class calculator'],
      ],
      table: { caption: 'Premium index of 51 jurisdictions, highest first (study of rates in effect on January 1, 2024)', headers: ['Rank', 'State', 'Index per $100', '% of median'], align: ['r', 'l', 'r', 'r'], rows: all.map((y) => [String(y.rank), NAMES[y.c], r100(y.index), `${formatNumber(y.pctMedian, 0)}%`]), keep: [all.findIndex((y) => y.c === st)], more: `Show all ${N_STATES} states` },
      note: 'The index applies one payroll mix (Oregon’s) to every state, so it ranks price levels; it is not a rate to multiply your payroll by. Use the class calculator for that.',
    };
  }),

  /** Experience modification. */
  mod: (arg = {}) => spec([{ ...MOD, def: 0.85 }, { id: 'man', label: 'Premium before the mod (manual premium)', def: Math.round(premium(EX.payroll, rate(EX.code, EX.st)!)), unit: '$', max: 100000000, help: 'Payroll / 100 x rate, before credits and fees' }], arg, (v) => {
    const mod = n(v, 'mod'), man = n(v, 'man'), e = modEffect(man, mod);
    const at = (m: number) => usd(man * m);
    return {
      label: mod <= 1 ? 'Yearly saving from your mod' : 'Yearly surcharge from your mod', value: usd(Math.abs(e.diff)), example: `Example: a mod of ${formatNumber(mod, 2)} on a ${usd(man)} premium`,
      sub: `premium ${usd(e.withMod)} instead of ${usd(man)} (${e.pct >= 0 ? '+' : ''}${formatNumber(e.pct * 100, 0)}%)`,
      rows: [['Mod 0.75', at(0.75)], ['Mod 1.00 (no history)', at(1)], ['Mod 1.25', at(1.25)], ['Mod 1.50', at(1.5)]],
      note: 'The mod multiplies the premium of every class on the policy. A rating bureau computes it from about three years of your claims against those expected for your payroll; the worksheet shows the figure.',
    };
  }),

  /** Cost per employee and per hour. */
  perEmployee: (arg = {}) => spec([CODE(), STW(), { id: 'emp', label: 'Employees in this class', def: EX.employees, max: 100000 }, { id: 'wage', label: 'Yearly wage of one employee', def: EX.payroll / EX.employees, unit: '$', max: 5000000 }, { id: 'hrs', label: 'Hours worked a year by one employee', def: EX.hours, max: 8784, adv: true, short: 'hours' }, MOD], arg, (v) => {
    const code = s(v, 'code'), st = s(v, 'st'), emp = n(v, 'emp'), wage = n(v, 'wage'), r = rate(code, st);
    if (r === null) return { label: 'Cost per employee', value: 'No rate', rows: [], note: `${stateName(st)} uses no class comparable to ${code} in the study.` };
    const p = premium(emp * wage, r, n(v, 'mod') || 1), h = perHead(p, emp, n(v, 'hrs'));
    return {
      label: 'Cost per employee, a year', value: usd(h.perEmployee), example: `Example: ${emp} employees at ${usd(wage)} in class ${code}, ${stateName(st)}`,
      sub: `${usd(h.perMonth)} a month · ${h.perHour > 0 ? `$${formatNumber(h.perHour, 2)} an hour` : ''}`,
      rows: [['Whole payroll', usd(emp * wage)], ['Yearly premium', usd(p)], ['Share of wages', pct(p / Math.max(1, emp * wage), 1)], ['Rate per $100', r100(r)]],
      note: STUDY,
    };
  }),

  /** Is coverage required? */
  required: (arg = {}) => spec([{ ...ST('FL'), help: 'Where your employees work' }, { id: 'emp', label: 'Employees, part-time included', def: 3, max: 100000 }, { kind: 'select', id: 'con', label: 'Construction work?', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes, construction' }] }, { id: 'pay', label: 'Total payroll last year', def: 90000, unit: '$', max: 500000000, adv: true, short: 'payroll last year', help: 'Counts in Kansas, South Carolina and Wisconsin' }], arg, (v) => {
    const st = s(v, 'st'), emp = n(v, 'emp');
    const r = required(st, emp, s(v, 'con') === 'yes', n(v, 'pay'));
    const word = { required: 'Required', 'not-required': 'Not required by the rule', optional: 'Optional in this state', unknown: 'Not read by this site' }[r.need];
    return {
      label: `Workers’ comp in ${stateName(st)}`, value: word, example: `Example: ${emp} employees in ${stateName(st)}${s(v, 'con') === 'yes' ? ', construction' : ''}`, exampleAide: 'enter your state and headcount',
      sub: r.rule ? r.rule.text : `This site has read the rule of ${Object.keys(RULES).length} states; ask the workers’ compensation agency of ${stateName(st)}.`,
      rows: [['Employees counted', formatNumber(emp, 0)], ['States whose rule this site has checked', `${Object.keys(RULES).length} of ${N_STATES}`], ['Rule checked on', 'November 13, 2026']],
      note: 'A rule of thumb, not legal advice: owners, officers, family members, farm and household workers have their own rules in many states. The state agency decides.',
    };
  }),

  /** Washington state fund, by the hour. */
  wa: (arg = {}) => spec([
    { kind: 'select', id: 'wa', label: 'Washington risk class', def: '0510', options: Object.entries(WA).map(([k, c]) => ({ value: k, label: `${k} ${waDesc(c.desc)}` })), wide: true, help: 'The four-digit class on the rate notice of the Washington Department of Labor & Industries' },
    { id: 'emp', label: 'Workers', def: 5, max: 100000 }, { id: 'hrs', label: 'Hours a year per worker', def: 2000, max: 8784 },
    { kind: 'select', id: 'yr', label: 'Year', def: '2026', options: [{ value: '2026', label: '2026 (adopted)' }, { value: '2027', label: '2027 (proposed)' }] },
  ], arg, (v) => {
    const hours = n(v, 'emp') * n(v, 'hrs'), yr = s(v, 'yr') === '2027' ? 2027 : 2026, c = waCost(s(v, 'wa'), hours, yr);
    return {
      label: 'Employer’s share, a year', value: usd(c.employer), example: `Example: ${n(v, 'emp')} workers in class ${s(v, 'wa')}, ${formatNumber(n(v, 'hrs'), 0)} hours each`,
      sub: `${r4(c.comp)} an hour in all, of which up to ${r4(c.ded)} may come out of pay`,
      rows: [['Total for the hours', usd(c.total)], ['Workers’ share at most', usd(c.worker)], ['Employer per hour', r4(c.employerHour)], ['2027 change for this class', `${c.change >= 0 ? '+' : ''}${formatNumber(c.change * 100, 1)}%`]],
      note: 'Washington L&I state fund rates per hour worked, at an experience factor of 1.0000. Your account’s own factor moves the rate; your rate notice shows it. Wallboard classes, priced per square foot, are left out.',
    };
  }),

  /** An announced change applied to a premium. */
  change: (arg = {}) => spec([
    { id: 'prem', label: 'Your yearly premium now', def: 10000, unit: '$', max: 100000000 },
    { kind: 'select', id: 'ch', label: 'Announced change', def: 'ca', options: [
      { value: 'ca', label: `California, Sept. 2026: +${CHANGES.ca.pct}%` },
      { value: 'or', label: `Oregon, 2027: +${CHANGES.or2027.purePremiumPct}%` },
      { value: 'wa26', label: `Washington, 2026: +${CHANGES.wa.chg2026}%` },
      { value: 'wa27', label: `Washington, 2027: +${CHANGES.wa.chg2027}%` },
      { value: 'own', label: 'Another change' },
    ] },
    { id: 'own', label: 'Other change, percent', def: 0, max: 100, decimals: 1, adv: true, short: 'other change', help: 'From your insurer’s renewal letter' },
  ], arg, (v) => {
    const map: Record<string, number> = { ca: CHANGES.ca.pct, or: CHANGES.or2027.purePremiumPct, wa26: CHANGES.wa.chg2026, wa27: CHANGES.wa.chg2027, own: n(v, 'own') };
    const c = map[s(v, 'ch')] ?? 0, now = n(v, 'prem'), next = applyChange(now, c);
    return {
      label: 'Premium after the average change', value: usd(next), example: `Example: ${usd(now)} a year and the ${s(v, 'ch') === 'ca' ? 'California' : 'selected'} change`, sub: `${c >= 0 ? '+' : ''}${formatNumber(c, 1)}%, so ${usd(next - now)} more a year`,
      rows: [['Premium now', usd(now)], ['Change applied', `${formatNumber(c, 1)}%`], ['Per month after', usd(next / 12)]],
      note: 'An average across classes: your own class can move more or less, and insurers price on top of it. California’s figure is advisory: insurers are not bound by it.',
    };
  }),

  /** A state explained: who sells coverage, the rule read, the price level and the total employer cost (NASI 2022). */
  profile: (arg = {}) => spec([ST('CA', 'Your state'), { ...PAYROLL(), label: 'Yearly payroll of your business', help: 'Gross wages of all employees' }], arg, (v) => {
    const st = s(v, 'st'), pay = n(v, 'pay'), m = MARKET[st], x = STATES[st], rule = RULES[st];
    const c = m.cost100 ?? null;
    return {
      label: `Workers’ comp in ${stateName(st)}`, value: c === null ? `${r100(x.index)} index` : `${r100(c)} per $100 of wages`,
      example: `Example: ${stateName(st)}, ${usd(pay)} of payroll`, exampleAide: 'pick your state',
      sub: c === null ? `overall price level ${rankText(x.rank, N_STATES)}` : `what employers paid in all in 2022, against ${r100(US.cost100)} nationally · overall price level ${rankText(x.rank, N_STATES)}`,
      rows: [
        ['Who sells coverage', whereToBuy(st)],
        ['Who must carry it', rule ? rule.text : 'Rule not read by this site: ask the state agency'],
        ...(c === null ? [['Total cost 2022', 'not shown: the national report prints the same table for Kentucky and Louisiana'] as [string, string]] : [
          [`Average cost on ${usd(pay)} of payroll`, `${usd(premium(pay, c))} a year, all classes mixed`] as [string, string],
          ['Benefits paid per $100 of wages, 2022', r100(m.ben100!)] as [string, string],
          ['Cost per $100 in 2018', r100(m.cost100_2018!)] as [string, string],
        ]),
        ['Premium index (Oregon study)', `${r100(x.index)} per $100, ${formatNumber(x.pctMedian, 0)}% of the median`],
      ],
      table: { caption: 'Employer cost per $100 of covered wages, 2018 and 2022, lowest first (NASI)', headers: ['State', '2022', '2018', 'Who sells coverage'], align: ['l', 'r', 'r', 'l'], rows: costRanking().map((y) => [NAMES[y.st], r100(y.cost100), r100(y.cost100_2018), FUND_LABEL[y.fund]]) },
      note: 'The cost per $100 of wages is every employer of the state together: premiums, deductible benefits and self-insured costs (National Academy of Social Insurance, 2022 data). Your own price follows your class code: the class calculator gives it.',
    };
  }),

  /** State funds: who sells, and the share of employer costs paid to the fund. */
  fund: (arg = {}) => spec([ST('OH', 'State')], arg, (v) => {
    const st = s(v, 'st'), m = MARKET[st], sh = shares(st);
    const list = [...EXCLUSIVE, ...COMPETITIVE].filter((c) => shares(c)).sort((a, b) => shares(b)!.fund - shares(a)!.fund);
    return {
      label: `${stateName(st)}: state fund`, value: FUND_LABEL[m.fund], example: `Example: ${stateName(st)}`, exampleAide: 'pick your state',
      sub: whereToBuy(st),
      rows: [
        ...(sh ? [
          ['State fund share of employer costs, 2022', pct(sh.fund, 1)] as [string, string],
          ['Private insurers', pct(sh.private, 1)] as [string, string],
          ['Self-insured employers', pct(sh.self, 1)] as [string, string],
        ] : [['Shares of costs', 'not shown: the national report prints the same table for Kentucky and Louisiana'] as [string, string]]),
        ['Rates set by', m.bureau === 'ncci' ? 'The National Council on Compensation Insurance (NCCI), a national rating body' : m.bureau === 'independent' ? 'An independent state rating bureau' : 'The state fund itself'],
        ...(m.arp?.pct ? [['Assigned risk pool, 2023', `${formatNumber(m.arp.pct, 1)}% of premiums (average ${formatNumber(ARP_AVG.pct, 1)}%)`] as [string, string]] : []),
      ],
      table: { caption: 'States with a state fund: its share of all employer costs in 2022, highest first', headers: ['State', 'Kind of fund', 'State fund share', 'Private insurers'], align: ['l', 'l', 'r', 'r'], rows: list.map((c) => [NAMES[c], FUND_LABEL[MARKET[c].fund], pct(shares(c)!.fund, 1), pct(shares(c)!.private, 1)]) },
      note: 'Shares of 2022 employer costs by type of insurer, from the National Academy of Social Insurance. Kentucky and Louisiana also have a competitive state fund; their figures are not shown because the report repeats one table for both.',
    };
  }),

  /** A quote checked against the average rate of the class in the state. */
  quote: (arg = {}) => spec([{ id: 'q', label: 'Yearly premium on the quote', def: 9500, unit: '$', max: 50000000, help: 'Total of the quote, fees included' }, CODE(), STW(), PAYROLL(), MOD], arg, (v) => {
    const code = s(v, 'code'), st = s(v, 'st'), pay = n(v, 'pay'), mod = n(v, 'mod') || 1, q = n(v, 'q');
    const r = rate(code, st);
    if (r === null) return { label: 'Your quote against the state average', value: 'No rate', rows: [], note: `${stateName(st)} uses no class comparable to ${code} in the study. Pick another class or state.` };
    const imp = impliedRate(q, pay, mod), avg = premium(pay, r, mod), gap = avg > 0 ? q / avg - 1 : 0;
    const k = classRanking(code), above = k.list.filter((x) => x.rate > imp).length;
    return {
      label: 'Your quote against the state average', value: `${gap >= 0 ? '+' : ''}${formatNumber(gap * 100, 0)}%`, example: `Example: a ${usd(q)} quote for ${classOf(code).short.toLowerCase()} (${code}) in ${stateName(st)}`,
      sub: `${r100(imp)} per $100 quoted, against an average of ${r100(r)} in the study`,
      rows: [
        ['Premium at the study rate', usd(avg)],
        ['Difference a year', `${q - avg >= 0 ? '' : '-'}${usd(Math.abs(q - avg))}`],
        ['Rate implied by the quote', `${r100(imp)} per $100${mod !== 1 ? ` before your mod of ${formatNumber(mod, 2)}` : ''}`],
        [`States above that rate for class ${code}`, `${above} of ${k.count}`],
      ],
      note: `A quote adds the insurer’s own rate, a minimum premium, fees and state surcharges, and the study is of rates in effect on January 1, 2024: a gap of a few percent means nothing. A large gap is a reason to check the class code and the payroll on the quote. ${STUDY}`,
    };
  }),
};

export function getTool(kind: string, arg?: Arg): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  return f(arg);
}
export const TOOL_KINDS = Object.keys(SPECS);
export { statesWith };

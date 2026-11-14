/**
 * Workers' compensation engine. Data:
 *   dcbs-2024.json  Oregon DCBS premium rate ranking, rates in effect on January 1, 2024: the index of 51 jurisdictions
 *                   (Table 1) and the calculated manual rate of 53 classes in each (Appendix 6), dollars per $100 of payroll
 *   wa-rates.json   Washington L&I state fund, dollars per hour worked, 2026 adopted and 2027 proposed
 *   params-2026.json coverage rules read on state sites, announced rate changes
 * Premium = payroll / 100 x rate x experience modification. Nothing here is a quote.
 */
import D from '../../data/dcbs-2024.json';
import W from '../../data/wa-rates.json';
import P from '../../data/params-2026.json';

export interface StateRow { index: number; rank: number; rank2022: number; pctMedian: number; effective: string }
export interface ClassRow { code: string; short: string; scope: string; rows: Record<string, [number, number]>; na: string[] }
export interface WaClass { desc: string; group: string; comp2026: number; ded2026: number; comp2027: number; ded2027: number }
export interface Rule { kind: 'all' | 'count' | 'optional' | 'payroll'; min: number | null; constr?: number; payrollMin?: number; quarterPay?: number; text: string; src: string }

export const MEDIAN: number = D.median;
export const NAMES: Record<string, string> = D.names;
export const STATES: Record<string, StateRow> = D.states as Record<string, StateRow>;
/**
 * Plain-English name of each class (naive testers, 2026-11-14: "Logging Nonmech", "Clerical Office Employ", "NOC" were
 * read as gibberish). The study's own wording stays in `scope`; `short` is what the reader sees everywhere.
 */
export const PLAIN: Record<string, string> = {
  '5': 'Plant nurseries (farm)', '37': 'Field crop farms', '2003': 'Bakeries', '2702': 'Logging without heavy machinery',
  '2710': 'Sawmills', '2731': 'Planing and molding mills', '2915': 'Veneer making', '3724': 'Machinery install and repair',
  '5183': 'Plumbing', '5190': 'Electrical wiring in buildings', '5213': 'Concrete construction', '5221': 'Concrete floors and driveways',
  '5403': 'Carpentry (general)', '5437': 'Cabinets and interior trim', '5474': 'Painting', '5506': 'Street and road paving',
  '5537': 'Heating and air conditioning', '5551': 'Roofing', '5645': 'House framing (up to 3 stories)', '6217': 'Excavation',
  '6504': 'Food manufacturing', '7219': 'Trucking', '7231': 'Parcel delivery and couriers', '7380': 'Drivers and chauffeurs',
  '7403': 'Aviation ground staff', '7600': 'Telecom and cable TV', '7710': 'Firefighters', '7720': 'Police officers',
  '8006': 'Gas stations, convenience stores', '8017': 'Retail stores', '8018': 'Wholesale stores', '8033': 'Grocery and meat stores',
  '8232': 'Lumberyards', '8380': 'Auto repair shops', '8742': 'Outside salespeople', '8810': 'Office staff',
  '8824': 'Retirement homes: care staff', '8826': 'Retirement homes: other staff', '8832': 'Doctors’ offices', '8833': 'Hospitals: professional staff',
  '8835': 'Home health care', '8864': 'Social services', '8868': 'Colleges: teachers, office', '9014': 'Chimney cleaning',
  '9015': 'Building maintenance', '9052': 'Hotels (not the restaurant)', '9058': 'Hotel restaurants', '9082': 'Restaurants',
  '9083': 'Fast-food restaurants', '9084': 'Bars and nightclubs', '9101': 'Colleges: other staff', '9102': 'Parks', '9403': 'Garbage collection',
};
export const CLASSES: ClassRow[] = (D.classes as unknown as ClassRow[]).map((c) => ({ ...c, short: PLAIN[c.code] ?? c.short }));
/** Wallboard classes are priced per square foot installed, not per hour (note ** of the L&I table): kept out of the hourly tool. */
export const WA_SQFT = ['0540', '0541', '0550', '0551'];
const WA_ALL = W.classes as Record<string, WaClass>;
export const WA: Record<string, WaClass> = Object.fromEntries(Object.entries(WA_ALL).filter(([k]) => !WA_SQFT.includes(k)));
export const RULES: Record<string, Rule> = P.rules as unknown as Record<string, Rule>;
export const CHANGES = P.changes;
export const DCBS_RETRIEVED: string = D.retrieved_at;
export const STATE_CODES = Object.keys(NAMES).sort((a, b) => NAMES[a].localeCompare(NAMES[b]));
export const N_STATES = STATE_CODES.length;

export const stateName = (st: string) => NAMES[st] ?? st;
export function classOf(code: string): ClassRow {
  const c = CLASSES.find((x) => x.code === code);
  if (!c) throw new Error(`Class ${code} not in the study`);
  return c;
}
/** Rate per $100 of payroll for a class in a state, January 1, 2024; null where the state has no comparable class. */
export const rate = (code: string, st: string): number | null => classOf(code).rows[st]?.[1] ?? null;
export const rankOf = (code: string, st: string): number | null => classOf(code).rows[st]?.[0] ?? null;
/** States where the class has a rate. */
export const statesWith = (code: string) => STATE_CODES.filter((s) => rate(code, s) !== null);

export function premium(payroll: number, ratePer100: number, mod = 1): number {
  return (Math.max(0, payroll) / 100) * Math.max(0, ratePer100) * Math.max(0, mod);
}

/** The 51 jurisdictions for one class, most expensive first. */
export function classRanking(code: string) {
  const c = classOf(code);
  const list = Object.entries(c.rows).map(([st, [rank, r]]) => ({ st, rank, rate: r })).sort((a, b) => a.rank - b.rank);
  const rates = list.map((x) => x.rate).sort((a, b) => a - b);
  const median = rates.length % 2 ? rates[(rates.length - 1) / 2] : (rates[rates.length / 2 - 1] + rates[rates.length / 2]) / 2;
  return { list, median, high: list[0], low: list[list.length - 1], count: list.length, missing: c.na };
}

/** The 53 classes of one state, with their rank among the states that price them. */
export function stateClasses(st: string) {
  return CLASSES.map((c) => ({ code: c.code, short: c.short, rate: rate(c.code, st), rank: rankOf(c.code, st), of: Object.keys(c.rows).length }))
    .filter((x) => x.rate !== null) as Array<{ code: string; short: string; rate: number; rank: number; of: number }>;
}

/** Index ranking of the 51 jurisdictions (rank 1 = highest). */
export const indexRanking = () => STATE_CODES.map((st) => ({ st, ...STATES[st] })).sort((a, b) => a.rank - b.rank);

/** Ratio of the state's rate to another state's for the same class (how many times more). */
export function compare(code: string, a: string, b: string) {
  const ra = rate(code, a), rb = rate(code, b);
  if (ra === null || rb === null) return null;
  return { a: ra, b: rb, ratio: rb === 0 ? null : ra / rb };
}

/** Experience modification: premium with the mod against the same premium at 1.00. */
export function modEffect(manualPremium: number, mod: number) {
  const withMod = manualPremium * mod;
  return { withMod, diff: withMod - manualPremium, pct: mod - 1 };
}

/** Cost per employee and per hour of a premium. */
export function perHead(premiumYear: number, employees: number, hoursEach: number) {
  const e = Math.max(1, employees);
  return { perEmployee: premiumYear / e, perMonth: premiumYear / e / 12, perHour: hoursEach > 0 ? premiumYear / e / hoursEach : 0 };
}

/** Washington state fund: the hourly rate, the part the employer may deduct from pay, and the employer's part. */
export function waCost(code: string, hours: number, year: 2026 | 2027 = 2026) {
  const c = WA[code];
  if (!c) throw new Error(`Washington class ${code}`);
  const comp = year === 2026 ? c.comp2026 : c.comp2027, ded = year === 2026 ? c.ded2026 : c.ded2027;
  return { comp, ded, employerHour: comp - ded, total: comp * hours, worker: ded * hours, employer: (comp - ded) * hours, change: c.comp2027 / c.comp2026 - 1, desc: c.desc, group: c.group };
}

export type Need = 'required' | 'not-required' | 'optional' | 'unknown';
/** Does a state's rule, as read on its site, require coverage for this employer? */
export function required(st: string, employees: number, construction: boolean, payrollLastYear: number): { need: Need; rule: Rule | null } {
  const r = RULES[st];
  if (!r) return { need: 'unknown', rule: null };
  if (r.kind === 'optional') return { need: 'optional', rule: r };
  if (employees < 1) return { need: 'not-required', rule: r };
  if (r.kind === 'all') return { need: 'required', rule: r };
  if (r.kind === 'payroll') return { need: payrollLastYear >= (r.payrollMin ?? 0) ? 'required' : 'not-required', rule: r };
  // Wisconsin: one employee paid $500 in a calendar quarter is enough (payroll spread evenly over four quarters).
  if (r.quarterPay && payrollLastYear / 4 >= r.quarterPay) return { need: 'required', rule: r };
  const min = construction && r.constr ? r.constr : (r.min ?? 1);
  if (employees < min) return { need: 'not-required', rule: r };
  if (r.payrollMin && payrollLastYear < r.payrollMin) return { need: 'not-required', rule: r };
  return { need: 'required', rule: r };
}

/** A premium moved by an announced average change (a percent). */
export const applyChange = (premiumYear: number, pctChange: number) => premiumYear * (1 + pctChange / 100);

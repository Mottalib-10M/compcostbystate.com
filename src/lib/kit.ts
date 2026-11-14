/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.rate(code, st), K.rank(code, st)   class rate per $100 and rank (Oregon DCBS study, January 1, 2024)
 *   K.S(st)                              state index row { index, rank, rank2022, pctMedian, effective }
 *   K.R(code)                            class ranking { list, median, high, low, count, missing }
 *   K.prem(payroll, rate, mod)           premium
 *   K.WA(code, hours, year)              Washington state fund cost
 *   K.CH, K.RULES, K.GA                  announced changes, coverage rules, Georgia penalty (params-2026.json)
 *   K.EX                                 the one example case of the whole site
 *   K.M                                  market: state funds, shares of costs, cost per $100 of wages 2022 (NASI)
 *   formats                              K.usd, K.r100 ("$1.09"), K.r4, K.num, K.dec, K.ord(3) "3rd", K.day
 */
import P from '../data/params-2026.json';
import { usd, r100, r4, longDate, ordinal, EX } from './tool-specs';
import { formatNumber, formatDecimal } from './format';
import * as E from './engine/comp';
import * as M from './engine/market';

export const KIT = {
  P, EX, MEDIAN: E.MEDIAN, N: E.N_STATES, NCLASS: E.CLASSES.length, CH: E.CHANGES, RULES: E.RULES, GA: P.gaPenalty, NWA: Object.keys(E.WA).length,
  rate: (code: string, st: string) => { const r = E.rate(code, st); if (r === null) throw new Error(`no rate ${code} ${st}`); return r; },
  rank: (code: string, st: string) => { const r = E.rankOf(code, st); if (r === null) throw new Error(`no rank ${code} ${st}`); return r; },
  S: (st: string) => E.STATES[st], R: E.classRanking, name: E.stateName, cls: E.classOf, prem: E.premium, WA: E.waCost, WAC: E.WA, WASQ: E.WA_SQFT,
  stateClasses: E.stateClasses, index: E.indexRanking, req: E.required, per: E.perHead,
  usd, r100, r4, ord: ordinal, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate,
  pct: (x: number, d = 0) => `${formatNumber(x, d)}%`,
  /** Market and total cost by state (NASI 2022, DCBS appendixes 4 and 5): K.M.MARKET[st], K.M.shares(st), K.M.costRanking(). */
  M,
};
export type Kit = typeof KIT;

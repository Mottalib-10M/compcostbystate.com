/**
 * Who insures employers in each state, and what workers' compensation costs them in total. Data: market-2022.json,
 * built by scripts/data/build-market.py from two public reports:
 *   NASI, Workers' Compensation: Benefits, Costs, and Coverage, 2022 data (state summaries, November 2024): employer
 *   costs per $100 of covered wages, costs paid to private carriers, state funds and self-insurance, in thousands;
 *   Oregon DCBS 2024 study, appendix 4 (rating organization) and appendix 5 (2023 assigned risk pool, from NCCI).
 * Kentucky and Louisiana carry a duplicated table in the NASI report: their cost figures are left out (dup).
 */
import M from '../../data/market-2022.json';
import { NAMES } from './comp';

export type Fund = 'exclusive' | 'competitive' | 'public-only' | 'none';
export interface MarketRow {
  fund: Fund; bureau: 'ncci' | 'independent' | 'monopolistic'; dup: boolean;
  cost100?: number; cost100_2018?: number; ben100?: number; workersK?: number; costTotalK?: number; sfK?: number; pcK?: number; siK?: number;
  arp?: { pct: number | null; risks: number | null };
}
export const MARKET: Record<string, MarketRow> = M.states as unknown as Record<string, MarketRow>;
export const US = M.us;
export const ARP_AVG = M.arpAvg as { pct: number; risks: number };
export const COMPETITIVE: string[] = M.competitive;
export const EXCLUSIVE: string[] = M.exclusive;
export const MARKET_RETRIEVED: string = M.retrieved_at;

/** Shares of 2022 employer costs: private carriers, state fund, self-insurance (0..1), or null when not shown. */
export function shares(st: string) {
  const x = MARKET[st];
  if (!x || x.dup || !x.costTotalK) return null;
  return { private: (x.pcK ?? 0) / x.costTotalK, fund: (x.sfK ?? 0) / x.costTotalK, self: (x.siK ?? 0) / x.costTotalK };
}
/** States with a published 2022 cost, cheapest first. */
export const costRanking = () => Object.keys(MARKET).filter((s) => MARKET[s].cost100 !== undefined)
  .map((st) => ({ st, cost100: MARKET[st].cost100!, cost100_2018: MARKET[st].cost100_2018!, fund: MARKET[st].fund }))
  .sort((a, b) => a.cost100 - b.cost100 || NAMES[a.st].localeCompare(NAMES[b.st]));
/** Where an employer of this state can buy coverage, in plain words. */
export function whereToBuy(st: string): string {
  switch (MARKET[st]?.fund) {
    case 'exclusive': return 'The state fund only, or self-insurance with state approval: private insurers do not sell standard coverage';
    case 'competitive': return 'A private insurer, the state fund, which competes with them, or self-insurance with state approval';
    case 'public-only': return 'A private insurer or self-insurance; the state fund insures public employers only';
    default: return 'A private insurer or self-insurance with state approval; there is no state fund';
  }
}
export const FUND_LABEL: Record<Fund, string> = { exclusive: 'Exclusive state fund', competitive: 'Competitive state fund', 'public-only': 'State fund for public employers', none: 'No state fund' };
/** Implied rate per $100 of a quoted premium: premium / (payroll / 100) / mod. */
export function impliedRate(premiumYear: number, payroll: number, mod = 1): number {
  if (payroll <= 0 || mod <= 0) return 0;
  return premiumYear / (payroll / 100) / mod;
}

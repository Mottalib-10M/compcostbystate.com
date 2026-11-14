/** Engine tests: values locked on the published tables (Oregon DCBS 2024 study, Washington L&I 2026). */
import { describe, expect, it } from 'vitest';
import { rate, rankOf, premium, classRanking, stateClasses, indexRanking, modEffect, perHead, waCost, required, applyChange, MEDIAN, N_STATES, CLASSES, WA, WA_SQFT } from '../src/lib/engine/comp';
import { getTool, TOOL_KINDS } from '../src/lib/tool-specs';

describe('Oregon DCBS study, rates in effect on January 1, 2024', () => {
  it('51 jurisdictions, 53 classes, median index $1.09', () => {
    expect(N_STATES).toBe(51);
    expect(CLASSES).toHaveLength(53);
    expect(MEDIAN).toBe(1.09);
  });
  it('index: Hawaii highest, North Dakota lowest', () => {
    const r = indexRanking();
    expect(r[0]).toMatchObject({ st: 'HI', index: 2.52, rank: 1 });
    expect(r[r.length - 1]).toMatchObject({ st: 'ND', index: 0.5, rank: 51 });
  });
  it('class rates as published (appendix 6)', () => {
    expect(rate('8810', 'HI')).toBe(0.48);
    expect(rate('5551', 'GA')).toBe(28.84);
    expect(rankOf('5551', 'GA')).toBe(1);
    expect(rate('5645', 'GA')).toBe(38.79);
    expect(rate('5190', 'CA')).toBe(2.78);
    expect(rate('8864', 'TX')).toBeNull();
  });
  it('every class: ranks 1..n continuous, rates not increasing with rank, N/A states left out', () => {
    for (const c of CLASSES) {
      const k = classRanking(c.code);
      expect(k.list.map((x) => x.rank)).toEqual(k.list.map((_, i) => i + 1));
      for (let i = 1; i < k.list.length; i++) expect(k.list[i].rate).toBeLessThanOrEqual(k.list[i - 1].rate);
      expect(k.count + k.missing.length).toBe(51);
    }
  });
  it('a state lists only the classes it prices', () => {
    expect(stateClasses('TX')).toHaveLength(52);
    expect(stateClasses('CA')).toHaveLength(53);
  });
});

describe('premium arithmetic', () => {
  it('payroll / 100 x rate x mod', () => {
    expect(premium(300000, 2.78)).toBeCloseTo(8340, 6);
    expect(premium(300000, 2.78, 0.85)).toBeCloseTo(7089, 6);
    expect(premium(-5, 2)).toBe(0);
  });
  it('mod effect and cost per head', () => {
    expect(modEffect(10000, 1.25)).toMatchObject({ withMod: 12500, diff: 2500 });
    const h = perHead(8340, 5, 2000);
    expect(h.perEmployee).toBeCloseTo(1668, 6);
    expect(h.perHour).toBeCloseTo(0.834, 6);
  });
  it('announced change', () => { expect(applyChange(10000, 6.6)).toBeCloseTo(10660, 6); });
});

describe('Washington state fund', () => {
  it('clerical 4904 in 2026: $0.2223 an hour, up to $0.1007 from pay', () => {
    const c = waCost('4904', 1000);
    expect(c.comp).toBe(0.2223);
    expect(c.ded).toBe(0.1007);
    expect(c.employer + c.worker).toBeCloseTo(c.total, 9);
  });
  it('wallboard classes priced per square foot are left out', () => { for (const k of WA_SQFT) expect(WA[k]).toBeUndefined(); });
});

describe('coverage rules read on state sites', () => {
  it('thresholds', () => {
    expect(required('FL', 3, false, 0).need).toBe('not-required');
    expect(required('FL', 1, true, 0).need).toBe('required');
    expect(required('GA', 3, false, 0).need).toBe('required');
    expect(required('GA', 2, false, 0).need).toBe('not-required');
    expect(required('MO', 1, true, 0).need).toBe('required');
    expect(required('TX', 50, false, 0).need).toBe('optional');
    expect(required('KS', 2, false, 20000).need).toBe('not-required');
    expect(required('KS', 2, false, 20001).need).toBe('required');
    expect(required('SC', 5, false, 2000).need).toBe('not-required');
    expect(required('WI', 1, false, 2400).need).toBe('required');
    expect(required('NY', 10, false, 0).need).toBe('unknown');
  });
});

describe('calculators', () => {
  it('every calculator runs on its defaults without NaN', () => {
    for (const k of TOOL_KINDS) {
      const s = getTool(k);
      const v = Object.fromEntries(s.inputs.map((i) => [i.id, i.def]));
      const out = s.run(v);
      expect(JSON.stringify(out), k).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
});

describe('naive testers, 2026-11-14', () => {
  const run = (kind: string, arg: Record<string, string | number>) => { const t = getTool(kind, arg); return t.run(Object.fromEntries(t.inputs.map((i) => [i.id, i.def]))); };
  it('class page: the big figure is the premium of the state asked, shown in the fields, not a national range', () => {
    const t = getTool('rank', { code: '5645', st: 'PA', pay: 300000 });
    const st = t.inputs.find((i) => i.id === 'st')!;
    expect(st.adv).toBeFalsy();
    const o = run('rank', { code: '5645', st: 'PA', pay: 300000 });
    expect(o.value).toBe('$44,130');
    expect(o.value).not.toMatch(/ to /);
    const range = o.rows.find(([l]) => /cheapest to the most expensive/.test(l))![1];
    const [lo, hi] = range.match(/\$[\d.]+/g)!.map((x) => Number(x.slice(1)));
    expect(lo).toBeLessThan(hi);
  });
  it('state page: the index is never multiplied by a payroll', () => {
    for (const k of ['state', 'index']) {
      const o = run(k, { st: 'CA', pay: 300000 });
      expect(o.rows.map((r) => r[0]).join(' ')).not.toMatch(/Index on/);
      expect(o.rows.map((r) => r[1]).join(' ')).not.toContain('$5,580');
    }
    expect(run('state', { st: 'CA', pay: 300000 }).value).toBe('$8,340');
  });
  it('class names in plain words: no NOC, no cut abbreviations', () => {
    for (const c of CLASSES) expect(c.short).not.toMatch(/\bNOC\b|Employ$|Nonmech|Refrig/);
  });
});

describe('Naive testers 2026-11-14, third pass', () => {
  const run = (kind: string, arg: Record<string, string | number> = {}) => { const t = getTool(kind, arg); return t.run(Object.fromEntries(t.inputs.map((i) => [i.id, i.def]))); };
  it('the state index is never shown in dollars', () => {
    const o = run('index', { st: 'HI' });
    expect(o.table!.headers.join(' ')).not.toMatch(/\$/);
    expect(o.rows.map((r) => r.join(' ')).join(' ')).not.toMatch(/\$2\.52/);
  });
  it('cost per employee says where the payroll comes from', () => {
    const o = run('perEmployee', { code: '5190', st: 'CA' });
    expect(o.rows[0][0]).toBe('Whole payroll (5 × $60,000)');
    expect(o.rows[0][1]).toBe('$300,000');
  });
  it('class codes are printed on four digits, the claims score as 1.00', () => {
    const t = getTool('all');
    expect(t.inputs.find((i) => i.id === 'code')!.kind === 'select' && (t.inputs.find((i) => i.id === 'code') as { options: { label: string }[] }).options.some((o) => o.label.endsWith('(0005)'))).toBe(true);
    expect(t.inputs.find((i) => i.id === 'mod')).toMatchObject({ label: 'Past injury claims score', fixed: true, decimals: 2 });
  });
  it('home example: $8,340 a year, rate also as a share of wages', () => {
    const o = run('all');
    expect(o.value).toBe('$8,340');
    expect(o.sub).toContain('(2.8% of wages)');
  });
});

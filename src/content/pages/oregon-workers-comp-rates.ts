import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'OR', S = K.S(ST), O = K.P.orStudy, C = K.CH.or2027;
const r = (c: string) => K.rate(c, ST);
const PAY = 250000, HOURS = 5 * 2000;

export default definePage({
  id: 'oregon-workers-comp-rates', group: 'states', order: 25, slug: 'oregon-workers-comp-rates',
  nav: 'Oregon', card: 'Oregon’s rates by class, its 2027 pure premium and assessments, and its long fall since 2018.',
  title: 'Oregon Workers Comp Rates 2026: Classes and 2027 Change',
  description: 'Oregon workers comp rates in 2026: 38th of 51 in the state study, class rates per $100 of payroll, and the 2027 pure premium increase of 2.1% with assessments.',
  h1: 'Oregon workers’ comp rates by class, and the 2027 change',
  intro: 'Oregon workers’ comp rates for each class of the state’s own study, with the premium on the payroll you enter.',
  resume: `Oregon runs the national comparison of workers’ compensation rates, and it fares well in it. In the Department of Consumer and Business Services study of rates in effect on January 1, 2024, Oregon’s index was ${K.r100(S.index)} per $100 of payroll, ${K.pct(S.pctMedian)} of the national median, ranking ${K.ord(S.rank)} of ${K.N}; it was ${K.r100(O.index2022)} and ${K.ord(S.rank2022)} in the previous study. Its payroll-weighted pure premium, the part meant to pay claims, fell ${K.pct(-O.ppChange, 1)} to ${K.r100(O.purePremium)}, the lowest since the study began, while the average multiplier insurers add rose ${K.pct(O.lcmChange, 1)} to ${K.dec(O.lcm, 3)}. For 2027 the department raises the average pure premium ${K.pct(C.purePremiumPct, 1)}, citing Senate Bill 1519, which increased benefits for injured workers; the pure premium is still ${K.pct(-C.since2018, 1)} below 2018. The premium assessment stays at ${K.pct(C.assessmentPct, 1)}, and the Workers’ Benefit Fund assessment rises to ${K.dec(C.wbfCents)} cents per hour worked, plus a new ${K.dec(C.boliCents)} cent for the BOLI Expenses Fund. Office work cost ${K.r100(r('8810'))} per $100 in the study.`,
  faqs: [
    { q: 'What is the Workers’ Benefit Fund assessment in Oregon?', a: `A charge per hour worked, ${K.dec(C.wbfCents)} cents in 2027, that funds return-to-work programs, increases benefits over time for permanently and totally disabled workers, and pays benefits to families of workers who die from workplace injuries or diseases. A new BOLI Expenses Fund component adds ${K.dec(C.boliCents)} cent per hour in 2027.`, open: true },
    { q: 'Why did Oregon’s rank rise if its rates fell?', a: `Because the ranking is relative. Oregon’s index fell from ${K.r100(O.index2022)} to ${K.r100(S.index)} between the two studies, but rates fell faster elsewhere, so Oregon moved from ${K.ord(S.rank2022)} to ${K.ord(S.rank)}. The department notes that these rank changes do not reflect increases in Oregon’s workers’ compensation costs.` },
    { q: 'Who sells workers’ comp in Oregon?', a: `Several insurers compete in Oregon’s market, SAIF Corporation among them. In the study, the ${O.insurers} largest insurers including SAIF held ${O.insurerShare}% of Oregon’s market, and their premium-weighted average loss cost multiplier was ${K.dec(O.lcm, 3)}. Some employers self-insure instead, and pay a premium assessment of their own.` },
  ],
  body: (h) => `
<h2>Oregon workers’ comp rates in its own study</h2>
<p>Oregon chose the ${K.NCLASS} classes of the study from its own payroll, so every class in the table under the calculator matters to Oregon employers. Its index has ranged from ${K.pct(O.peakPct)} of the national median in ${O.peakYear} to ${K.pct(O.lowPct)} in ${O.lowYear}, and stood at ${K.pct(S.pctMedian)} in 2024 (${h.src('dcbs_2024', 'Oregon DCBS')}). The department adds that Oregon employers in the voluntary market paid the ${K.ord(O.voluntaryLowRank)} lowest rates in the nation.</p>
${h.table(['Class', 'Work', 'Oregon per $100', 'Rank of 51', `Premium on ${K.usd(PAY)}`], ['8810', '9082', '8017', '5190', '5645', '5551', '2702'].map((c) => [c, K.cls(c).short, K.r100(r(c)), String(K.rank(c, ST)), K.usd(K.prem(PAY, r(c)))]), 'Oregon in the study of rates in effect on January 1, 2024', ['l', 'l', 'r', 'r', 'r'])}
${h.mini('change', { t: 'Apply the 2027 Oregon change to your premium', p: ['prem'], d: { ch: 'or', prem: 8000 } })}
<h2>What changes in 2027</h2>
<p>The Department of Consumer and Business Services publishes the cost of coverage for the coming year in three parts (${h.src('or_cost', 'Oregon workers’ compensation costs')}). The pure premium rises ${K.pct(C.purePremiumPct, 1)} on average. The premium assessment, which covers the cost of administering workers’ compensation and worker safety programs, stays at ${K.pct(C.assessmentPct, 1)} of premium for insured employers. The Workers’ Benefit Fund assessment rises to ${K.dec(C.wbfCents)} cents per hour worked, with ${K.dec(C.boliCents)} cent more for the new BOLI Expenses Fund.</p>
<p>The hourly charges add up for a small crew: ${K.num(HOURS)} hours a year at ${K.dec(C.wbfCents + C.boliCents)} cents is ${K.usd((HOURS * (C.wbfCents + C.boliCents)) / 100)}. The ${h.a('workers-comp-rate-changes', 'rate change page')} sets Oregon beside California and Washington, and the ${h.a('workers-comp-rates-by-state', 'state ranking')} shows the ${K.N} jurisdictions on the index.</p>
<h2>Where Oregon ranks higher</h2>
<p>Oregon’s low index hides a few classes in the upper half of the table. Planing and molding mills (2731) ranked ${K.ord(K.rank('2731', ST))} at ${K.r100(r('2731'))}, wholesale stores (8018) ${K.ord(K.rank('8018', ST))} at ${K.r100(r('8018'))}, veneer products (2915) ${K.ord(K.rank('2915', ST))} and roofing ${K.ord(K.rank('5551', ST))} at ${K.r100(r('5551'))}. At the other end, Oregon was among the cheapest states for electrical wiring, plumbing and clerical office work. Wood products are where its rates come closest to the national middle.</p>
<h2>Oregon beside its neighbors</h2>
<p>Washington’s index was ${K.r100(K.S('WA').index)} and California’s ${K.r100(K.S('CA').index)}, both well above Oregon; Idaho’s was ${K.r100(K.S('ID').index)} and Nevada’s ${K.r100(K.S('NV').index)}. Washington prices by the hour through its state fund, so an Oregon contractor with a crew across the Columbia River deals with two systems as well as two price levels.</p>
<h2>Self-insured employers</h2>
<p>The 2027 premium assessment differs by type of employer. Insured employers pay ${K.pct(C.assessmentPct, 1)}; self-insured employers and public-sector self-insured groups pay ${K.pct(C.selfInsuredPct, 1)}; private-sector self-insured groups pay ${K.pct(C.selfGroupsPct, 1)}, according to the department. The Workers’ Benefit Fund charge per hour applies to all.</p>
<h2>An Oregon example: a restaurant</h2>
<p>A restaurant with ten employees and ${K.usd(PAY)} of payroll would pay about ${K.usd(K.prem(PAY, r('9082')))} a year at Oregon’s rate for class 9082, ${K.r100(r('9082'))} per $100, against ${K.usd(K.prem(PAY, K.rate('9082', 'CA')))} at California’s. If its staff work ${K.num(15000)} hours in 2027, the Workers’ Benefit Fund and BOLI charges add ${K.usd((15000 * (C.wbfCents + C.boliCents)) / 100)} on top.</p>
<h2>How the study is built from Oregon’s payroll</h2>
<p>Because Oregon runs the study, its classes set the comparison. The department ranked Oregon’s classes by claims cost, kept the largest, replaced Oregon’s own restaurant class with the four classes other states use, and ended with ${K.NCLASS} classes that make up most of Oregon’s payroll and losses. Every other state is then priced on that Oregon mix. For an Oregon employer, the index is therefore an unusually close picture of the price level it faces, much closer than for an employer in any other state.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['workers-comp-rate-changes', 'workers-comp-rates-by-state', 'washington-workers-comp-rates', 'class-code-8810'],
  sources: ['dcbs_2024', 'or_cost', 'dcbs_page'],
});

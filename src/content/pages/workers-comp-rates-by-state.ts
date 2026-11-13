import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const idx = K.index();
const HI = K.S('HI'), ND = K.S('ND'), CA = K.S('CA'), OR = K.S('OR'), WA = K.S('WA'), GA = K.S('GA');
const top = idx[0], bottom = idx[idx.length - 1];
const above = idx.filter((x) => x.index > K.MEDIAN).length, below = idx.filter((x) => x.index < K.MEDIAN).length;
const up = idx.filter((x) => x.rank < x.rank2022).length, down = idx.filter((x) => x.rank > x.rank2022).length;
const PAY = 500000;
const sorted = idx.map((x) => x.index).sort((a, b) => a - b);
const q1 = sorted[Math.floor(sorted.length / 4)], q3 = sorted[Math.floor((sorted.length * 3) / 4)];
const jumps = [...idx].sort((a, b) => (b.rank2022 - b.rank) - (a.rank2022 - a.rank));
const CO = K.S('CO');

export default definePage({
  id: 'workers-comp-rates-by-state', group: 'cost', order: 1, slug: 'workers-comp-rates-by-state',
  nav: 'Rates by state: the 51 ranking', card: 'The premium index of every state and DC, its rank and its distance from the median.',
  title: 'Workers Comp Rates by State 2026: 51-State Index Ranking',
  description: 'Workers comp rates by state in 2026: the premium index of 50 states and DC per $100 of payroll, rank, change since 2022 and distance from the $1.09 median.',
  h1: 'Workers’ comp rates by state: the 51-state ranking',
  intro: 'Workers’ comp rates by state, on one basis: pick a state to see its premium index per $100 of payroll, its rank among 51 jurisdictions and the full table.',
  resume: `The premium index of the Oregon Department of Consumer and Business Services is the only public comparison of workers’ compensation rates across all ${K.N} jurisdictions on one basis. Its latest edition priced the same ${K.NCLASS} classes of work in each state with the rates in effect on January 1, 2024, added insurer expense loads and state assessments, and weighted the classes by Oregon’s payroll. The median state came out at ${K.r100(K.MEDIAN)} per $100 of payroll. ${K.name(top.st)} was the highest at ${K.r100(HI.index)}, ${K.pct(HI.pctMedian)} of the median, and ${K.name(bottom.st)} the lowest at ${K.r100(ND.index)}, ${K.pct(ND.pctMedian)} of it: a factor of five between the two ends. California ranked ${K.ord(CA.rank)} at ${K.r100(CA.index)}, Washington ${K.ord(WA.rank)} at ${K.r100(WA.index)}, Georgia sat exactly at the median and Oregon ranked ${K.ord(OR.rank)} at ${K.r100(OR.index)}. The index is a price level for comparing states. Multiply your payroll by your own class rate, not by the index.`,
  faqs: [
    { q: 'Which state has the most expensive workers’ comp?', a: `Hawaii, with an index of ${K.r100(HI.index)} per $100 of payroll in the study of rates in effect on January 1, 2024, followed by ${K.name(idx[1].st)} at ${K.r100(idx[1].index)} and ${K.name(idx[2].st)} at ${K.r100(idx[2].index)}. Hawaii also tops the study for many single classes, such as clerical office work and trucking.`, open: true },
    { q: 'What does an index of $1.09 per $100 mean?', a: `That a payroll spread across the ${K.NCLASS} study classes like Oregon’s payroll would cost $1.09 for each $100 of wages at the median state’s rates. On ${K.usd(PAY)} of such payroll, that is ${K.usd(K.prem(PAY, K.MEDIAN))} a year. No single business has that exact mix, so use your class rate for a budget.` },
    { q: 'How often is the state ranking published?', a: 'The Oregon department has run the study since 1986 and now publishes it every two years. The edition used here compares rates in effect on January 1, 2024 and was published in June 2025. The next edition will look at rates in effect at the start of 2026.' },
    { q: 'Can a state rank change without its rates moving?', a: `Yes. The rank compares states with one another, so it moves when other states cut or raise their rates faster. Oregon’s own index fell from $0.93 to ${K.r100(OR.index)} between the two studies, yet its rank moved from ${K.ord(OR.rank2022)} to ${K.ord(OR.rank)} because others fell further.` },
  ],
  body: (h) => `
<h2>How the 51 jurisdictions compare</h2>
<p>${above} jurisdictions sit above the median of ${K.r100(K.MEDIAN)} and ${below} below it. The spread is wide at both ends and narrow in the middle: the middle half of the jurisdictions falls between ${K.r100(q1)} and ${K.r100(q3)}. Coastal and northeastern states fill the top of the table: Hawaii, New Jersey, New York, California, Vermont and Connecticut. The bottom belongs to North Dakota, Arkansas, West Virginia, Utah, Ohio and Arizona.</p>
<p>Compared with the previous study, ${up} jurisdictions moved up the ranking (toward the expensive end) and ${down} moved down. A move up does not mean rates rose: the study notes that national rates kept falling, so a state that cut less than others climbs. The largest jumps were ${K.name(jumps[0].st)}, from ${K.ord(CO.rank2022)} to ${K.ord(CO.rank)}, and ${K.name(jumps[1].st)}, from ${K.ord(WA.rank2022)} to ${K.ord(WA.rank)}.</p>
${h.mini('index', { t: 'Where your state ranks', p: ['st'], d: { st: 'GA', pay: PAY } })}
<h2>Why workers’ comp rates by state differ so much</h2>
<p>The study lists the causes without ranking them (${h.src('dcbs_2024', 'Oregon DCBS')}): benefit laws that pay more or longer in some states, medical fee schedules, how often and how long claims run, the share of the market held by a state fund or a residual market for hard-to-place employers, the expense and profit load insurers add, and the taxes and assessments each state charges to fund its agency and special funds. Two states with the same claims can therefore show quite different rates.</p>
<p>The industry mix of a state does not explain the ranking, by design. Every state is priced on the same set of classes, weighted by Oregon’s payroll, so a state full of offices and a state full of sawmills are compared on the same work. That is also why the index is not the average premium actually paid in a state: the real mix differs.</p>
<h2>What the index leaves out</h2>
<p>The figures are averages across insurers. In states where insurers file their own multiplier on the bureau rate, the study used a premium-weighted average of the largest insurers, covering at least 60% of the market. Your own insurer can sit well above or below. Schedule credits, the experience modification, premium discounts for large accounts, minimum premiums for small ones and policy fees are not in the index.</p>
<p>The dates also differ by state. Each state’s rates are those in effect on January 1, 2024, which some states adopted months earlier: California’s rates dated from ${CA.effective}, Georgia’s from ${GA.effective}. The calculator shows each state’s date.</p>
<p>For a budget, go from the index to your class. The ${h.a('workers-comp-class-codes', 'class code page')} lists the ${K.NCLASS} classes of any state, and the ${h.a('how-much-does-workers-comp-cost', 'cost guide')} turns a class rate into a premium per employee. State pages go further for ${h.a('california-workers-comp-rates', 'California')}, ${h.a('texas-workers-comp-rates', 'Texas')}, ${h.a('florida-workers-comp-rates', 'Florida')}, ${h.a('georgia-workers-comp-rates', 'Georgia')}, ${h.a('pennsylvania-workers-comp-rates', 'Pennsylvania')} and ${h.a('oregon-workers-comp-rates', 'Oregon')}.</p>
<h2>Using the ranking for a business in several states</h2>
<p>Workers’ compensation follows the state where the work is done. A business with crews in New Jersey (${K.r100(K.S('NJ').index)}), Pennsylvania (${K.r100(K.S('PA').index)}) and Ohio (${K.r100(K.S('OH').index)}) pays three price levels on three slices of payroll, and its policy lists each state. The index gives a first idea of where a new job or a new branch will cost more. For the real difference, compare your own class in both states with the class calculator: for some trades the order of two states is the reverse of their index order.</p>
`,
  tool: 'index', toolArg: { st: 'CA', pay: PAY },
  related: ['workers-comp-class-codes', 'how-much-does-workers-comp-cost', 'california-workers-comp-rates', 'workers-comp-requirements-by-state'],
  sources: ['dcbs_2024', 'dcbs_page'],
});

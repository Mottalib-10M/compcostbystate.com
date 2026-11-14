import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'FL', S = K.S(ST);
const r = (c: string) => K.rate(c, ST);
const PAY = 200000;
const trades = ['5183', '5190', '5213', '5403', '5474', '5537', '5551', '5645', '6217'];
const dear = [...K.stateClasses(ST)].sort((a, b) => b.rate - a.rate)[0];

export default definePage({
  id: 'florida-workers-comp-rates', group: 'states', order: 22, slug: 'florida-workers-comp-rates',
  nav: 'Florida', card: 'Florida’s construction rule from one employee, its class rates and its place near the median.',
  title: 'Florida Workers Comp Rates 2026: Construction and Classes',
  description: 'Florida workers comp rates in 2026: index just under the median in the state study, the rate of each construction trade per $100 of payroll, who must cover.',
  h1: 'Florida workers’ comp rates: construction trades and other classes',
  intro: 'Florida workers’ comp rates for the classes of the Oregon state study, with the premium on the payroll you enter.',
  resume: `Florida draws a sharp line between construction and other work. The Division of Workers’ Compensation requires coverage in the construction industry from one employee, counting business owners who are corporate officers or members of a limited liability company, while other employers must cover from four employees, owners who are officers or members included. Farms must cover from six regular employees or twelve seasonal workers. Rates sit close to the middle of the country: in the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, Florida’s index was ${K.r100(S.index)} per $100 of payroll, ${K.pct(S.pctMedian)} of the national median of ${K.r100(K.MEDIAN)}, ranking ${K.ord(S.rank)} of ${K.N} after ${K.ord(S.rank2022)} in the previous study. The trades vary widely. Excavation (6217) cost ${K.r100(r('6217'))} per $100, the ${K.ord(K.rank('6217', ST))} highest in the country, while electrical wiring (5190) cost ${K.r100(r('5190'))} and roofing ${K.r100(r('5551'))}, below most states. On ${K.usd(PAY)} of house framing payroll, the study rate gives about ${K.usd(K.prem(PAY, r('5645')))} a year.`,
  faqs: [
    { q: 'Do Florida construction business owners need workers’ comp?', a: 'Owners who are corporate officers or members of a limited liability company (LLC) count as employees in Florida, so a construction business with one such owner working in it must carry coverage. The division says exemptions are available to owners who opt out of coverage for themselves and meet its requirements; its site has an exemption search. Check the conditions before relying on one.', open: true },
    { q: 'How many employees before Florida requires workers’ comp?', a: 'Four in most industries, one in construction, and six regular or twelve seasonal workers on farms, according to the Division of Workers’ Compensation. Sole proprietors and partners outside construction are not counted as employees unless they choose to be included on the policy.' },
    { q: 'Do out-of-state contractors need Florida coverage?', a: 'The division says out-of-state employers must notify their insurer that they are working in Florida. If their policy does not cover Florida, they must obtain a Florida policy from an approved carrier that meets Florida law, so a crew from Georgia or Alabama working a Florida job should check its policy before starting.' },
  ],
  body: (h) => `
<h2>Florida workers’ comp rates for construction trades</h2>
${h.table(['Class', 'Trade', 'Florida per $100', 'Rank of 51', `Premium on ${K.usd(PAY)}`], trades.map((c) => [c, K.cls(c).short, K.r100(r(c)), String(K.rank(c, ST)), K.usd(K.prem(PAY, r(c)))]), 'Florida construction classes in the study of rates in effect on January 1, 2024 (rank 1 = highest)', ['l', 'l', 'r', 'r', 'r'])}
<p>In Florida the most expensive class of the study was ${dear.short.toLowerCase()} (${dear.code}) at ${K.r100(dear.rate)} per $100 (${h.src('dcbs_2024', 'Oregon state study')}). Several trades rank high nationally, excavation and painting among them, while roofing ranks low. A contractor bidding in Florida and Georgia should not assume the two states price alike: Georgia’s roofing rate was ${K.r100(K.rate('5551', 'GA'))}, the highest in the country, against ${K.r100(r('5551'))} in Florida.</p>
${h.mini('rank', { t: 'Florida against other states for one trade', p: ['code'], d: { code: '6217', st: ST, pay: PAY } })}
<h2>Who must be covered in Florida</h2>
<p>The Division of Workers’ Compensation sets three thresholds (${h.src('fl_dwc', 'Florida Division of Workers’ Compensation')}). In construction, one or more employees, owners who are corporate officers or members of a limited liability company (LLC) included; the trades counted as construction are listed in the Florida Administrative Code. In other industries, four or more employees, with the same rule for owners; sole proprietors and partners outside construction are not employees unless they elect to be covered and file the form with the division. In agriculture, six regular employees or twelve seasonal workers who work more than 30 days in a season or 45 days in a calendar year.</p>
<p>Subcontractors matter too. The division states that when a subcontractor has no workers’ compensation insurance for its employees, those workers become the employees of the contractor, which then pays the benefits if one is injured. A Florida contractor should therefore keep proof of each subcontractor’s coverage or exemption. The ${h.a('workers-comp-requirements-by-state', 'requirements page')} sets Florida beside the other states read, and the ${h.a('how-much-does-workers-comp-cost', 'cost guide')} turns the class rates above into a cost per employee.</p>
<h2>Florida beside its neighbors</h2>
<p>Florida’s index of ${K.r100(S.index)} sits between Georgia’s ${K.r100(K.S('GA').index)} and Alabama’s ${K.r100(K.S('AL').index)}, all three close to the national median. The averages hide large gaps by class. For roofing, Georgia’s rate was more than eight times Florida’s; for excavation, Florida was the more expensive of the two at ${K.r100(r('6217'))} against ${K.r100(K.rate('6217', 'GA'))}. A contractor working both sides of the line should price each job with the rate of its own state.</p>
<h2>Outside construction</h2>
<p>Most Florida businesses are not builders, and for them the four-employee rule and lower rates apply. In the study, Florida’s rate for retail stores (8017) was ${K.r100(r('8017'))} per $100, for full-service restaurants (9082) ${K.r100(r('9082'))}, for clerical office work ${K.r100(r('8810'))} and for home health care (8835) ${K.r100(r('8835'))}. A restaurant with ${K.usd(PAY)} of payroll would pay about ${K.usd(K.prem(PAY, r('9082')))} a year at that rate, before its experience modification and the insurer’s pricing. The trades that count as construction for the one-employee rule are listed in rule 69L-6.021 of the Florida Administrative Code, which the division links from its page.</p>
<h2>Three employees, two answers</h2>
<p>Take two Florida businesses with three employees each. A retail shop is below the four-employee rule and need not carry coverage, unless its owners are corporate officers who bring the count to four. A three-person electrical contractor is in the construction industry and must be covered from the first employee. At the study rate for electrical wiring, ${K.r100(r('5190'))}, three electricians earning ${K.usd(50000)} each would cost about ${K.usd(K.prem(150000, r('5190')))} a year to insure, before the mod.</p>
<p>Florida’s rates in the study date from ${S.effective}.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['workers-comp-requirements-by-state', 'class-code-5645', 'georgia-workers-comp-rates', 'how-much-does-workers-comp-cost'],
  sources: ['dcbs_2024', 'fl_dwc'],
});

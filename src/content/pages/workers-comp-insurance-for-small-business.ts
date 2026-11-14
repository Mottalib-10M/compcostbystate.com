import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.M;
// A small retail shop in Georgia: 4 employees at $36,000 each, class 8017.
const SHOP = { code: '8017', st: 'GA', emp: 4, wage: 36000 };
const R = K.rate(SHOP.code, SHOP.st), P = K.prem(SHOP.emp * SHOP.wage, R), per = K.per(P, SHOP.emp, 2000);
const GA = M.MARKET.GA.arp!;
const smallBiz = [
  { k: 'Office, 3 people', code: '8810', pay: 150000 },
  { k: 'Retail store, 4 people', code: '8017', pay: 144000 },
  { k: 'Restaurant, 8 people', code: '9082', pay: 240000 },
  { k: 'Home healthcare, 5 people', code: '8835', pay: 175000 },
  { k: 'Plumber, 3 people', code: '5183', pay: 180000 },
];
const med = (code: string) => K.R(code).median;

export default definePage({
  id: 'workers-comp-insurance-for-small-business', group: 'insurance', order: 4, slug: 'workers-comp-insurance-for-small-business',
  nav: 'Small business', card: 'When a small business must buy workers’ comp, what a handful of employees costs and where to turn if insurers say no.',
  title: 'Workers Comp Insurance for Small Business 2026: Costs, Rules',
  description: 'Workers comp insurance for small business in 2026: the headcount that triggers coverage, the cost of 3 to 8 employees by trade, and the assigned risk pool.',
  h1: 'Workers’ comp insurance for small business: when and how much',
  intro: 'Workers’ comp insurance for a small business: enter your trade, state, headcount and a typical wage to see the yearly cost and the cost per employee.',
  resume: `For a small business, workers’ comp insurance raises two questions: from which hire it becomes compulsory, and what it costs. The first answer depends on the state. California, Colorado, Hawaii, Pennsylvania and most other states read here require it from the first employee; Georgia and Virginia from three, Florida and South Carolina from four outside construction, Missouri from five, and Texas leaves it to the employer. The second depends on the class of work far more than on headcount. At the average rates in effect on January 1, 2024 in the Oregon study, a Georgia retail store with ${SHOP.emp} employees paid ${K.usd(SHOP.wage)} each would pay about ${K.usd(P)} a year, or ${K.usd(per.perEmployee)} per employee. The same payroll in a restaurant or a building trade costs several times more. A young business with no claims history pays at an experience modification of 1.00, and if no insurer will write it, the state’s assigned risk plan or state fund must. In Georgia, ${K.num(GA.risks!)} employers were in the assigned risk pool in 2023.`,
  faqs: [
    { q: 'How many employees before a small business needs workers’ comp?', a: 'It depends on the state: one in California, Colorado, Hawaii, Montana, Pennsylvania and Washington, three in Georgia and Virginia, four in Florida and South Carolina, five in Missouri, and none required in Texas or South Dakota. Florida and Missouri drop to one employee in construction. The requirements page covers sixteen states read on their own sites.', open: true },
    { q: 'How much is workers’ comp for a business with five employees?', a: `It is the payroll times the rate of the trade. Five office employees earning ${K.usd(40000)} each cost about ${K.usd(K.prem(200000, med('8810')))} a year at the median state rate for clerical work; five plumbers on the same wages about ${K.usd(K.prem(200000, med('5183')))}. A quote then adds the insurer’s minimum premium and state charges.` },
    { q: 'Do part-time employees count for workers’ comp?', a: 'In the states read here that address it, yes: Georgia counts persons regularly employed, part-time or full time, and Hawaii one or more employees, full time or part time. Their wages enter the payroll on which the premium is calculated, so a part-time employee costs in proportion to the hours paid.' },
    { q: 'Can a new business get workers’ comp with no history?', a: 'Yes. Without enough premium history, the experience modification is 1.00 and the insurer prices from the class rate. A new business in a risky trade may be turned down by insurers, but the law still lets it buy coverage through the assigned risk plan or, in some states, the state fund acting as insurer of last resort.' },
  ],
  body: (h) => `
<h2>Workers’ comp insurance for small business: the first hire</h2>
<p>The day a small business hires, workers’ comp becomes a question of state law. In most states the answer is immediate: the first employee, part-time included, must be covered. A few states wait for a headcount, and two of the states this site has read leave it optional. The tool below applies the rule of each state read on its own site; the ${h.a('workers-comp-requirements-by-state', 'requirements page')} quotes them.</p>
${h.mini('required', { t: 'Is coverage required yet?', p: ['st', 'emp', 'con'], d: { st: 'FL', emp: 3, con: 'no' } })}
<p>Owners usually sit apart. Florida, for example, counts corporate officers and LLC members toward its threshold, but treats sole proprietors and partners outside construction as non-employees unless they choose to be included (${h.src('fl_dwc', 'Florida DWC')}). The ${h.a('workers-comp-insurance-for-self-employed', 'self-employed page')} goes through the owner rules.</p>
<h2>What a few employees cost, trade by trade</h2>
<p>For a small team, the class of work decides the bill. The table applies the median state rate of the Oregon study to typical small payrolls. It is an order of magnitude: your state can be well above or below the median, and the ${h.a('workers-comp-rates-by-state', 'state ranking')} shows where it stands.</p>
${h.table(['Business', 'Class', 'Payroll', 'Median rate', 'Yearly premium'], smallBiz.map((b) => [b.k, b.code, K.usd(b.pay), K.r100(med(b.code)), K.usd(K.prem(b.pay, med(b.code)))]), 'Small payrolls at the median state rate, rates in effect on January 1, 2024', ['l', 'l', 'r', 'r', 'r'])}
<p>At these sizes the insurer’s minimum premium and flat charges weigh more than they do for a large firm, so the real bill of a three-person office is often above the calculated premium. Each insurer files its own minimums; ask for them on the quote.</p>
<h2>When insurers say no: the assigned risk plan</h2>
<p>A small business in roofing, logging or trucking, or one that has had a serious claim, can be refused by insurers. The law does not let that business go uninsured, so each state has a residual market. In the states where NCCI manages it, the assigned risk pool held ${K.pct(M.ARP_AVG.pct, 1)} of premiums in 2023 on average, with ${K.num(M.ARP_AVG.risks)} employers per state (${h.src('dcbs_2024', 'Oregon DCBS, appendix 5')}). In states with a competitive state fund, such as California, the fund is often the last resort instead (${h.src('ca_dwc_faq', 'California DWC')}).</p>
<p>The pool is a fallback, not a sentence: an insurer of the voluntary market can take the business back at any renewal, and a claims record that improves year after year feeds a lower experience modification. The ${h.a('experience-modification-rate', 'mod page')} shows how claims enter the price.</p>
<h2>Deductibles: rarely for the smallest policies</h2>
<p>A deductible policy lowers the premium in exchange for the employer repaying the insurer for claims up to an agreed amount, which makes the employer partly self-insured. Private insurers may write such policies in 46 jurisdictions, but not in North Dakota, Ohio, Washington, Wisconsin or Wyoming, and state funds may write them in ten states (${h.src('nasi_2022', 'NASI')}). For a business with a handful of employees, one claim inside the deductible can cost more than the year’s saving, so read the amount per claim before choosing it.</p>
<h2>Paying for it without a shock</h2>
<p>A small business pays a deposit on its estimated payroll and settles at the audit after the year. Two habits keep the audit calm: put each employee in the right class, and report payroll changes to the insurer during the year. A small business that grows from three to eight employees mid-year owes premium on the larger payroll either way; spreading payments over the year spares it a large bill at the audit. The ${h.a('how-much-does-workers-comp-cost', 'cost per employee page')} turns a premium into a cost per head and per hour.</p>
`,
  tool: 'perEmployee',
  toolArg: { code: SHOP.code, st: SHOP.st, emp: SHOP.emp, wage: SHOP.wage },
  related: ['workers-comp-requirements-by-state', 'how-much-does-workers-comp-cost', 'workers-comp-insurance', 'workers-comp-insurance-for-self-employed'],
  sources: ['dcbs_2024', 'fl_dwc', 'ga_sbwc', 'ca_dwc_faq'],
});

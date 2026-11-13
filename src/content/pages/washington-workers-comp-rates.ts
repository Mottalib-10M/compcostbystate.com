import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const HRS = 2000, EMP = 5;
const pick = ['4904', '3905', '0601', '6110', '1102', '0507'];
const c = (code: string, y: 2026 | 2027 = 2026) => K.WA(code, EMP * HRS, y);
const frame = c('0510'), office = c('4904'), roof = c('0507');
const all = Object.keys(K.WAC);
const SQ = K.WASQ.length;
const rising = all.filter((k) => K.WAC[k].comp2027 > K.WAC[k].comp2026).length;
const WAS = K.S('WA');

export default definePage({
  id: 'washington-workers-comp-rates', group: 'cost', order: 6, slug: 'washington-workers-comp-rates',
  nav: 'Washington hourly rates', card: 'The 2026 and proposed 2027 state fund rate of every hourly Washington class, with the part taken from pay.',
  title: 'Washington Workers Comp Rates 2026: L&I Hourly Calculator',
  description: 'Washington workers comp rates for 2026 and proposed 2027: the L&I hourly rate of each risk class, the part taken from pay and the employer’s yearly cost.',
  h1: 'Washington workers’ comp rates per hour, 2026 and 2027',
  intro: 'Washington workers’ comp rates are hourly: pick the risk class on your L&I rate notice, the workers and their hours, and the calculator splits the yearly cost.',
  resume: `Washington does not allow private workers’ compensation insurance: an employer buys coverage from the state fund run by the Department of Labor & Industries (L&I) or qualifies to self-insure. The fund prices by the hour worked, not per $100 of payroll, and lets the employer deduct part of the rate from the worker’s pay. In 2026 the average rate across all classes is ${K.r4(K.CH.wa.avg2026)} an hour, up ${K.pct(K.CH.wa.chg2026, 1)}, and L&I proposes ${K.r4(K.CH.wa.avg2027)} for 2027, another ${K.pct(K.CH.wa.chg2027, 1)}. The class decides the level. Clerical office work (4904) costs ${K.r4(office.comp)} an hour in 2026, wood frame building construction (0510) ${K.r4(frame.comp)} and roof work (0507) ${K.r4(roof.comp)}. For ${EMP} framers working ${K.num(HRS)} hours a year, that is ${K.usd(frame.total)} in all, of which up to ${K.usd(frame.worker)} may come out of their pay and ${K.usd(frame.employer)} stays with the employer. Of the ${all.length} hourly classes, ${rising} have a higher proposed rate for 2027.`,
  faqs: [
    { q: 'Can I buy workers’ comp from a private insurer in Washington?', a: 'No. L&I states that Washington does not allow private workers’ compensation coverage: an employer buys it from L&I or becomes a certified self-insured employer. Washington is one of four states with a monopolistic state fund, with North Dakota, Ohio and Wyoming.', open: true },
    { q: 'How much can I deduct from a worker’s pay in Washington?', a: `The rate tables list, for each class, the payroll deduction the employer may take from the worker for each hour worked. For clerical office work in 2026 it is ${K.r4(office.ded)} of the ${K.r4(office.comp)} hourly rate; for wood frame construction ${K.r4(frame.ded)} of ${K.r4(frame.comp)}. The rest is the employer’s.` },
    { q: 'When do the 2027 Washington rates take effect?', a: 'Washington rates apply by calendar year, to hours worked from January 1. The 2027 figures used here are the proposed rates L&I published with its 2026 rates page, and they can change when L&I adopts the final rates. The rate notice L&I sends each employer gives the rate that applies to the account.' },
  ],
  body: (h) => `
<h2>Washington workers’ comp rates by class, 2026 against 2027</h2>
${h.table(['Class', 'Work', '2026 per hour', 'Deducted from pay at most', '2027 proposed'], pick.map((k) => [k, K.WAC[k].desc, K.r4(K.WAC[k].comp2026), K.r4(K.WAC[k].ded2026), K.r4(K.WAC[k].comp2027)]), 'Washington state fund, rates per hour worked', ['l', 'l', 'r', 'r', 'r'])}
<p>The hourly rate combines several funds: the accident fund, the medical aid fund, which includes the stay-at-work program, and the supplemental pension fund. L&I publishes the rate of each fund by class (${h.src('wa_fund2026', '2026 rate table')}); the calculator uses the composite rate and the payroll deduction column, both stated at an experience factor of 1.0000. ${SQ} wallboard classes are priced per square foot installed rather than per hour and are left out of the calculator.</p>
${h.mini('wa', { t: 'Cost for your crew', p: ['wa', 'emp'], d: { wa: '4904', emp: 3 } })}
<h2>Hours, not payroll</h2>
<p>Because the rate is per hour, a better-paid worker costs the same as a lower-paid one in the same class. That reverses the logic of the other states, where the premium follows wages. An employer reports the hours worked in each class to L&I and pays on them; the L&I reporting rules say how hours of salaried staff are counted.</p>
<p>The experience factor of the employer’s account multiplies part of the rate, like a mod elsewhere. A new account starts at 1.00 and the factor appears on the rate notice. The ${h.a('experience-modification-rate', 'mod page')} explains how claims feed such a factor.</p>
<h2>Washington against the other states</h2>
<p>To compare Washington with other states, the Oregon study converts its hourly rates to a rate per $100 of payroll. On that basis Washington ranked ${K.ord(WAS.rank)} of ${K.N} jurisdictions with rates in effect on January 1, 2024, at ${K.r100(WAS.index)} per $100, up from ${K.ord(WAS.rank2022)} in the previous study. Its clerical office rate was the lowest of all states at ${K.r100(K.rate('8810', 'WA'))} per $100, while its roofing rate ranked ${K.ord(K.rank('5551', 'WA'))}. The ${h.a('workers-comp-rates-by-state', 'state ranking')} shows all jurisdictions, and the ${h.a('workers-comp-rate-changes', 'rate change page')} applies the 2027 average to a yearly bill.</p>
<p><strong>Where the figures come from.</strong> The 2026 rates and the proposed 2027 rates are the spreadsheets L&I publishes by risk class and fund, read on ${K.day(K.P.retrieved_at)} (${h.src('wa_fund2027', 'proposed 2027 table')}). The average across all classes comes from L&I’s table by business type (${h.src('wa_bus2027', 'L&I')}).</p>
<h2>What the hourly basis means for an employer</h2>
<p>Two clerical employees in Washington, one paid ${K.usd(20)} an hour and the other ${K.usd(45)}, cost the same in workers’ compensation: ${K.r4(office.comp)} for each hour worked in 2026. In a state that prices per $100 of payroll, the second would cost more than twice as much. A crew that works long weeks pays in proportion to its hours, whatever the hourly wage.</p>
<p>The worker’s share is deducted from pay at the hourly amount listed for the class, up to the payroll deduction figure. For ${EMP} clerical employees working ${K.num(HRS)} hours each, the whole bill is ${K.usd(office.total)}, of which up to ${K.usd(office.worker)} can come from their pay. For the same crew in roof work, the bill is ${K.usd(roof.total)}, with up to ${K.usd(roof.worker)} from pay. The rate notice from L&I gives the account’s own rates, after its experience factor.</p>
<p><strong>Self-insurance.</strong> Large Washington employers can be certified by L&I to carry their own workers’ compensation instead of buying from the fund. Everyone else reports hours to L&I and pays its rates. The rates in the table and calculator are those an account pays at an experience factor of exactly 1.0000, the starting point of a new account.</p>
`,
  tool: 'wa',
  related: ['workers-comp-rate-changes', 'workers-comp-rates-by-state', 'experience-modification-rate', 'workers-comp-requirements-by-state'],
  sources: ['wa_rates', 'wa_fund2026', 'wa_fund2027', 'wa_bus2027', 'wa_account'],
});

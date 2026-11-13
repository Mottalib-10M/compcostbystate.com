import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CODE = '8742', R = K.R(CODE), OFF = K.R('8810');
const PAY = 150000;
const ratio = R.median / OFF.median;
const states = ['LA', 'HI', 'CA', 'NY', 'FL', 'TX', 'OR', 'MA'];

export default definePage({
  id: 'class-code-8742', group: 'classes', order: 44, slug: 'class-code-8742',
  nav: '8742 Outside sales', card: 'Outside salespeople and collectors: rates in 51 states, and when sales staff leave the office class.',
  title: 'Class Code 8742 Rates 2026: Outside Sales Staff by State',
  description: 'Class code 8742 rates in 2026: workers comp per $100 of payroll for outside salespeople and collectors in 51 states, and how they differ from office staff.',
  h1: 'Class code 8742: outside salespeople and collectors by state',
  intro: 'Class code 8742 rates in 51 jurisdictions, highest first, with the premium on the sales payroll you enter.',
  resume: `Class code 8742 covers salespersons and collectors who work outside the office: representatives who visit customers, account managers on the road, collectors who call on debtors. It is one of the standard exception classes, like clerical office work, that a business can report apart from its main operations. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, its rate ran from ${K.r100(R.low.rate)} per $100 of payroll in ${K.name(R.low.st)} to ${K.r100(R.high.rate)} in ${K.name(R.high.st)}, with a median of ${K.r100(R.median)}, about ${K.dec(ratio, 1)} times the median clerical rate of ${K.r100(OFF.median)}. On ${K.usd(PAY)} of sales payroll, the premium would be about ${K.usd(K.prem(PAY, R.median))} a year at the median rate and ${K.usd(K.prem(PAY, R.high.rate))} in Louisiana. Commissions are part of pay, so a sales team paid mostly on commission carries a payroll that moves with sales, and the audit after the policy year adjusts the premium to the commissions actually paid.`,
  faqs: [
    { q: 'When does a salesperson go in 8742 rather than 8810?', a: 'When the job takes them out of the office to see customers. A salesperson who sells only by phone or online from the office is usually clerical, class 8810; one who drives to clients is outside sales. Someone who does both may be split under the state’s rules, or placed in the class of the main duty.', open: true },
    { q: 'Is driving part of class 8742?', a: 'Driving to visit customers is part of the outside sales job and its risk is in the rate. Delivering goods, installing products or doing other work at the customer’s site is not sales: that payroll belongs in the class of that operation, usually at a higher rate. Describe the job accurately to the insurer.' },
    { q: 'Do commissions count as payroll for workers’ comp?', a: 'Commissions are generally part of the remuneration counted for the premium, like salary and bonuses. The state’s manual lists what is included and excluded, such as certain expense reimbursements. Estimate commissions realistically at the start of the policy, since the audit will use the amounts actually paid.' },
  ],
  body: (h) => `
<h2>Class code 8742 rates in eight states</h2>
${h.table(['State', '8742 per $100', '8810 per $100', `8742 on ${K.usd(PAY)}`], states.map((s) => [K.name(s), K.r100(K.rate(CODE, s)), K.r100(K.rate('8810', s)), K.usd(K.prem(PAY, K.rate(CODE, s)))]), 'Outside sales against clerical office, rates in effect on January 1, 2024', ['l', 'r', 'r', 'r'])}
<p>Louisiana and Hawaii stand well above every other state for outside sales (${h.src('dcbs_2024', 'Oregon DCBS')}); from the third state down, rates fall below fifty cents per $100. Massachusetts priced it lowest. The difference between 8742 and 8810 in the same state is what is at stake when a sales role is classified: in California, ${K.r100(K.rate(CODE, 'CA'))} against ${K.r100(K.rate('8810', 'CA'))}.</p>
${h.mini('estimate', { t: 'Sales staff premium in your state', p: ['st', 'pay'], d: { code: CODE, st: 'LA', pay: PAY } })}
<h2>Sales staff in a business with heavier classes</h2>
<p>For a manufacturer, a wholesaler or a contractor, splitting sales staff into 8742 can save a great deal, because the main class is far dearer. A wholesaler’s main class in the study, wholesale stores (8018), had a median of ${K.r100(K.R('8018').median)} per $100, several times the sales class. The split holds only if the salespeople do not take part in the operations: one who also loads trucks or helps on the floor goes back to the main class. The ${h.a('workers-comp-class-codes', 'class code guide')} covers the rules, and the ${h.a('class-code-8810', 'clerical office page')} ranks the office class.</p>
<p>Remote sales staff living in another state raise a different question: which state’s law and rates apply. Tell the insurer where each salesperson is based and travels, so that the policy lists those states.</p>
<h2>Outside sales in the largest states</h2>
<p>California and New York both charged ${K.r100(K.rate(CODE, 'CA'))} per $100, ranked ${K.ord(K.rank(CODE, 'CA'))} and ${K.ord(K.rank(CODE, 'NY'))}. Florida and Pennsylvania charged ${K.r100(K.rate(CODE, 'FL'))}, Texas ${K.r100(K.rate(CODE, 'TX'))} and Ohio ${K.r100(K.rate(CODE, 'OH'))}. New Jersey was the dearest large state at ${K.r100(K.rate(CODE, 'NJ'))}. Outside the two outliers of Louisiana and Hawaii, the class costs from ${K.r100(R.low.rate)} to ${K.r100(R.list[2].rate)} per $100, so for most businesses the class split matters more than the state.</p>
<h2>A worked split</h2>
<p>A wholesale distributor with ${K.usd(600000)} of warehouse payroll and ${K.usd(PAY)} of outside sales payroll, at median rates, pays about ${K.usd(K.prem(600000, K.R('8018').median))} for the warehouse and ${K.usd(K.prem(PAY, R.median))} for the sales team. Reported together in the wholesale class, the sales payroll alone would cost ${K.usd(K.prem(PAY, K.R('8018').median))}. The saving holds only if the salespeople stay out of the warehouse; the insurer’s auditor will ask what each of them does.</p>
<p>Sales staff who are paid only by commission and set their own schedule raise a different question: whether they are employees at all. States answer it with their own tests, and a salesperson classed as an independent contractor in a sales agreement can still be an employee for workers’ compensation. When in doubt, ask the state agency or the insurer before the audit does.</p>
<h2>Collectors and commission audits</h2>
<p>The class also covers collectors who work outside the office, calling on customers to collect payments. Their payroll is rated like that of outside salespeople. For a sales team paid largely on commission, the audit uses the commissions actually paid: a team estimated at ${K.usd(PAY)} that earned ${K.usd(200000)} in a good year adds about ${K.usd(K.prem(50000, R.median))} at the median rate.</p>
<p>Rates in the table are those in effect on January 1, 2024 in each state, from the Oregon study, ranked highest first. Your insurer’s rate for class 8742 can differ, but the order of the states changes slowly from one edition to the next.</p>
`,
  tool: 'rank', toolArg: { code: CODE, pay: PAY, st: 'CA' },
  related: ['class-code-8810', 'workers-comp-class-codes', 'how-much-does-workers-comp-cost', 'workers-comp-rates-by-state'],
  sources: ['dcbs_2024'],
});

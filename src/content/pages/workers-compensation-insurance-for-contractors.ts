import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const PAY = 400000;
const TRADES = ['5183', '5190', '5213', '5221', '5403', '5437', '5474', '5506', '5537', '5551', '5645', '6217'];
const rows = TRADES.map((c) => ({ c, k: K.R(c) })).sort((a, b) => b.k.median - a.k.median);
const top = rows[0], bottom = rows[rows.length - 1];
const OFF = K.R('8810').median;
const CODE = '5221', R = K.R(CODE);

export default definePage({
  id: 'workers-compensation-insurance-for-contractors', group: 'insurance', order: 6, slug: 'workers-compensation-insurance-for-contractors',
  nav: 'Contractors', card: 'Rates of twelve construction trades, the stricter rules for building work and the certificates general contractors ask for.',
  title: 'Workers Compensation Insurance for Contractors 2026: Rates',
  description: 'Workers compensation insurance for contractors in 2026: median rates of 12 building trades across the states, construction thresholds and license rules.',
  h1: 'Workers’ compensation insurance for contractors: rates and rules',
  intro: 'Workers’ compensation insurance for contractors, trade by trade: pick a construction class and a payroll to see its rate in every state, highest first.',
  resume: `Construction pays the highest workers’ compensation rates of any industry, and states write stricter rules for it. In the Oregon study of rates in effect on January 1, 2024, the median state charges ${K.r100(top.k.median)} per $100 of payroll for ${K.cls(top.c).short.toLowerCase()} (class ${top.c}) and ${K.r100(bottom.k.median)} for ${K.cls(bottom.c).short.toLowerCase()} (${bottom.c}), against ${K.r100(OFF)} for office work. On ${K.usd(PAY)} of payroll, that is ${K.usd(K.prem(PAY, top.k.median))} against ${K.usd(K.prem(PAY, bottom.k.median))} a year. The rules are stricter too. Florida requires coverage from the first employee in construction, counting corporate officers and members of a limited liability company (LLC), against four employees in other industries; Missouri from one in construction, against five elsewhere. California’s Contractors State License Board makes roofing, concrete, heating and air-conditioning, asbestos abatement and tree service contractors carry it even with no employees, and suspends any license whose coverage lapses. General contractors, finally, ask subcontractors for a certificate of insurance, because an uninsured subcontractor’s injured worker can become their problem.`,
  faqs: [
    { q: 'Which construction trade pays the most for workers’ comp?', a: `Among the twelve building classes of the Oregon study, ${K.cls(top.c).short.toLowerCase()} (${top.c}) has the highest median rate, ${K.r100(top.k.median)} per $100 of payroll, and roofing reaches the highest rate of any single state, ${K.r100(K.R('5551').high.rate)} in ${K.name(K.R('5551').high.st)}. ${K.cls(bottom.c).short} (${bottom.c}) and ${K.cls(rows[rows.length - 2].c).short.toLowerCase()} (${rows[rows.length - 2].c}) sit at the low end of the trades.`, open: true },
    { q: 'Do subcontractors need their own workers’ comp?', a: 'If they have employees, yes, under the law of the state where the work is done. General contractors ask for a certificate of insurance because in many states they can be held liable for the injured employees of an uninsured subcontractor, and their own insurer may charge them premium for that subcontractor’s payroll at the audit.' },
    { q: 'Does a contractor license require workers’ comp?', a: 'In California, yes: every licensee with employees must carry it, licensees in five trades must carry it even without employees, and the others must file an exemption certifying they have none. A lapse suspends the license and any work done while suspended counts as unlicensed. Other states tie licenses and permits to coverage in their own ways.' },
    { q: 'Why is roofing workers’ comp so expensive?', a: `Because a class rate follows the claims that class has cost insurers over several years, and roofing claims are among the most expensive. In the Oregon study, roofing runs from ${K.r100(K.R('5551').low.rate)} per $100 of payroll in ${K.name(K.R('5551').low.st)} to ${K.r100(K.R('5551').high.rate)} in ${K.name(K.R('5551').high.st)}. The class 5551 page shows every state.` },
  ],
  body: (h) => `
<h2>Workers’ compensation insurance for contractors: trade by trade</h2>
<p>Each building trade has its own class code and rate, and a contractor with several trades reports each payroll under its own class. The table gives the median rate of twelve construction classes across the states that use a comparable class in the Oregon study, with the highest state for each (${h.src('dcbs_2024', 'Oregon state study')}).</p>
${h.table(['Class', 'Trade', 'Median per $100', 'Highest state', 'Premium on ' + K.usd(PAY)], rows.map(({ c, k }) => [c, K.cls(c).short, K.r100(k.median), `${K.name(k.high.st)} ${K.r100(k.high.rate)}`, K.usd(K.prem(PAY, k.median))]), 'Construction classes at the median state, rates in effect on January 1, 2024', ['l', 'l', 'r', 'l', 'r'])}
<p>The spread between states is wider than between trades. The ${h.a('class-code-5551', 'roofing page')} and the ${h.a('class-code-5645', 'residential carpentry page')} rank every state for those two classes, and the calculator above does the same for any trade.</p>
${h.mini('estimate', { t: 'Price one trade in your state', p: ['code', 'st', 'pay'], d: { code: '5403', st: 'MO', pay: 250000 } })}
<h2>Stricter thresholds in construction</h2>
<p>Several states require coverage sooner in building work. Florida asks for it from one employee in the construction industry, counting corporate officers and LLC members, against four elsewhere (${h.src('fl_dwc', 'Florida Division of Workers’ Compensation')}). Missouri requires it from five employees in general and from one in construction (${h.src('mo_rsmo', 'Missouri section 287.030')}). California requires every employer to insure from the first employee, and a roofer even with none (${h.src('ca_dwc', 'California Division of Workers’ Compensation')}).</p>
<h2>License rules: California’s example</h2>
<p>The Contractors State License Board ties the license to coverage. Licensees with employees must keep workers’ compensation in force continuously; C-8 concrete, C-20 heating and air-conditioning, C-22 asbestos abatement, C-39 roofing and C-61/D-49 tree service contractors must carry it whether or not they have employees; others without employees file an exemption. A licensee who hires must send proof of coverage within 90 days, and a lapse suspends the license (${h.src('cslb_wc', 'California Contractors State License Board')}).</p>
<h2>Rates are moving in 2026 and 2027</h2>
<p>The study rates date from January 1, 2024, and several states have moved since. California’s insurance commissioner adopted an average advisory pure premium rate of ${K.r100(K.CH.ca.rate)} per $100 of payroll from September 1, 2026, up ${K.pct(K.CH.ca.pct, 1)} (${h.src('ca_cdi', 'California Department of Insurance')}). Applied to the study rate for roofing in California, ${K.r100(K.rate('5551', 'CA'))}, that average change would add about ${K.usd(K.prem(PAY, K.rate('5551', 'CA')) * K.CH.ca.pct / 100)} a year on ${K.usd(PAY)} of payroll, though each class moves by its own amount. Oregon’s pure premium rises ${K.pct(K.CH.or2027.purePremiumPct, 1)} on average in 2027, and Washington’s state fund proposes ${K.pct(K.CH.wa.chg2027, 1)} on average for 2027. The ${h.a('workers-comp-rate-changes', 'rate change page')} applies each change to a premium.</p>
<h2>Certificates and uninsured subcontractors</h2>
<p>A general contractor usually asks each subcontractor for a certificate of insurance before work starts and checks it again at renewal. The reason is the audit: when a subcontractor has no valid policy, the general contractor’s insurer can count that subcontractor’s labor as payroll on the general contractor’s policy and charge premium for it, and in many states the general contractor can be liable for an injury. A one-person subcontractor without employees may instead show a state exemption where the state issues one; the ${h.a('workers-comp-insurance-for-self-employed', 'self-employed page')} covers those rules.</p>
<p>Office staff and estimators who never go to the site can usually be reported under clerical class 8810 at ${K.r100(OFF)} per $100 at the median, a fraction of the field rate, provided the payroll records keep them apart. Mixing them into the field class inflates the premium, and putting field workers in the office class is a misclassification the auditor will correct.</p>
`,
  tool: 'rank',
  toolArg: { code: CODE, pay: PAY, st: 'FL' },
  related: ['class-code-5551', 'class-code-5645', 'class-code-5190', 'workers-comp-requirements-by-state'],
  sources: ['dcbs_2024', 'fl_dwc', 'mo_rsmo', 'ca_dwc', 'cslb_wc'],
});

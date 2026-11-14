import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CODE = '5551', R = K.R(CODE);
const PAY = 300000;
const over15 = R.list.filter((x) => x.rate > 15).length;
const wa = K.WAC['0507'];

export default definePage({
  id: 'class-code-5551', group: 'classes', order: 41, slug: 'class-code-5551',
  nav: '5551 Roofing', card: 'Roofing rates in 51 states, from about a dollar to almost thirty per $100 of payroll.',
  title: 'Class Code 5551 Roofing Rates 2026: Workers Comp by State',
  description: 'Class code 5551 roofing rates in 2026: workers comp per $100 of payroll in 51 states, from $1.18 in North Dakota to $28.84 in Georgia, and your premium.',
  h1: 'Class code 5551: roofing workers’ comp rates by state',
  intro: 'Class code 5551 roofing rates in 51 jurisdictions, highest first, with the premium on the roofing payroll you enter.',
  resume: `Roofing, class code 5551 (roofing of all kinds, drivers included), carries one of the steepest workers’ compensation rates and the widest spread between states. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, ${K.name(R.high.st)} charged ${K.r100(R.high.rate)} per $100 of payroll and ${K.name(R.low.st)} ${K.r100(R.low.rate)}, with a median of ${K.r100(R.median)} across ${R.count} jurisdictions. ${over15} states priced roofing above $15 per $100. On ${K.usd(PAY)} of roofing payroll, the yearly premium would be about ${K.usd(K.prem(PAY, R.high.rate))} in Georgia, ${K.usd(K.prem(PAY, R.median))} in the median state and ${K.usd(K.prem(PAY, R.low.rate))} in North Dakota, before any experience modification. Neighbors differ sharply: Florida’s rate was ${K.r100(K.rate(CODE, 'FL'))} and Texas’s ${K.r100(K.rate(CODE, 'TX'))}, against Georgia’s near-thirty dollars. California charged ${K.r100(K.rate(CODE, 'CA'))}, ${K.ord(K.rank(CODE, 'CA'))} highest, and its Division of Workers’ Compensation requires even a roofer with no employees to carry coverage.`,
  faqs: [
    { q: 'How much is workers’ comp for a roofing company?', a: `Payroll divided by 100 times the state’s roofing rate. In the study, the median state charged ${K.r100(R.median)} per $100, so ${K.usd(K.prem(100000, R.median))} for each ${K.usd(100000)} of roofing wages; Georgia charged ${K.usd(K.prem(100000, R.high.rate))}. Office staff of the same company can usually be reported in class 8810 at a fraction of that.`, open: true },
    { q: 'Does a roofer with no employees need workers’ comp?', a: 'In California, yes: the Division of Workers’ Compensation says a roofer without employees is still required to carry it. In most other states read by this site, the rule depends on headcount or on owners electing coverage. General contractors often require proof of coverage from roofing subcontractors before work starts.' },
    { q: 'Why does roofing cost so much more than other trades?', a: 'The rate of a class reflects the claims of the businesses in it. Rating bureaus set the roofing rate from the claims roofing employers report, and the study then compares the resulting rates across states. Your own claims record moves your price further through the experience modification.' },
  ],
  body: (h) => `
<h2>Class code 5551: the most expensive states</h2>
<p>Georgia and New York lead, followed by ${K.name(R.list[2].st)}, ${K.name(R.list[3].st)} and ${K.name(R.list[4].st)} (${h.src('dcbs_2024', 'Oregon state study')}). The full ranking sits under the calculator. A roofing business working across state lines pays the rate of the state where each job is done, so a crew that crosses from Florida into Georgia multiplies its rate several times for that payroll.</p>
${h.mini('perEmployee', { t: 'Cost per roofer, a year', p: ['st', 'emp', 'wage'], d: { code: CODE, st: 'GA' } })}
<h2>Keeping roofing payroll accurate</h2>
<p>Because the rate is high, mistakes in payroll weigh heavily. Report under 5551 only the wages of employees who do roofing work or drive for it. Estimators and office staff who stay off roofs may qualify for clerical or outside sales classes under the state’s manual. Subcontractors without their own coverage can be added to your payroll at the audit: keep their certificates. The ${h.a('workers-comp-class-codes', 'class code guide')} explains how payroll is split between classes.</p>
<p>Some states adjust contracting classes for employers who pay high wages. The study counts nineteen states with such a program: a contractor that pays its employees more than the average wage can have part of its construction payroll left out of the premium. Ask your insurer whether your state has one and how to qualify.</p>
<h2>Washington and the experience mod</h2>
<p>Washington prices roof work by the hour in its own class 0507: ${K.r4(wa.comp2026)} per hour worked in 2026 and ${K.r4(wa.comp2027)} proposed for 2027. The ${h.a('washington-workers-comp-rates', 'Washington calculator')} applies it. In every state, a roofing contractor’s experience modification moves a large premium: the ${h.a('experience-modification-rate', 'mod page')} puts it in dollars, and the ${h.a('georgia-workers-comp-rates', 'Georgia page')} explains the state at the top of this class.</p>
<h2>Roofing in the five largest states</h2>
<p>California charged ${K.r100(K.rate(CODE, 'CA'))} per $100, Texas ${K.r100(K.rate(CODE, 'TX'))}, Florida ${K.r100(K.rate(CODE, 'FL'))}, New York ${K.r100(K.rate(CODE, 'NY'))} and Pennsylvania ${K.r100(K.rate(CODE, 'PA'))}. Two of the largest roofing markets, Texas and Florida, were among the cheapest states for the class; New York among the most expensive. For a roofing company the choice of states served is a pricing decision in its own right.</p>
<h2>A roofing premium and the mod</h2>
<p>A roofing contractor in California with ${K.usd(PAY)} of roofing payroll would carry a manual premium of about ${K.usd(K.prem(PAY, K.rate(CODE, 'CA')))} a year. An experience modification of 0.85 would bring it to ${K.usd(K.prem(PAY, K.rate(CODE, 'CA'), 0.85))}; one of 1.25 would raise it to ${K.usd(K.prem(PAY, K.rate(CODE, 'CA'), 1.25))}. At roofing rates, the mod moves more money than most small businesses pay for their entire policy.</p>
<h2>Roofing payroll and subcontracted labor</h2>
<p>Many roofing businesses use subcontracted crews. The insurer asks at the audit for the certificate of insurance of each subcontractor. Without one, the amount paid to the subcontractor, or the part of it the state’s rules treat as payroll, can be added to the roofing class. At ${K.r100(R.median)} per $100, every ${K.usd(100000)} paid to an uninsured crew could add about ${K.usd(K.prem(100000, R.median))} to the bill at the median rate.</p>
<p>Roofers who also do gutters, siding or sheet metal work may have payroll in other classes, depending on the state’s manual. Keep time records by type of work: in most states the most expensive class applies to an employee whose time cannot be shown to be split.</p>
`,
  tool: 'rank', toolArg: { code: CODE, pay: PAY, st: 'GA' },
  related: ['georgia-workers-comp-rates', 'experience-modification-rate', 'class-code-5645', 'workers-comp-requirements-by-state'],
  sources: ['dcbs_2024', 'ca_dwc', 'wa_fund2026'],
});

import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CODE = '5190', R = K.R(CODE);
const { payroll: PAY, employees: EMP } = K.EX;
const wa = K.WAC['0601'];
const hvac = K.R('5537'), plumb = K.R('5183');
const mid = R.list.filter((x) => x.rate >= 2 && x.rate <= 3).length;
const top5 = R.list.slice(0, 5), low5 = R.list.slice(-5);

export default definePage({
  id: 'class-code-5190', group: 'classes', order: 45, slug: 'class-code-5190',
  nav: '5190 Electricians', card: 'Electrical wiring within buildings: rates in 51 states, beside plumbing and HVAC.',
  title: 'Class Code 5190 Electrician Rates 2026: Comp Cost by State',
  description: 'Class code 5190 electrician rates in 2026: workers comp per $100 of payroll for electrical wiring in 51 states, beside plumbing and HVAC, and your premium.',
  h1: 'Class code 5190: electrician workers’ comp rates by state',
  intro: 'Class code 5190 electrician rates in 51 jurisdictions, highest first, with the premium on the payroll you enter.',
  resume: `Class code 5190 covers electrical wiring within buildings, drivers included: the class of most electrical contractors who install and repair wiring in homes, offices and shops. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, the rate ran from ${K.r100(R.low.rate)} per $100 of payroll in ${K.name(R.low.st)} to ${K.r100(R.high.rate)} in ${K.name(R.high.st)}, with a median of ${K.r100(R.median)} across ${R.count} jurisdictions. It is the example case of this site: an electrical contractor in California with ${EMP} employees and ${K.usd(PAY)} of payroll would pay about ${K.usd(K.prem(PAY, K.rate(CODE, 'CA')))} a year at California’s rate of ${K.r100(K.rate(CODE, 'CA'))}, against ${K.usd(K.prem(PAY, R.high.rate))} at New York’s. Electrical work sits in the middle of the building trades. Plumbing (5183) had a median of ${K.r100(plumb.median)} and heating and air conditioning (5537) ${K.r100(hvac.median)}, while roofing and framing cost several times more. Electricians who also do low-voltage or alarm work may fall under other classes in some states, so the description on the policy should match the work.`,
  faqs: [
    { q: 'What work does class code 5190 cover?', a: 'Electrical wiring within buildings: installing, repairing and maintaining wiring, fixtures and panels inside structures, including the drivers of the business. Outside line work on poles and power lines, and installing electrical machinery, generally fall in other classes. The insurer applies the description of your state’s manual.', open: true },
    { q: 'Which state has the highest workers’ comp rate for electricians?', a: `In the study, ${top5.slice(0, 3).map((x) => `${K.name(x.st)} (${K.r100(x.rate)})`).join(', ')} had the highest rates for class 5190, per $100 of payroll. The lowest were ${low5.slice(-3).map((x) => K.name(x.st)).join(', ')}. The full order is in the table under the calculator.` },
    { q: 'Do apprentices count in the electrician payroll?', a: 'Yes. Apprentices doing electrical work are employees in the same class, and their wages count in the payroll of class 5190. Because the premium follows wages, an apprentice costs less to insure than a journeyman in the same class, in proportion to pay, everywhere except Washington, which charges by the hour.' },
  ],
  body: (h) => `
<h2>Class code 5190: highest and lowest states</h2>
${h.table(['Rank', 'State', 'Per $100', `On ${K.usd(PAY)}`], [...top5, ...low5].map((x) => [String(x.rank), K.name(x.st), K.r100(x.rate), K.usd(K.prem(PAY, x.rate))]), 'Electrical wiring within buildings (5190), rates in effect on January 1, 2024', ['r', 'l', 'r', 'r'])}
<p>New York stands apart, with a rate well above New Jersey and Hawaii (${h.src('dcbs_2024', 'Oregon DCBS')}). The bottom of the table holds West Virginia, North Dakota and Arkansas, which are also the three lowest states on the overall index. Between the two ends, ${mid} of the ${R.count} jurisdictions price electrical work between two and three dollars per $100.</p>
${h.mini('estimate', { t: 'Electrician premium in your state', p: ['st', 'pay'], d: { code: CODE, st: 'FL', pay: PAY } })}
<h2>Electricians beside the other trades</h2>
${h.table(['Class', 'Trade', 'Median per $100', `Median premium on ${K.usd(PAY)}`], ['5190', '5183', '5537', '5403', '5551'].map((c) => [c, K.cls(c).short, K.r100(K.R(c).median), K.usd(K.prem(PAY, K.R(c).median))]), 'Medians of 51 jurisdictions, rates in effect on January 1, 2024', ['l', 'l', 'r', 'r'])}
<p>For a mechanical contractor that does electrical, plumbing and heating work, each trade’s payroll goes in its own class when records separate them. The ${h.a('workers-comp-class-codes', 'class code guide')} explains the split. Washington prices electrical wiring by the hour in its class 0601: ${K.r4(wa.comp2026)} per hour worked in 2026 and ${K.r4(wa.comp2027)} proposed for 2027, on the ${h.a('washington-workers-comp-rates', 'Washington page')}.</p>
<p>To go from the rate to a budget per employee, use the ${h.a('how-much-does-workers-comp-cost', 'cost guide')}; for an established contractor, the ${h.a('experience-modification-rate', 'mod page')} adds the effect of its claims record.</p>
<h2>Electricians in the largest states</h2>
<p>New York’s rate of ${K.r100(K.rate(CODE, 'NY'))} was more than twice California’s ${K.r100(K.rate(CODE, 'CA'))}. Illinois charged ${K.r100(K.rate(CODE, 'IL'))} and ranked ${K.ord(K.rank(CODE, 'IL'))}, Florida ${K.r100(K.rate(CODE, 'FL'))} and ranked ${K.ord(K.rank(CODE, 'FL'))}, Georgia ${K.r100(K.rate(CODE, 'GA'))}. Texas, at ${K.r100(K.rate(CODE, 'TX'))}, sat near the middle, and Ohio, at ${K.r100(K.rate(CODE, 'OH'))}, near the bottom. For an electrical contractor, Florida is a dear state even though its overall index is below the median.</p>
<h2>The example contractor, state by state</h2>
<p>The example case of this site, ${EMP} electricians with ${K.usd(PAY)} of payroll, would pay about ${K.usd(K.prem(PAY, K.rate(CODE, 'CA')))} a year in California, ${K.usd(K.prem(PAY, K.rate(CODE, 'TX')))} in Texas, ${K.usd(K.prem(PAY, K.rate(CODE, 'FL')))} in Florida and ${K.usd(K.prem(PAY, K.rate(CODE, 'NY')))} in New York, at the study rates and a mod of 1.00. Per electrician, that runs from ${K.usd(K.prem(PAY, R.low.rate) / EMP)} in the cheapest state to ${K.usd(K.prem(PAY, R.high.rate) / EMP)} in the dearest. The calculator at the top of the page gives the figure for every state on your own payroll.</p>
<p>Electrical contractors often work as subcontractors to general contractors who require a certificate of insurance and sometimes a maximum experience modification. Keep the certificate current with each client, and check the mod on your worksheet each year before bidding season.</p>
<h2>Electrical, plumbing and HVAC by state</h2>
<p>The three mechanical trades do not rank the same way in every state. California charged ${K.r100(K.rate(CODE, 'CA'))} for electrical wiring and ${K.r100(K.rate('5183', 'CA'))} for both plumbing and HVAC. Texas charged ${K.r100(K.rate(CODE, 'TX'))} for electrical wiring, ${K.r100(K.rate('5183', 'TX'))} for plumbing and ${K.r100(K.rate('5537', 'TX'))} for HVAC; Florida ${K.r100(K.rate(CODE, 'FL'))}, ${K.r100(K.rate('5183', 'FL'))} and ${K.r100(K.rate('5537', 'FL'))}. New York was the dearest state for all three. A mechanical contractor that adds a trade should look up the new class in its own state rather than assume it costs the same as electrical work.</p>
<p>Low-voltage work, such as alarm, data and telephone cabling, is classified separately in many states, often at a lower rate than wiring within buildings. Washington, for example, has a class of its own for telephone and electrical alarm system installation (0608), at ${K.r4(K.WAC['0608'].comp2026)} per hour in 2026 against ${K.r4(wa.comp2026)} for electrical wiring.</p>
<p>All figures on this page are study rates in effect on January 1, 2024, before the experience modification, the schedule credits and the fees of a quote.</p>
`,
  tool: 'rank', toolArg: { code: CODE, pay: PAY, st: 'CA' },
  related: ['how-much-does-workers-comp-cost', 'california-workers-comp-rates', 'workers-comp-class-codes', 'experience-modification-rate'],
  sources: ['dcbs_2024', 'wa_fund2026'],
});

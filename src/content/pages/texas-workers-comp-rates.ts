import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'TX', S = K.S(ST);
const list = K.stateClasses(ST);
const cheapRank = list.filter((x) => x.rank > x.of / 2).length;
const PAY = 250000;
const r = (c: string) => K.rate(c, ST);
const CA = K.S('CA');

export default definePage({
  id: 'texas-workers-comp-rates', group: 'states', order: 21, slug: 'texas-workers-comp-rates',
  nav: 'Texas', card: 'Texas rates by class, its place among the cheapest states, and the choice not to subscribe.',
  title: 'Texas Workers Comp Rates 2026: Class Costs and Opting Out',
  description: 'Texas workers comp rates in 2026: 40th of 51 states in the state study, the rate per $100 of payroll of 52 classes, and what a non-subscriber employer gives up.',
  h1: 'Texas workers’ comp rates and the choice to opt out',
  intro: 'Texas workers’ comp rates for every class of the Oregon state study, with the premium on the payroll you enter, sorted in the table below.',
  resume: `Of the ${Object.keys(K.RULES).length} states this site has read, Texas and South Dakota are the two where a private employer can choose not to carry workers’ compensation: the Texas Department of Insurance says coverage is not required in most cases. An employer without it is a non-subscriber and must report to the state that it has no coverage. Those who do buy it pay some of the lower rates in the country. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024 (Texas rates dating from ${S.effective}), the Texas premium index was ${K.r100(S.index)} per $100 of payroll, ${K.pct(S.pctMedian)} of the national median, ranking ${K.ord(S.rank)} of ${K.N} after ${K.ord(S.rank2022)} in the previous study. Clerical office work cost ${K.r100(r('8810'))} per $100, about ${K.usd(K.prem(PAY, r('8810')))} a year on ${K.usd(PAY)} of office payroll, and roofing ${K.r100(r('5551'))} against a national median of ${K.r100(K.R('5551').median)}. Texas was below the middle of the states for ${cheapRank} of its ${list.length} classes in the study.`,
  faqs: [
    { q: 'Is workers’ comp required in Texas?', a: 'Not for most private employers. The Texas Department of Insurance, Division of Workers’ Compensation, says private employers can choose to carry it but it is not required in most cases. A client’s contract can still require proof of coverage, so read what your clients ask before you decide.', open: true },
    { q: 'What is a non-subscriber in Texas?', a: 'An employer without workers’ compensation coverage. The Texas Department of Insurance says non-subscribers must report to the state that they have no coverage, and must report to the Division of Workers’ Compensation work-related injuries causing more than one day of lost time, all work-related illnesses and deaths.' },
    { q: 'What does a Texas employer gain by carrying coverage?', a: 'The department says coverage limits liability if an employee sues the business for damages, except when gross negligence results in a death. The policy pays lost wages and medical benefits to an employee injured on the job, whoever was at fault. A non-subscriber faces those suits without that limit.' },
  ],
  body: (h) => `
<h2>Texas workers’ comp rates against the other states</h2>
<p>Texas is the ${K.ord(K.N - S.rank + 1)} cheapest of the ${K.N} jurisdictions. Its index of ${K.r100(S.index)} compares with ${K.r100(CA.index)} in California and a median of ${K.r100(K.MEDIAN)} (${h.src('dcbs_2024', 'Oregon DCBS')}). The gap is widest in construction: the Texas rate for house framing (5645) was ${K.r100(r('5645'))}, ranked ${K.ord(K.rank('5645', ST))}, and for street and road paving (5506) ${K.r100(r('5506'))}, ranked ${K.ord(K.rank('5506', ST))}. The study shows no comparable Texas class for social services organizations (8864), which is why Texas lists ${list.length} classes rather than ${K.NCLASS}.</p>
${h.table(['Class', 'Work', 'Texas per $100', 'National median', `Texas on ${K.usd(PAY)}`], ['8810', '8742', '9082', '5190', '5551', '7219'].map((c) => [c, K.cls(c).short, K.r100(r(c)), K.r100(K.R(c).median), K.usd(K.prem(PAY, r(c)))]), 'Texas rates in the study of rates in effect on January 1, 2024', ['l', 'l', 'r', 'r', 'r'])}
${h.mini('estimate', { t: 'Premium in Texas for your class', p: ['code', 'pay'], d: { st: ST, code: '5403', pay: PAY } })}
<h2>Subscriber or non-subscriber</h2>
<p>The choice in Texas is the employer’s, and it is a trade (${h.src('tx_tdi', 'Texas Department of Insurance')}). With coverage, an injured employee receives lost wages and medical benefits from the policy, and the employer’s liability is limited if the employee sues, except when gross negligence causes a death. Without it, the employer saves the premium and carries the risk of a lawsuit, and still has reporting duties to the state: its non-coverage, and certain injuries, illnesses and deaths.</p>
<p>The premium at stake is easy to estimate with the calculator: for an office business it is a few hundred dollars a year or less; for a roofing or framing crew it is several dollars per $100 of payroll. Weigh it against what one serious injury would cost in a suit, and against clients that require proof of coverage.</p>
<h2>Next steps for a Texas employer</h2>
<p>To buy coverage, ask a licensed agent or insurer for a quote; the rating worksheet will show the Texas rate of each class, the experience modification and the credits. Compare it with the class rates above and with the ${h.a('how-much-does-workers-comp-cost', 'cost per employee')}. The ${h.a('workers-comp-requirements-by-state', 'requirements page')} sets Texas beside the states that require coverage, useful when a crew works across the state line.</p>
<h2>Where Texas is not cheap</h2>
<p>Low overall does not mean low for every class. Texas ranked ${K.ord(K.rank('5537', ST))} of ${K.N} for heating and air conditioning (5537) at ${K.r100(r('5537'))}, ${K.ord(K.rank('5474', ST))} for painting (5474) at ${K.r100(r('5474'))}, and ${K.ord(K.rank('5190', ST))} for electrical wiring at ${K.r100(r('5190'))}: middle of the table, not bottom. Its cheapest positions were in heavy industry and outdoor work, saw mills and logging among them. An HVAC or painting contractor should not expect Texas to undercut neighboring states by much.</p>
<p>Among its neighbors, Oklahoma’s index was ${K.r100(K.S('OK').index)}, Louisiana’s ${K.r100(K.S('LA').index)}, New Mexico’s ${K.r100(K.S('NM').index)} and Arkansas’s ${K.r100(K.S('AR').index)}. A Texas crew working in Louisiana pays Louisiana’s rate on that payroll, and Louisiana’s index was close to twice the Texas figure.</p>
<h2>A Texas example: a heating and air conditioning contractor</h2>
<p>An HVAC contractor with ${K.usd(PAY)} of installation payroll in class 5537 would pay about ${K.usd(K.prem(PAY, r('5537')))} a year at the Texas rate of ${K.r100(r('5537'))}. The same payroll would cost ${K.usd(K.prem(PAY, K.rate('5537', 'OK')))} in Oklahoma, ${K.usd(K.prem(PAY, K.rate('5537', 'LA')))} in Louisiana and ${K.usd(K.prem(PAY, K.rate('5537', 'AR')))} in Arkansas. Its office staff, reported in class 8810 at ${K.r100(r('8810'))}, would add very little. Whether this contractor subscribes is its own decision in Texas; if it works on jobs in Louisiana or Oklahoma, those states’ rules apply to that work.</p>
<p><strong>Reading the Texas table.</strong> The calculator lists the ${list.length} Texas classes of the study with their rank among the states that price each class. A rank near the bottom means Texas was among the cheapest states for that work on January 1, 2024. Rates in Texas, as elsewhere, have moved since; the table is a comparison, and your insurer’s quote is the price.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['workers-comp-requirements-by-state', 'how-much-does-workers-comp-cost', 'workers-comp-rates-by-state', 'class-code-5551'],
  sources: ['dcbs_2024', 'tx_tdi'],
});

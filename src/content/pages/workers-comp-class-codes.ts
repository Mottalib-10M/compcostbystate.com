import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'TX';
const list = K.stateClasses(ST).sort((a, b) => a.rate - b.rate);
const lo = list[0], hi = list[list.length - 1];
const PAY = 100000;
const c8810 = K.R('8810'), c2702 = K.R('2702'), c5403 = K.R('5403'), c5645 = K.R('5645');
const ca9082 = K.rate('9082', 'CA'), ca9083 = K.rate('9083', 'CA'), ca9084 = K.rate('9084', 'CA');

export default definePage({
  id: 'workers-comp-class-codes', group: 'cost', order: 2, slug: 'workers-comp-class-codes',
  nav: 'Class codes and their rates', card: 'What a class code is, how it is assigned, and the rate of 53 common codes in any state.',
  title: 'Workers Comp Class Codes 2026: Rates of 53 Codes by State',
  description: 'Workers comp class codes in 2026: what the four-digit code means, how it is assigned, and the rate per $100 of payroll of 53 common codes in the state you pick.',
  h1: 'Workers’ comp class codes and what each one costs',
  intro: 'Workers’ comp class codes of the state study, for the state you pick: 53 codes with their rate per $100 of payroll, their rank and the premium on your payroll.',
  resume: `A workers’ compensation class code is a four-digit number that groups businesses doing the same kind of work, so that each group pays for its own claims. The National Council on Compensation Insurance (NCCI) keeps the system used for rates in 35 states and the District of Columbia, and other states keep their own codes or adapt NCCI’s. The rate of a code is a price per $100 of payroll. In the Oregon study of rates in effect on January 1, 2024, the cheapest of its ${K.NCLASS} codes in Texas was ${lo.code} (${lo.short}) at ${K.r100(lo.rate)} and the dearest ${hi.code} (${hi.short}) at ${K.r100(hi.rate)}, about ${K.num(hi.rate / lo.rate)} times more. Across the states, clerical office work (8810) ran from ${K.r100(c8810.low.rate)} to ${K.r100(c8810.high.rate)} per $100. The code on your policy therefore matters more than the state you are in. Getting it wrong, in either direction, changes the premium and can be corrected at the insurer’s payroll audit after the policy year.`,
  faqs: [
    { q: 'Who assigns my class code?', a: 'The insurer assigns it when it writes the policy, from the description of the business you give, following the classification manual in force in your state. The code describes the business as a whole, with a few standard exceptions such as clerical office staff and outside salespeople, which can be split out under their own codes.', open: true },
    { q: 'Can I have more than one class code?', a: 'Yes, when the business runs separate operations or has employees in the standard exception classes. A contractor commonly has one or more construction codes plus 8810 for office staff. Each code carries its own payroll and rate. Insurers usually ask for payroll records by class before they accept a split, and check them at the audit.' },
    { q: 'What happens if my class code is wrong?', a: 'The insurer audits the payroll after the policy year and can reclassify it, which brings a refund or an additional premium for that year. If you think your code is wrong, ask the insurer in writing and keep its answer; your state insurance regulator can tell you how a classification is disputed there.' },
    { q: 'Do all states use the same codes?', a: 'No. The study counts 11 states with an independent rating bureau, among them California, New York, New Jersey, Pennsylvania, Michigan and Wisconsin, and 4 with a monopolistic state fund: North Dakota, Ohio, Washington and Wyoming. For the study, states that do not use the NCCI system supplied their closest comparable class, which is why a few codes show no rate in some states.' },
  ],
  body: (h) => `
<h2>How workers’ comp class codes are built</h2>
<p>A class groups businesses with similar operations and risk. The rating bureau of the state collects payroll and claims by class from all insurers, and from them computes a rate for each class: the expected cost of claims per $100 of payroll, sometimes called the loss cost or pure premium. Insurers then add their own expenses, taxes and profit through a multiplier they file with the regulator. The rate in the study is that loaded figure, averaged across the largest insurers of each state (${h.src('dcbs_2024', 'Oregon DCBS')}).</p>
<p>The ${K.NCLASS} classes of the study are the classes that carried the most claims cost in Oregon, the state that runs it. Together they made up 71% of Oregon’s payroll and 65% of its losses in 2018 to 2020. They cover offices, shops, restaurants, hotels, building trades, trucking, health care, farms and public services, which is why most small businesses find their code in the list.</p>
${h.mini('rank', { t: 'Compare one class code across the states', p: ['code'], d: { code: '5403', pay: PAY } })}
<h2>The spread within one state</h2>
<p>In the study, logging without machines (2702) costs ${K.r100(c2702.median)} per $100 in the median state, house framing (5645) ${K.r100(c5645.median)} and general carpentry (5403) ${K.r100(c5403.median)}, while clerical office work costs ${K.r100(c8810.median)}. That is why a business with both office staff and field crews should check that the office payroll is reported under 8810: the same ${K.usd(PAY)} costs about ${K.usd(K.prem(PAY, c8810.median))} as office payroll and ${K.usd(K.prem(PAY, c5403.median))} as carpentry at median rates.</p>
<p>The classification manual of the state decides which employees may be reported in the office class, and the test is strict: an employee who also goes to job sites or supervises crews is generally not clerical for that time. Ask the insurer before you split payroll, and keep time records for anyone who works in both places.</p>
<h2>States with their own system</h2>
<p>Some states write one class where NCCI writes several. California uses a single restaurant class, which is why the study shows the same California rate for full-service restaurants (${K.r100(ca9082)}), fast food (${K.r100(ca9083)}) and bars (${K.r100(ca9084)}). Other states have no comparable class for some codes: the study lists them, and the calculator leaves those states out. Washington goes furthest: its state fund prices ${K.num(K.NWA)} risk classes by the hour worked, not per $100 of payroll, with its own codes. The ${h.a('washington-workers-comp-rates', 'Washington page')} covers them.</p>
<p>Six common codes have their own page: ${h.a('class-code-8810', '8810 clerical office')}, ${h.a('class-code-8742', '8742 outside sales')}, ${h.a('class-code-9082', '9082 restaurants')}, ${h.a('class-code-5190', '5190 electrical wiring')}, ${h.a('class-code-5551', '5551 roofing')} and ${h.a('class-code-5645', '5645 house framing')}. For the premium of a whole business, the ${h.a('how-much-does-workers-comp-cost', 'cost guide')} adds the classes together.</p>
<h2>Reading the class lines of a policy</h2>
<p>The information page of a workers’ compensation policy lists, for each state, the class codes with a short description, the estimated payroll of each, the rate per $100 and the premium of the line. Check three things: that each code describes work your business really does, that office and outside sales payroll sit in their own lines when your staff qualify, and that the payroll estimates are realistic, since the audit will replace them with actual figures. The letters NOC after a description mean not otherwise classified: the code catches work that no more specific code describes.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['class-code-8810', 'how-much-does-workers-comp-cost', 'workers-comp-rates-by-state', 'washington-workers-comp-rates'],
  sources: ['dcbs_2024', 'wa_rates'],
});

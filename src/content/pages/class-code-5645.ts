import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CODE = '5645', R = K.R(CODE);
const PAY = K.EX.payroll;
const c5403 = K.R('5403');
const wa = K.WAC['0510'];
const dearer = R.list.filter((x) => x.rate > K.rate('5403', x.st)).length;
const states = ['GA', 'MN', 'NJ', 'PA', 'NY', 'CA', 'FL', 'TX'];

export default definePage({
  id: 'class-code-5645', group: 'classes', order: 42, slug: 'class-code-5645',
  nav: '5645 House framing', card: 'Carpentry on dwellings of three stories or less: rates in 51 states and the premium on a framing payroll.',
  title: 'Class Code 5645 Rates 2026: Residential Carpentry by State',
  description: 'Class code 5645 rates in 2026: residential carpentry workers comp per $100 of payroll in 51 states, from $3.68 in Wyoming to $38.79 in Georgia, your premium.',
  h1: 'Class code 5645: house framing and residential carpentry rates by state',
  intro: 'Class code 5645 rates in 51 jurisdictions, highest first, with the premium on the framing payroll you enter.',
  resume: `Class code 5645 covers carpentry on dwellings not exceeding three stories in height: framing, sheathing and finish carpentry on houses and small apartment buildings. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, it was one of the most expensive construction classes: ${K.name(R.high.st)} charged ${K.r100(R.high.rate)} per $100 of payroll, against a median of ${K.r100(R.median)} and a low of ${K.r100(R.low.rate)} in ${K.name(R.low.st)}. ${K.name(R.list[1].st)} came second at ${K.r100(R.list[1].rate)} and ${K.name(R.list[2].st)} third at ${K.r100(R.list[2].rate)}. On ${K.usd(PAY)} of framing payroll, a year of coverage would cost about ${K.usd(K.prem(PAY, R.median))} at the median rate and ${K.usd(K.prem(PAY, R.high.rate))} in Georgia, before the experience modification. General carpentry (5403), used for commercial work and other carpentry, had a median of ${K.r100(c5403.median)}. Which of the two codes applies depends on the building, not on the tools, so a carpenter who works on both houses and commercial jobs splits payroll between them.`,
  faqs: [
    { q: 'What is the difference between 5645 and 5403?', a: `Class 5645 is carpentry on dwellings of three stories or less; 5403 is carpentry not otherwise classified, which takes in commercial buildings and taller structures. In the study the residential class was the more expensive of the two in ${dearer} of the ${R.count} jurisdictions. Payroll for each type of job is reported in its own class.`, open: true },
    { q: 'Does 5645 include cabinet and trim installation?', a: `Many states classify the installation of cabinets and interior trim separately, in class 5437, which the study also prices. Its median was ${K.r100(K.R('5437').median)} per $100, against ${K.r100(R.median)} for 5645. Ask the insurer which code your work falls under, since the manual description, not the job title, decides.` },
    { q: 'How do I lower a framing premium?', a: 'Check that office and estimating staff are in their own classes, that subcontractors carry their own coverage, and that payroll is split correctly between residential and commercial jobs. Over time, a claims record better than expected lowers the experience modification, which multiplies the whole premium.' },
  ],
  body: (h) => `
<h2>Class code 5645 rates in eight states</h2>
${h.table(['State', 'Per $100', 'Rank of 51', `On ${K.usd(PAY)}`], states.map((s) => [K.name(s), K.r100(K.rate(CODE, s)), String(K.rank(CODE, s)), K.usd(K.prem(PAY, K.rate(CODE, s)))]), 'Residential carpentry (5645), rates in effect on January 1, 2024', ['l', 'r', 'r', 'r'])}
<p>The table shows how far apart large building states are (${h.src('dcbs_2024', 'Oregon state study')}). Pennsylvania priced residential carpentry at ${K.r100(K.rate(CODE, 'PA'))}, ${K.ord(K.rank(CODE, 'PA'))} highest, while California, often the more expensive state, charged ${K.r100(K.rate(CODE, 'CA'))}. Florida and Texas sat near or below the median. The full ranking of the ${R.count} jurisdictions is under the calculator.</p>
${h.mini('perEmployee', { t: 'Cost per framer, a year', p: ['st', 'emp'], d: { code: CODE, st: 'PA' } })}
<h2>Three stories as the dividing line</h2>
<p>The class description stops at three stories. Above that height, carpentry on a residential building usually moves to another class. The line matters most to builders of small apartment buildings, who should ask the insurer how a four-story building is classified before bidding.</p>
<h2>Washington and other comparisons</h2>
<p>Washington prices wood frame building construction by the hour in its class 0510: ${K.r4(wa.comp2026)} per hour worked in 2026, of which the employer may deduct up to ${K.r4(wa.ded2026)} from pay, and ${K.r4(wa.comp2027)} proposed for 2027. For a framing crew of five at ${K.num(2000)} hours each, that is ${K.usd(wa.comp2026 * 10000)} a year. The ${h.a('washington-workers-comp-rates', 'Washington page')} computes it for any crew. The ${h.a('class-code-5551', 'roofing page')} ranks the other expensive residential trade, and the ${h.a('georgia-workers-comp-rates', 'Georgia page')} covers the state at the top of both.</p>
<h2>The upper Midwest and the Northeast</h2>
<p>After Georgia, the most expensive states for residential carpentry were Minnesota and New Jersey, then Illinois at ${K.r100(K.rate(CODE, 'IL'))} and Louisiana at ${K.r100(K.rate(CODE, 'LA'))}. New York, the most expensive state for many other construction classes, sat near the middle for this one at ${K.r100(K.rate(CODE, 'NY'))}, ${K.ord(K.rank(CODE, 'NY'))} of ${R.count}. Massachusetts, at ${K.r100(K.rate(CODE, 'MA'))}, was among the cheapest. A home builder cannot read the ranking of a state from its general reputation: the class ranking is the one to check.</p>
<h2>What a framing crew costs to insure</h2>
<p>For a crew of five framers earning ${K.usd(PAY / 5)} each, the yearly payroll is ${K.usd(PAY)}. At the median rate the premium is about ${K.usd(K.prem(PAY, R.median))}, or ${K.usd(K.prem(PAY, R.median) / 5)} per framer, which is ${K.pct(R.median, 1)} of wages. In Georgia the same crew would cost ${K.usd(K.prem(PAY, R.high.rate) / 5)} per framer, more than a third of the wage; in Wyoming ${K.usd(K.prem(PAY, R.low.rate) / 5)}. Those figures are before the experience modification and the insurer’s credits, and they show why framing subcontractors in the most expensive states quote their labor with the premium built in.</p>
<p>General contractors who hire framing subcontractors should collect a certificate of insurance from each. Florida’s division, for one, states that when a subcontractor has no coverage for its employees, those workers become the employees of the contractor, which then owes the benefits if one is hurt. An insurer can then charge that payroll at the audit, at this class rate.</p>
<h2>Residential against general carpentry, state by state</h2>
<p>In Georgia, residential carpentry cost ${K.r100(K.rate(CODE, 'GA'))} per $100 and general carpentry (5403) ${K.r100(K.rate('5403', 'GA'))}. New York was the reverse, at ${K.r100(K.rate(CODE, 'NY'))} against ${K.r100(K.rate('5403', 'NY'))}. California charged the same ${K.r100(K.rate(CODE, 'CA'))} for both. Which class your carpenters fall in can matter as much as the state.</p>
<p>Rates in this page are those in effect on January 1, 2024 in each state, from the Oregon study; the next edition of the study will show how far residential carpentry rates have moved since. In the meantime, the rate on your own policy or quote is the one to use, and the ranking tells you whether it is high or low for the country.</p>
`,
  tool: 'rank', toolArg: { code: CODE, pay: PAY, st: 'PA' },
  related: ['class-code-5551', 'georgia-workers-comp-rates', 'pennsylvania-workers-comp-rates', 'washington-workers-comp-rates'],
  sources: ['dcbs_2024', 'wa_fund2026'],
});

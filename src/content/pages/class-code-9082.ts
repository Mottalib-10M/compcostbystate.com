import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CODE = '9082', R = K.R(CODE), FF = K.R('9083'), BAR = K.R('9084'), HOTEL = K.R('9058');
const PAY = K.EX.payroll;
const same = R.list.filter((x) => K.rate('9083', x.st) === x.rate && K.rate('9084', x.st) === x.rate).length;
const wa = K.WAC['3905'];
const barsHigher = R.list.filter((x) => K.rate('9084', x.st) > K.rate('9083', x.st)).length;
const top3 = R.list.slice(0, 3);

export default definePage({
  id: 'class-code-9082', group: 'classes', order: 43, slug: 'class-code-9082',
  nav: '9082 Restaurants', card: 'Restaurant rates in 51 states, beside fast food, bars and hotel restaurants.',
  title: 'Class Code 9082 Restaurant Rates 2026: Workers Comp by State',
  description: 'Class code 9082 restaurant rates in 2026: workers comp per $100 of payroll in 51 states, beside fast food (9083) and bars (9084), and the premium on payroll.',
  h1: 'Class code 9082: restaurant workers’ comp rates by state',
  intro: 'Class code 9082 restaurant rates in 51 jurisdictions, highest first, with the premium on the payroll you enter.',
  resume: `Class code 9082 covers restaurants not otherwise classified: table-service restaurants with their cooks, servers, dishwashers and hosts. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, the rate ran from ${K.r100(R.low.rate)} per $100 of payroll in ${K.name(R.low.st)} to ${K.r100(R.high.rate)} in ${K.name(R.high.st)}, with a median of ${K.r100(R.median)} across ${R.count} jurisdictions. On ${K.usd(PAY)} of restaurant payroll, that is about ${K.usd(K.prem(PAY, R.median))} a year at the median rate and ${K.usd(K.prem(PAY, R.high.rate))} in California. The study priced three related classes beside it: fast food (9083), with a median of ${K.r100(FF.median)}; bars, lounges and taverns (9084), ${K.r100(BAR.median)}; and hotel restaurant employees (9058), ${K.r100(HOTEL.median)}. In ${same} jurisdictions the three restaurant codes carried the same rate, because the state uses a single restaurant class or equal rates. Tips matter here: whether reported tips count as payroll for the premium depends on the state’s manual, and they can be a large share of a server’s pay.`,
  faqs: [
    { q: 'What is the difference between class codes 9082 and 9083?', a: 'Class 9082 is restaurants not otherwise classified, typically with table service; 9083 is fast food, where customers order at a counter. Some states price them differently, others use one rate for both. In California the study shows the same rate for 9082, 9083 and 9084, because California has one restaurant class.', open: true },
    { q: 'Do tips count in a restaurant’s workers’ comp payroll?', a: 'The state’s classification and rating manual decides which pay counts toward the premium base, and the way tips and service charges are counted differs between states. Ask your insurer how it counts reported tips, since for servers they can be most of the pay and move the premium a long way.' },
    { q: 'Which states charge restaurants the most for workers’ comp?', a: `In the study, ${top3.map((x) => `${K.name(x.st)} (${K.r100(x.rate)})`).join(', ')} had the highest rates for class 9082, per $100 of payroll. The lowest was ${K.name(R.low.st)} at ${K.r100(R.low.rate)}. The full order of the ${R.count} jurisdictions is in the table under the calculator.` },
  ],
  body: (h) => `
<h2>Class code 9082 against the other food classes</h2>
${h.table(['Class', 'Work', 'Median per $100', 'Highest', 'Lowest'], [R, FF, BAR, HOTEL].map((x, i) => [['9082', '9083', '9084', '9058'][i], K.cls(['9082', '9083', '9084', '9058'][i]).short, K.r100(x.median), `${K.r100(x.high.rate)} (${x.high.st})`, `${K.r100(x.low.rate)} (${x.low.st})`]), 'Food service classes, rates in effect on January 1, 2024', ['l', 'l', 'r', 'r', 'r'])}
<p>The four classes came into the study together: Oregon’s own restaurant class, 9079, is not used elsewhere, so the department replaced it with the four classes other states use (${h.src('dcbs_2024', 'Oregon state study')}). Their medians are close, but individual states separate them: bars were priced above fast food in ${barsHigher} of the ${R.count} jurisdictions.</p>
${h.mini('perEmployee', { t: 'Cost per restaurant employee, a year', p: ['st', 'emp', 'wage'], d: { code: CODE, st: 'NY' } })}
<h2>A restaurant premium in practice</h2>
<p>A restaurant with ${K.usd(PAY)} of payroll pays about ${K.usd(K.prem(PAY, K.rate(CODE, 'TX')))} a year at the Texas rate, ${K.usd(K.prem(PAY, K.rate(CODE, 'NY')))} at New York’s and ${K.usd(K.prem(PAY, K.rate(CODE, 'CA')))} at California’s. Office staff of a restaurant group can usually go in class 8810, and outside catering sales staff in 8742. The ${h.a('how-much-does-workers-comp-cost', 'cost guide')} turns the rate into a cost per employee.</p>
<p>Washington prices restaurants and taverns together in its class 3905, at ${K.r4(wa.comp2026)} per hour worked in 2026 and ${K.r4(wa.comp2027)} proposed for 2027, with up to ${K.r4(wa.ded2026)} an hour taken from the worker’s pay. For a restaurant open long hours with part-time staff, the hourly basis gives a very different bill from the payroll basis of other states: the ${h.a('washington-workers-comp-rates', 'Washington calculator')} shows it.</p>
<p>California ranks first for all three restaurant codes: the ${h.a('california-workers-comp-rates', 'California page')} lists its other classes.</p>
<h2>Restaurants in the largest states</h2>
<p>After California, Hawaii and New Jersey, New York ranked ${K.ord(K.rank(CODE, 'NY'))} at ${K.r100(K.rate(CODE, 'NY'))}. Pennsylvania (${K.r100(K.rate(CODE, 'PA'))}), Illinois (${K.r100(K.rate(CODE, 'IL'))}) and Florida (${K.r100(K.rate(CODE, 'FL'))}) were in the middle, Texas (${K.r100(K.rate(CODE, 'TX'))}) and Ohio (${K.r100(K.rate(CODE, 'OH'))}) near the bottom. A restaurant group with locations in several states pays each state’s rate on the payroll of the locations there.</p>
<h2>Kitchen, floor and office</h2>
<p>The restaurant class covers the whole operation of a restaurant: cooks, dishwashers, servers, bartenders and hosts. That is why its rate is an average of very different jobs. A restaurant cannot usually split its kitchen staff into a more expensive class or its servers into a cheaper one. What it can do is keep separate the payroll of a real office, such as the bookkeeping office of a restaurant group, in class 8810, when the office meets the state’s conditions.</p>
<p>Two other choices shape the premium. Payroll includes the wages of part-time and seasonal staff, so a summer patio season raises the audited payroll. And the experience modification, once a restaurant is large enough to have one, rewards a kitchen with few burns, cuts and slips over three years. The ${h.a('experience-modification-rate', 'mod page')} puts that in dollars.</p>
<h2>Full service against fast food</h2>
<p>States that separate the two classes do not always charge more for table service. New York charged ${K.r100(K.rate('9083', 'NY'))} for fast food against ${K.r100(K.rate(CODE, 'NY'))} for full service; Illinois ${K.r100(K.rate('9083', 'IL'))} against ${K.r100(K.rate(CODE, 'IL'))}; Ohio ${K.r100(K.rate('9083', 'OH'))} against ${K.r100(K.rate(CODE, 'OH'))}. New Jersey, like California, priced them the same. The difference rarely exceeds a few cents per $100, so the class matters less than the state for a restaurant.</p>
<p>Hotel restaurants have their own class (9058), with a median of ${K.r100(HOTEL.median)} per $100. A hotel that runs a restaurant reports the restaurant staff there and the rest of its staff in the hotel classes. An independent restaurant inside a hotel building is still rated as a restaurant.</p>
`,
  tool: 'rank', toolArg: { code: CODE, pay: PAY, st: 'NY' },
  related: ['california-workers-comp-rates', 'how-much-does-workers-comp-cost', 'class-code-8810', 'washington-workers-comp-rates'],
  sources: ['dcbs_2024', 'wa_fund2026'],
});

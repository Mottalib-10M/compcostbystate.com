/** Text of the home page (the pillar). Every figure comes from the kit. */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';

// The example case of the whole site (K.EX): the calculator at the top of the page starts from the same figures.
const { st: ST, code: CODE, payroll: PAY } = K.EX;
const R = K.rate(CODE, ST), EXP = K.prem(PAY, R);
const E = K.R(CODE);
const C8810 = K.R('8810'), C5551 = K.R('5551'), C9082 = K.R('9082');
const CA = K.S('CA'), TX = K.S('TX'), HI = K.S('HI'), ND = K.S('ND');
const idx = K.index();
const OFFICE = PAY;
const off = (st: string) => K.usd(K.prem(OFFICE, K.rate('8810', st)));
const nRules = Object.keys(K.RULES).length;
const MOD = 0.85;

/** The value sentence (RECETTE §2.4), shown on the home page, the About page and the method page. */
export const VALUE = `Insurance sites ask for your phone number before they show a price, and most cost pages quote a national average that means nothing for a roofer or for an office. This site starts from the rate tables states themselves publish: the calculated rate of ${K.NCLASS} classes of work in ${K.N} jurisdictions from the Oregon Department of Consumer and Business Services study, and the ${K.num(K.NWA)} hourly classes of the Washington state fund. Pick your class and your state and you see the price level per $100 of payroll, where it ranks, and what your payroll would cost, without giving a name.`;

export const HOME = {
  title: 'Workers Compensation Cost by State: Class Calculator',
  description: 'Workers compensation cost by state: a yearly premium from your kind of work and payroll, with the January 1, 2024 rates of all 50 states and DC. No sign-up.',
  h1: 'Workers compensation cost by state',
  // Third pass of the naive testers: a concrete case in dollars first, no "median state", no "per $100".
  answer: `Workers compensation cost by state, for one case: a California electrical contractor with ${K.usd(PAY)} of yearly wages pays about ${K.usd(EXP)} a year. The kind of work matters most: on the same wages, ${K.usd(K.prem(PAY, C8810.median))} for office staff and ${K.usd(K.prem(PAY, C5551.median))} for roofers in a typical state.`,
  /** Date of the rates, said at once (third pass: "Google said 2026, the result says January 1, 2024"). */
  dates: 'Rates of January 1, 2024: the latest official comparison of all 50 states and DC (Oregon’s insurance regulator, June 2025; it comes out every two years).',
  intro: 'For employers: pick the work your employees do and your state, enter the payroll, and the calculator estimates the yearly premium your business pays.',
  resume: `Workers’ compensation is priced per $100 of payroll, class of work by class of work, state by state. The Oregon Department of Consumer and Business Services (DCBS) compares the ${K.N} jurisdictions (50 states and DC) every two years on ${K.NCLASS} classes, and its latest study compares the rates in effect on January 1, 2024. All work mixed, Hawaii is the most expensive at ${K.pct(HI.pctMedian)} of the median state and North Dakota the cheapest at ${K.pct(ND.pctMedian)}; California ranks ${K.ord(CA.rank)} at ${K.pct(CA.pctMedian)} and Texas ${K.ord(TX.rank)} at ${K.pct(TX.pctMedian)}. The class weighs more than the state. Clerical office work (class 8810) runs from ${K.r100(C8810.low.rate)} to ${K.r100(C8810.high.rate)} per $100, roofing (5551) from ${K.r100(C5551.low.rate)} to ${K.r100(C5551.high.rate)}. An electrical contractor in California with ${K.usd(PAY)} of payroll in class ${CODE} would pay about ${K.usd(EXP)} a year at the average rate of ${K.r100(R)}, before its experience modification, the factor that raises or lowers a premium by its claims record. Your insurer sets the final price.`,
  faqs: [
    { q: 'How is a workers’ comp premium calculated?', a: `Payroll divided by 100, times the rate of your class code in your state, times your experience modification, then plus or minus the insurer’s own credits, fees and state surcharges. With ${K.usd(PAY)} of payroll at ${K.r100(R)} the base is ${K.usd(EXP)}. A mod of 0.85 takes it to ${K.usd(EXP * MOD)}. Each class on the policy is priced on its own payroll.`, open: true },
    { q: 'Which state has the cheapest workers’ comp?', a: `In the Oregon study of rates in effect on January 1, 2024, North Dakota had the lowest price level, all work mixed, at ${K.pct(ND.pctMedian)} of the median state, then ${K.name(idx[K.N - 2].st)} and ${K.name(idx[K.N - 3].st)}. The index weights ${K.NCLASS} classes by one payroll mix; for one class, the order can differ. The class calculator shows the order for yours.` },
    { q: 'Why do two states charge so differently for the same work?', a: 'Benefit laws differ, and so do medical fees, the number and length of claims, the expenses and profit insurers load onto the bureau rate, and the taxes and assessments a state adds. Some states run a state fund as the only insurer. The study measures the result, not each cause.' },
    { q: 'Does this site sell insurance or ask for my details?', a: 'No. Radif Partners publishes the site; it is not an insurer, an agent or a broker and receives nothing from any of them. The calculator runs in your browser and asks for no name, phone or e-mail. To buy coverage, ask a licensed agent or your state fund for a quote.' },
    { q: 'Does the employer or the employee pay for workers’ comp?', a: `The employer buys the policy and pays the premium; the cost per employee is a cost of the business, like payroll tax. Washington works differently among the states read here: its state fund lets the employer deduct part of the hourly rate from the worker’s pay, up to ${K.r4(K.WAC['4904'].ded2026)} an hour for clerical office work in 2026.` },
    { q: 'Are these 2026 rates?', a: 'The state-by-state rates are the latest edition of the Oregon study, which compares rates in effect on January 1, 2024 and was published in June 2025; the next edition covers 2026. Washington figures are the 2026 adopted and 2027 proposed hourly rates. Rates moved since 2024 in many states, so read them as relative levels.' },
  ] as FAQ[],
  /** Right under the calculator: what to copy from a policy or a quote. */
  start: (h: Helpers) => `
<h2>What to copy from your policy or quote</h2>
<p>No papers at hand? Keep the example: an electrical contractor in California with ${K.usd(PAY)} of payroll in class ${CODE}. Change the class, the state and the payroll to see your own ballpark figure.</p>
<p>A policy or renewal quote lists each class code with its payroll and its rate per $100. The class code is a four-digit number that describes the work, such as 8810 for clerical office staff or 5551 for roofing. Copy one class at a time: a business with office staff and field crews has two lines, and each is priced on its own payroll. The experience modification, often shortened to mod or EMR (experience modification rate), is a score of your claims record printed on the rating worksheet; enter 1.00 if you do not know it or if your business is too small or too new to have one.</p>
<p>The rate shown here is an average for the state, from a study that collected rates in effect on January 1, 2024. Your insurer applies its own rate, a minimum premium for small policies, and the fees and surcharges of your state. The ${h.a('how-much-does-workers-comp-cost', 'cost guide')} lists those lines.</p>
`,
  /** Open sections. */
  guide: (h: Helpers) => `
<h2>Workers compensation cost by state: what the ranking says</h2>
<p>Every two years the Oregon Department of Consumer and Business Services asks insurance regulators and rating bureaus in all ${K.N} jurisdictions for the rate of the same ${K.NCLASS} classes of work, adds the average expense load of insurers and the state assessments, and weights them the same way in every state. The result is a price level, all work mixed: 200% means about twice the median state (${h.src('dcbs_2024', 'Oregon state study')}).</p>
${h.table(['Rank', 'State', 'Price level (median state = 100%)'], [...idx.slice(0, 5), ...idx.slice(-5)].map((x) => [String(x.rank), K.name(x.st), K.pct(x.pctMedian)]), 'Five most expensive and five cheapest states, all work mixed, rates of January 1, 2024', ['r', 'l', 'r'])}
<p>Hawaii at ${K.pct(HI.pctMedian)} means employers there pay, on average, more than twice what they pay in the median state. Your own premium still follows your kind of work: the calculators above give it in dollars. The ${h.a('workers-comp-rates-by-state', 'state ranking page')} lists all 50 states and DC, and each state page lists its ${K.NCLASS} classes.</p>
<h2>Your class code decides most of the price</h2>
<p>Within one state, rates of the study run from a few cents to tens of dollars per $100. In the median state, clerical office work costs ${K.r100(C8810.median)} per $100, a restaurant (9082) ${K.r100(C9082.median)} and roofing ${K.r100(C5551.median)}. A firm of ${K.usd(OFFICE)} of office payroll pays about ${off('TX')} a year in Texas, ${off('FL')} in Florida and ${off('CA')} in California at the study rates. The same payroll in roofing would cost thousands.</p>
${h.mini('rank', { t: 'One kind of work, your state against the others', p: ['code', 'st'], d: { code: '8810', pay: OFFICE } })}
<p>Classes follow the work, not the job title. A contractor’s estimator who works in the office can be clerical; the same person on a roof is a roofer for those hours, under the rules of the state. The ${h.a('workers-comp-class-codes', 'class code guide')} explains how the codes are assigned and which states use their own system.</p>
<h2>Who has to carry it, and who sells it</h2>
<p>Almost every state requires coverage once you hire, but the threshold varies. This site has read the rule of ${nRules} states on the state’s own site. California requires it from the first employee, and even a roofer with no employees. Florida requires it from one employee in construction and from four elsewhere; Georgia from three; Missouri from five, or one in construction. Texas leaves it to the employer, and South Dakota has no law requiring it. Washington requires it but forbids private insurers: you buy from the state fund.</p>
<p>New to the subject? The ${h.a('workmans-comp', 'workmans comp overview')} explains the system state by state, the ${h.a('workers-comp-insurance', 'workers’ comp insurance page')} how a policy is priced and bought, and the ${h.a('state-fund-workers-comp', 'state fund page')} where the state itself sells coverage. ${h.a('workers-comp-insurance-for-small-business', 'Small businesses')}, the ${h.a('workers-comp-insurance-for-self-employed', 'self-employed')} and ${h.a('workers-compensation-insurance-for-contractors', 'contractors')} each have their own page, and the ${h.a('workers-comp-quotes', 'quote checker')} compares a quote with the average rate.</p>
${h.mini('required', { t: 'Do you have to carry it?', p: ['st', 'emp'], d: { st: 'GA', emp: 3 } })}
`,
  /** Folded sections (<details>, content kept in the HTML). */
  folds: [
    { id: 'mod', title: 'The experience modification: your claims record in the price', html: (h: Helpers) => `
<p>Once a business has a few years of premium, a rating bureau compares its claims with those expected for its payroll and class mix. The result is a factor applied to the whole premium: 1.00 is average, 0.85 is a 15% credit, 1.25 a 25% surcharge. On the example premium of ${K.usd(EXP)}, a mod of 0.85 saves ${K.usd(EXP * (1 - MOD))} a year. The ${h.a('experience-modification-rate', 'mod calculator')} shows the effect on your own figures and how claims enter the formula.</p>
` },
    { id: 'washington', title: 'Washington: a state fund priced by the hour', html: (h: Helpers) => `
<p>Washington is one of the states where only the state fund, run by the Department of Labor &amp; Industries, sells coverage. It prices by the hour worked, not per $100 of payroll, and lets the employer take part of the rate from the worker’s pay. The average rate across all classes is ${K.r4(K.CH.wa.avg2026)} an hour in 2026, up ${K.pct(K.CH.wa.chg2026, 1)}, and ${K.r4(K.CH.wa.avg2027)} proposed for 2027 (${h.src('wa_bus2027', 'Washington Department of Labor & Industries')}). The ${h.a('washington-workers-comp-rates', 'Washington calculator')} covers its ${K.num(K.NWA)} classes.</p>
` },
    { id: 'changes', title: 'Rates are moving: California, Oregon and Washington', html: (h: Helpers) => `
<p>California’s insurance commissioner adopted an average advisory pure premium rate of ${K.r100(K.CH.ca.rate)} per $100 of payroll from September 1, 2026, up ${K.pct(K.CH.ca.pct, 1)}; the rating bureau had asked for ${K.pct(K.CH.ca.requested, 1)} (${h.src('ca_cdi', 'California Department of Insurance')}). Oregon’s pure premium rises ${K.pct(K.CH.or2027.purePremiumPct, 1)} on average in 2027, after falling ${K.pct(-K.CH.or2027.since2018, 1)} since 2018. The ${h.a('workers-comp-rate-changes', 'rate change page')} applies each change to a premium.</p>
` },
  ],
  sources: ['dcbs_2024', 'dcbs_page', 'wa_rates', 'wa_bus2027', 'ca_cdi', 'or_cost', 'ca_dwc', 'fl_dwc', 'ga_sbwc', 'tx_tdi'],
};

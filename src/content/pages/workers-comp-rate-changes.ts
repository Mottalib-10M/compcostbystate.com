import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.CH;
const PREM = 10000;
const after = (p: number) => PREM * (1 + p / 100);
const OR = K.S('OR');
const moves = Object.values(K.WAC).map((c) => c.comp2027 / c.comp2026 - 1);
const minMove = Math.min(...moves), maxMove = Math.max(...moves);
const wac = Object.entries(K.WAC).map(([code, c]) => ({ code, desc: c.desc, chg: c.comp2027 / c.comp2026 - 1 })).sort((a, b) => b.chg - a.chg);
const up = wac[0], down = wac[wac.length - 1];

export default definePage({
  id: 'workers-comp-rate-changes', group: 'cost', order: 7, slug: 'workers-comp-rate-changes',
  nav: 'Rate changes 2026 and 2027', card: 'California’s September 2026 increase, Oregon and Washington in 2027, applied to your premium.',
  title: 'Workers Comp Rate Changes 2026 and 2027: Premium Impact',
  description: 'Workers comp rate changes for 2026 and 2027: California +6.6% from September 2026, Oregon +2.1% and Washington +4.9% in 2027, applied to your premium.',
  h1: 'Workers’ comp rate changes for 2026 and 2027',
  intro: 'Workers’ comp rate changes announced by three states, applied to your own yearly premium: enter it and pick a change.',
  resume: `After years in which rates fell across the country, as the Oregon study of all states notes, California, Oregon and Washington announced increases for 2026 and 2027. California’s insurance commissioner adopted an average advisory pure premium rate of ${K.r100(C.ca.rate)} per $100 of payroll effective ${K.day(C.ca.effective)}, ${K.pct(C.ca.pct, 1)} above the 2025 rate and below the ${K.pct(C.ca.requested, 1)} the Workers’ Compensation Insurance Rating Bureau of California (WCIRB) had asked for. Oregon’s average pure premium rises ${K.pct(C.or2027.purePremiumPct, 1)} in 2027, after a ${K.pct(-C.or2027.since2018, 1)} fall since 2018, with the premium assessment unchanged at ${K.pct(C.or2027.assessmentPct, 1)}. Washington’s state fund raised its average hourly rate ${K.pct(C.wa.chg2026, 1)} in 2026, to ${K.r4(C.wa.avg2026)}, and proposes another ${K.pct(C.wa.chg2027, 1)} for 2027. On a ${K.usd(PREM)} premium, the California change alone adds ${K.usd(after(C.ca.pct) - PREM)} a year if the insurer follows it. These are averages across all classes: a single class can move more or less, and insurers in competitive states set their own rates on top.`,
  faqs: [
    { q: 'Do California insurers have to follow the 6.6% increase?', a: `No. The commissioner’s release says the adopted rate is advisory, meaning insurers are not bound by it and are free to set their own rates. It is a benchmark of expected claims cost, the pure premium, to which each insurer adds its expenses and profit. Expect renewals to move in the same direction, by amounts that differ between insurers.`, open: true },
    { q: 'Why did Oregon raise its 2027 pure premium?', a: `The Oregon Department of Consumer and Business Services attributes the increase to Senate Bill 1519, which increased benefits for workers injured on the job. Even with the increase, the department notes that the pure premium has fallen ${K.pct(-C.or2027.since2018, 1)} since 2018. A new BOLI Expenses Fund component also adds ${K.dec(C.or2027.boliCents)} cent per hour worked in 2027.` },
    { q: 'What is a pure premium rate?', a: 'The part of the rate meant to pay claims: medical care, wage replacement and other benefits, without the insurer’s expenses, taxes or profit. Rating bureaus publish pure premiums, also called loss costs, by class; insurers multiply them by a factor they file to reach the rate they charge. A change in the pure premium therefore moves the final rate by about the same percentage.' },
  ],
  body: (h) => `
<h2>Workers’ comp rate changes announced by three states</h2>
${h.table(['State', 'What changes', 'Average change', `On a ${K.usd(PREM)} premium`], [
    ['California', `Advisory pure premium, ${K.r100(C.ca.rate)} per $100, from ${K.day(C.ca.effective)}`, `+${K.pct(C.ca.pct, 1)}`, K.usd(after(C.ca.pct))],
    ['Oregon', 'Average pure premium, 2027', `+${K.pct(C.or2027.purePremiumPct, 1)}`, K.usd(after(C.or2027.purePremiumPct))],
    ['Washington', `Average hourly rate, 2026: ${K.r4(C.wa.avg2026)}`, `+${K.pct(C.wa.chg2026, 1)}`, K.usd(after(C.wa.chg2026))],
    ['Washington', `Average hourly rate proposed for 2027: ${K.r4(C.wa.avg2027)}`, `+${K.pct(C.wa.chg2027, 1)}`, K.usd(after(C.wa.chg2027))],
  ], 'Changes published by state agencies, read on November 13, 2026', ['l', 'l', 'r', 'r'])}
<p>Sources: ${h.src('ca_cdi', 'California Department of Insurance')}, ${h.src('or_cost', 'Oregon DCBS')}, ${h.src('wa_bus2027', 'Washington L&I')}.</p>
<h2>California: an advisory increase</h2>
<p>California runs a competitive market: the WCIRB proposes a benchmark, the commissioner adopts an advisory rate, and each insurer files its own rates. The adopted figure of ${K.r100(C.ca.rate)} per $100 of payroll is an average across classes. In the Oregon study of rates in effect on January 1, 2024, California was already the ${K.ord(K.S('CA').rank)} most expensive jurisdiction, so the increase widens a gap that existed. The ${h.a('california-workers-comp-rates', 'California page')} lists the rates of its classes in that study.</p>
${h.mini('change', { t: 'Your premium after the change', p: ['prem', 'ch'], d: { prem: 25000, ch: 'or' } })}
<h2>Oregon and Washington in 2027</h2>
<p>Oregon’s department sets the pure premium and the assessments that fund its programs. Besides the ${K.pct(C.or2027.purePremiumPct, 1)} increase, the premium assessment stays at ${K.pct(C.or2027.assessmentPct, 1)}, the Workers’ Benefit Fund assessment rises to ${K.dec(C.or2027.wbfCents)} cents per hour worked, and a new BOLI Expenses Fund component adds ${K.dec(C.or2027.boliCents)} cent per hour. Oregon remains below the median: it ranked ${K.ord(OR.rank)} of ${K.N} in the latest study. The ${h.a('oregon-workers-comp-rates', 'Oregon page')} gives its classes.</p>
<p>Washington’s change applies directly, since L&I is the only insurer. Its average rate per hour worked rose ${K.pct(C.wa.chg2026, 1)} in 2026 and the proposal for 2027 repeats the same increase; individual classes move from ${K.pct(minMove * 100, 1)} to +${K.pct(maxMove * 100, 1)}. The ${h.a('washington-workers-comp-rates', 'Washington calculator')} shows the 2027 rate of your class.</p>
<h2>Reading a renewal</h2>
<p>An announced average does not tell you your renewal. Between two policy years, the premium also moves with your payroll, your experience modification, the rate of your own class and the insurer’s pricing. Compare the renewal’s rate per $100 for each class with last year’s, then its mod and its credits: that separates the state’s change from the rest. The ${h.a('experience-modification-rate', 'mod page')} shows how much a change of mod is worth.</p>
<h2>Classes that move the most in Washington</h2>
<p>Washington publishes its proposed rate for every class, which shows how far individual classes stray from the average. In the 2027 proposal, the largest increase is ${K.pct(up.chg * 100, 1)} for ${up.desc.toLowerCase()} (class ${up.code}), and the largest decrease ${K.pct(down.chg * 100, 1)} for ${down.desc.toLowerCase()} (class ${down.code}). An employer in a class far from the average should look up its own line rather than apply the ${K.pct(C.wa.chg2027, 1)} average.</p>
<h2>Where to find the change for your state</h2>
<p>Each state publishes its rate decisions through its insurance department or its workers’ compensation agency. In states that use a rating bureau, the bureau files new loss costs or rates, often once a year, and the regulator approves or adjusts them; insurers then file their own multipliers. Look for the decision that applies on your renewal date, and compare its average change with the change of your own class, which the filing usually lists. When the rate of your class falls but your premium rises, the cause is elsewhere: payroll, the mod or the insurer’s pricing.</p>
<p><strong>The example case.</strong> The California electrical contractor used across this site pays about ${K.usd(K.prem(K.EX.payroll, K.rate(K.EX.code, K.EX.st)))} a year at the study rate. If its insurer passed on the full average change of ${K.pct(C.ca.pct, 1)}, the renewal would rise by about ${K.usd(K.prem(K.EX.payroll, K.rate(K.EX.code, K.EX.st)) * C.ca.pct / 100)}.</p>
`,
  tool: 'change',
  related: ['california-workers-comp-rates', 'oregon-workers-comp-rates', 'washington-workers-comp-rates', 'experience-modification-rate'],
  sources: ['ca_cdi', 'or_cost', 'wa_bus2027'],
});

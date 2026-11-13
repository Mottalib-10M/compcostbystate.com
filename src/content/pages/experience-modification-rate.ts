import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const { st: ST, code: CODE, payroll: PAY } = K.EX;
const MAN = K.prem(PAY, K.rate(CODE, ST));
const at = (m: number) => MAN * m;
const ROOF = K.prem(PAY, K.rate('5551', 'GA'));

export default definePage({
  id: 'experience-modification-rate', group: 'cost', order: 4, slug: 'experience-modification-rate',
  nav: 'Experience mod (EMR)', card: 'What a mod of 0.85 or 1.25 does to your premium, in dollars, and how claims feed it.',
  title: 'Experience Modification Rate 2026: What Your Mod Costs',
  description: 'Experience modification rate in 2026: what a mod of 0.85, 1.00 or 1.25 does to a workers comp premium in dollars, how claims feed it and how long they weigh.',
  h1: 'Experience modification rate: what your mod costs or saves',
  intro: 'Experience modification rate in dollars: enter your mod from the rating worksheet and the premium before it to see the saving or surcharge.',
  resume: `The experience modification rate, called the mod or EMR, is a factor that adjusts a workers’ compensation premium to the employer’s own claims record. A mod of 1.00 means claims in line with what is expected for that payroll and class mix; below 1.00 is a credit, above a surcharge. It multiplies the premium of every class on the policy, so its effect is easy to put in dollars. On the example premium of ${K.usd(MAN)}, a California electrical contractor with ${K.usd(PAY)} of payroll at the study rate, a mod of 0.85 brings the bill to ${K.usd(at(0.85))} and saves ${K.usd(MAN - at(0.85))} a year, while a mod of 1.25 raises it to ${K.usd(at(1.25))}. The same factor on a roofing premium in Georgia, the most expensive state for roofing in the Oregon study at ${K.r100(K.rate('5551', 'GA'))} per $100, moves thousands of dollars more. A rating bureau computes the mod, generally from three years of payroll and claims; the employer cannot set it but can follow how each claim feeds it.`,
  faqs: [
    { q: 'What is a good experience mod?', a: 'Anything below 1.00 means your claims cost less than expected for a business of your size and class mix, and earns a credit. Some project owners and general contractors set a maximum mod, often around 1.00, for the subcontractors they hire; the threshold is theirs, not a legal rule. Read the bid documents.', open: true },
    { q: 'Who calculates the mod?', a: 'The rating bureau of your state: the National Council on Compensation Insurance (NCCI) in most states, or an independent bureau in states such as California, New York, Pennsylvania, Michigan or Wisconsin. Monopolistic state funds compute their own experience factor. The insurer applies the mod; it cannot change it.' },
    { q: 'Does a small claim hurt my mod?', a: 'Less than a large one, but frequency weighs heavily: the formulas give full weight to the first part of every claim and only partial weight to the rest, so several small claims can raise a mod more than one large claim of the same total. In some states medical-only claims are reduced in the calculation.' },
    { q: 'How long does a claim stay in my mod?', a: 'Generally for three rating years. The experience period usually covers three complete policy years and leaves out the most recent year, which is not yet mature, so a claim starts to count about a year after it happens and drops out after three ratings.' },
  ],
  body: (h) => `
<h2>Experience modification rate in dollars</h2>
<p>The calculator uses the premium before the mod, called the manual premium: payroll divided by 100 times the class rate, summed over the classes of the policy. The default is the example of the site, ${K.usd(MAN)}. Replace it with the manual premium on your own worksheet and enter the mod printed beside it.</p>
${h.table(['Mod', 'Premium', 'Against 1.00'], [0.75, 0.85, 1, 1.15, 1.25, 1.5].map((m) => [K.dec(m, 2), K.usd(at(m)), m === 1 ? 'no change' : `${m < 1 ? '' : '+'}${K.usd(at(m) - MAN)}`]), `Effect of the mod on a manual premium of ${K.usd(MAN)}`, ['l', 'r', 'r'])}
<p>The mod applies after the class rates and before most other credits. On a large premium the same factor is worth more: a roofing contractor in Georgia with ${K.usd(PAY)} of payroll would carry a manual premium of about ${K.usd(ROOF)}, where a mod of 0.85 is worth ${K.usd(ROOF * 0.15)} a year.</p>
${h.mini('estimate', { t: 'Manual premium of one class', p: ['code', 'st'], d: { code: '5551', st: 'GA' } })}
<h2>How claims feed the mod</h2>
<p>The bureau compares the employer’s actual losses over the experience period with the expected losses for its payroll in each class. Expected losses come from tables of expected loss rates per $100 of payroll by class, published by the bureau. Large claims are capped and only partly counted, so that one bad accident does not ruin a small employer; the first part of every claim counts in full. That design makes the number of claims matter as much as their size.</p>
<p>Not every employer has a mod. Each state sets a minimum premium level for eligibility, and a new or very small business is rated at 1.00 until it has enough history. When a business changes owners, the mod can follow the operations to the new owner under the bureau’s ownership rules.</p>
<h2>Bringing a mod down</h2>
<p>The mod responds to what the employer reports and how claims are handled. Report injuries promptly, since late claims tend to cost more. Bring injured workers back on light duty where a doctor allows it, so that wage-loss payments stop sooner. Check the payroll and claims on the worksheet before the rating takes effect: a closed claim still carrying a large reserve, or payroll reported in the wrong class, both distort the result. Bureaus accept corrections of errors through the insurer.</p>
<p>The ${h.a('how-much-does-workers-comp-cost', 'cost guide')} lists the other lines of a quote, and the ${h.a('workers-comp-class-codes', 'class code page')} the rate of each class before the mod.</p>
<h2>Two contractors, two mods</h2>
<p>Take two businesses with the same payroll and the same class, so the same manual premium of ${K.usd(MAN)}. One has a mod of 0.80 after three quiet years; the other a mod of 1.30 after a run of claims. The first pays ${K.usd(at(0.8))} a year, the second ${K.usd(at(1.3))}: a gap of ${K.usd(at(1.3) - at(0.8))} a year for the same work, and a mod stays in place for a full year at each rating. Over three ratings the gap can approach ${K.usd((at(1.3) - at(0.8)) * 3)}, before counting the contracts the second business may lose where clients set a maximum mod.</p>
<h2>Reading the worksheet</h2>
<p>The rating worksheet lists, for each year of the experience period, the payroll by class, the expected losses computed from it and the actual losses of each claim, split into the part counted in full and the part counted only partly. At the bottom it shows the resulting mod and its effective date. Compare the claims listed with your own records: a claim charged to the wrong employer, or a reserve the insurer has since lowered, can be corrected before the rating is final.</p>
`,
  tool: 'mod',
  related: ['how-much-does-workers-comp-cost', 'workers-comp-class-codes', 'class-code-5551', 'workers-comp-rates-by-state'],
  sources: ['dcbs_2024'],
});

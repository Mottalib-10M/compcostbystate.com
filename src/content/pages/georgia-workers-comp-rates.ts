import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'GA', S = K.S(ST), G = K.GA;
const r = (c: string) => K.rate(c, ST);
const list = K.stateClasses(ST);
const firsts = list.filter((x) => x.rank === 1);
const PAY = 200000;
const FL = 'FL';

export default definePage({
  id: 'georgia-workers-comp-rates', group: 'states', order: 23, slug: 'georgia-workers-comp-rates',
  nav: 'Georgia', card: 'Georgia sits at the national median overall but has the highest roofing and framing rates.',
  title: 'Georgia Workers Comp Rates 2026: Roofing, Framing, Classes',
  description: 'Georgia workers comp rates in 2026: the national median overall in the state study, yet the highest roofing and framing rates of 51; the three-employee rule.',
  h1: 'Georgia workers’ comp rates: median overall, highest for roofing',
  intro: 'Georgia workers’ comp rates for each class of the Oregon state study, with the premium on the payroll you enter.',
  resume: `Georgia is a state of contrasts for workers’ compensation. Its premium index in the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024 (Georgia’s dating from ${S.effective}) was ${K.r100(S.index)} per $100 of payroll, exactly the national median, ranking ${K.ord(S.rank)} of ${K.N} after ${K.ord(S.rank2022)} in the previous study. Yet Georgia had the highest rate in the country for ${firsts.length} classes: roofing (5551) at ${K.r100(r('5551'))} per $100 and house framing (5645) at ${K.r100(r('5645'))}, against national medians of ${K.r100(K.R('5551').median)} and ${K.r100(K.R('5645').median)}. On ${K.usd(PAY)} of roofing payroll that is about ${K.usd(K.prem(PAY, r('5551')))} a year, where neighboring Florida’s rate gives ${K.usd(K.prem(PAY, K.rate('5551', FL)))}. Office work, by contrast, cost ${K.r100(r('8810'))}. The State Board of Workers’ Compensation requires coverage from employers regularly employing three or more persons, part-time or full time, and can assess a civil penalty of ${K.usd(G.min)} to ${K.usd(G.max)} per occurrence when an employer fails to provide it.`,
  faqs: [
    { q: 'Why is roofing so expensive in Georgia?', a: 'The study reports rates, not their causes, so it does not say. It applies to every state the same method: the bureau rate of the class, the average expense multiplier of the largest insurers and the state’s assessments. Georgia’s figure for roofing and framing came out the highest on that common basis. Ask your insurer for the current Georgia rate of your class.', open: true },
    { q: 'Do corporate officers count toward Georgia’s three employees?', a: 'The State Board says exempted officers of corporations and exempted members of limited liability companies do not reduce the number of employees counted for the three-person rule. Employees include minors and part-time workers under a contract of hire, written or implied.' },
    { q: 'What happens to a Georgia employer without required coverage?', a: `The Board may assess a civil penalty of ${K.usd(G.min)} to ${K.usd(G.max)} per occurrence. An employer refusing or willfully neglecting to insure is guilty of a misdemeanor, punishable by a fine of ${K.usd(G.criminalMin)} to ${K.usd(G.criminalMax)}, imprisonment of up to ${G.jailMonths} months, or both, and remains responsible for the compensation owed.` },
    { q: 'What notices must a Georgia employer post?', a: 'A notice showing compliance with the law, the State Board’s bill of rights for the injured worker and a panel of physicians, in a conspicuous place, with the name of the insurance company, or the certificate of self-insurance for a self-insured employer. The Board provides the notices on request.' },
  ],
  body: (h) => `
<h2>Georgia workers’ comp rates for building trades</h2>
${h.table(['Class', 'Work', 'Georgia per $100', 'Rank of 51', 'National median'], ['5551', '5645', '5474', '5403', '5190', '5183', '8810'].map((c) => [c, K.cls(c).short, K.r100(r(c)), String(K.rank(c, ST)), K.r100(K.R(c).median)]), 'Georgia in the study of rates in effect on January 1, 2024 (rank 1 = highest)', ['l', 'l', 'r', 'r', 'r'])}
<p>The study notes that for Georgia, and for ten other states, some taxes and assessments reported earlier were already inside the bureau rates or the insurers’ filings, and were removed to avoid counting them twice (${h.src('dcbs_2024', 'Oregon state study')}). The roofing and framing figures do not count them twice. Painting (5474) also ranked ${K.ord(K.rank('5474', ST))} in the country.</p>
${h.mini('estimate', { t: 'Georgia premium for one class', p: ['code', 'pay'], d: { st: ST, code: '5551', pay: PAY } })}
<h2>The three-employee rule</h2>
<p>The State Board of Workers’ Compensation states that every employer, individual, firm, association or corporation regularly employing three or more persons, part-time or full time, shall provide coverage (${h.src('ga_sbwc', 'Georgia State Board of Workers’ Compensation')}). Exempt officers and members of a limited liability company (LLC) still count toward the three. Employers may insure through an insurer or apply to the Board to self-insure, which requires three years of audited financial statements and, once approved, a surety bond or letter of credit.</p>
<p>Two employees in Georgia is therefore below the rule, three is above it, whatever their hours. A roofing business that grows from two to three workers moves from no coverage to one of the highest rates in the country in one hire. The ${h.a('workers-comp-requirements-by-state', 'requirements page')} compares the thresholds of other states.</p>
<h2>Duties after an injury</h2>
<p>The Board asks employers to report an injury to their insurer as soon as they know of it, and to keep the required notices posted. Those duties apply to every covered employer, whatever its class. For the cost side, the ${h.a('class-code-5551', 'roofing class page')} ranks the ${K.N} states for class 5551, and the ${h.a('experience-modification-rate', 'mod page')} shows how a claims record raises or lowers a Georgia premium.</p>
<h2>Georgia’s other expensive classes</h2>
<p>Roofing and framing are not alone. Georgia ranked ${K.ord(K.rank('5474', ST))} for painting at ${K.r100(r('5474'))}, ${K.ord(K.rank('5437', ST))} for cabinet and trim carpentry (5437) at ${K.r100(r('5437'))}, and ${K.ord(K.rank('37', ST))} for field crop farms (0037). Its rates for public safety, colleges and aviation were in the lower half of the table, and office work ranked ${K.ord(K.rank('8810', ST))}. The pattern points to the residential building trades: a Georgia business outside them pays close to median rates.</p>
<p>Its neighbors priced lower overall. South Carolina’s index was ${K.r100(K.S('SC').index)}, North Carolina’s ${K.r100(K.S('NC').index)}, Tennessee’s ${K.r100(K.S('TN').index)} and Alabama’s ${K.r100(K.S('AL').index)}. For roofing, every neighbor was far below Georgia: ${K.r100(K.rate('5551', 'SC'))} in South Carolina, ${K.r100(K.rate('5551', 'AL'))} in Alabama.</p>
<h2>Self-insuring in Georgia</h2>
<p>A large Georgia employer can apply to the State Board to carry its own risk. The application includes three years of audited financial statements and a non-refundable ${K.usd(500)} fee payable to the Georgia Self-Insurers Guaranty Trust Fund; the Board and the Trust Fund decide, and set the required security after reviewing the file. Questions about insurance rates themselves go to the Office of Insurance and Safety Fire Commissioner, not to the Board.</p>
<h2>A Georgia example: a painting crew</h2>
<p>A painting contractor with three painters earning ${K.usd(45000)} each is covered by the three-employee rule. At Georgia’s rate for painting, ${K.r100(r('5474'))}, the ${K.usd(135000)} payroll would cost about ${K.usd(K.prem(135000, r('5474')))} a year; at South Carolina’s ${K.r100(K.rate('5474', 'SC'))}, ${K.usd(K.prem(135000, K.rate('5474', 'SC')))}; at Florida’s ${K.r100(K.rate('5474', 'FL'))}, ${K.usd(K.prem(135000, K.rate('5474', 'FL')))}.</p>
<p>Painting is the third Georgia class in the national top three, after roofing and framing. Rates in the study date from Georgia’s filing in effect on ${S.effective}; ask a licensed agent for the rates in force today.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['class-code-5551', 'class-code-5645', 'workers-comp-requirements-by-state', 'florida-workers-comp-rates'],
  sources: ['dcbs_2024', 'ga_sbwc'],
});

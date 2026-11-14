import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const CODE = '8810', R = K.R(CODE);
const PAY = K.EX.payroll;
const under10 = R.list.filter((x) => x.rate < 0.1).length;
const wa = K.WAC['4904'];
const ratio = R.high.rate / R.low.rate;

export default definePage({
  id: 'class-code-8810', group: 'classes', order: 40, slug: 'class-code-8810',
  nav: '8810 Office staff', card: 'The cheapest common class: clerical office rates in 51 states, and who qualifies for it.',
  title: 'Class Code 8810 Rates 2026: Clerical Office by State',
  description: 'Class code 8810 rates in 2026: clerical office workers comp per $100 of payroll in 51 states, from 4 cents to 48 cents, and the rules for putting staff in it.',
  h1: 'Class code 8810: clerical office rates in every state',
  intro: 'Class code 8810 rates in 51 jurisdictions, highest first, with the premium on the office payroll you enter.',
  resume: `Class code 8810, clerical office employees not otherwise classified, is the cheapest class most businesses will ever see on a workers’ compensation policy. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024, its rate ran from ${K.r100(R.low.rate)} per $100 of payroll in ${K.name(R.low.st)} to ${K.r100(R.high.rate)} in ${K.name(R.high.st)}, with a median of ${K.r100(R.median)} across ${R.count} jurisdictions. ${under10} of them priced it under ten cents. On ${K.usd(PAY)} of office payroll, that is ${K.usd(K.prem(PAY, R.median))} a year at the median and ${K.usd(K.prem(PAY, R.high.rate))} in Hawaii, ${K.dec(ratio, 0)} times the cheapest state. California, at ${K.r100(K.rate(CODE, 'CA'))}, ranked ${K.ord(K.rank(CODE, 'CA'))}. Because the class is so cheap, the question is less the rate than who may be reported in it: employees whose duties are confined to office work, kept apart from the operations of the business. Moving a field worker into 8810 to save premium is reversed at the audit.`,
  faqs: [
    { q: 'What does class code 8810 cover?', a: 'Clerical office employees not otherwise classified: staff doing office work such as correspondence, bookkeeping, filing, data entry and answering phones, in an office separated from the operations of the business. It is one of the standard exception classes, which can be split out from a business’s main class when the conditions of the manual are met.', open: true },
    { q: 'Can a business with only office staff use 8810 as its main class?', a: 'Yes, when the business itself is office work not described by a more specific class. Many professional firms use their own codes instead: the study lists, for example, physicians and clerical (8832) and college professional employees (8868), with rates of their own. The insurer picks the code that describes the business.' },
    { q: 'Is 8810 the same in every state?', a: `Most states use code 8810 or a close equivalent, but the rules for qualifying differ, and some states with their own manuals number the class differently. Washington, for example, prices clerical office work under its own class 4904, at ${K.r4(wa.comp2026)} per hour worked in 2026 rather than per $100 of payroll.` },
  ],
  body: (h) => `
<h2>Class code 8810 rates: the highest and lowest states</h2>
<p>The spread looks large in ratio and small in dollars. Even in Hawaii, office payroll costs less than half a cent per dollar of wages (${h.src('dcbs_2024', 'Oregon state study')}). For an office business, the minimum premium and the policy fees of a quote can weigh more than the rate itself.</p>
${h.mini('perEmployee', { t: 'Cost per office employee, a year', p: ['st', 'emp'], d: { code: CODE, st: 'CA' } })}
<h2>Who belongs in 8810</h2>
<p>The class exists so that office staff do not pay the rate of the field crews of the same employer. A contractor, a manufacturer or a trucking firm can report its bookkeeper, its receptionist and its office manager in 8810 rather than in the construction, factory or trucking class. The manuals require that the office be physically separated from the operations, and that the employee’s duties stay clerical. An employee who also loads trucks, visits job sites or works the shop floor is usually classified with the operations for all or part of the payroll.</p>
<p>Insurers check this at the payroll audit by asking for job descriptions and sometimes visiting the premises. Keep a list of office staff with their duties, and time records for anyone who splits time between the office and the field. The ${h.a('workers-comp-class-codes', 'class code guide')} explains how a policy combines several classes.</p>
<h2>Outside sales and remote staff</h2>
<p>Salespeople who travel to customers are not clerical: they go in class 8742, which costs more, with a median of ${K.r100(K.R('8742').median)} in the study. The ${h.a('class-code-8742', '8742 page')} ranks it. Employees working from home on office tasks are generally still clerical, but confirm it with the insurer, since some states have specific wording on remote work.</p>
<h2>Class 8810 in the largest states</h2>
<p>California’s office rate of ${K.r100(K.rate(CODE, 'CA'))} was more than three times Texas’s ${K.r100(K.rate(CODE, 'TX'))}. New York charged ${K.r100(K.rate(CODE, 'NY'))}, Florida ${K.r100(K.rate(CODE, 'FL'))}, Pennsylvania ${K.r100(K.rate(CODE, 'PA'))}. For a company with a head office in one state and branch offices in others, each office’s payroll is rated in its own state, so moving a back office from California to Texas changes this line of the policy but rarely the total by much.</p>
<p>For an office-only business, the premium at these rates is often small enough that the insurer’s minimum premium applies instead. Ask the insurer for its minimum for class 8810 in your state; it can exceed the premium the rate gives on a modest payroll.</p>
<h2>Other office-type classes</h2>
<p>Not every office is clerical. The study also priced physicians and their clerical staff (8832), with a median of ${K.r100(K.R('8832').median)} per $100, and the professional and clerical staff of colleges (8868), with a median of ${K.r100(K.R('8868').median)}. Both are higher than 8810’s ${K.r100(R.median)}. A medical practice, a school or a professional firm may be placed in its own industry class rather than in 8810, depending on the state’s manual. For a small office of three people earning ${K.usd(50000)} each, the median 8810 rate gives a premium of about ${K.usd(K.prem(150000, R.median))} a year, which is often below what an insurer charges as a minimum.</p>
<p>Office workers rarely make large claims, which is why the class is cheap. The premium still buys the same coverage for them as for any employee.</p>
`,
  tool: 'rank', toolArg: { code: CODE, pay: PAY, st: 'CA' },
  related: ['class-code-8742', 'workers-comp-class-codes', 'how-much-does-workers-comp-cost', 'washington-workers-comp-rates'],
  sources: ['dcbs_2024', 'wa_fund2026'],
});

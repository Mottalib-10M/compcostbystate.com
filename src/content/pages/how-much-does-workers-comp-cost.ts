import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const { st: ST, code: CODE, payroll: PAY, employees: EMP, hours: HRS } = K.EX;
const R = K.rate(CODE, ST), P = K.prem(PAY, R), per = K.per(P, EMP, HRS);
const WAGE = PAY / EMP;
const shop = { code: '8017', pay: 150000 }, rest = { code: '9082', pay: 400000 }, off = { code: '8810', pay: 250000 };
const cost = (code: string, pay: number, st: string) => K.prem(pay, K.rate(code, st));
const mixed = { field: 240000, office: 60000 };
const mixedCost = cost(CODE, mixed.field, ST) + cost('8810', mixed.office, ST);

export default definePage({
  id: 'how-much-does-workers-comp-cost', group: 'cost', order: 3, slug: 'how-much-does-workers-comp-cost',
  nav: 'Cost per employee', card: 'A premium turned into a cost per employee, per month and per hour, for your class and state.',
  title: 'Workers Comp Cost per Employee 2026: Premium Calculator',
  description: 'Workers comp cost per employee in 2026: turn a class rate per $100 of payroll into a yearly, monthly and hourly cost, plus the fees a quote adds to it.',
  h1: 'How much does workers’ comp cost per employee?',
  intro: 'Workers’ comp cost per employee: enter the class, the state, the headcount and one wage to get the yearly premium and its cost per employee, per month and per hour.',
  resume: `Workers’ compensation cost per employee is the yearly premium divided by headcount, and the premium is payroll divided by 100, times the rate of the class, times the experience modification. With the average rates in effect on January 1, 2024 in the Oregon state study, a California electrical contractor (class ${CODE}, ${K.r100(R)} per $100) with ${EMP} employees earning ${K.usd(WAGE)} each pays about ${K.usd(P)} a year: ${K.usd(per.perEmployee)} per employee, ${K.usd(per.perMonth)} a month or ${K.r100(per.perHour)} per hour worked over ${K.num(HRS)} hours. The same headcount in an office (8810) would cost ${K.usd(cost('8810', PAY, ST))} in all. A cost per employee is only as good as the wage behind it: the premium follows payroll, so a higher-paid employee in the same class costs more. Quotes then add a minimum premium for small policies, an expense constant, state surcharges and credits that this average does not show.`,
  faqs: [
    { q: 'Is workers’ comp charged per employee or per payroll?', a: 'Per payroll in almost every state: the rate applies to each $100 of wages in the class. Headcount matters only through the wages. Washington is the main exception, with rates per hour worked, and some states cap the payroll counted for owners or set a fixed payroll for them. The cost per employee shown here divides the premium afterwards.', open: true },
    { q: 'Why is my quote higher than the calculated premium?', a: 'Because a quote adds lines the rate does not include: a minimum premium when the payroll is small, an expense constant per policy, taxes and assessments in some states, and the insurer’s own credits or debits. A brand-new business with no claims history also pays at mod 1.00. Ask the agent for the rating worksheet: it shows each line.' },
    { q: 'Do owners count in the payroll?', a: 'It depends on the state and the type of business. Many states let sole proprietors, partners and some corporate officers exclude themselves, and where they are included the payroll counted for them is often limited to a minimum and maximum set by the state. The insurer applies your state’s figures.' },
    { q: 'How is the premium paid?', a: 'Usually as an estimated deposit at the start of the policy year, based on the payroll you expect, then adjusted at the audit once the actual payroll is known. Some insurers offer monthly payments based on each payroll run, which avoids a large bill or refund at the audit.' },
  ],
  body: (h) => `
<h2>Workers’ comp cost per employee, from the class rate</h2>
<p>A rate is quoted per $100 of payroll, so the arithmetic is short. Divide the yearly payroll of the class by 100, multiply by the rate, then by the experience modification. In the example, ${K.usd(PAY)} of payroll divided by 100 is ${K.num(PAY / 100)} units, times ${K.r100(R)} is ${K.usd(P)}. Split over ${EMP} employees, that is ${K.usd(per.perEmployee)} each. The share of wages, ${K.pct((P / PAY) * 100, 2)}, is simply the rate written as a percentage.</p>
<p>The rate is the rate of the class, not of the job title. A business with ${K.usd(mixed.field)} of electrical work and ${K.usd(mixed.office)} of office payroll in California pays about ${K.usd(mixedCost)} with the office payroll reported under 8810, against ${K.usd(cost(CODE, mixed.field + mixed.office, ST))} if everything stayed in the field class.</p>
${h.mini('estimate', { t: 'Premium for one class', p: ['code', 'pay'], d: { code: '8810', pay: off.pay } })}
<h2>What other businesses pay</h2>
<p>At the median state of the study, the same payroll costs very different amounts by class. A retail store with ${K.usd(shop.pay)} of payroll (8017) pays about ${K.usd(K.prem(shop.pay, K.R(shop.code).median))} a year; a restaurant with ${K.usd(rest.pay)} (9082) about ${K.usd(K.prem(rest.pay, K.R(rest.code).median))}; an office with ${K.usd(off.pay)} (8810) about ${K.usd(K.prem(off.pay, K.R(off.code).median))}. The ${h.a('workers-comp-class-codes', 'class code page')} gives the rate of each class in your state, and the ${h.a('workers-comp-rates-by-state', 'state ranking')} shows where your state stands.</p>
<h2>Lines a quote adds to the rate</h2>
<p><strong>Experience modification.</strong> Once a business has enough premium history, its own claims raise or lower the premium through a factor. The ${h.a('experience-modification-rate', 'mod page')} measures it.</p>
<p><strong>Schedule rating.</strong> In many states the insurer may apply credits or debits within limits for safety programs, the condition of the premises or the experience of management.</p>
<p><strong>Premium discount.</strong> Larger premiums usually earn a discount on the portion above a threshold, because the insurer’s expenses do not grow in proportion.</p>
<p><strong>Minimum premium and expense constant.</strong> A small policy pays at least a minimum set by class, and many states allow a flat charge per policy. For a business with one or two low-paid office workers, these lines can be most of the bill.</p>
<p><strong>Taxes and assessments.</strong> States fund their agencies and special funds through surcharges on premium or per hour worked. The study includes them where they are part of the rate. Oregon, for example, adds a premium assessment of ${K.pct(K.CH.or2027.assessmentPct, 1)} in 2027 and a Workers’ Benefit Fund assessment of ${K.dec(K.CH.or2027.wbfCents)} cents per hour (${h.src('or_cost', 'Oregon Department of Consumer and Business Services')}).</p>
<p>None of these lines changes the order of magnitude given by the class rate, which is why the calculator starts there. For a price, ask a licensed agent or the state fund for a quote and compare its rating worksheet line by line with this estimate.</p>
<h2>The audit at the end of the year</h2>
<p>The premium charged at the start of the policy is a deposit on estimated payroll. After the policy year, the insurer audits the actual payroll by class and recalculates. If the example contractor estimated ${K.usd(PAY)} but paid ${K.usd(PAY * 1.2)} in wages, the audit adds about ${K.usd(K.prem(PAY * 0.2, R))} at the same rate; a payroll that came in lower brings a refund. Seasonal hires, raises and overtime all move the final figure. Keep payroll records by class and by state ready for the auditor, and update the insurer during the year when the business grows quickly, so that the final bill holds no surprise.</p>
`,
  tool: 'perEmployee',
  related: ['workers-comp-class-codes', 'experience-modification-rate', 'workers-comp-rates-by-state', 'workers-comp-requirements-by-state'],
  sources: ['dcbs_2024', 'or_cost'],
});

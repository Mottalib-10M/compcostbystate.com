import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const { st: ST, code: CODE, payroll: PAY } = K.EX;
const R = K.rate(CODE, ST), AVG = K.prem(PAY, R);
const Q = 9500;
const imp = K.M.impliedRate(Q, PAY, 1);
const gap = Q / AVG - 1;
// Two quotes for a Texas restaurant, $400,000 of payroll: one on class 9082, one that also reports $60,000 under 8810.
const REST = { st: 'TX', pay: 400000, office: 60000 };
const r9082 = K.rate('9082', REST.st), r8810 = K.rate('8810', REST.st);
const one = K.prem(REST.pay, r9082), split = K.prem(REST.pay - REST.office, r9082) + K.prem(REST.office, r8810);

export default definePage({
  id: 'workers-comp-quotes', group: 'insurance', order: 7, slug: 'workers-comp-quotes',
  nav: 'Check a quote', card: 'Compare the premium on a workers’ comp quote with the average rate of its class in its state.',
  title: 'Workers Comp Quotes 2026: Check a Quote Against State Rates',
  description: 'Workers comp quotes in 2026: read each line of a quote and compare its implied rate per $100 of payroll with the average rate for your class and state.',
  h1: 'Workers’ comp quotes: check a quote against the state rate',
  intro: 'Workers’ comp quotes are hard to compare by their total: enter the quoted premium, the class, the state and the payroll to see how far it sits from the average rate.',
  resume: `Workers’ comp quotes look alike and still differ, because each insurer applies its own multiplier to the base rate of each class, its own credits and its own minimum premium. The way to read one is to bring it back to a rate per $100 of payroll and compare that with a neutral benchmark. This site uses the Oregon study, which averages the rates of each class in each state as of January 1, 2024. Take a California electrical contractor (class ${CODE}) with ${K.usd(PAY)} of payroll quoted ${K.usd(Q)} a year: the implied rate is ${K.r100(imp)} per $100, against an average of ${K.r100(R)}, so the quote is ${K.pct(gap * 100, 0)} above the average premium of ${K.usd(AVG)}. A gap of that size can come from fees and surcharges alone; a much larger one is a reason to check the class code, the payroll and the experience modification printed on the quote. This site sells nothing and passes no details to insurers: the comparison runs in your browser.`,
  faqs: [
    { q: 'How do I compare two workers’ comp quotes?', a: 'Line by line, not by total. Check that both use the same class codes and the same payroll for each class, then compare the rate per $100 of each class, the experience modification, schedule credits, the premium discount and the fees. A cheaper total built on a lower payroll estimate will be corrected at the audit.', open: true },
    { q: 'Why are my workers’ comp quotes so different?', a: 'Insurers file their own loss cost multipliers or deviations on top of the base rates, so the same class can carry different rates. They also choose the class for your work, apply different credits, and some add a minimum premium or charges another leaves out. The Oregon study notes that competitive rating produces a range of rates for an employer.' },
    { q: 'What payroll should a quote use?', a: 'Your expected gross wages for the policy year, class by class, with any owner payroll your state counts. The premium is a deposit: the insurer audits the actual payroll after the year and bills or refunds the difference. An estimate that is too low gives a cheaper quote and a bill later.' },
    { q: 'Is a quote above the state average a bad quote?', a: 'Not necessarily. The study rate is an average of insurers before your experience modification, minimum premium, fees and state surcharges, and it dates from January 1, 2024. A business in its first years or with recent claims often pays more. Use the gap as a prompt to ask questions, not as a verdict.' },
  ],
  body: (h) => `
<h2>Workers’ comp quotes, read line by line</h2>
<p>A quote is a premium calculation laid out in lines. The first lines list each class code with its estimated payroll and its rate per $100; their product is the manual premium. Below come the experience modification, which multiplies it, schedule credits or debits, a premium discount for larger policies, and the charges of the state and the insurer. The total at the bottom mixes all of these, which is why two totals tell you little on their own.</p>
<p>The calculator above reverses the arithmetic. It divides the quoted premium by the payroll in hundreds and by your modification, which gives the rate the quote implies, then sets it next to the average rate of the same class in the same state from the Oregon study (${h.src('dcbs_2024', 'Oregon state study')}). For a policy with several classes, enter the premium and payroll of one class line at a time.</p>
<h2>Why quotes differ from insurer to insurer</h2>
<p>Most states have competitive rating laws. The rating organization publishes loss costs or base rates, and each insurer files the multiplier or deviation it applies. The Oregon study states it plainly: in competitive rating states, individual insurers apply different load factors, which results in a range of premium rates available to an employer. The study’s rates are averages of that range, weighted by premium.</p>
${h.mini('quote', { t: 'Check a second quote', p: ['q', 'code', 'st', 'pay'], d: { q: 3200, code: '8810', st: 'NY', pay: 250000 } })}
<h2>The class code: the biggest line on most quotes</h2>
<p>The wrong class costs more than any rate difference between insurers. A Texas restaurant with ${K.usd(REST.pay)} of payroll all reported under class 9082 starts at about ${K.usd(one)} at the study rate; if ${K.usd(REST.office)} of that payroll is office staff properly reported under 8810, the premium falls to about ${K.usd(split)}. Check that each employee sits in the class of the work done, and that the description of your business on the quote matches what you do. The ${h.a('workers-comp-class-codes', 'class code page')} explains how codes are chosen.</p>
<h2>Other lines to check</h2>
<p><strong>Experience modification.</strong> It should match the latest worksheet of your rating bureau; a quote that assumes 1.00 when you have earned a credit is overpriced. The ${h.a('experience-modification-rate', 'mod page')} shows its effect.</p>
<p><strong>Payroll.</strong> Both quotes should use the same estimate. A lower figure lowers the deposit, not the final premium, which follows the audit.</p>
<p><strong>Minimum premium and fees.</strong> For small payrolls they can exceed the class premium; ask whether they are included in the total.</p>
<p><strong>Dividends.</strong> Some insurers return part of the premium after the year as a dividend. The Oregon study does not adjust its rates for dividends, and a dividend is not promised in advance, so compare quotes on the premium you will be billed and treat a dividend history as a bonus.</p>
<p><strong>The state.</strong> Payroll earned in another state belongs to that state’s rate. A crew working across a border should appear on both state lines.</p>
<p>Once the lines match, the remaining gap between two quotes is the insurers’ own pricing, and the comparison becomes fair. Where coverage is hard to find, the ${h.a('workers-comp-insurance', 'insurance page')} explains the assigned risk plans and the state funds that write the policy when insurers will not.</p>
`,
  tool: 'quote',
  related: ['workers-comp-insurance', 'workers-comp-class-codes', 'experience-modification-rate', 'how-much-does-workers-comp-cost'],
  sources: ['dcbs_2024'],
});

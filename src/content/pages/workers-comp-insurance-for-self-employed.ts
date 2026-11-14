import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// A self-employed house carpenter in Florida who decides to cover himself: $60,000 of earnings, class 5645.
const ME = { code: '5645', st: 'FL', pay: 60000 };
const R = K.rate(ME.code, ME.st), P = K.prem(ME.pay, R);
const OFF = K.prem(ME.pay, K.rate('8810', ME.st));
const CSLB = ['C-8 concrete', 'C-20 warm-air heating, ventilating and air-conditioning', 'C-22 asbestos abatement', 'C-39 roofing', 'C-61/D-49 tree service'];

export default definePage({
  id: 'workers-comp-insurance-for-self-employed', group: 'insurance', order: 5, slug: 'workers-comp-insurance-for-self-employed',
  nav: 'Self-employed', card: 'Whether a sole proprietor or one-person company needs workers’ comp, and what covering yourself costs.',
  title: 'Workers Comp Insurance for Self Employed 2026: Rules, Cost',
  description: 'Workers comp insurance for self employed owners in 2026: when the law requires it with no employees, how owners opt in or out, and what covering yourself costs.',
  h1: 'Workers’ comp insurance for self-employed owners: do you need it?',
  intro: 'Workers’ comp insurance for the self-employed: enter your trade, state and yearly earnings to see what covering yourself would cost at the average rate.',
  resume: `Workers’ comp insurance exists to cover employees, so a self-employed person with nobody on the payroll is outside most state laws. Two things change that. The first is the trade: California’s Contractors State License Board requires every licensed roofing, concrete, heating and air-conditioning, asbestos abatement and tree service contractor to carry workers’ compensation even without employees, and other contractors to file a signed exemption saying they have none. The second is the form of the business: Florida counts corporate officers and LLC members as employees, from the first one in construction, while sole proprietors and partners outside construction are not employees unless they choose to be covered. An owner who opts in pays like any employer. A Florida house carpenter (class ${ME.code}) earning ${K.usd(ME.pay)} would pay about ${K.usd(P)} a year at the average rate of ${K.r100(R)} in the Oregon study, against ${K.usd(OFF)} for office work. Many self-employed people also need coverage because a client asks for a certificate of insurance before letting them work on a site.`,
  faqs: [
    { q: 'Do I need workers’ comp if I am self-employed with no employees?', a: 'Usually not by law, with exceptions. California requires licensed contractors in five trades, roofing among them, to carry it without employees. Florida counts corporate officers and LLC members in construction from the first one, unless they file an exemption. And a client or general contractor may require it by contract even where the law does not.', open: true },
    { q: 'Can a sole proprietor buy workers’ comp for himself?', a: 'In many states, yes. Florida lets sole proprietors and partners outside construction be included by filing form DWC-251 with its Division of Workers’ Compensation. The premium is then calculated on the owner’s earnings, often within a minimum and a maximum payroll that the state sets for owners.' },
    { q: 'What is a certificate of insurance and why do clients ask for one?', a: 'It is a document from the insurer showing that a business has a workers’ comp policy in force. General contractors and larger clients ask for it because, in many states, they can become liable for the injured workers of an uninsured subcontractor. Without employees and without a policy, the subcontractor may instead be asked for a state exemption.' },
    { q: 'Does a one-person LLC need workers’ comp?', a: 'It depends on the state and the trade. Florida counts LLC members toward its threshold of one employee in construction and four elsewhere, and lets members who qualify opt out with an exemption. Montana excepts some owners from its law. Read your state agency’s page on owners and officers, or ask it directly.' },
  ],
  body: (h) => `
<h2>Workers’ comp insurance for the self-employed: the general rule</h2>
<p>A workers’ compensation law protects employees. A sole proprietor who works alone has none, so in most states nothing obliges him or her to buy a policy. The ${h.a('workers-comp-requirements-by-state', 'requirements page')} shows the employee thresholds of sixteen states; with zero employees, almost all of them say coverage is not required. The exceptions come from the trade, the legal form of the business and the contracts the business signs.</p>
${h.mini('required', { t: 'With no employee, is it required?', p: ['st', 'emp', 'con'], d: { st: 'FL', emp: 1, con: 'yes' } })}
<h2>Trades that must carry it with no employees: California</h2>
<p>California goes furthest. Its Contractors State License Board requires active licensees in these classifications to carry workers’ compensation, or a certification of self-insurance, whether or not they have employees (${h.src('cslb_wc', 'CSLB')}):</p>
<ul>${CSLB.map((c) => `<li>${c}</li>`).join('')}</ul>
<p>Other licensed contractors without employees file a signed exemption certifying that they have none. Once they hire, proof of coverage must reach the Board within 90 days of the hire, coverage must be continuous, and a lapse suspends the license, so that any work done meanwhile counts as unlicensed. The ${h.a('california-workers-comp-rates', 'California page')} gives the rates of the state.</p>
<h2>Owners, officers and members: Florida as an example</h2>
<p>Florida separates owners by legal form. Corporate officers and LLC members count as employees, so a one-officer construction company meets the one-employee threshold; owners who meet the conditions can opt out with an exemption. Sole proprietors and partners outside construction are not employees unless they choose to be included, which they do by filing form DWC-251 (${h.src('fl_dwc', 'Florida Division of Workers’ Compensation')}). Other states draw the lines elsewhere: Montana’s law lists owners among its exceptions (${h.src('mt_mca', 'Montana Code')}), and California’s roofing rule applies whatever the form of the business.</p>
<p>Two states read here leave the whole question to the business. In Texas, private employers may choose not to carry coverage, and those without it must tell the state (${h.src('tx_tdi', 'Texas Department of Insurance')}); South Dakota has no law requiring it (${h.src('sd_dlr', 'South Dakota DLR')}). A self-employed person there buys a policy only when a contract asks for one.</p>
<h2>What covering yourself costs</h2>
<p>An owner who opts in pays the rate of his or her class on the payroll counted for the owner. In the example, a Florida house carpenter with ${K.usd(ME.pay)} of earnings pays about ${K.usd(P)} a year at the study rate; a consultant with the same earnings in office work pays about ${K.usd(OFF)}. States often set a minimum and a maximum payroll for owners, and the insurer adds its minimum premium, which for a one-person policy can exceed the calculated amount.</p>
<p>Before paying for your own cover, compare it with what it buys: medical care and wage replacement for a work injury, under the state’s benefit rules. A private disability or health policy works differently and does not satisfy a contract that asks for workers’ comp. Where a client only needs proof that you have no employees, a state exemption, where one exists, is the document the law provides.</p>
<h2>Hiring changes everything</h2>
<p>The first employee, even part-time, can bring a self-employed person under the law of the state, sometimes on the first day. Plan the policy before the hire. The ${h.a('workers-comp-insurance-for-small-business', 'small business page')} covers the costs of the first few employees.</p>
`,
  tool: 'estimate',
  toolArg: { code: ME.code, st: ME.st, pay: ME.pay },
  related: ['workers-comp-requirements-by-state', 'workers-compensation-insurance-for-contractors', 'workers-comp-insurance-for-small-business', 'class-code-5645'],
  sources: ['cslb_wc', 'fl_dwc', 'mt_mca', 'ca_dwc'],
});

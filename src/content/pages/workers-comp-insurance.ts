import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.M, US = M.US;
const OFF = { code: '8810', st: 'TX', pay: 180000 };
const R = K.rate(OFF.code, OFF.st), P = K.prem(OFF.pay, R);
const pc = US.pcK / US.costTotalK;
const MA = M.MARKET.MA.arp!, AK = M.MARKET.AK.arp!, NJ = M.MARKET.NJ.arp!;
const ncci = Object.values(M.MARKET).filter((x) => x.bureau === 'ncci').length;
const indep = Object.values(M.MARKET).filter((x) => x.bureau === 'independent').length;

export default definePage({
  id: 'workers-comp-insurance', group: 'insurance', order: 2, slug: 'workers-comp-insurance',
  nav: 'Workers’ comp insurance', card: 'How a workers’ comp insurance policy is priced and bought, and where a business turned down by insurers goes.',
  title: 'Workers Comp Insurance 2026: How Policies Are Priced',
  description: 'Workers comp insurance in 2026: how insurers price a policy from class rates, who sets the rates in each state and where a business turned down still buys it.',
  h1: 'Workers’ comp insurance: how a policy is priced and bought',
  intro: 'Workers’ comp insurance is priced class by class: enter the class code, state and payroll of your business to see the premium a policy starts from.',
  resume: `Workers’ comp insurance is the policy an employer buys to meet its state’s workers’ compensation law, and in 2022 private insurers collected ${K.pct(pc * 100, 1)} of everything employers spent on the system, according to the National Academy of Social Insurance. The price starts from a rate per $100 of payroll for each class of work. In ${ncci} jurisdictions a national body, the National Council on Compensation Insurance (NCCI), files the base rates or loss costs; ${indep} states, among them California, New York and Pennsylvania, have their own rating bureau; and in North Dakota, Ohio, Washington and Wyoming the state fund sets its own price. Insurers then load their expenses and profit, apply the employer’s experience modification and credits, and the result is the premium. A Texas office with ${K.usd(OFF.pay)} of clerical payroll starts at about ${K.usd(P)} a year at the average rate of ${K.r100(R)}. A business no insurer will accept is not left uncovered: each state has an assigned risk plan or a state fund of last resort, which wrote about ${K.pct(M.ARP_AVG.pct, 1)} of premiums in the states measured.`,
  faqs: [
    { q: 'What does a workers’ comp insurance policy cover?', a: 'It pays the benefits your state’s law owes to an employee hurt or made ill by the job: medical care, part of lost wages, permanent impairment and death benefits. Most policies also carry employers’ liability cover, which defends the business when an injury leads to a lawsuit the law still allows, up to the limits on the policy.', open: true },
    { q: 'Who sets the rates of workers’ comp insurance?', a: `In ${ncci} jurisdictions, the National Council on Compensation Insurance (NCCI) files base rates or loss costs that the state approves, and insurers add their own expense load. ${indep} states have an independent rating bureau doing the same job. In the four states with an exclusive state fund, the fund sets its rates itself. Insurers may then deviate within what the state allows.` },
    { q: 'What if no insurer will sell me workers’ comp?', a: `Every state has a market of last resort. In most it is an assigned risk plan, also called the residual market, where an insurer is designated to write the policy, often at a higher rate. In 2023 it held ${K.pct(MA.pct!, 1)} of premiums in Massachusetts and ${K.pct(AK.pct!, 1)} in Alaska. In California the State Fund plays that role.` },
    { q: 'Can I buy workers’ comp insurance only for myself?', a: 'In many states an owner without employees is not required to insure and may choose to cover himself or herself, through the same policy an employer buys. Rules differ for sole proprietors, partners, corporate officers and members of a limited liability company (LLC), and for construction. The self-employed page lists the rules this site has read.' },
  ],
  body: (h) => `
<h2>Workers’ comp insurance, from the rate to the premium</h2>
<p>An insurer prices a workers’ comp insurance policy in layers. The first is the class rate, or the loss cost of the class to which the insurer adds its own multiplier for expenses, taxes and profit. The Oregon study describes both systems: in states that publish pure premiums, each insurer applies a loss cost multiplier; in states that publish full rates, the insurer may file a deviation (${h.src('dcbs_2024', 'Oregon state study')}). That is why two insurers can quote different prices for the same business in the same state.</p>
<p>The next layers belong to the employer: its experience modification once it has enough history, schedule credits or debits for its safety record, a premium discount on large policies, and sometimes a deductible. The study leaves all of these out, because they are not comparable from state to state, so its rates are an average starting point.</p>
${h.mini('estimate', { t: 'The starting premium of one class', p: ['code', 'st', 'pay'], d: { code: '8810', st: 'TX', pay: OFF.pay } })}
<h2>Who sets the rates in your state</h2>
<p>Appendix 4 of the Oregon study sorts the jurisdictions by rating organization. NCCI, the National Council on Compensation Insurance, serves ${ncci} of them. ${indep} run an independent bureau: California, Delaware, Indiana, Massachusetts, Michigan, Minnesota, New Jersey, New York, North Carolina, Pennsylvania and Wisconsin. The four monopolistic state funds set their own rates. Most states also have competitive rating laws, which let insurers file their own loss cost multipliers, so the rate an employer pays is one point in a range.</p>
<p>The rating organization also decides the class codes. NCCI codes are four digits and shared by its states; California, New York and some others use their own lists, which is why one trade can carry different numbers. The ${h.a('workers-comp-class-codes', 'class code page')} explains how a code is assigned.</p>
<h2>The market of last resort</h2>
<p>A new business in a dangerous trade, or one with poor claims, may find that no insurer wants to write it. The law still requires coverage, so each state keeps a residual market. NCCI manages the assigned risk pools of many states; in 2023 they held ${K.pct(M.ARP_AVG.pct, 1)} of premiums written on average, with ${K.num(NJ.risks!)} employers in New Jersey alone (${h.src('dcbs_2024', 'Oregon state study, appendix 5')}).</p>
${h.table(['State', 'Share of premiums, 2023', 'Employers in the pool'], Object.entries(M.MARKET).filter(([, x]) => x.arp && x.arp.pct !== null).sort((a, b) => b[1].arp!.pct! - a[1].arp!.pct!).slice(0, 8).map(([st, x]) => [K.name(st), K.pct(x.arp!.pct!, 1), x.arp!.risks === null ? 'not published' : K.num(x.arp!.risks)]), 'Largest assigned risk pools among the states measured (NCCI, 2023)', ['l', 'r', 'r'])}
<p>In states with a competitive state fund, the fund often plays this role. California’s Division of Workers’ Compensation describes its State Fund as a state-operated, non-profit insurer that is the insurer of last resort when private companies will not offer coverage (${h.src('ca_dwc_faq', 'California Division of Workers’ Compensation')}). The ${h.a('state-fund-workers-comp', 'state fund page')} lists those funds.</p>
<h2>Buying a policy</h2>
<p>Coverage is sold by licensed agents and brokers, by insurers directly, and by the state funds. Whatever the channel, the quote should list each class code with its payroll and rate, the experience modification, credits, the minimum premium and state charges. Compare those lines rather than the total, and check the class against your actual work: the wrong code is the most expensive error on a policy. The ${h.a('workers-comp-quotes', 'quote checker')} compares a quote with the study rate of its class.</p>
<p>Self-insurance is the alternative for large employers. California asks for state approval, a net worth of at least $5 million, net income of $500,000 a year and a security deposit, and lets employers of one industry pool their risks in a group. In North Dakota and Wyoming it is not allowed at all.</p>
`,
  tool: 'estimate',
  toolArg: { code: OFF.code, st: OFF.st, pay: OFF.pay },
  related: ['workmans-comp', 'workers-comp-quotes', 'workers-comp-insurance-for-small-business', 'state-fund-workers-comp'],
  sources: ['dcbs_2024', 'nasi_2022', 'ca_dwc_faq'],
});

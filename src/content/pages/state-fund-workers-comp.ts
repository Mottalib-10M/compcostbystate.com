import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.M, US = M.US;
const sh = (st: string) => M.shares(st)!;
const p1 = (x: number) => K.pct(x * 100, 1);
const comp = M.COMPETITIVE.filter((c) => M.shares(c));
const big = [...comp].sort((a, b) => sh(b).fund - sh(a).fund);
const small = [...comp].sort((a, b) => sh(a).fund - sh(b).fund);
const bill = (k: number) => `$${K.dec(k / 1e6, 1)} billion`;

export default definePage({
  id: 'state-fund-workers-comp', group: 'insurance', order: 3, slug: 'state-fund-workers-comp',
  nav: 'State funds', card: 'The 4 exclusive and 16 competitive state funds, and the share of employer costs each one carries.',
  title: 'State Fund Compensation 2026: State Comp Insurance Funds',
  description: 'State fund compensation in 2026: the 4 states where the state fund is the only insurer, the 16 where it competes, and its share of employer costs in each state.',
  h1: 'State fund compensation: the state comp insurance funds',
  intro: 'State fund compensation, state by state: pick a state to see whether it has a state fund, whether the fund competes with private insurers and how much of the market it holds.',
  resume: `A state fund is a workers’ compensation insurer created by state law. In 2022, twenty states had one selling to private employers, according to the National Academy of Social Insurance: four exclusive funds, in North Dakota, Ohio, Washington and Wyoming, where private insurers do not sell standard coverage, and sixteen competitive funds that sell next to private insurers, from California and New York to Texas and Oregon. South Carolina’s fund insures public employers only, and West Virginia closed its fund in 2009. State funds collected ${bill(US.sfK)} of the ${bill(US.costTotalK)} employers spent on workers’ comp in 2022, or ${p1(US.sfK / US.costTotalK)}. Their weight differs a lot: the exclusive funds of North Dakota and Wyoming carry ${p1(sh('ND').fund)} and ${p1(sh('WY').fund)} of employer costs, while among competitive funds the share runs from ${p1(sh(small[0]).fund)} in ${K.name(small[0])} to ${p1(sh(big[0]).fund)} in ${K.name(big[0])}. Several funds also act as the insurer of last resort for employers private companies turn down.`,
  faqs: [
    { q: 'What is state fund compensation?', a: 'It is workers’ compensation insurance bought from a state fund, an insurer set up by state law, instead of from a private company. In four states the fund is the only insurer; in sixteen it competes with private insurers on price and service. The coverage itself is the same: benefits are set by the state’s workers’ compensation law, not by the insurer.', open: true },
    { q: 'Which states have a monopolistic state fund?', a: 'North Dakota, Ohio, Washington and Wyoming. In North Dakota and Wyoming the fund is the only way to cover employees; Ohio and Washington also let qualifying large employers self-insure. Private insurers can still sell some related covers there, such as employers’ liability or federal maritime coverage, which the state fund does not provide.' },
    { q: 'Is the State Compensation Insurance Fund part of the California government?', a: 'California’s Division of Workers’ Compensation calls its State Fund a state-operated entity that transacts workers’ compensation on a non-profit basis and competes with private insurers. It is also the insurer of last resort when private companies are not willing to offer coverage. Employers can buy from it or from any licensed insurer.' },
    { q: 'Is a state fund cheaper than a private insurer?', a: 'Not as a rule. A competitive fund files its rates like any insurer, and its price for your class depends on its own experience and the market. Where the fund is the insurer of last resort, it also takes employers no one else will write. The only way to know is to compare quotes line by line for the same classes and payroll.' },
  ],
  body: (h) => `
<h2>State fund compensation in the four exclusive states</h2>
<p>In North Dakota, Ohio, Washington and Wyoming the state runs the insurance itself. The Oregon study lists them apart from every rating organization, as monopolistic state funds, and notes that North Dakota and Wyoming administer coverage exclusively through the fund while Ohio and Washington also allow self-insurance (${h.src('dcbs_2024', 'Oregon DCBS')}). Their premiums follow their own rules: Washington charges by the hour worked and lets employers deduct part of the rate from wages, as its ${h.a('washington-workers-comp-rates', 'hourly rate page')} shows. Deductible policies are not allowed in any of the four, according to the Academy.</p>
${h.table(['State', 'State fund share of costs', 'Self-insured', 'Cost per $100 of wages'], M.EXCLUSIVE.map((st) => [K.name(st), p1(sh(st).fund), p1(sh(st).self), K.r100(M.MARKET[st].cost100!)]), 'Exclusive state funds, 2022 (NASI)', ['l', 'r', 'r', 'r'])}
<h2>The sixteen competitive state funds</h2>
<p>A competitive fund sells next to private insurers, and several also serve the employers the private market turns down. California’s State Fund, the State Compensation Insurance Fund, is described by the Division of Workers’ Compensation as a non-profit, state-operated insurer and the insurer of last resort (${h.src('ca_dwc_faq', 'California DWC')}). New York’s law keeps “the state insurance fund” in its Department of Labor, to insure employers against liability for their employees’ injuries (${h.src('ny_wkc76', 'New York WCL section 76')}).</p>
<p>Their market share is a matter of history and policy. Where the fund grew into the main insurer, it carries half or more of employer costs: ${K.name(big[0])} ${p1(sh(big[0]).fund)}, ${K.name(big[1])} ${p1(sh(big[1]).fund)}, ${K.name(big[2])} ${p1(sh(big[2]).fund)}. Where private insurers dominate, the fund is a small player: ${K.name(small[0])} ${p1(sh(small[0]).fund)}, ${K.name(small[1])} ${p1(sh(small[1]).fund)}. Kentucky and Louisiana have competitive funds too, but the Academy’s report repeats one table for both states, so their shares are not shown.</p>
${h.mini('fund', { t: 'Check a state', p: ['st'], d: { st: 'CO' } })}
<h2>Funds that changed or closed</h2>
<p>The list moves. West Virginia discontinued its state fund in 2009, though the fund was still paying benefits on old claims in 2022. Utah repealed the statute that created its public Workers’ Compensation Fund in 2017; the former fund became WCF Mutual Insurance Company, a for-profit mutual insurer, which remained Utah’s insurer of last resort until 2020. South Carolina keeps a fund, but it insures state and local government employees, not private businesses (${h.src('nasi_2022', 'NASI, sources and methods')}). An employer in any of these states buys from private insurers or insures itself.</p>
<h2>How a state fund prices coverage</h2>
<p>A competitive fund files rates with the insurance regulator like a private insurer and uses the same class codes and experience modification. An exclusive fund sets its own classes and rates, often with its own credit programs. In ten states a state fund may also sell deductible policies, according to the Academy: Colorado, Hawaii, Idaho, Kentucky, Louisiana, Missouri, Montana, New Mexico, Oklahoma and Texas.</p>
<p>For a single class, the Oregon study gives the average rate in each state whatever the insurer. The ${h.a('workers-comp-rates-by-state', 'state ranking')} shows that exclusive fund states sit at both ends: North Dakota has the lowest premium index of all ${K.N} jurisdictions and Wyoming ranks ${K.ord(K.S('WY').rank)} highest, which says the type of insurer alone does not set the price.</p>
<h2>State funds and the rest of the market</h2>
<p>Across the United States in 2022, private insurers carried ${p1(US.pcK / US.costTotalK)} of employer costs, self-insured employers ${p1(US.siK / US.costTotalK)} and state funds ${p1(US.sfK / US.costTotalK)} (${h.src('nasi_2022', 'National Academy of Social Insurance')}). The ${h.a('workmans-comp', 'workmans comp overview')} puts these shares next to the total cost of each state, and the ${h.a('workers-comp-insurance', 'insurance page')} explains the assigned risk plans used where no fund is the last resort.</p>
`,
  tool: 'fund',
  toolArg: { st: 'CA' },
  related: ['workmans-comp', 'workers-comp-insurance', 'washington-workers-comp-rates', 'california-workers-comp-rates'],
  sources: ['nasi_2022', 'dcbs_2024', 'ca_dwc_faq', 'ny_wkc76', 'wa_rates'],
});

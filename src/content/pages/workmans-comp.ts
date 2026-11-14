import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const M = K.M, US = M.US;
const PAY = 300000;
const rk = M.costRanking();
const low = rk[0], high = rk[rk.length - 1];
const fell = rk.filter((x) => x.cost100 < x.cost100_2018).length;
const CA = M.MARKET.CA, TX = M.MARKET.TX, NY = M.MARKET.NY;
const sh = (st: string) => M.shares(st)!;
const self = US.siK / US.costTotalK, fund = US.sfK / US.costTotalK;
const bill = (k: number) => `$${K.dec(k / 1e6, 1)} billion`;

export default definePage({
  id: 'workmans-comp', group: 'insurance', order: 1, slug: 'workmans-comp',
  nav: 'What workers’ comp is', card: 'What workers’ compensation is, who pays for it and who sells it, with the total cost of every state.',
  title: 'Workmans Comp 2026: How Workers’ Comp Works in Each State',
  description: 'Workmans comp in 2026: what workers’ compensation covers, who pays, who sells it in each state and what it costs employers per $100 of wages, from public data.',
  h1: 'Workmans comp: how workers’ compensation works in each state',
  intro: 'Workmans comp, state by state: pick your state to see who sells coverage there, who must carry it and what employers pay in all per $100 of wages.',
  jump: { href: '#who-sells', label: 'Who sells it in each state' },
  resume: `Workmans comp, the everyday name for workers’ compensation, is insurance an employer buys so that an employee hurt at work, or made ill by it, receives medical care and part of lost wages, and in exchange cannot usually sue the employer. There is no federal program for private employers: each of the ${K.N} jurisdictions writes its own law, sets its own benefits and decides who sells the coverage. In 2022, employers paid ${bill(US.costTotalK)} for it, or ${K.r100(US.cost100)} per $100 of covered wages, down from ${K.r100(US.cost100_2018)} in 2018, according to the National Academy of Social Insurance. The level runs from ${K.r100(low.cost100)} in ${K.name(low.st)} to ${K.r100(high.cost100)} in ${K.name(high.st)}. Most employers insure with a private company; in four states the state fund is the only insurer, and in sixteen others a state fund competes with private insurers. Large employers can often insure themselves with state approval. This page explains the system and does not give legal advice on a claim.`,
  faqs: [
    { q: 'Is workmans comp the same as workers’ compensation?', a: 'Yes. Workmans comp, workman’s comp and workers’ comp are informal names for workers’ compensation, the state insurance system for work injuries and illnesses. State laws and agencies use the term workers’ compensation, and some older statutes say workmen’s compensation. The rules, the benefits and the price are the same whatever name you use.', open: true },
    { q: 'Who pays for workmans comp, the employer or the worker?', a: `The employer. It buys the policy or insures itself, and the premium is a business cost. Washington is the exception among the states read here: its state fund lets the employer take part of the hourly premium from wages. Across the country, employers paid ${K.r100(US.cost100)} for every $100 of covered wages in 2022.` },
    { q: 'What does workers’ compensation pay an injured employee?', a: 'Each state sets the benefits: medical care for the injury, a share of lost wages while the employee cannot work, payments for a lasting impairment and death benefits to dependants. Weekly amounts are capped by state law. The state workers’ compensation agency publishes the current figures and settles disputes; this site does not advise on claims.' },
    { q: 'Can an employer insure workers’ comp itself?', a: 'In most states a large employer can self-insure with the approval of the state, which sets conditions on financial strength and asks for a security deposit. California, for example, requires a net worth of at least $5 million and net income of $500,000 a year. Smaller employers in one industry can sometimes pool their risks in a group.' },
  ],
  body: (h) => `
<h2>What workmans comp is, in four lines</h2>
<p>Workers’ compensation is a bargain written into state law. The employee hurt on the job gets medical care and part of lost wages without having to prove anyone was at fault. The employer, in exchange, is protected from most lawsuits over that injury. To make sure the money is there, states require employers to insure the risk, with an insurance company, a state fund, or by insuring themselves under state supervision.</p>
<p>Because each state writes its own law, everything varies: who must be covered, the weekly benefit, the medical fees, the rating organization that prices the classes, and the insurers allowed to sell. The calculator above shows how these choices add up in your state, and the ${h.a('workers-comp-requirements-by-state', 'requirements page')} details who must carry it.</p>
${h.mini('required', { t: 'Must your business carry it?', p: ['st', 'emp'], d: { st: 'GA', emp: 3 } })}
<h2 id="who-sells">Who sells workmans comp in each state</h2>
<p>Four states run an exclusive state fund: North Dakota, Ohio, Washington and Wyoming. In North Dakota and Wyoming the state fund is the only way to insure; Ohio and Washington also let large employers self-insure (${h.src('dcbs_2024', 'Oregon state study, notes')}). In 2022 the fund collected ${K.pct(sh('ND').fund * 100, 1)} of employer costs in North Dakota and ${K.pct(sh('OH').fund * 100, 1)} in Ohio, where self-insured employers paid most of the rest (${h.src('nasi_2022', 'National Academy of Social Insurance')}).</p>
<p>Sixteen states have a competitive state fund that sells next to private insurers: California, Colorado, Hawaii, Idaho, Kentucky, Louisiana, Maryland, Missouri, Montana, New Mexico, New York, Oklahoma, Oregon, Pennsylvania, Rhode Island and Texas, in the count of the National Academy of Social Insurance. South Carolina has a fund for public employers only. Everywhere else, private insurance companies and self-insurance share the market. The ${h.a('state-fund-workers-comp', 'state fund page')} compares the funds.</p>
${h.table(['Who sells', 'States', 'Share of US employer costs, 2022'], [['Private insurers', '47 jurisdictions', K.pct((US.pcK / US.costTotalK) * 100, 1)], ['State funds', '20 states, 4 of them exclusive', K.pct(fund * 100, 1)], ['Self-insured employers', 'Most states, with approval', K.pct(self * 100, 1)]], 'Who carried the cost of workers’ compensation in 2022 (NASI)', ['l', 'l', 'r'])}
<h2>What workmans comp costs employers, state by state</h2>
<p>Two measures answer the question. The Oregon study ranks the rates insurers charge for the same ${K.NCLASS} classes of work, so it compares prices; the ${h.a('workers-comp-rates-by-state', 'state ranking')} uses it. The National Academy of Social Insurance adds up what employers actually spent, premiums and self-insured costs together, and divides by all covered wages. That second figure mixes offices and building sites, so it reads as the weight of the system on a state’s economy: ${K.r100(CA.cost100!)} per $100 of wages in California, ${K.r100(NY.cost100!)} in New York, ${K.r100(TX.cost100!)} in Texas, where carrying coverage is optional for most private employers.</p>
<p>Costs fell in ${fell} of the ${rk.length} states shown between 2018 and 2022. Over those four years covered wages grew faster than what employers spent on the system, so the cost per $100 went down even where the bill in dollars went up. The Academy prints the same table for Kentucky and Louisiana in its 2022 report, so this site leaves both out of the comparison rather than guess which is right.</p>
${h.mini('profile', { t: 'Your state at a glance', p: ['st'], d: { st: 'NY', pay: PAY } })}
<h2>Your own premium is a class rate, not an average</h2>
<p>An employer does not pay the state average. The insurer applies the rate of each class of work on the policy to the payroll of that class, then the experience modification and its own credits. Office work costs cents per $100 of payroll, roofing many dollars. Use the ${h.a('workers-comp-class-codes', 'class code page')} to find your code and the calculator of the home page to price it in your state.</p>
<p>Workers’ compensation is not the only cover a business may need, and it does not replace health insurance, disability insurance or liability insurance for injuries to customers. It only covers injuries and illnesses that arise out of the employment, and each state decides what counts. For a claim, the state workers’ compensation agency is the place to ask; its staff answer employees and employers without charge.</p>
`,
  tool: 'profile',
  toolArg: { st: 'CA', pay: PAY },
  related: ['workers-comp-insurance', 'state-fund-workers-comp', 'workers-comp-requirements-by-state', 'workers-comp-rates-by-state'],
  sources: ['nasi_2022', 'dcbs_2024', 'ca_dwc_faq', 'wa_account'],
});

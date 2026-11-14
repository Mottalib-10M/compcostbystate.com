import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'CA', S = K.S(ST), C = K.CH.ca;
const list = K.stateClasses(ST);
const top = [...list].sort((a, b) => a.rank - b.rank);
const firsts = top.filter((x) => x.rank === 1);
const PAY = K.EX.payroll;
const ex = K.rate(K.EX.code, ST);

export default definePage({
  id: 'california-workers-comp-rates', group: 'states', order: 20, slug: 'california-workers-comp-rates',
  nav: 'California', card: 'California’s rank, its class rates in the state study and the September 2026 advisory increase.',
  title: 'California Workers Comp Rates 2026: Classes and Increase',
  description: 'California workers comp rates in 2026: 4th highest of 51 in the state study, class rates per $100 of payroll, and the 6.6% advisory increase of September 2026.',
  h1: 'California workers’ comp rates by class',
  intro: 'California workers’ comp rates for the 53 classes of the Oregon state study, with the premium on the payroll you enter.',
  resume: `California is one of the most expensive states for workers’ compensation. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024 (California’s dating from ${S.effective}), its premium index was ${K.r100(S.index)} per $100 of payroll, ${K.pct(S.pctMedian)} of the national median, ranking ${K.ord(S.rank)} of ${K.N} jurisdictions after ${K.ord(S.rank2022)} in the previous study. It was the most expensive state of all for ${firsts.length} of the ${K.NCLASS} classes, including restaurants. Rates have since moved up: the state insurance commissioner adopted an average advisory pure premium rate (the expected cost of claims per $100 of payroll, a benchmark insurers may depart from) of ${K.r100(C.rate)} per $100 of payroll from ${K.day(C.effective)}, ${K.pct(C.pct, 1)} above 2025, against the ${K.pct(C.requested, 1)} the rating bureau requested. Every employer with one or more employees must carry coverage, and the Division of Workers’ Compensation adds that a roofer with no employees must be insured too. On ${K.usd(PAY)} of electrical wiring payroll (class ${K.EX.code}), the study rate of ${K.r100(ex)} gives about ${K.usd(K.prem(PAY, ex))} a year before the mod.`,
  faqs: [
    { q: 'How much is workers’ comp in California for a small business?', a: `It follows the class. In the study, California’s clerical office rate was ${K.r100(K.rate('8810', ST))} per $100 of payroll, so ${K.usd(K.prem(100000, K.rate('8810', ST)))} on ${K.usd(100000)} of office wages, while restaurants paid ${K.r100(K.rate('9082', ST))} and roofing ${K.r100(K.rate('5551', ST))}. Add the September 2026 increase and your insurer’s pricing for a current figure.`, open: true },
    { q: 'Does California use the national class codes?', a: 'No. Most states use the codes of the National Council on Compensation Insurance (NCCI), a national rating body. California has its own rating bureau, the Workers’ Compensation Insurance Rating Bureau of California (WCIRB), and its own classification system. For the Oregon study it supplied the closest California class for each code. That is why several codes, such as the three restaurant codes, share one California rate.' },
    { q: 'Do I need workers’ comp in California with no employees?', a: 'A sole owner with no employees generally does not, with one stated exception: the Division of Workers’ Compensation says a roofer with no employees is still required to carry it. An out-of-state employer may also need California coverage for employees who regularly work in California.' },
  ],
  body: (h) => `
<h2>California workers’ comp rates in the national ranking</h2>
<p>Only Hawaii, New Jersey and New York had a higher index than California in the latest study. California led the country for ${firsts.map((x) => `${x.short.toLowerCase()} (${x.code})`).slice(0, 4).join(', ')}${firsts.length > 4 ? ' and others' : ''}. Its rates for office work were also high by national standards: ${K.r100(K.rate('8810', ST))} per $100 for class 8810, ${K.ord(K.rank('8810', ST))} of ${K.N}, against a median of ${K.r100(K.R('8810').median)} (${h.src('dcbs_2024', 'Oregon state study')}).</p>
<p>California sets its benchmark through its own bureau. The Workers’ Compensation Insurance Rating Bureau of California (WCIRB) proposes an advisory pure premium, the expected cost of claims, the insurance commissioner adopts it, and insurers, which California does not bind to it, file their own rates. The study averaged the multipliers of the largest insurers to reach a rate comparable with other states.</p>
${h.mini('rank', { t: 'California against other states for one kind of work', p: ['code'], d: { code: '9082', st: ST, pay: PAY } })}
<h2>The September 2026 increase</h2>
<p>The California Department of Insurance adopted an average advisory pure premium rate of ${K.r100(C.rate)} per $100 of payroll effective ${K.day(C.effective)}, an increase of ${K.pct(C.pct, 1)} on the 2025 approved rate (${h.src('ca_cdi', 'release of the commissioner')}). The WCIRB had requested ${K.pct(C.requested, 1)}. The commissioner cited rising costs in the system. A policy renewing after that date may carry a higher rate per $100 than the study shows; the ${h.a('workers-comp-rate-changes', 'rate change page')} applies the average to a premium.</p>
<h2>Who must be covered in California</h2>
<p>The Division of Workers’ Compensation states that California employers are required by law to have workers’ compensation insurance, even if they have only one employee (${h.src('ca_dwc', 'California Division of Workers’ Compensation')}). Its employer page singles out roofers, who must carry coverage even with no employees. When an employer and an injured employee disagree, for instance on whether the injury happened on the job, the division helps settle it through its Information and Assistance Unit or before a judge in one of its 23 district offices.</p>
<p>For a whole business, list each class with its payroll: the ${h.a('how-much-does-workers-comp-cost', 'cost guide')} adds them and divides by headcount, and the ${h.a('experience-modification-rate', 'mod page')} applies the experience modification the WCIRB computes for California employers.</p>
<h2>Where California is most expensive, and where it is not</h2>
<p>California ranked first among all states for ${firsts.length} classes of the study, from retail stores and gasoline stations to hotels, food manufacturing and chimney cleaning. Its construction classes were closer to the pack: residential carpentry (5645) ranked ${K.ord(K.rank('5645', ST))} at ${K.r100(K.rate('5645', ST))}, excavation (6217) ${K.ord(K.rank('6217', ST))}. For a builder, California is therefore less of an outlier than its index suggests; for a shop, a hotel or a restaurant, it is the most expensive state in the study.</p>
<p>Its neighbors sit well below. Oregon’s index was ${K.r100(K.S('OR').index)}, Nevada’s ${K.r100(K.S('NV').index)} and Arizona’s ${K.r100(K.S('AZ').index)}, against ${K.r100(S.index)} in California. A business with staff on both sides of a state line pays each state’s rate on the payroll earned there.</p>
<h2>Shops, hotels and restaurants in California</h2>
<p>For businesses that serve the public, California’s rates were the highest in the study. On ${K.usd(PAY)} of payroll, a retail store (8017) would pay about ${K.usd(K.prem(PAY, K.rate('8017', ST)))} a year at California’s rate, against ${K.usd(K.prem(PAY, K.R('8017').median))} at the median; a hotel’s non-restaurant staff (9052) about ${K.usd(K.prem(PAY, K.rate('9052', ST)))}, against ${K.usd(K.prem(PAY, K.R('9052').median))}.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['workers-comp-rate-changes', 'class-code-9082', 'how-much-does-workers-comp-cost', 'workers-comp-rates-by-state'],
  sources: ['dcbs_2024', 'ca_cdi', 'ca_dwc'],
});

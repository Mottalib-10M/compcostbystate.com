import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ST = 'PA', S = K.S(ST);
const r = (c: string) => K.rate(c, ST);
const list = K.stateClasses(ST);
const high = list.filter((x) => x.rank <= 10).sort((a, b) => a.rank - b.rank);
const PAY = 400000;

export default definePage({
  id: 'pennsylvania-workers-comp-rates', group: 'states', order: 24, slug: 'pennsylvania-workers-comp-rates',
  nav: 'Pennsylvania', card: 'Pennsylvania’s rank, the classes where it is among the ten dearest states, and SWIF.',
  title: 'Pennsylvania Workers Comp Rates 2026: Classes and SWIF',
  description: 'Pennsylvania workers comp rates in 2026: 21st of 51 in the state study, the classes priced among the ten highest, and coverage from an insurer or SWIF.',
  h1: 'Pennsylvania workers’ comp rates by class',
  intro: 'Pennsylvania workers’ comp rates for the classes of the Oregon state study, with the premium on the payroll you enter.',
  resume: `Workers’ compensation is mandatory for most employers under Pennsylvania law, and its price sits a little above the middle of the country. In the Oregon Department of Consumer and Business Services study of rates in effect on January 1, 2024 (Pennsylvania’s dating from ${S.effective}), the Pennsylvania index was ${K.r100(S.index)} per $100 of payroll, ${K.pct(S.pctMedian)} of the national median, ranking ${K.ord(S.rank)} of ${K.N} after ${K.ord(S.rank2022)} in the previous study. Pennsylvania has its own rating bureau rather than the National Council on Compensation Insurance (NCCI), and its rates were among the ten highest in the country for ${high.length} classes, mostly heavy construction: street paving (5506) at ${K.r100(r('5506'))}, excavation (6217) at ${K.r100(r('6217'))} and house framing (5645) at ${K.r100(r('5645'))}. Office work cost ${K.r100(r('8810'))} per $100. On ${K.usd(PAY)} of excavation payroll, the study rate gives about ${K.usd(K.prem(PAY, r('6217')))} a year before the experience modification. Employers buy coverage from a licensed insurer or the State Workers’ Insurance Fund (SWIF), or apply to self-insure.`,
  faqs: [
    { q: 'Who is exempt from workers’ comp in Pennsylvania?', a: 'The Department of Labor & Industry lists people covered by other compensation acts, such as railroad workers, longshoremen and federal employees; domestic workers, for whom coverage is optional; farm workers who work fewer than 30 days or earn less than $1,200 a year from one employer; and employees granted an exemption for religious beliefs or executive status in certain corporations.', open: true },
    { q: 'What is SWIF in Pennsylvania?', a: 'The State Workers’ Insurance Fund, set up by law to provide workers’ compensation to Pennsylvania businesses that choose it to meet their obligation under the Workers’ Compensation Act. The department names it as one of three ways to be covered, with a licensed insurance carrier and self-insurance approved by the bureau.' },
    { q: 'When does Pennsylvania coverage start for a new hire?', a: 'The department says employees are covered for the entire period of their employment, so coverage begins on the first day on the job. Injuries or diseases caused or aggravated by employment are covered whatever the employee’s previous physical condition, which is why a policy must be in force before the first hire starts.' },
  ],
  body: (h) => `
<h2>Pennsylvania workers’ comp rates among the ten highest</h2>
${h.table(['Class', 'Work', 'Pennsylvania per $100', 'Rank of 51'], high.map((x) => [x.code, x.short, K.r100(x.rate), String(x.rank)]), 'Classes where Pennsylvania ranked in the top ten, rates in effect on January 1, 2024', ['l', 'l', 'r', 'r'])}
<p>Pennsylvania’s pattern is uneven (${h.src('dcbs_2024', 'Oregon DCBS')}). Several heavy construction classes rank near the top, while restaurants (${K.r100(r('9082'))}, ${K.ord(K.rank('9082', ST))}) and roofing (${K.r100(r('5551'))}, ${K.ord(K.rank('5551', ST))}) sit in the middle or lower half. The study also lists Pennsylvania among the states whose assessments and taxes it factored into the rates, so the comparison includes them.</p>
<p>The study shows no comparable Pennsylvania class for commercial drivers (7380) or social services organizations (8864); those rows are missing from the table under the calculator.</p>
${h.mini('rank', { t: 'Pennsylvania against other states for one class', p: ['code'], d: { code: '6217', st: ST, pay: PAY } })}
<h2>Three ways to be covered</h2>
<p>The Department of Labor & Industry states that coverage is mandatory for most employers and that employers without it may face lawsuits by employees and criminal prosecution (${h.src('pa_dli', 'Pennsylvania L&I')}). Coverage can come from a licensed insurance carrier, from the State Workers’ Insurance Fund, or from self-insurance approved by the bureau on criteria set by the act and the department.</p>
<p>Disputes over a claim go to a workers’ compensation judge, and appeals to the Workers’ Compensation Appeal Board, which hears appeals from the judges’ decisions across the Commonwealth. For the price of coverage, the ${h.a('how-much-does-workers-comp-cost', 'cost guide')} turns class rates into a cost per employee, and the ${h.a('workers-comp-rates-by-state', 'state ranking')} compares Pennsylvania with its neighbors: New York ranked ${K.ord(K.S('NY').rank)} and New Jersey ${K.ord(K.S('NJ').rank)}.</p>
<h2>Where Pennsylvania is cheaper</h2>
<p>The same table that puts Pennsylvania among the dearest states for heavy construction puts it near the bottom for other work. Its roofing rate of ${K.r100(r('5551'))} ranked ${K.ord(K.rank('5551', ST))}, telecommunications (7600) ranked ${K.ord(K.rank('7600', ST))}, and colleges’ non-professional staff (9101) ${K.ord(K.rank('9101', ST))}. Retail stores (8017), by contrast, ranked ${K.ord(K.rank('8017', ST))} at ${K.r100(r('8017'))}. A Pennsylvania business should look at its own class rather than at the state’s place in the index.</p>
<h2>Pennsylvania beside its neighbors</h2>
<p>The neighbors span the whole table. New Jersey’s index was ${K.r100(K.S('NJ').index)} and New York’s ${K.r100(K.S('NY').index)}, both in the top three; Ohio’s was ${K.r100(K.S('OH').index)}, one of the lowest, and Maryland’s ${K.r100(K.S('MD').index)}, Delaware’s ${K.r100(K.S('DE').index)}, West Virginia’s ${K.r100(K.S('WV').index)}. A contractor based near Philadelphia and working in New Jersey pays the New Jersey rate on that payroll, often much higher for the same trade.</p>
<h2>Exemptions in practice</h2>
<p>The department’s list of exemptions is short and specific. Domestic workers may be covered but need not be. Farm workers are exempt only when they work fewer than 30 days or earn less than ${K.usd(1200)} in a calendar year from one employer. Some executive officers and people with religious objections can be exempted after applying. Everyone else is covered from the first day of work, so a Pennsylvania employer needs a policy in force before the first employee starts.</p>
<h2>A Pennsylvania example: a paving contractor</h2>
<p>A street and road paving contractor (5506) with ${K.usd(PAY)} of payroll would pay about ${K.usd(K.prem(PAY, r('5506')))} a year at the Pennsylvania rate of ${K.r100(r('5506'))}. Across its borders, the same payroll would cost ${K.usd(K.prem(PAY, K.rate('5506', 'NJ')))} in New Jersey, ${K.usd(K.prem(PAY, K.rate('5506', 'NY')))} in New York and ${K.usd(K.prem(PAY, K.rate('5506', 'OH')))} in Ohio. Paving crews that cross state lines for public work feel those differences directly in their bids.</p>
<p>Rates in the table date from Pennsylvania’s filing in effect on ${S.effective}, as reported in the study.</p>
`,
  tool: 'state', toolArg: { st: ST, pay: PAY },
  related: ['workers-comp-rates-by-state', 'how-much-does-workers-comp-cost', 'class-code-5645', 'workers-comp-requirements-by-state'],
  sources: ['dcbs_2024', 'pa_dli'],
});

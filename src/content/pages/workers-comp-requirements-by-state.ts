import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const R = K.RULES;
const codes = Object.keys(R).sort((a, b) => K.name(a).localeCompare(K.name(b)));
const first = codes.filter((c) => R[c].kind === 'all');
const optional = codes.filter((c) => R[c].kind === 'optional');
const word = (c: string) => ({ all: 'From the first employee', count: `From ${R[c].min} employees${R[c].constr ? ` (construction: ${R[c].constr})` : ''}`, optional: 'Not required', payroll: `Payroll above ${K.usd((R[c].payrollMin ?? 1) - 1)}` }[R[c].kind]);

export default definePage({
  id: 'workers-comp-requirements-by-state', group: 'cost', order: 5, slug: 'workers-comp-requirements-by-state',
  nav: 'Who must carry it', card: 'The employee threshold of 16 states, read on each state’s own site, and what changes in construction.',
  title: 'Workers Comp Requirements by State 2026: Who Must Carry It',
  description: 'Workers comp requirements by state in 2026: the employee count that triggers coverage in 16 states read on official sites, construction rules, optional states.',
  h1: 'Workers’ comp requirements by state: who has to carry it',
  intro: 'Workers’ comp requirements by state, as each state publishes them: pick a state, enter your headcount and say whether you work in construction.',
  resume: `Every state sets its own rule for when an employer must carry workers’ compensation, and the thresholds differ more than most employers expect. This site has read the rule of ${codes.length} states on their own agency or statute pages, on November 13, 2026. ${first.length} of them require coverage from the first employee, among them California, Colorado, Hawaii, Montana, Pennsylvania and Washington, where the state fund is the only insurer. Others count heads: Georgia and Virginia from three employees, Florida and South Carolina from four, Missouri from five. Construction lowers the bar in Florida and Missouri to a single employee, and Florida counts corporate officers. Kansas uses payroll instead, exempting employers with ${K.usd(20000)} of yearly payroll or less. Two of the states read leave it to the employer: Texas, where an employer without coverage is a non-subscriber, and South Dakota, which has no law requiring it. Georgia fines an uninsured employer ${K.usd(K.GA.min)} to ${K.usd(K.GA.max)} per occurrence.`,
  faqs: [
    { q: 'Do I need workers’ comp with one employee?', a: `In ${first.length} of the ${codes.length} states read here, yes, and in Florida and Missouri as soon as the one employee works in construction. In Georgia, Virginia, South Carolina, Missouri and Florida outside construction, a small headcount is exempt. Part-time employees usually count as employees for the threshold.`, open: true },
    { q: 'Is workers’ comp required for independent contractors?', a: 'An employer does not insure true independent contractors, but states decide who is a contractor and who is an employee, often with tests stricter than the label in the contract. In construction, a general contractor can be liable for the workers of an uninsured subcontractor in many states, which is why certificates of insurance are requested.' },
    { q: 'What happens if I do not carry required coverage?', a: `States can fine the employer, stop its work and make it pay the injured worker’s benefits directly. Georgia, for example, sets a civil penalty of ${K.usd(K.GA.min)} to ${K.usd(K.GA.max)} per occurrence. Read the penalty section of your state agency, linked under the tool.` },
    { q: 'Is workers’ comp optional in Texas?', a: 'Private employers in Texas can choose not to carry it: the Texas Department of Insurance says coverage is not required in most cases. An employer without coverage is called a non-subscriber and must report to the state that it has none, and report certain injuries. Coverage limits the employer’s liability when an employee sues, except when gross negligence results in a death.' },
  ],
  body: (h) => `
<h2>Workers’ comp requirements in the ${codes.length} states read</h2>
${h.table(['State', 'Coverage required', 'Rule as published', 'Source'], codes.map((c) => [K.name(c), word(c), R[c].text, h.src(R[c].src, 'read')]), 'Rules read on state sites on November 13, 2026', ['l', 'l', 'l', 'l'])}
<p>The table gives the general rule. Each state lists exceptions: household workers, farm workers, casual labor, family members, sole proprietors, partners and corporate officers are treated differently from state to state. Where an owner may opt out, the opt-out usually has to be filed with the state or the insurer.</p>
${h.mini('required', { t: 'Check one state', p: ['st', 'emp', 'con'], d: { st: 'MO', emp: 2, con: 'yes' } })}
<h2>States not read here</h2>
<p>The other ${K.N - codes.length} jurisdictions were not read for this page, either because their agency site refused automated reading or because the rule sits in a statute this site has not parsed. The tool says so rather than guessing. Search for the workers’ compensation agency of your state, which publishes an employer page, or ask a licensed agent.</p>
<h2>Optional is not free</h2>
<p>In Texas and South Dakota the choice belongs to the employer, but going without has a price. South Dakota’s labor department says an uninsured employer may be sued in civil court by an injured worker (${h.src('sd_dlr', 'South Dakota DLR')}). Texas lets a covered employer limit its liability when a worker sues, and requires a non-subscriber to report its status and certain injuries to the state (${h.src('tx_tdi', 'Texas Department of Insurance')}).</p>
<p>Where coverage is required, its cost depends on the class and the state: the ${h.a('how-much-does-workers-comp-cost', 'cost guide')} gives an order of magnitude, and the ${h.a('workers-comp-rates-by-state', 'state ranking')} shows how your state compares. Washington employers buy from the state fund only, which the ${h.a('washington-workers-comp-rates', 'Washington page')} prices by the hour.</p>
<p><strong>Out-of-state work.</strong> A crew sent to work in another state can fall under that state’s law, depending on how long the work lasts and where the contract was made. California’s division, for example, says an out-of-state employer may need coverage for employees who regularly work in California (${h.src('ca_dwc', 'California DWC')}). Tell your insurer every state where employees work.</p>
<h2>Construction thresholds</h2>
<p>Construction carries stricter rules in several of the states read. Florida requires coverage from a single employee in the construction industry, with corporate officers and LLC members counted, against four elsewhere. Missouri requires it from five employees in general but from one in construction. California requires it of a roofer even without employees. Georgia counts exempt officers toward its three-person rule. A contractor moving from service work into building should reread the rule of its state at that moment.</p>
<h2>Payroll tests</h2>
<p>Three states read here use payroll as well as, or instead of, headcount. Kansas exempts an employer whose gross annual payroll was ${K.usd(20000)} or less last year and is expected to stay there, family wages left out. South Carolina exempts employers with fewer than four employees or a payroll under ${K.usd(3000)} in the previous year. Wisconsin requires coverage as soon as one employee is paid ${K.usd(500)} or more in a calendar quarter, even below its three-employee rule. The tool asks for last year’s payroll for these states.</p>
<h2>Farm and household workers</h2>
<p>Farms have their own thresholds: six regular employees or twelve seasonal workers in Florida, six employees on twenty days in Wisconsin, more than three full-time workers in Virginia, and in Pennsylvania farm workers are exempt below 30 days or ${K.usd(1200)} a year with one employer. Arizona and Pennsylvania leave domestic workers out or optional. These are the rules as published; the agency applies them to a given case.</p>
`,
  tool: 'required',
  related: ['how-much-does-workers-comp-cost', 'texas-workers-comp-rates', 'florida-workers-comp-rates', 'georgia-workers-comp-rates'],
  sources: ['ca_dwc', 'fl_dwc', 'ga_sbwc', 'tx_tdi', 'sd_dlr', 'wa_account', 'mo_rsmo', 'ks_ksa'],
});

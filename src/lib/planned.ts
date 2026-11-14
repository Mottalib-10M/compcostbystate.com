/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  'workmans-comp', 'workers-comp-insurance', 'state-fund-workers-comp', 'workers-comp-insurance-for-small-business',
  'workers-comp-insurance-for-self-employed', 'workers-compensation-insurance-for-contractors', 'workers-comp-quotes',
  'workers-comp-rates-by-state', 'workers-comp-class-codes', 'how-much-does-workers-comp-cost', 'experience-modification-rate',
  'workers-comp-requirements-by-state', 'washington-workers-comp-rates', 'workers-comp-rate-changes',
  'california-workers-comp-rates', 'texas-workers-comp-rates', 'florida-workers-comp-rates', 'georgia-workers-comp-rates',
  'pennsylvania-workers-comp-rates', 'oregon-workers-comp-rates',
  'class-code-8810', 'class-code-5551', 'class-code-5645', 'class-code-9082', 'class-code-8742', 'class-code-5190',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);

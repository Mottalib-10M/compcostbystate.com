/** llms.txt (RECETTE §21), generated from the page registry. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> What workers’ compensation costs in the United States, by state and class code: the calculated rate per $100 of payroll of 53 classes in 51 jurisdictions and the premium index of each state, from the Oregon Department of Consumer and Business Services premium rate ranking (rates in effect on January 1, 2024, published June 2025); Washington Labor & Industries hourly state fund rates for 2026 and proposed 2027; the effect of an experience modification; the coverage threshold of 16 states read on official sites; and the 2026 and 2027 rate changes of California, Oregon and Washington. No quote, no insurer price. Independent site published by Radif Partners, not an insurer, an agent or a broker. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How the figures are built](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

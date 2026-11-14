import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Workers’ comp cost calculator', method: 'How the figures are built', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'insurance', label: 'Workers’ comp insurance' },
  { id: 'cost', label: 'Cost and rules' },
  { id: 'states', label: 'Rates by state' },
  { id: 'classes', label: 'Rates by class code' },
];
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
const inMenu = (g: Group, lang: Locale): NavLink[] => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label, links: inMenu(g.id, lang) })).filter((c) => c.links.length);
}
// Method: linked in the footer, outside the top menu so that it fits on one line.
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inMenu(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Most read pages from the footer: one click from any page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => ['workmans-comp', 'workers-comp-insurance', 'workers-comp-rates-by-state', 'workers-comp-class-codes', 'how-much-does-workers-comp-cost', 'workers-comp-requirements-by-state', 'class-code-8810', 'california-workers-comp-rates'].filter((id) => pageById(id)).map((id) => link(id, lang));

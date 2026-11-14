#!/usr/bin/env python3
"""Rebuilds src/data/market-2022.json: who insures employers in each state, and what workers' comp costs them.

Sources (official or public, kept in data-raw/, not in git):
  data-raw/nasi-2022-state-summaries.pdf  National Academy of Social Insurance, Workers' Compensation: Benefits, Costs,
      and Coverage, Sources, Methods, and State Summaries (November 2024, 2022 data), downloaded 2026-11-14 from
      https://www.nasi.org/wp-content/uploads/2024/11/Sources-Methods-and-State-Summaries-2022-Data-Report-FINAL-2024_11_13.pdf
  data-raw/oregon-24-2083.pdf  Oregon DCBS premium rate ranking 2024, appendix 4 (rating organization of each
      jurisdiction) and appendix 5 (2023 assigned risk pool, from NCCI's Residual Market Management Summary 2023).
Checks: 51 jurisdictions; private + state fund + self-insured costs = total within rounding; 16 competitive and
4 exclusive state funds, as NASI writes it. Kentucky and Louisiana: NASI prints the same table twice, so their
figures are flagged (dup) and never shown.
Usage: python3 scripts/data/build-market.py
"""
import json, os, re, sys
import pypdf

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
RAW = os.path.join(ROOT, 'data-raw'); OUT = os.path.join(ROOT, 'src', 'data')
NAMES = json.load(open(os.path.join(OUT, 'dcbs-2024.json')))['names']
BY_NAME = {v: k for k, v in NAMES.items()}
fail = []

def text(f):
    return '\n'.join((p.extract_text() or '') for p in pypdf.PdfReader(os.path.join(RAW, f)).pages)

# ---- NASI state summary tables (5 years, 2018 to 2022) ----
T = text('nasi-2022-state-summaries.pdf')
L = lambda s: r'\s+'.join(re.escape(w) for w in s.split())
NUM = r'\$?[\d,\.]+%?'
def row(body, label):
    m = re.search(L(label) + r'\s+((?:' + NUM + r'\s+){4}' + NUM + ')', body)
    return [float(x.replace('$', '').replace(',', '').replace('%', '')) for x in m.group(1).split()] if m else None
nasi = {}
for m in re.finditer(r'\n([A-Z][A-Za-z ]{2,22}) State Summary Table: 2018-2022(.*?Costs\s+per\s+\$100\s+of\s+Payroll\s+(?:' + NUM + r'\s+){4}' + NUM + ')', T, re.S):
    name, body = m.group(1).strip(), m.group(2)
    if name == 'Total': key = 'US'
    elif name in BY_NAME: key = BY_NAME[name]
    else: fail.append(f'unknown state {name}'); continue
    ben, cost = re.split(r'Costs\s+\(thousands\)', body)
    r = {'workers': row(ben, 'Covered Workers (thousands)'), 'wages': row(ben, 'Covered Wages (millions)'), 'ben100': row(ben, 'Benefits per $100 of Payroll'),
         'pc': row(cost, 'Private Carriers'), 'sf': row(cost, 'State Fund'), 'si': row(cost, 'Self-Insured'), 'total': row(cost, 'Total Costs'), 'cost100': row(cost, 'Costs per $100 of Payroll')}
    bad = [k for k, v in r.items() if not v or len(v) != 5]
    if bad: fail.append(f'{name}: {bad}'); continue
    if abs(r['pc'][4] + r['sf'][4] + r['si'][4] - r['total'][4]) > 3: fail.append(f'{name}: costs do not add up')
    nasi[key] = r
if set(nasi) != set(NAMES) | {'US'}: fail.append(f'NASI states: {sorted(set(NAMES) - set(nasi))}')
DUP = sorted(k for k in nasi for j in nasi if j < k and nasi[j] == nasi[k])
DUP = sorted(set(DUP) | {j for k in DUP for j in nasi if j != k and nasi[j] == nasi[k]})
if DUP != ['KY', 'LA']: fail.append(f'duplicates changed: {DUP}')
if 'In 2022, 22 states had state funds that paid WC benefits. Of these, 16 states had competitive funds and 4' not in T.replace('\n', ' ').replace('  ', ' '): fail.append('NASI state fund sentence not found')

# ---- DCBS appendix 4 (rating organization) and appendix 5 (assigned risk pool) ----
D = text('oregon-24-2083.pdf')
MONO = ['ND', 'OH', 'WA', 'WY']
INDEP = ['CA', 'DE', 'IN', 'MA', 'MI', 'MN', 'NJ', 'NY', 'NC', 'PA', 'WI']
a4 = D.split('Appendix 4. Jurisdictions by workers’ compensation rating organization')[-1].split('Appendix 5')[0]
for st in MONO + INDEP:
    if NAMES[st] not in a4: fail.append(f'appendix 4: {st}')
a5 = D.split('Appendix 5. 2023 assigned risk pool size')[-1].split('Appendix 6')[0]
arp = {}
for l in a5.split('\n'):
    m = re.match(r'^([A-Za-z .]+?)1?\s+(N/A|\d+\.\s?\d)%?(?:2)?\s+(N/A|[\d,]+)\s*$', l.strip())
    if m and m.group(1).strip() in BY_NAME:
        arp[BY_NAME[m.group(1).strip()]] = {'pct': None if m.group(2) == 'N/A' else float(m.group(2).replace(' ', '')), 'risks': None if m.group(3) == 'N/A' else int(m.group(3).replace(',', ''))}
m = re.search(r'Partial National Average = (\d+\.\d)% ([\d,]+)', a5)
arpAvg = {'pct': float(m.group(1)), 'risks': int(m.group(2).replace(',', ''))} if m else None
if len(arp) != 29 or not arpAvg: fail.append(f'appendix 5: {len(arp)} rows')

# ---- State funds: a state fund cost in 2022 means a state fund (NASI) ----
COMP = sorted(k for k in NAMES if k not in MONO and k != 'SC' and nasi[k]['sf'][4] > 0)
if len(COMP) != 16: fail.append(f'competitive state funds: {COMP}')

states = {}
for st in NAMES:
    n = nasi[st]
    fund = 'exclusive' if st in MONO else 'competitive' if st in COMP else 'public-only' if st == 'SC' else 'none'
    x = {'fund': fund, 'bureau': 'monopolistic' if st in MONO else 'independent' if st in INDEP else 'ncci', 'dup': st in DUP}
    if st not in DUP:
        x.update({'cost100': n['cost100'][4], 'cost100_2018': n['cost100'][0], 'ben100': n['ben100'][4], 'workersK': n['workers'][4],
                  'costTotalK': n['total'][4], 'sfK': n['sf'][4], 'pcK': n['pc'][4], 'siK': n['si'][4]})
    if st in arp: x['arp'] = arp[st]
    states[st] = x
us = nasi['US']
out = {'_source': 'NASI 2022 data report (state summaries, November 2024) and Oregon DCBS 2024 study, appendixes 4 and 5', 'retrieved_at': '2026-11-14',
       'us': {'cost100': us['cost100'][4], 'cost100_2018': us['cost100'][0], 'ben100': us['ben100'][4], 'costTotalK': us['total'][4], 'sfK': us['sf'][4], 'pcK': us['pc'][4], 'siK': us['si'][4], 'workersK': us['workers'][4]},
       'arpAvg': arpAvg, 'competitive': COMP, 'exclusive': MONO, 'states': states}
if fail: sys.exit('FAIL\n' + '\n'.join(fail))
json.dump(out, open(os.path.join(OUT, 'market-2022.json'), 'w'), indent=1, ensure_ascii=False)
print('market-2022.json:', len(states), 'states; competitive funds', COMP, '; ARP rows', len(arp), arpAvg)

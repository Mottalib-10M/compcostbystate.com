#!/usr/bin/env python3
"""Rebuilds src/data/dcbs-2024.json and src/data/wa-rates.json from the official files kept in data-raw/ (not in git).

Sources (downloaded 2026-11-13 with curl):
  data-raw/oregon-24-2083.pdf     https://www.oregon.gov/DCBS/DCBSPubs/reports/general/prem-rpt/24-2083.pdf
  data-raw/wa2026.xlsx            https://lni.wa.gov/insurance/_docs/2026RatesByClassCodeFund.xlsx
  data-raw/wa2027p.xlsx           https://lni.wa.gov/insurance/_docs/Proposed2027RatesByClassCodeFund.xlsx
  data-raw/wa2026-bustype.xlsx    https://lni.wa.gov/insurance/_docs/2026RatesBusTypeClassCode.xlsx
  data-raw/wa2027p-bustype.xlsx   https://lni.wa.gov/insurance/_docs/Proposed2027RatesBusTypeClassCode.xlsx
Checks: every DCBS class has 51 jurisdictions (rate or N/A), ranks 1..n without gap, rates never rise with rank.
Usage: python3 scripts/data/build-data.py
"""
import json, re, sys, os
import pypdf, openpyxl

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
RAW = os.path.join(ROOT, 'data-raw'); OUT = os.path.join(ROOT, 'src', 'data')
NAMES = {'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'}
BY_NAME = {v: k for k, v in NAMES.items()}
ST = set(NAMES)

pages = [(p.extract_text() or '') for p in pypdf.PdfReader(os.path.join(RAW, 'oregon-24-2083.pdf')).pages]
fail = []

# Table 1: rank 2024, rank 2022, state, index, % of median, effective date.
states = {}
for p in pages:
    if 'Table 1. Workers’ compensation premium rate ranking' not in p: continue
    for l in p.split('\n'):
        m = re.match(r'^(\d+) (\d+) ([A-Za-z .]+?) (\d\.\d\d) (\d+)% (.+)$', l.strip())
        if m and m.group(3) in BY_NAME:
            states[BY_NAME[m.group(3)]] = {'index': float(m.group(4)), 'rank': int(m.group(1)), 'rank2022': int(m.group(2)), 'pctMedian': int(m.group(5)), 'effective': m.group(6).strip()}
if set(states) != ST: fail.append(f'table 1: {sorted(ST - set(states))}')

# Appendix 1: class code and scope.
scope = {}
for p in pages:
    if 'Appendix 1. Occupational classes' not in p: continue
    lines = [l.strip() for l in p.split('\n')]
    for i, l in enumerate(lines):
        if re.fullmatch(r'\d{1,2} \d{1,4}', l):  # code alone on its line, scope on the next lines (class 5221)
            j, text = i + 1, ''
            while j < len(lines) and '$' not in lines[j]: text += ' ' + lines[j]; j += 1
            scope[l.split()[1]] = re.sub(r'\s+', ' ', text).strip(' -'); continue
        m = re.match(r'^(\d{1,2}) (\d{1,4}) (.+?)(?: \$[\d,]+ \$[\d, ]+)?$', l)
        if m and not l.startswith('Rank'):
            text = m.group(3)
            if '$' not in l and i + 1 < len(lines) and '$' in lines[i + 1]:
                text += ' ' + re.sub(r'\s*\$[\d,]+ \$[\d, ]+$', '', lines[i + 1])
            scope[m.group(2)] = re.sub(r'\s+', ' ', re.sub(r'\$[\d, ]+', '', text)).strip(' -')
# Appendix 6: class × jurisdiction.
classes, order = {}, []
for p in pages:
    if 'Appendix 6.' not in p: continue
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    i = 0; hdr = []
    while i < len(lines) and not re.match(r'^\d{1,2} [A-Z]{2} ', lines[i]): hdr.append(lines[i]); i += 1
    codes, labels = [], []
    for h in hdr:
        if h.startswith('Appendix 6') or re.fullmatch(r'\d{1,2}', h): continue
        m = re.fullmatch(r'(?:Class\s*)?(\d[\d ]*)\s*', h)
        if m: codes.append(m.group(1).replace(' ', '')); labels.append('')
        elif codes: labels[-1] = (labels[-1] + ' ' + h).strip()
    for r in lines[i:]:
        m = re.match(r'^(\d{1,2}) (.*)$', r)
        if not m: continue
        parts = re.findall(r'([A-Z]{2}) (N/A|[0-9 .]+?)(?= [A-Z]{2} |$)', m.group(2))
        if len(parts) != len(codes): fail.append(f'row {codes} {r}'); continue
        for (st, val), code in zip(parts, codes):
            d = classes.setdefault(code, {'short': '', 'rows': {}, 'na': []})
            if val.strip() == 'N/A': d['na'].append(st)
            else: d['rows'][st] = [int(m.group(1)), float(val.replace(' ', ''))]
    for c, l in zip(codes, labels):
        if l: classes[c]['short'] = re.sub(r'\s*/\s*', '/', re.sub(r'- ', '-', l))
        if c not in order: order.append(c)
for c in order:
    d = classes[c]; rows = d['rows']
    if set(rows) | set(d['na']) != ST: fail.append(f'class {c}: states')
    seq = [v for r, v in sorted(rows.values())]
    if any(seq[k] < seq[k + 1] - 1e-9 for k in range(len(seq) - 1)): fail.append(f'class {c}: order')
    if sorted(r for r, v in rows.values()) != list(range(1, len(rows) + 1)): fail.append(f'class {c}: ranks')
    if c not in scope: fail.append(f'class {c}: no scope')
if len(order) != 53: fail.append(f'{len(order)} classes')

dcbs = {
    '_source': 'Oregon Department of Consumer and Business Services, Oregon Workers’ Compensation Premium Rate Ranking, Calendar Year 2024 (June 2025), Table 1 and Appendixes 1 and 6. Rates in effect on January 1, 2024, dollars per $100 of payroll.',
    'url': 'https://www.oregon.gov/DCBS/DCBSPubs/reports/general/prem-rpt/24-2083.pdf',
    'page': 'https://www.oregon.gov/dcbs/reports/compensation/pages/wc-across-states.aspx',
    'retrieved_at': '2026-11-13', 'median': 1.09, 'names': NAMES, 'states': states,
    'classes': [{'code': c, 'short': classes[c]['short'], 'scope': scope.get(c, ''), 'rows': classes[c]['rows'], 'na': classes[c]['na']} for c in order],
}

# Washington L&I: hourly rates by class and fund (composite rate, payroll deduction), business examples.
def fund(path):
    out = {}
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    for r in ws.iter_rows(values_only=True):
        for off in (0, 8):
            c, comp, ded = r[off], r[off + 5] if len(r) > off + 5 else None, r[off + 6] if len(r) > off + 6 else None
            if isinstance(c, (int, float)) and isinstance(comp, (int, float)) and isinstance(ded, (int, float)):
                out[str(int(c)).zfill(4)] = [round(comp, 4), round(ded, 5)]
    return out
def bustype(path, base_cols):
    out = {}; group = ''
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    for r in ws.iter_rows(values_only=True):
        if isinstance(r[1], str) and r[1].isupper() and not r[1].startswith('ALL'): group = r[1].title()
        if isinstance(r[1], (int, float)) and isinstance(r[2], str):
            out[str(int(r[1])).zfill(4)] = {'desc': r[2].strip(), 'group': group, 'base': [round(r[k], 4) for k in base_cols]}
    return out
import warnings; warnings.filterwarnings('ignore')
f26, f27 = fund(os.path.join(RAW, 'wa2026.xlsx')), fund(os.path.join(RAW, 'wa2027p.xlsx'))
b26, b27 = bustype(os.path.join(RAW, 'wa2026-bustype.xlsx'), (6,)), bustype(os.path.join(RAW, 'wa2027p-bustype.xlsx'), (5, 6))
wa = {}
for c in sorted(set(f26) & set(f27) & set(b27)):
    wa[c] = {'desc': b27[c]['desc'], 'group': b27[c]['group'], 'comp2026': f26[c][0], 'ded2026': f26[c][1], 'comp2027': f27[c][0], 'ded2027': f27[c][1], 'base2026': b27[c]['base'][0], 'base2027': b27[c]['base'][1]}
if len(wa) < 250: fail.append(f'WA: {len(wa)} classes')
for c in ('5305', '4904', '0510'):
    if c not in wa: fail.append(f'WA class {c} missing')
wajson = {
    '_source': 'Washington State Department of Labor & Industries: 2026 hourly rates by risk classification code and fund (adopted) and proposed 2027 rates; composite base rates by business type. State fund rates per hour worked.',
    'urls': {'page': 'https://lni.wa.gov/insurance/rates-risk-classes/rates-for-workers-compensation/index', 'fund2026': 'https://lni.wa.gov/insurance/_docs/2026RatesByClassCodeFund.xlsx', 'fund2027': 'https://lni.wa.gov/insurance/_docs/Proposed2027RatesByClassCodeFund.xlsx', 'bus2027': 'https://lni.wa.gov/insurance/_docs/Proposed2027RatesBusTypeClassCode.xlsx'},
    'retrieved_at': '2026-11-13', 'classes': wa,
}
if fail: print('\n'.join(fail)); sys.exit(1)
json.dump(dcbs, open(os.path.join(OUT, 'dcbs-2024.json'), 'w'), indent=0, ensure_ascii=False)
json.dump(wajson, open(os.path.join(OUT, 'wa-rates.json'), 'w'), indent=0, ensure_ascii=False)
print(f'DCBS: {len(states)} states, {len(order)} classes; WA: {len(wa)} classes')

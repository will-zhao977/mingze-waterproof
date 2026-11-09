import json, re
from pathlib import Path
import openpyxl

DATA_DIR = Path(__file__).resolve().parents[1] / 'reports' / '记录与数据'
XL = '/Users/chengzhi/Downloads/全站推广-商品(投放时段_2026-08-13 ~ 2026-09-11).xlsx'
wb = openpyxl.load_workbook(XL, data_only=True)
ws = wb['sheet1']
rows = list(ws.iter_rows(values_only=True))
print('xlsx total rows (incl header):', len(rows))
# strip leading all-empty rows
while rows and all(c is None for c in rows[0]):
    rows.pop(0)
hdr = [str(c).strip() if c is not None else '' for c in rows[0]]
print('HEADER:', json.dumps(hdr, ensure_ascii=False))
data = rows[1:]
print('data rows:', len(data))
print('row0:', json.dumps([str(c)[:24] if c is not None else '' for c in data[0]], ensure_ascii=False))
print('row1:', json.dumps([str(c)[:24] if c is not None else '' for c in data[1]], ensure_ascii=False))

def num(v):
    if v is None: return 0.0
    if isinstance(v, (int, float)): return float(v)
    s = re.sub(r'[^0-9.\-]', '', str(v))
    try: return float(s) if s not in ('', '-', '.') else 0.0
    except: return 0.0

# map by header keywords
def find(*keys):
    for i, h in enumerate(hdr):
        if all(k in h for k in keys): return i
    return None
idx = {
    'id': find('产品ID') or find('商品ID') or 2,
    'imps': find('曝光'),
    'click': find('点击量'),
    'biz': find('全站商机量') ,
    'inq': find('询盘'),
    'tm': find('TM'),
    'order': find('订单'),
    'l1click': find('L1+点击'),
    'l1biz': find('L1+全站商机'),
}
print('IDX:', idx)

export = {}
for r in data:
    if not r or idx['id'] is None: continue
    pid = str(r[idx['id']]).strip() if r[idx['id']] is not None else ''
    if not re.fullmatch(r'\d{8,}', pid): continue
    export[pid] = {k: (num(r[i]) if i is not None else 0) for k, i in idx.items() if k != 'id'}
print('export unique product ids:', len(export))
tot = {k: sum(v[k] for v in export.values()) for k in ('imps','click','biz','l1biz','inq','tm','order','l1click')}
print('export totals:', json.dumps(tot))

# in-plan dataset
raw = json.load(open(DATA_DIR / 'alibaba_products_raw.json'))
dl = raw['dataSample']['detailList']
def g(d, k):
    v = d.get(k)
    return v.get('main', 0) if isinstance(v, dict) else (v or 0)
inplan = []
for d in dl:
    ag = (d.get('adgroupInfoDataDTO') or {}).get('main') or {}
    inplan.append({
        'id': str(g(d, 'productId')),
        'adGroupId': ag.get('adGroupId'),
        'adGroupStatus': ag.get('adGroupStatus'),
        'subject': str(g(d, 'subject') or '')[:120],
        'stage': str(g(d, 'prodStage') or ''),
        'imps': num(g(d, 'impsCnt')), 'click': num(g(d, 'clickCnt')),
        'biz': num(g(d, 'cvr3')), 'l1biz': num(g(d, 'l1PlusCvr3')),
        'inq': num(g(d, 'mcCnt')), 'tm': num(g(d, 'atmSessionCnt')),
        'order': num(g(d, 'orderCnt')), 'l1click': num(g(d, 'fiGrowthClickCnt')),
    })
print('in-plan products:', len(inplan))

DESIG = ['1601610105926', '1601597520094', '1601609188841', '1601608020570', '1601099715354']
# effective metrics = max(in-plan, export)
for p in inplan:
    e = export.get(p['id'])
    p['inReport'] = bool(e)
    p['effImps'] = max(p['imps'], e['imps'] if e else 0)
    p['effClick'] = max(p['click'], e['click'] if e else 0)
    p['effBiz'] = max(p['biz'], (e['biz'] + e['inq'] + e['tm'] + e['order']) if e else 0)

def has_conv(p): return p['order'] > 0 or p['inq'] > 0 or p['tm'] > 0 or p['biz'] > 0 or p['l1biz'] > 0
def has_click(p): return p['click'] > 0 or p['l1click'] > 0

conv = [p for p in inplan if has_conv(p)]
clk = [p for p in inplan if not has_conv(p) and has_click(p)]
rest = [p for p in inplan if not has_conv(p) and not has_click(p)]
desig_in = [p for p in inplan if p['id'] in DESIG]
print('convKeep=%d clickKeep=%d designatedInPlan=%d rest=%d' % (len(conv), len(clk), len(desig_in), len(rest)))

TARGET = 150
base = conv + clk + desig_in
baseids = set(p['id'] for p in base)
# rank the rest: lowest exposure/click first -> pause
rest_sorted = sorted(rest, key=lambda p: (p['effImps'], p['effClick'], p['id']))
need_pause = len(inplan) - TARGET
pause = rest_sorted[:need_pause]
keep_rest = rest_sorted[need_pause:]
keep = [p for p in inplan if p['id'] in baseids] + keep_rest
print('pause=%d keep=%d (target %d, in-plan %d)' % (len(pause), len(keep), TARGET, len(inplan)))
print('pause list effImps range: %s .. %s' % (pause[0]['effImps'] if pause else None, pause[-1]['effImps'] if pause else None))
print('kept-rest effImps range: %s .. %s' % ((keep_rest[0]['effImps'], keep_rest[-1]['effImps']) if keep_rest else None))

out = {
    'plan': {'id': 383290905, 'name': '全站推广_方案包_20260731103532', 'period': '2026-08-13 ~ 2026-09-11'},
    'exportFile': XL,
    'counts': {
        'exportUniqueProducts': len(export), 'inPlanProducts': len(inplan),
        'convKeep': len(conv), 'clickKeep': len(clk), 'designatedFound': len(desig_in),
        'zeroConversionRemainder': len(rest), 'plannedPause': len(pause), 'plannedKeep': len(keep),
    },
    'designatedNotInPlan': DESIG,
}
json.dump(out, open(DATA_DIR / 'shrink_plan_summary.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'planId': 383290905, 'toKeep': sorted([p['id'] for p in keep]),
           'details': [{k: p[k] for k in ('id','subject','imps','click','biz','inq','tm','order','effImps','effClick','adGroupId','adGroupStatus','stage')} for p in sorted(keep, key=lambda x: -x['effImps'])]},
          open(DATA_DIR / 'keep_list_150.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'planId': 383290905, 'toPause': sorted([p['id'] for p in pause]),
           'details': [{k: p[k] for k in ('id','subject','imps','click','biz','inq','tm','order','effImps','effClick','adGroupId','adGroupStatus','stage')} for p in sorted(pause, key=lambda x: x['effImps'])]},
          open(DATA_DIR / 'pause_list_322.json', 'w'), ensure_ascii=False, indent=1)
print('files written: shrink_plan_summary.json keep_list_150.json pause_list_322.json')

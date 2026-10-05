// dashboard.js — الرئيسية: كل الأرقام محسوبة من الطلبات الحقيقية
const DAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const liveOrders = () => S.orders.filter(o => o.status !== 'ملغي');
const sumOf = (list) => list.reduce((a, o) => a + (o.total || 0), 0);
const onDay = (list, d) => list.filter(o => dayKey(dOf(o.createdAt)) === dayKey(d));

function dailySeries() {
  const n = currentRange === 'week' ? 7 : 30, now = new Date(), out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    out.push({ key: dayKey(d), label: n === 7 ? DAYS[d.getDay()] : String(d.getDate()), val: 0 });
  }
  liveOrders().forEach(o => { const s = out.find(x => x.key === dayKey(dOf(o.createdAt))); if (s) s.val += o.total || 0; });
  return out;
}
function niceMax(v) {                       // أقرب رقم "حلو" فوق القيمة (للمحور)
  if (v <= 0) return 100;
  const mag = Math.pow(10, Math.floor(Math.log10(v / 4)));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag * 4 >= v) return m * mag * 4;
  return v;
}
function buildChart() {
  const data = dailySeries(), W = 640, H = 250, padL = 52, padR = 20, padT = 14, padB = 34;
  const max = niceMax(Math.max(...data.map(d => d.val)));
  const getX = (i) => padL + (W - padL - padR) * (i / (data.length - 1));
  const getY = (v) => padT + (H - padT - padB) * (1 - v / max);
  const pts = data.map((d, i) => ({ x: getX(i), y: getY(d.val) }));
  let path = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) { const m = (pts[i - 1].x + pts[i].x) / 2; path += ` C${m},${pts[i - 1].y} ${m},${pts[i].y} ${pts[i].x},${pts[i].y}`; }
  const area = `${path} L${pts[pts.length - 1].x},${H - padB} L${pts[0].x},${H - padB} Z`;
  let grid = '';
  for (let k = 0; k <= 4; k++) {
    const v = max * k / 4, y = getY(v);
    grid += `<line x1="${padL}" x2="${W - padR}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${padL - 8}" y="${y + 4}" text-anchor="end">${v >= 1000 ? +(v / 1000).toFixed(1) + 'k' : Math.round(v)}</text>`;
  }
  const labels = data.map((d, i) => (data.length === 7 || i % 5 === 0 || i === data.length - 1) ? `<text x="${getX(i)}" y="${H - 10}" text-anchor="middle">${d.label}</text>` : '').join('');
  const dots = pts.map((p, i) => `<circle class="pt" cx="${p.x}" cy="${p.y}" r="${data.length > 7 ? 4 : 5}" fill="var(--gold)" data-i="${i}"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%">${grid}<path d="${area}" fill="var(--gold)" opacity=".18"/><path d="${path}" fill="none" stroke="var(--gold)" stroke-width="2.5"/>${labels}${dots}<text class="tip" id="tip" x="${W / 2}" y="12" text-anchor="middle"></text></svg>`;
}

function buildDashboard() {
  const now = new Date(), yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const live = liveOrders(), tOrders = onDay(live, now), yOrders = onDay(live, yest);
  const newUsers = (d) => S.users.filter(u => dayKey(dOf(u.createdAt)) === dayKey(d)).length;
  const avg = (l) => l.length ? sumOf(l) / l.length : 0;
  const kpis = [
    ['مبيعات اليوم', fmt(sumOf(tOrders)), sumOf(tOrders), sumOf(yOrders), 'orders'],
    ['الطلبات', tOrders.length, tOrders.length, yOrders.length, 'orders'],
    ['عملاء جدد', newUsers(now), newUsers(now), newUsers(yest), 'cust'],
    ['متوسط الطلب', fmt(Math.round(avg(tOrders))), avg(tOrders), avg(yOrders), 'orders']
  ];
  const kpiHtml = kpis.map(([title, value, a, b, target]) => {
    let ch = '<span style="color:var(--muted)">—</span>';
    if (b > 0) { const c = Math.round((a - b) / b * 1000) / 10; ch = `<span class="${c >= 0 ? 'up' : 'down'}">${c > 0 ? '+' : ''}${c}% عن أمس</span>`; }
    return `<div class="card kpi" data-go="${target}"><div class="h"><span>${title}</span></div><b>${value}</b>${ch}</div>`;
  }).join('');

  // المبيعات حسب القسم + الأكثر مبيعًا (من بنود الطلبات)
  const byCat = {}, byProd = {};
  live.forEach(o => (o.items || []).forEach(it => {
    const c = it.cat || 'أخرى'; byCat[c] = (byCat[c] || 0) + it.price * it.qty;
    byProd[it.name] = (byProd[it.name] || 0) + it.qty;
  }));
  const catTotal = Object.values(byCat).reduce((a, b) => a + b, 0);
  const catList = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const catsHtml = catList.length ? catList.map(([name, v]) => {
    const pct = Math.round(v / catTotal * 100);
    return `<div class="bar" data-go="cats"><div class="l"><span>${esc(name)}</span><span>${pct}%</span></div><div class="t"><div class="f" style="width:${pct}%"></div></div></div>`;
  }).join('') : '<div class="empty">لسه مفيش مبيعات</div>';
  const topHtml = Object.entries(byProd).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([name, n]) => `<div class="row" data-go="products"><span>${esc(name)}</span><span>${n} قطعة</span></div>`).join('') || '<div class="empty">لسه مفيش مبيعات</div>';
  const statusHtml = STATUSES.map(s => {
    const n = onDay(S.orders, now).filter(o => o.status === s).length;
    return `<div class="row" data-go="orders" data-st="${s}"><span><i class="dot" style="background:${STATUS_COLOR[s]}"></i>${s}</span><span>${n}</span></div>`;
  }).join('');

  return `
    <div class="grid g4">${kpiHtml}</div>
    <div class="grid g2">
      <div class="card"><h3>المبيعات حسب القسم</h3>${catsHtml}</div>
      <div class="card">
        <div class="ch"><h3>${currentRange === 'week' ? 'المبيعات خلال الأسبوع' : 'المبيعات خلال الشهر'}</h3>
        <button class="sel" id="range">${currentRange === 'week' ? 'آخر 7 أيام' : 'آخر 30 يوم'} ▾</button></div>
        ${buildChart()}
      </div>
    </div>
    <div class="grid g2b">
      <div class="card"><h3>الأكثر مبيعًا</h3>${topHtml}</div>
      <div class="card"><h3>حالة الطلبات اليوم</h3>${statusHtml}</div>
    </div>`;
}

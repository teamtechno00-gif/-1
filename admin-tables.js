// tables.js — صفحات الإدارة: الطلبات / المنتجات / الأقسام / العملاء / الرسائل / البانرات / الإعدادات
const card = (title, count, tools, body) =>
  `<div class="card"><div class="ch"><h3>${title} <span class="tag">${count}</span></h3><div>${tools || ''}</div></div>${body}</div>`;
const table = (heads, rows) => `<div class="tw"><table><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr>${rows.join('')}</table></div>`;
const none = '<div class="empty">لا توجد نتائج</div>';
const hit = (arr, q) => !q || arr.join(' ').toLowerCase().includes(q.toLowerCase());
const thumb = (u) => u ? `<img class="thumb" src="${esc(imgSrc(u))}" alt="" onerror="this.style.visibility='hidden'">` : '<span class="thumb ph">—</span>';
const btn = (act, id, label, cls = '') => `<button class="act ${cls}" data-act="${act}" data-id="${esc(id)}">${label}</button>`;

/* ---------- الطلبات ---------- */
function ordersPage(q, status) {
  const list = [...S.orders].sort((a, b) => dOf(b.createdAt) - dOf(a.createdAt))
    .filter(o => (!status || o.status === status) && hit(['#' + o.orderNo, o.name, o.phone, o.addr], q));
  const rows = list.map(o => `<tr><td>#${o.orderNo}</td><td>${esc(o.name)}</td><td dir="ltr">${esc(o.phone)}</td><td>${fmt(o.total)} ج.م</td>
    <td><select class="st" data-oid="${o.id}">${STATUSES.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
    <td>${fmtDate(o.createdAt)}</td><td>${btn('view-order', o.id, 'تفاصيل')}${btn('del-order', o.id, 'حذف')}</td></tr>`);
  const tools = status ? `<span class="chip">${status}</span><button class="btn ghost sm" data-act="clear-status">إلغاء الفلتر</button>` : '';
  return card('الطلبات', list.length, tools, list.length ? table(['رقم', 'العميل', 'الموبايل', 'الإجمالي', 'الحالة', 'التاريخ', ''], rows) : none);
}
function orderModal(id) {
  const o = S.orders.find(x => x.id === id); if (!o) return;
  openModal(`<h2>طلب #${o.orderNo}</h2><p class="note">${fmtDate(o.createdAt)} — ${esc(o.status)}</p>
    <div class="li"><span>العميل</span><span>${esc(o.name)}</span></div>
    <div class="li"><span>الموبايل</span><a href="tel:${esc(o.phone)}" dir="ltr" style="color:var(--gold)">${esc(o.phone)}</a></div>
    <div class="li"><span>العنوان</span><span style="white-space:normal;text-align:left">${esc(o.addr)}</span></div>
    ${o.note ? `<div class="li"><span>ملاحظات</span><span>${esc(o.note)}</span></div>` : ''}
    <h3 style="margin:14px 0 4px">المنتجات</h3>
    ${(o.items || []).map(i => `<div class="li"><span>${esc(i.name)} × ${i.qty}</span><span>${fmt(i.price * i.qty)} ج.م</span></div>`).join('')}
    <div class="li"><b>الإجمالي</b><b>${fmt(o.total)} ج.م</b></div>`);
}

/* ---------- المنتجات ---------- */
function productsPage(q) {
  const list = [...S.products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).filter(p => hit([p.name, p.en, p.cat, p.sub], q));
  const rows = list.map(p => `<tr><td>${thumb(p.img)}</td><td>${esc(p.name)}</td><td>${esc(p.cat)} | ${esc(p.sub)}</td><td>${fmt(p.price)} ج.م</td>
    <td>${p.stock == null ? '—' : p.stock}</td><td>${esc(p.section || '—')}</td>
    <td><span class="chip ${p.active === false ? 'off' : ''}">${p.active === false ? 'مخفي' : 'ظاهر'}</span></td>
    <td>${btn('edit-product', p.id, 'تعديل')}${btn('toggle-product', p.id, p.active === false ? 'إظهار' : 'إخفاء')}${btn('del-product', p.id, 'حذف')}</td></tr>`);
  return card('المنتجات', list.length, '<button class="btn sm" data-act="add-product">+ إضافة منتج</button>',
    list.length ? table(['', 'المنتج', 'القسم', 'السعر', 'المخزون', 'صف الرئيسية', 'الحالة', ''], rows) : none);
}
function productForm(id) {
  if (!S.cats.length) return showToast('ضيف قسم الأول من صفحة الأقسام');
  const p = S.products.find(x => x.id === id) || {};
  openModal(`<h2>${id ? 'تعديل منتج' : 'إضافة منتج'}</h2>
  <form data-form="product" data-id="${esc(id || '')}">
    <label>الاسم (عربي)</label><input name="name" value="${esc(p.name)}" required>
    <label>الاسم (English)</label><input name="en" value="${esc(p.en)}">
    <div class="two">
      <div><label>القسم</label><select name="cat" id="fCat">${S.cats.map(c => `<option ${c.name === p.cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
      <div><label>القسم الفرعي</label><select name="sub" id="fSub"></select></div>
    </div>
    <div class="two">
      <div><label>السعر (ج.م)</label><input name="price" type="number" min="0" step="0.5" value="${p.price ?? ''}" required></div>
      <div><label>المخزون (فاضي = متوفر)</label><input name="stock" type="number" min="0" value="${p.stock ?? ''}"></div>
    </div>
    <label>يظهر في صف (الرئيسية)</label>
    <select name="section"><option value="">— لا يظهر في الرئيسية —</option>${HOME_SECTIONS.map(s => `<option ${s === p.section ? 'selected' : ''}>${s}</option>`).join('')}</select>
    <label>صورة المنتج</label><input type="file" name="file" accept="image/*" id="fFile">
    ${p.img ? `<img class="prev" id="prev" src="${esc(imgSrc(p.img))}" alt="">` : '<img class="prev" id="prev" style="display:none" alt="">'}
    <label class="chk"><input type="checkbox" name="active" ${p.active === false ? '' : 'checked'}> ظاهر في الموقع</label>
    <div class="err" id="ferr"></div>
    <button class="btn">حفظ</button>
  </form>`);
  fillSubs(p.sub);
}
function fillSubs(selected) {
  const c = S.cats.find(x => x.name === $('#fCat').value);
  const subs = (c && c.subs) || [];
  $('#fSub').innerHTML = subs.length ? subs.map(s => `<option ${s === selected ? 'selected' : ''}>${esc(s)}</option>`).join('') : '<option value="">—</option>';
}

/* ---------- الأقسام ---------- */
function catsPage(q) {
  const list = [...S.cats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).filter(c => hit([c.name, c.en, (c.subs || []).join(' ')], q));
  const rows = list.map(c => `<tr><td>${thumb(c.img)}</td><td>${esc(c.name)}</td><td>${esc(c.en || '—')}</td><td>${(c.subs || []).length}</td>
    <td>${S.products.filter(p => p.cat === c.name).length}</td><td><span class="chip ${c.circle ? '' : 'off'}">${c.circle ? 'ظاهر' : 'لا'}</span></td>
    <td>${btn('edit-cat', c.id, 'تعديل')}${btn('del-cat', c.id, 'حذف')}</td></tr>`);
  return card('الأقسام', list.length, '<button class="btn sm" data-act="add-cat">+ إضافة قسم</button>',
    list.length ? table(['صورة', 'القسم', 'English', 'أقسام فرعية', 'منتجات', 'في دوائر الرئيسية', ''], rows) : none);
}
function catForm(id) {
  const c = S.cats.find(x => x.id === id) || {};
  const subs = (c.subs || []).map((s, i) => s + (c.subsEn && c.subsEn[i] ? ' | ' + c.subsEn[i] : '')).join('\n');
  openModal(`<h2>${id ? 'تعديل قسم' : 'إضافة قسم'}</h2>
  <form data-form="cat" data-id="${esc(id || '')}">
    <label>اسم القسم (عربي)</label><input name="name" value="${esc(c.name)}" required>
    <label>الاسم (English)</label><input name="en" value="${esc(c.en)}">
    <label>الأقسام الفرعية (كل واحد في سطر — ممكن: عربي | English)</label>
    <textarea name="subs" rows="5">${esc(subs)}</textarea>
    <div class="two">
      <div><label>الترتيب</label><input name="order" type="number" value="${c.order ?? S.cats.length}"></div>
      <div><label class="chk" style="margin-top:34px"><input type="checkbox" name="circle" ${c.circle ? 'checked' : ''}> يظهر كدايرة في الرئيسية</label></div>
    </div>
    <label>صورة القسم (للدايرة)</label><input type="file" name="file" accept="image/*" id="fFile">
    ${c.img ? `<img class="prev" id="prev" src="${esc(imgSrc(c.img))}" alt="">` : '<img class="prev" id="prev" style="display:none" alt="">'}
    <div class="note">لو غيّرت اسم القسم، المنتجات بتتنقل له تلقائي. لو غيّرت اسم قسم فرعي، عدّل المنتجات بتاعته.</div>
    <div class="err" id="ferr"></div>
    <button class="btn">حفظ</button>
  </form>`);
}

/* ---------- العملاء ---------- */
function custPage(q) {
  const list = [...S.users].sort((a, b) => dOf(b.createdAt) - dOf(a.createdAt)).filter(u => hit([u.name, u.phone], q));
  const rows = list.map(u => {
    const mine = S.orders.filter(o => o.uid === u.id);
    return `<tr><td>${esc(u.name)}</td><td dir="ltr"><a href="tel:${esc(u.phone)}" style="color:var(--gold)">${esc(u.phone)}</a></td>
      <td>${fmtDate(u.createdAt)}</td><td>${mine.length}</td><td>${fmt(mine.filter(o => o.status !== 'ملغي').reduce((a, o) => a + (o.total || 0), 0))} ج.م</td>
      <td>${btn('view-cust', u.id, 'طلباته')}</td></tr>`;
  });
  return card('العملاء المسجلين', list.length, '', list.length ? table(['الاسم', 'الموبايل', 'تاريخ التسجيل', 'الطلبات', 'إجمالي المشتريات', ''], rows) : none);
}
function custModal(id) {
  const u = S.users.find(x => x.id === id); if (!u) return;
  const mine = S.orders.filter(o => o.uid === id).sort((a, b) => dOf(b.createdAt) - dOf(a.createdAt));
  openModal(`<h2>${esc(u.name)}</h2><p class="note" dir="ltr" style="text-align:right">${esc(u.phone)}</p><h3 style="margin:14px 0 4px">الطلبات</h3>` +
    (mine.map(o => `<div class="li"><span>#${o.orderNo} — ${esc(o.status)}</span><span>${fmt(o.total)} ج.م</span></div>`).join('') || '<div class="empty">لا توجد طلبات</div>'));
}

/* ---------- الرسائل ---------- */
function msgsPage(q) {
  const list = [...S.messages].sort((a, b) => dOf(b.createdAt) - dOf(a.createdAt)).filter(m => hit([m.name, m.phone, m.msg], q));
  const rows = list.map(m => `<tr><td>${esc(m.name)}</td><td dir="ltr">${esc(m.phone)}</td><td class="wrap">${esc(m.msg)}</td><td>${fmtDate(m.createdAt)}</td>
    <td><span class="chip ${m.read ? 'off' : ''}">${m.read ? 'مقروءة' : 'جديدة'}</span></td>
    <td>${btn('toggle-msg', m.id, m.read ? 'غير مقروءة' : 'تمت القراءة')}${btn('del-msg', m.id, 'حذف')}</td></tr>`);
  return card('الرسائل', list.length, '', list.length ? table(['الاسم', 'الموبايل', 'الرسالة', 'التاريخ', 'الحالة', ''], rows) : none);
}

/* ---------- البانرات ---------- */
function bannersPage() {
  const b = S.settings.banners || [], pr = S.settings.promos || {};
  const gal = b.map((u, i) => `<figure><img src="${esc(imgSrc(u))}" alt="">${btn('del-banner', String(i), 'حذف')}</figure>`).join('');
  const slot = (k, n) => `<div class="slot">${pr[k] ? `<img src="${esc(imgSrc(pr[k]))}" alt="">` : '<span class="thumb ph" style="width:160px;height:70px;line-height:70px">فاضي</span>'}
    <div><b>البانر الإعلاني ${n}</b><br><label class="btn sm" style="display:inline-block;margin-top:8px">${pr[k] ? 'استبدال' : 'رفع صورة'}<input type="file" accept="image/*" hidden data-up="${k}"></label></div></div>`;
  return card('بانرات السلايدر', b.length, `<label class="btn sm">+ إضافة صور<input type="file" accept="image/*" multiple hidden data-up="banner"></label>`,
    (gal ? `<div class="gal">${gal}</div>` : '<div class="empty">مفيش بانرات — الموقع بيعرض الصور الافتراضية.</div>')) +
    card('البانرات الإعلانية', 2, '', slot('p1', 1) + slot('p2', 2));
}

/* ---------- الإعدادات ---------- */
function setPage() {
  return card('الإعدادات', '', '', `
    <div class="li"><span>الحساب الحالي</span><span dir="ltr">${esc(auth.currentUser ? auth.currentUser.email : '')}</span></div>
    <div class="li"><span>المنتجات / الأقسام / العملاء / الطلبات</span><span>${S.products.length} / ${S.cats.length} / ${S.users.length} / ${S.orders.length}</span></div>
    <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn" data-act="seed">نقل البيانات الأولية للقاعدة</button>
      <button class="btn ghost" data-act="logout">تسجيل خروج</button>
    </div>
    <p class="note">زرار "نقل البيانات الأولية" بينقل الأقسام والمنتجات والبانرات الموجودة في الموقع لـ Firebase مرة واحدة عشان تعدّل عليهم من هنا. استخدمه مرة واحدة بس.</p>`);
}

function buildPage(key, q, status) {
  return { orders: () => ordersPage(q, status), products: () => productsPage(q), cats: () => catsPage(q), cust: () => custPage(q),
    msgs: () => msgsPage(q), banners: bannersPage, set: setPage }[key]();
}

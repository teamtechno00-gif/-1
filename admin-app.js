// app.js — تشغيل اللوحة وربط كل الأزرار (آخر ملف بيتحمّل)
let loginMsg = '';

function renderPage() {
  if (currentPage === 'dash') { $('#sub').textContent = 'ملخص الأداء اليوم'; $('#q').placeholder = 'ابحث في الطلبات'; $('#view').innerHTML = buildDashboard(); return; }
  const title = PAGES.find(p => p[0] === currentPage)[1];
  $('#sub').textContent = title; $('#q').placeholder = 'ابحث في ' + title;
  $('#view').innerHTML = buildPage(currentPage, $('#q').value, statusFilter);
}
function updateBadge() {
  const n = S.orders.filter(o => o.status === 'جديدة').length, m = S.messages.filter(x => !x.read).length;
  const b = $('#badge'); b.textContent = n + m; b.style.display = n + m ? '' : 'none';
  $('#drop').innerHTML = (n ? `<div data-go="orders" data-st="جديدة">${n} طلب جديد</div>` : '') + (m ? `<div data-go="msgs">${m} رسالة جديدة</div>` : '') || '<div>لا توجد إشعارات</div>';
}
function onData() { updateBadge(); renderPage(); }   // بيتنادى من store.js مع كل تغيير في القاعدة

/* ---------- الأوامر (data-act) ---------- */
const guard = (fn) => async (...a) => { try { await fn(...a); } catch (e) { showToast('حصل خطأ: ' + (e.code || e.message)); } };
const ACT = {
  close: closeModal,
  'clear-status': () => { statusFilter = ''; renderPage(); },
  'view-order': (id) => orderModal(id),
  'del-order': guard(async (id) => { if (confirm('حذف الطلب نهائيًا؟')) { await db.collection('orders').doc(id).delete(); showToast('تم الحذف'); } }),
  'add-product': () => productForm(''), 'edit-product': (id) => productForm(id),
  'toggle-product': guard(async (id) => { const p = S.products.find(x => x.id === id); await db.collection('products').doc(id).update({ active: p.active === false }); }),
  'del-product': guard(async (id) => { const p = S.products.find(x => x.id === id); if (confirm('حذف "' + p.name + '"؟')) { await db.collection('products').doc(id).delete(); deleteImage(p.img); showToast('تم الحذف'); } }),
  'add-cat': () => catForm(''), 'edit-cat': (id) => catForm(id),
  'del-cat': guard(async (id) => {
    const c = S.cats.find(x => x.id === id), n = S.products.filter(p => p.cat === c.name).length;
    if (confirm('حذف قسم "' + c.name + '"؟' + (n ? `\nفيه ${n} منتج مش هيظهروا في أي قسم.` : ''))) { await db.collection('categories').doc(id).delete(); deleteImage(c.img); showToast('تم الحذف'); }
  }),
  'view-cust': (id) => custModal(id),
  'toggle-msg': guard(async (id) => { const m = S.messages.find(x => x.id === id); await db.collection('messages').doc(id).update({ read: !m.read }); }),
  'del-msg': guard(async (id) => { if (confirm('حذف الرسالة؟')) await db.collection('messages').doc(id).delete(); }),
  'del-banner': guard(async (i) => {
    const url = (S.settings.banners || [])[+i];
    if (url && confirm('حذف البانر؟')) { await db.collection('settings').doc('home').set({ banners: firebase.firestore.FieldValue.arrayRemove(url) }, { merge: true }); deleteImage(url); }
  }),
  seed: guard(async () => {
    if (S.products.length || S.cats.length) return showToast('القاعدة فيها بيانات بالفعل — مش هنكررها');
    if (!confirm('نقل الأقسام والمنتجات والبانرات الأولية لـ Firebase؟')) return;
    const batch = db.batch();
    SEED_MENU.forEach((m, i) => {
      const circle = SEED_CATS.find(c => c.name === m.name);
      batch.set(db.collection('categories').doc(), { name: m.name, en: '', subs: m.subs, subsEn: [], img: '', circle: !!circle, order: i });
    });
    let k = 0;
    SEED_SECTIONS.forEach(s => s.items.forEach(p => batch.set(db.collection('products').doc(), {
      name: p.name, en: p.en, cat: p.cat, sub: p.sub, price: p.price, stock: p.stock ?? null, section: s.title,
      img: '', active: true, rating: p.rating, reviews: p.reviews, order: k++, createdAt: TS()
    })));
    batch.set(db.collection('settings').doc('home'), { banners: [], promos: {} }, { merge: true });
    await batch.commit(); showToast('تم نقل البيانات ✓');
  }),
  logout: () => auth.signOut()
};
function handleAct(el) { const f = ACT[el.dataset.act]; if (f) f(el.dataset.id, el); }

/* ---------- الضغط جوه منطقة المحتوى ---------- */
$('#view').addEventListener('click', (e) => {
  if (e.target.id === 'range') { currentRange = currentRange === 'week' ? 'month' : 'week'; return renderPage(); }
  const pt = e.target.closest('.pt');
  if (pt) { const d = dailySeries()[+pt.dataset.i]; $('#tip').textContent = `${d.label}: ${fmt(d.val)} ج.م`; return; }
  const a = e.target.closest('[data-act]'); if (a) return handleAct(a);
  const g = e.target.closest('[data-go]'); if (g) goTo(g.dataset.go, g.dataset.st || '');
});
$('#modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') return closeModal();
  const a = e.target.closest('[data-act]'); if (a) handleAct(a);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ---------- تغيير حالة الطلب + رفع صور البانرات ---------- */
$('#view').addEventListener('change', guard(async (e) => {
  const t = e.target;
  if (t.dataset.oid) { await db.collection('orders').doc(t.dataset.oid).update({ status: t.value }); return showToast('تم تحديث الحالة ✓'); }
  if (t.dataset.up && t.files.length) {
    showToast('جاري رفع الصور...');
    const ref = db.collection('settings').doc('home'), files = [...t.files];
    if (t.dataset.up === 'banner') {
      for (const f of files) { const url = await uploadImage(f, 'banners'); await ref.set({ banners: firebase.firestore.FieldValue.arrayUnion(url) }, { merge: true }); }
    } else {
      const old = (S.settings.promos || {})[t.dataset.up];
      const url = await uploadImage(files[0], 'banners');
      await ref.set({ promos: { [t.dataset.up]: url } }, { merge: true }); deleteImage(old);
    }
    t.value = ''; showToast('تم الرفع ✓');
  }
}));

/* ---------- فورمات المنتج والقسم (داخل النافذة) ---------- */
$('#modal').addEventListener('change', (e) => {
  if (e.target.id === 'fCat') fillSubs();
  if (e.target.id === 'fFile' && e.target.files[0]) { const p = $('#prev'); p.src = URL.createObjectURL(e.target.files[0]); p.style.display = 'block'; }
});
$('#modal').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target, type = form.dataset.form, id = form.dataset.id, f = Object.fromEntries(new FormData(form));
  const file = form.querySelector('input[type=file]').files[0], btnEl = form.querySelector('.btn'), err = (m) => { $('#ferr').textContent = m; };
  btnEl.disabled = true; btnEl.textContent = file ? 'جاري رفع الصورة...' : 'جاري الحفظ...';
  try {
    if (type === 'product') {
      const old = S.products.find(x => x.id === id) || {};
      let img = old.img || '';
      if (file) { img = await uploadImage(file, 'products'); if (old.img) deleteImage(old.img); }
      const data = {
        name: f.name.trim(), en: (f.en || '').trim() || f.name.trim(), cat: f.cat, sub: f.sub || '', price: Number(f.price),
        stock: f.stock === '' ? null : Number(f.stock), section: f.section || '', img, active: !!f.active
      };
      if (id) await db.collection('products').doc(id).update(data);
      else await db.collection('products').add({ ...data, rating: 0, reviews: 0, order: -Date.now(), createdAt: TS() });
    } else {
      const old = S.cats.find(x => x.id === id) || {};
      let img = old.img || '';
      if (file) { img = await uploadImage(file, 'categories'); if (old.img) deleteImage(old.img); }
      const lines = f.subs.split('\n').map(l => l.split('|').map(x => x.trim())).filter(l => l[0]);
      const name = f.name.trim();
      const data = { name, en: (f.en || '').trim(), subs: lines.map(l => l[0]), subsEn: lines.map(l => l[1] || ''), img, circle: !!f.circle && !!img, order: Number(f.order) || 0 };
      if (f.circle && !img) { btnEl.disabled = false; btnEl.textContent = 'حفظ'; return err('ارفع صورة عشان القسم يظهر كدايرة'); }
      if (id) {
        await db.collection('categories').doc(id).update(data);
        if (old.name && old.name !== name) {                       // نقل المنتجات للاسم الجديد
          const batch = db.batch(); S.products.filter(p => p.cat === old.name).forEach(p => batch.update(db.collection('products').doc(p.id), { cat: name }));
          await batch.commit();
        }
      } else await db.collection('categories').add(data);
    }
    closeModal(); showToast('تم الحفظ ✓');
  } catch (ex) { btnEl.disabled = false; btnEl.textContent = 'حفظ'; err('تعذّر الحفظ: ' + (ex.code || ex.message)); }
});

/* ---------- البحث والإشعارات ---------- */
$('#q').addEventListener('input', () => {
  if (currentPage === 'dash') { if (!$('#q').value) return; currentPage = 'orders'; renderNav(); }
  renderPage();
});
$('#bell').addEventListener('click', (e) => { e.stopPropagation(); $('#drop').classList.toggle('show'); });
$('#drop').addEventListener('click', (e) => { const g = e.target.closest('[data-go]'); if (g) goTo(g.dataset.go, g.dataset.st || ''); });
document.addEventListener('click', () => $('#drop').classList.remove('show'));

/* ---------- تسجيل دخول الأدمن ---------- */
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target)), b = e.target.querySelector('.btn');
  b.disabled = true; $('#loginErr').textContent = '';
  try { await auth.signInWithEmailAndPassword(f.email.trim(), f.pass); }
  catch (ex) { $('#loginErr').textContent = /invalid|wrong|user-not-found/.test(ex.code || '') ? 'البريد أو كلمة المرور غلط' : 'تعذّر الدخول: ' + (ex.code || ex.message); }
  b.disabled = false;
});
auth.onAuthStateChanged(async (u) => {
  if (!u) { stopStore(); $('#login').hidden = false; $('#loginErr').textContent = loginMsg; loginMsg = ''; return; }
  try {
    const a = await db.collection('admins').doc(u.uid).get();
    if (!a.exists) { loginMsg = 'الحساب ده مش أدمن. أضف الـ UID بتاعه في مجموعة admins.'; await auth.signOut(); return; }
  } catch (ex) { loginMsg = 'تعذّر التحقق من الصلاحية: ' + (ex.code || ex.message); await auth.signOut(); return; }
  $('#login').hidden = true; startStore(); renderNav(); renderPage();
});
renderNav();

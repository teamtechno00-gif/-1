/* shop-firebase.js - بيحل محل localStorage في الموقع: حسابات + طلبات + رسائل على Firebase */
localStorage.removeItem('hm_user');
auth.onAuthStateChanged(async (u) => {
  if (!u) { user = null; renderUser(); return; }
  try {
    const d = await db.collection('users').doc(u.uid).get();
    user = { uid: u.uid, name: d.exists ? d.data().name : 'عميل', phone: d.exists ? d.data().phone : '' };
  } catch { user = { uid: u.uid, name: 'عميل', phone: '' }; }
  renderUser();
});

showAccount = async function () {
  openModal(`<h2>أهلاً ${esc(user.name)}</h2><p>${esc(user.phone)}</p><h3 style="margin:14px 0 6px">طلباتي</h3><div id="myOrders" class="empty">...</div><button class="m-btn ghost" data-act="logout">تسجيل خروج</button>`, true);
  try {
    const snap = await db.collection('orders').where('uid', '==', user.uid).get();
    const list = snap.docs.map(d => d.data()).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    const box = $('#myOrders'); if (!box) return;
    box.className = '';
    box.innerHTML = list.length
      ? list.map(o => `<div class="sr"><div>طلب #${o.orderNo}<small style="display:block;color:#888">${esc(o.status)} — ${o.total} ج.م</small></div></div>`).join('')
      : '<div class="empty">لسه معندكش طلبات.</div>';
  } catch { const b = $('#myOrders'); if (b) b.textContent = 'تعذّر تحميل الطلبات'; }
};
actions.logout = async () => { await auth.signOut(); closeModal(); toast('تم تسجيل الخروج'); };

modalEl.addEventListener('submit', async (e) => {
  const type = e.target.dataset.form;
  if (!['register', 'login', 'order'].includes(type)) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const f = Object.fromEntries(new FormData(e.target));
  const err = (m) => { const x = $('#err'); if (x) x.textContent = m; };
  const btn = e.target.querySelector('button.m-btn'); if (btn) btn.disabled = true;
  try {
    if (type === 'register') {
      if (!/^01[0125]\d{8}$/.test(f.phone)) return err('رقم الموبايل غير صحيح');
      if (f.pass.length < 6) return err('كلمة المرور لازم 6 حروف على الأقل');
      const c = await auth.createUserWithEmailAndPassword(phoneEmail(f.phone), f.pass);
      await db.collection('users').doc(c.user.uid).set({ name: f.name.trim(), phone: f.phone, createdAt: TS() });
      user = { uid: c.user.uid, name: f.name.trim(), phone: f.phone };
    } else if (type === 'login') {
      const c = await auth.signInWithEmailAndPassword(phoneEmail(f.phone), f.pass);
      const d = await db.collection('users').doc(c.user.uid).get();
      user = { uid: c.user.uid, name: d.data().name, phone: d.data().phone };
    } else {
      const items = Object.entries(cartData).filter(([id]) => byId(id))
        .map(([id, qty]) => ({ id, name: byId(id).name, cat: byId(id).cat, price: byId(id).price, qty }));
      const orderNo = 1000 + Math.floor(Date.now() / 1000) % 1000000;
      await db.collection('orders').add({
        uid: user.uid, name: user.name, phone: user.phone, items, total: cartTotal(),
        addr: f.addr, note: f.note || '', status: 'جديدة', orderNo, createdAt: TS()
      });
      cartData = {}; saveCart();
      return openModal(`<div class="empty"><h2>تم استلام طلبك ✓</h2>رقم الطلب #${orderNo}<br>هنتواصل معاك على ${esc(user.phone)}</div>`, true);
    }
    renderUser(); closeModal(); toast('أهلاً ' + user.name);
    if (afterAuth) { const fn = afterAuth; afterAuth = null; fn(); }
  } catch (ex) {
    const c = ex.code || '';
    err(c === 'auth/email-already-in-use' ? 'الرقم ده مسجّل قبل كده'
      : /invalid|wrong|user-not-found/.test(c) ? 'الرقم أو كلمة المرور غلط'
      : c === 'auth/network-request-failed' ? 'مشكلة في الاتصال بالإنترنت' : 'حصلت مشكلة، حاول تاني');
  } finally { if (btn) btn.disabled = false; }
}, true);

pageEl.addEventListener('submit', async (e) => {
  e.preventDefault(); e.stopImmediatePropagation();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    await db.collection('messages').add({ ...data, read: false, createdAt: TS() });
    e.target.innerHTML = '<div class="empty">وصلتنا رسالتك ✓ هنرد عليك قريباً.</div>';
  } catch { toast('تعذّر الإرسال، حاول تاني'); }
}, true);

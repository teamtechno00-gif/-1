// store.js — بيسمع لتغييرات Firebase لحظيًا ويحطها في S
const S = { orders: [], products: [], cats: [], users: [], messages: [], settings: {} };
let unsubs = [];
function listen(name, key) {
  return db.collection(name).onSnapshot(
    (snap) => { S[key] = snap.docs.map(d => ({ id: d.id, ...d.data() })); if (typeof onData === 'function') onData(); },
    (e) => showToast('تعذّر تحميل ' + name + ': ' + e.code)
  );
}
function startStore() {
  stopStore();
  unsubs = [
    listen('orders', 'orders'), listen('products', 'products'), listen('categories', 'cats'),
    listen('users', 'users'), listen('messages', 'messages'),
    db.collection('settings').doc('home').onSnapshot((d) => { S.settings = d.exists ? d.data() : {}; if (typeof onData === 'function') onData(); })
  ];
}
function stopStore() { unsubs.forEach(u => u()); unsubs = []; }

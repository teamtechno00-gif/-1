// data.js — ثوابت اللوحة (الأيقونات والصفحات والحالات). البيانات الحقيقية بتيجي من Firebase (store.js)
const ICONS = {
  dash:     '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  orders:   '<path d="M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0"/>',
  products: '<path d="M3 12h18v8H3zM5 12V8a7 7 0 0 1 14 0v4"/>',
  cats:     '<path d="M4 6h16M4 12h16M4 18h10"/>',
  cust:     '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6"/>',
  msgs:     '<path d="M3 6h18v12H3zM3 6l9 7 9-7"/>',
  banners:  '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-5-5-9 7"/>',
  set:      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
};
const PAGES = [
  ['dash', 'لوحة التحكم'], ['orders', 'الطلبات'], ['products', 'المنتجات'], ['cats', 'الأقسام'],
  ['cust', 'العملاء'], ['msgs', 'الرسائل'], ['banners', 'البانرات'], ['set', 'الإعدادات']
];
const STATUSES = ['جديدة', 'قيد التحضير', 'في الطريق', 'تم التسليم', 'ملغي'];
const STATUS_COLOR = { 'جديدة': 'var(--gold)', 'قيد التحضير': 'var(--navy)', 'في الطريق': 'var(--purple)', 'تم التسليم': 'var(--green)', 'ملغي': 'var(--red)' };
// أقسام الصفحة الرئيسية في الموقع (لازم تطابق عناوين الصفوف في script.js)
const HOME_SECTIONS = ['الأكثر رواجًا', 'المنتجات الجديده', 'تشكيلة مميزة'];

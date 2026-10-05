/* ============================================================
   lang.js - زرار اللغة: بيقلب الموقع كله عربي <-> إنجليزي
   الفكرة: قاموس D (عربي ← إنجليزي). أي نص في الصفحة بيتترجم تلقائي،
   وأي نص جديد بيظهر (نافذة، صفحة، رسالة) بيتترجم لوحده عن طريق MutationObserver.
   لإضافة ترجمة جديدة: ضيف سطر في D.
   ============================================================ */
const D = {
  // الشريط العلوي والهيدر
  'اتصل بنا: 16312': 'Call us: 16312', 'وقت التوصيل من ٤٥ : ٦٠ دقيقة': 'Delivery time 45 - 60 minutes', 'طرق دفع سهلة': 'Easy payment methods',
  'ابحث عن..': 'Search for..', 'تسجيل دخول': 'Login', 'انشاء حساب': 'Sign up', 'إنشاء حساب': 'Sign up', 'منتج (ات)': 'item(s)', 'تغيير': 'Change',
  'مكرم عبيد': 'Makram Ebeid', 'مدينة نصر': 'Nasr City', 'التجمع الخامس': 'Fifth Settlement', 'المعادي': 'Maadi', 'الدقي': 'Dokki',
  'حلو الملك': 'Helw El Malek',
  // القائمة
  'الخصومات': 'Offers', 'مطعم': 'Restaurant', 'حلويات مصرية': 'Egyptian Sweets', 'حلويات غربية': 'Western Sweets', 'ميكس سويت': 'Mix Sweet',
  'مخبوزات': 'Bakery', 'شيكولاته': 'Chocolate', 'كحك 2026': 'Kahk 2026', 'المولد 2026': 'Mawlid 2026', 'آيس كريم': 'Ice Cream',
  'بسبوسه': 'Basbousa', 'علب مشكل': 'Assorted Boxes', 'مكس شرقي': 'Oriental Mix', 'جلاش': 'Goulash', 'اطباق': 'Plates', 'كنافه': 'Kunafa',
  'علب شرقي جاهزة': 'Ready Oriental Boxes', 'خبز': 'Bread', 'تشيز كيك': 'Cheesecake', 'بوكس': 'Box', 'كرواسون': 'Croissant', 'نص لتر': 'Half Liter',
  'كب كيك': 'Cupcakes', 'دونات': 'Donuts', 'تارت': 'Tarts', 'علب هدايا': 'Gift Boxes', 'عرض الكل': 'View all', 'عروض اليوم': "Today's Offers", 'عروض الأسبوع': 'Weekly Offers', 'وجبات': 'Meals', 'سلطات': 'Salads',
  'مشروبات': 'Drinks', 'ملبن': 'Malban', 'بسكوت': 'Biscuits', 'ألواح': 'Bars', 'كحك سادة': 'Plain Kahk', 'كحك بالعجمية': 'Ajamiya Kahk', 'كحك محشي': 'Stuffed Kahk',
  'حلاوة المولد': 'Mawlid Halawa', 'علب المولد': 'Mawlid Boxes', 'عروسة المولد': 'Mawlid Doll', 'كوب': 'Cups', 'عبوات عائلية': 'Family Tubs', 'تورتات': 'Cakes',
  // الكروت
  'متوفر في المخزون': 'In stock', 'اضف الي عربة': 'Add to cart', 'أضف للسلة': 'Add to cart',
  // الفوتر
  'نصنع أفضل الحلويات الشرقية والغربية والمخبوزات بأجود المكونات.': 'We make the finest oriental and western sweets and bakery from the best ingredients.',
  'عن الشركة': 'About', 'من نحن': 'About us', 'الفروع': 'Branches', 'وظائف': 'Careers', 'خدمة العملاء': 'Customer service', 'اتصل بنا': 'Contact us',
  'الشروط والأحكام': 'Terms & conditions', 'سياسة الخصوصية': 'Privacy policy', 'تواصل معنا': 'Get in touch', '© 2026 جميع الحقوق محفوظة': '© 2026 All rights reserved',
  // 404 والصفحات
  'الصفحة دي لسه مش متاحة في النسخة التجريبية.': 'This page is not available in the demo yet.', 'الرجوع للرئيسية': 'Back to home', 'الرئيسية': 'Home', 'كل المنتجات': 'All products',
  'المنتجات دي هتتضاف قريباً.': 'These products are coming soon.', 'مفيش عروض متاحة دلوقتي — تابعنا قريباً.': 'No offers right now — stay tuned.',
  'حلو الملك بيقدّم أفضل الحلويات الشرقية والغربية والمخبوزات بأجود المكونات، وبنهتم بالطعم والجودة في كل منتج.': 'Helw El Malek serves the best oriental and western sweets and bakery made with the finest ingredients, and we care about taste and quality in every product.',
  'فرع مكرم عبيد': 'Makram Ebeid branch', 'مدينة نصر، القاهرة': 'Nasr City, Cairo', 'اتصل بنا: 16312': 'Call us: 16312',
  'عايز تشتغل معانا؟ ابعتلنا بياناتك من صفحة "اتصل بنا" وهنراجعها.': 'Want to work with us? Send your details from the "Contact us" page and we will review them.',
  'بإتمامك الطلب فإنت بتوافق على بيانات التوصيل والأسعار المعروضة وقت الطلب. الأسعار قابلة للتغيير. لو في مشكلة في الطلب كلمنا خلال 24 ساعة من الاستلام.': 'By placing an order you agree to the delivery details and prices shown at the time of ordering. Prices may change. If there is a problem with your order, contact us within 24 hours of delivery.',
  'بنستخدم بياناتك (الاسم والموبايل والعنوان) لتوصيل طلبك والتواصل معاك بس، ومش بنشاركها مع أي جهة تانية.': 'We use your data (name, mobile and address) only to deliver your order and contact you, and we never share it with anyone else.',
  'اتصل بنا: 16312 — info@etoileeg.online': 'Call us: 16312 — info@etoileeg.online', 'الاسم': 'Name', 'الموبايل': 'Mobile', 'رسالتك': 'Your message', 'إرسال': 'Send',
  'وصلتنا رسالتك ✓ هنرد عليك قريباً.': 'We got your message ✓ We will reply soon.',
  // النوافذ
  'سلة المشتريات': 'Shopping cart', 'الإجمالي': 'Total', 'إتمام الطلب': 'Checkout', 'حذف': 'Remove', 'السلة فاضية — ضيف منتجات وارجع هنا.': 'Your cart is empty — add some products first.',
  'تمت الإضافة للسلة ✓': 'Added to cart ✓', 'رقم الموبايل': 'Mobile number', 'كلمة المرور': 'Password', 'دخول': 'Login', 'إنشاء الحساب': 'Create account',
  'رقم الموبايل غير صحيح': 'Invalid mobile number', 'كلمة المرور لازم 6 حروف على الأقل': 'Password must be at least 6 characters', 'الرقم ده مسجّل قبل كده': 'This number is already registered',
  'الرقم أو كلمة المرور غلط': 'Wrong number or password', 'طلباتي': 'My orders', 'لسه معندكش طلبات.': 'You have no orders yet.', 'تسجيل خروج': 'Logout', 'تم تسجيل الخروج': 'Logged out',
  'عنوان التوصيل': 'Delivery address', 'ملاحظات (اختياري)': 'Notes (optional)', 'الدفع عند الاستلام': 'Cash on delivery', 'تأكيد الطلب': 'Confirm order',
  'تم استلام طلبك ✓': 'Order received ✓', 'مفيش نتائج.': 'No results.', 'صورة المنتج': 'Product image', 'صورة': 'Image', 'اللوجو': 'Logo', 'بانر إعلاني 1': 'Promo banner 1', 'بانر إعلاني 2': 'Promo banner 2', 'اختار منطقتك': 'Choose your area'
};
// أسماء المنتجات وعناوين الصفوف بتتضاف تلقائي من الداتا
sections.forEach(s => { D[s.title] = s.en; s.items.forEach(p => { D[p.name] = p.en; }); });
Object.assign(D, window.EXTRA_EN || {});
D['نفد المخزون'] = 'Out of stock';
// جمل فيها أرقام أو أسماء
const RULES = [
  [/^تبقى فقط (\d+)$/, 'Only $1 left'], [/^(.+) ج\.م$/, '$1 EGP'], [/^أهلاً (.+)$/, 'Welcome $1'], [/^طلب #(\d+)$/, 'Order #$1'],
  [/^رقم الطلب #(\d+)$/, 'Order number #$1'], [/^هنتواصل معاك على (.+)$/, 'We will contact you at $1'],
  [/^نتائج البحث عن "(.*)"$/, 'Search results for "$1"'], [/^(.+) — (\d+) ج\.م$/, '$1 — $2 EGP']
];
const REV = Object.fromEntries(Object.entries(D).map(([a, e]) => [e, a]));
const toAr = (s) => REV[s] || s;                                  // بيرجّع الاسم العربي (للراوتر)

let lang = 'ar';
const origText = new WeakMap();

function trText(s) {                                              // يترجم نص واحد
  const t = s.trim(); if (!t) return s;
  let r = D[t];
  if (r === undefined && t.includes(' | ')) { r = t.split(' | ').map(x => D[x] ?? x).join(' | '); if (r === t) r = undefined; }
  if (r === undefined) for (const [re, to] of RULES) if (re.test(t)) { r = t.replace(re, to); break; }
  return r === undefined ? s : s.replace(t, () => r);
}
function walk(root) {                                             // يترجم عقدة وكل اللي جواها
  if (root.nodeType === 3) return fixNode(root);
  if (root.nodeType !== 1) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) fixNode(n); }
  [root, ...root.querySelectorAll('[placeholder],[aria-label]')].forEach(el => ['placeholder', 'aria-label'].forEach(a => {
    if (el.getAttribute && el.hasAttribute(a) && !el.dataset['ar' + a]) { const v = el.getAttribute(a), r = trText(v); if (r !== v) { el.dataset['ar' + a] = v; el.setAttribute(a, r); } }
  }));
}
function fixNode(n) { const r = trText(n.nodeValue); if (r !== n.nodeValue) { if (!origText.has(n)) origText.set(n, n.nodeValue); n.nodeValue = r; } }
function restore() {                                              // يرجّع الأصل العربي
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) if (origText.has(n)) { n.nodeValue = origText.get(n); origText.delete(n); }
  document.querySelectorAll('[data-arplaceholder],[data-aria-label],[data-ararialabel]').forEach(el => {
    if (el.dataset.arplaceholder) { el.setAttribute('placeholder', el.dataset.arplaceholder); delete el.dataset.arplaceholder; }
  });
}
// أي حاجة تتضاف للصفحة وإحنا إنجليزي تتترجم فوراً
new MutationObserver(ms => { if (lang === 'en') ms.forEach(m => m.addedNodes.forEach(walk)); })
  .observe(document.body, { childList: true, subtree: true });

function setLang(l) {
  lang = l; localStorage.setItem('hm_lang', l);
  const en = l === 'en', root = document.documentElement;
  root.lang = l; root.dir = en ? 'ltr' : 'rtl';                   // ده اللي بيقلب الاتجاه كله
  en ? walk(document.body) : restore();
  document.title = en ? 'Helw El Malek' : 'حلو الملك';
  $('#flag').classList.toggle('us', !en);                         // الزرار بيعرض اللغة التانية
  $('#langTxt').textContent = en ? 'العربية' : 'English';
}
$('#langLink').onclick = (e) => { e.preventDefault(); setLang(lang === 'ar' ? 'en' : 'ar'); };
setLang(localStorage.getItem('hm_lang') || 'ar');

/* ============================================================
   script.js - منطق الصفحة الرئيسية
   1) بيانات الصور والأقسام والمنتجات  ← هنا بتحط مسارات صورك
   2) رسم الصفحة
   3) السلايدر
   4) Not Found + السلة + الكوكيز
   ============================================================ */

/* ---------- دالة بترجّع مربع "مكان صورة" لو الصورة مش موجودة ---------- */
function phBox(label) {
  const d = document.createElement('div');
  d.className = 'ph';
  d.textContent = label || 'صورة';
  return d;
}
// بتعمل <img> وبتحط مكانها placeholder لو الملف مش موجود
function imgTag(src, label) {
  return `<img src="${src}" alt="" onerror="this.replaceWith(phBox('${label}'))">`;
}

/* ============================================================
   1) البيانات
   ============================================================ */

/* 🖼 صور البانر الرئيسي (السلايدر) - حط الصور في images/banners/ */
const banners = [
  'images/banners/banner-1.jpg',
  'images/banners/banner-2.jpg',
  'images/banners/banner-3.jpg'
];

/* 🖼 الأقسام الدائرية - صورة لكل قسم في images/categories/ */
const categories = [
  { name: 'حلويات مصرية', img: 'images/categories/1.jpg' },
  { name: 'حلويات غربية', img: 'images/categories/2.jpg' },
  { name: 'ميكس سويت',    img: 'images/categories/3.jpg' },
  { name: 'مخبوزات',      img: 'images/categories/4.jpg' },
  { name: 'شيكولاته',     img: 'images/categories/5.jpg' },
  { name: 'كحك 2026',     img: 'images/categories/6.jpg' },
  { name: 'المولد 2026',  img: 'images/categories/7.jpg' },
  { name: 'آيس كريم',     img: 'images/categories/8.jpg' }
];

/* 🖼 صفوف المنتجات - كل منتج: الاسم، الاسم بالإنجليزي، القسم، القسم الفرعي، السعر، التقييم، عدد التقييمات،
   stock (اختياري: لو كتبت رقم بيظهر "تبقى فقط N")، والصورة في images/products/
   الصف اللي فيه carousel:true بيطلع سلايدر بأسهم */
const sections = [
  { title: 'الأكثر رواجًا', en: 'Best Sellers', items: [
    { name: 'بسبوسة سادة (1/4 كيلو)', en: 'Plain Basbousa (1/4 kg)',  cat: 'حلويات مصرية', sub: 'بسبوسه',   price: 50,   rating: 3, reviews: 1, img: 'images/products/1.jpg' },
    { name: 'عيون سادة (1/4 كيلو)',   en: 'Plain Oyoun (1/4 kg)',     cat: 'حلويات مصرية', sub: 'مكس شرقي', price: 60,   rating: 3, reviews: 1, img: 'images/products/2.jpg' },
    { name: 'كنافة كريمة (1/4 كيلو)', en: 'Cream Kunafa (1/4 kg)',    cat: 'حلويات مصرية', sub: 'كنافه',    price: 62.5, rating: 2, reviews: 1, stock: 8,  img: 'images/products/3.jpg' },
    { name: 'بسبوسة بندق (1/4 كيلو)', en: 'Hazelnut Basbousa (1/4 kg)', cat: 'حلويات مصرية', sub: 'بسبوسه', price: 70,   rating: 3, reviews: 1, img: 'images/products/4.jpg' },
    { name: 'بلح الشام (1/4 كيلو)',   en: 'Balah El Sham (1/4 kg)',   cat: 'حلويات مصرية', sub: 'مكس شرقي', price: 47.5, rating: 3, reviews: 1, stock: 10, img: 'images/products/5.jpg' }
  ]},
  { title: 'المنتجات الجديده', en: 'New Products', items: [
    { name: 'جلاش بالمكسرات (1/4 كيلو)', en: 'Nuts Goulash (1/4 kg)', cat: 'حلويات مصرية', sub: 'جلاش',     price: 75,  rating: 4, reviews: 2, img: 'images/products/6.jpg' },
    { name: 'خبز الحبة الكاملة',         en: 'Whole Grain Bread',     cat: 'مخبوزات',      sub: 'خبز',      price: 45,  rating: 4, reviews: 3, img: 'images/products/7.jpg' },
    { name: 'تشيز كيك التوت',            en: 'Berry Cheesecake',      cat: 'حلويات غربية', sub: 'تشيز كيك', price: 95,  rating: 5, reviews: 4, img: 'images/products/8.jpg' },
    { name: 'بوكس شيكولاته فاخر',        en: 'Premium Chocolate Box', cat: 'شيكولاته',     sub: 'بوكس',     price: 210, rating: 4, reviews: 2, stock: 5, img: 'images/products/9.jpg' },
    { name: 'كرواسون بالزبدة',           en: 'Butter Croissant',      cat: 'مخبوزات',      sub: 'كرواسون',  price: 40,  rating: 3, reviews: 1, img: 'images/products/10.jpg' }
  ]},
  { title: 'تشكيلة مميزة', en: 'Featured Selection', carousel: true,
    items: [
    { name: 'آيس كريم مانجو (نص لتر)', en: 'Mango Ice Cream (half liter)', cat: 'آيس كريم',     sub: 'نص لتر',    price: 85,  rating: 0, reviews: 0, img: 'images/products/11.jpg' },
    { name: 'كب كيك (علبة ٦ قطع)',     en: 'Cupcakes (box of 6)',          cat: 'حلويات غربية', sub: 'كب كيك',    price: 110, rating: 0, reviews: 0, img: 'images/products/12.jpg' },
    { name: 'دونات مشكل (علبة ٦ قطع)', en: 'Assorted Donuts (box of 6)',   cat: 'حلويات غربية', sub: 'دونات',     price: 130, rating: 0, reviews: 0, img: 'images/products/13.jpg' },
    { name: 'تارت فواكه',              en: 'Fruit Tart',                   cat: 'حلويات غربية', sub: 'تارت',      price: 140, rating: 0, reviews: 0, img: 'images/products/14.jpg' },
    { name: 'حلقوم وملبن (علبة هدايا)', en: 'Turkish Delight (gift box)',  cat: 'ميكس سويت',    sub: 'علب هدايا', price: 75,  rating: 0, reviews: 0, img: 'images/products/15.jpg' },
    { name: 'تورتة شيكولاته (وسط)',    en: 'Chocolate Cake (medium)',      cat: 'حلويات غربية', sub: 'تورتات',    price: 350, rating: 0, reviews: 0, stock: 3, img: 'images/products/16.jpg' }
  ]}
];

/* 🧭 القائمة العلوية: كل قسم له قايمة اختيارات، وكل اختيار بيفتح صفحة الصنف ده
   لإضافة اختيار: ضيفه في subs (واسمه لازم يطابق sub في المنتجات عشان يعرض منتجاتها) */
const menu = [
  { name: 'الخصومات',     subs: ['عروض اليوم', 'عروض الأسبوع'] },
  { name: 'مطعم',         subs: ['وجبات', 'سلطات', 'مشروبات'] },
  { name: 'حلويات مصرية', subs: ['بسبوسه', 'علب مشكل', 'مكس شرقي', 'جلاش', 'اطباق', 'كنافه', 'علب شرقي جاهزة'] },
  { name: 'حلويات غربية', subs: ['تشيز كيك', 'كب كيك', 'دونات', 'تارت', 'تورتات'] },
  { name: 'ميكس سويت',    subs: ['علب هدايا', 'ملبن'] },
  { name: 'مخبوزات',      subs: ['خبز', 'كرواسون', 'بسكوت'] },
  { name: 'شيكولاته',     subs: ['بوكس', 'ألواح'] },
  { name: 'كحك 2026',     subs: ['كحك سادة', 'كحك بالعجمية', 'كحك محشي'] },
  { name: 'المولد 2026',  subs: ['حلاوة المولد', 'علب المولد', 'عروسة المولد'] },
  { name: 'آيس كريم',     subs: ['نص لتر', 'كوب', 'عبوات عائلية'] }
];
/* ---------- بيانات Firebase (لو متاحة؛ غير كده بيشتغل بالبيانات اللي فوق) ---------- */
sections.forEach(s => s.items.forEach(p => { p.id = p.id || p.img; }));
window.EXTRA_EN = {};
(function (R) {
  if (!R) return;
  const cfg = R.settings || {};
  if (R.prods.length) {
    const live = R.prods.filter(p => p.active !== false);
    live.forEach(p => { p.en = p.en || p.name; p.rating = p.rating || 0; p.reviews = p.reviews || 0; });
    sections.forEach(s => { s.items = live.filter(p => p.section === s.title); });
    const rest = live.filter(p => !sections.some(s => s.title === p.section));
    sections.push({ title: 'أخرى', en: 'Other', hidden: true, items: rest });   // بتظهر في الأقسام والبحث بس
  }
  if (R.cats.length) {
    menu.length = 0; categories.length = 0;
    R.cats.forEach(c => {
      menu.push({ name: c.name, subs: c.subs || [] });
      if (c.circle && c.img) categories.push({ name: c.name, img: c.img });
      if (c.en) EXTRA_EN[c.name] = c.en;
      (c.subs || []).forEach((x, i) => { if (c.subsEn && c.subsEn[i]) EXTRA_EN[x] = c.subsEn[i]; });
    });
  }
  if (cfg.banners && cfg.banners.length) { banners.length = 0; banners.push(...cfg.banners); }
  if (cfg.promos) {
    const els = document.querySelectorAll('.promos .promo');
    [cfg.promos.p1, cfg.promos.p2].forEach((u, i) => { if (u && els[i]) els[i].innerHTML = imgTag(u, 'بانر إعلاني ' + (i + 1)); });
  }
})(window.REMOTE);

document.getElementById('navList').innerHTML = menu.map(m => `
  <li class="has-drop">
    <a href="#" data-nf>${m.name}</a>
    <ul class="drop">
      <li><a href="#" data-nf data-go="${m.name}" class="all">عرض الكل</a></li>
      ${m.subs.map(x => `<li><a href="#" data-nf>${x}</a></li>`).join('')}
    </ul>
  </li>`).join('');

/* ============================================================
   2) رسم الصفحة
   ============================================================ */

// أيقونة القلب (المفضلة)
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

// كارت منتج واحد (نفس ترتيب Etoile: صورة + بادج + قلب / اسم / نجوم / مخزون / سعر / زرار)
function productCard(p) {
  const favs = JSON.parse(localStorage.getItem('hm_favs') || '[]');
  const stars = `<span class="stars"><b>${'★'.repeat(p.rating)}</b>${'★'.repeat(5 - p.rating)}</span>`;
  const stock = p.stock === 0 ? `<span class="stock low">نفد المخزون</span>` : (p.stock && p.stock <= 10) ? `<span class="stock low">تبقى فقط ${p.stock}</span>` : `<span class="stock">متوفر في المخزون</span>`;
  return `
    <article class="card" data-id="${p.id}">
      <div class="card-img">
        <span class="badge">${p.cat} | ${p.sub}</span>
        <button class="heart ${favs.includes(p.id) ? 'on' : ''}" type="button" aria-label="Favorite">${HEART}</button>
        ${imgTag(p.img, 'صورة المنتج')}
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="rate">${stars}<span class="rcount">(${p.reviews})</span></div>
        ${stock}
        <span class="price">${p.price} ج.م</span>
        <button class="add" type="button" ${p.stock === 0 ? 'disabled' : ''}><svg class="ic"><use href="#i-basket"/></svg>اضف الي عربة</button>
      </div>
    </article>`;
}

// الأقسام الدائرية
document.getElementById('cats').innerHTML = categories.map(c => `
  <a href="#" data-nf class="cat">
    <div class="cat-img">${imgTag(c.img, c.name)}</div>${c.name}
  </a>`).join('');

// صفوف المنتجات: صف عادي (شبكة 5 كروت) أو سلايدر بأسهم + الدايرة الخاصة
function sectionHTML(s) {
  if (s.hidden || !s.items.length) return '';
  const title = `<div class="sec-title"><i class="dot"></i><h2>${s.title}</h2><i class="line"></i></div>`;
  const cards = s.items.map(productCard).join('');
  if (!s.carousel) return `<section class="psec"><div class="container">${title}<div class="grid">${cards}</div></div></section>`;
  return `<section class="psec"><div class="container">${title}
    <div class="car-row">
      <div class="car">
        <button class="car-btn prev" type="button" aria-label="Previous"><svg class="ic"><use href="#i-left"/></svg></button>
        <div class="grid">${cards}</div>
        <button class="car-btn next" type="button" aria-label="Next"><svg class="ic"><use href="#i-right"/></svg></button>
      </div>
    </div></div></section>`;
}
document.getElementById('productSections').innerHTML = sections.map(sectionHTML).join('');

/* ============================================================
   3) السلايدر
   ============================================================ */
const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots');
let current = 0, timer;

slidesEl.innerHTML = banners.map((src, i) =>
  `<div class="slide">${imgTag(src, 'مكان صورة البانر ' + (i + 1))}</div>`).join('');
dotsEl.innerHTML = banners.map((_, i) => `<i data-i="${i}"></i>`).join('');

function goTo(i) {
  current = (i + banners.length) % banners.length;
  slidesEl.style.transform = `translateX(${-current * 100}%)`;
  [...dotsEl.children].forEach((d, k) => d.classList.toggle('on', k === current));
}
function autoplay() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5000); }

document.getElementById('nextBtn').onclick = () => { goTo(current + 1); autoplay(); };
document.getElementById('prevBtn').onclick = () => { goTo(current - 1); autoplay(); };
dotsEl.onclick = (e) => { if (e.target.dataset.i) { goTo(+e.target.dataset.i); autoplay(); } };
goTo(0); autoplay();

/* ============================================================
   4) Not Found + السلة + الكوكيز
   ============================================================ */
const home = document.getElementById('home');
const notFound = document.getElementById('notfound');

function showNotFound() { home.hidden = true; notFound.hidden = false; window.scrollTo(0, 0); }
function showHome()     { notFound.hidden = true; home.hidden = false; window.scrollTo(0, 0); }

// أي عنصر عليه data-nf بيفتح Not Found
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-nf]')) { e.preventDefault(); showNotFound(); }
});
document.getElementById('backHome').addEventListener('click', (e) => { e.preventDefault(); showHome(); });
document.getElementById('logoLink').addEventListener('click', (e) => { e.preventDefault(); showHome(); });

// شريط الكوكيز
['allowCk', 'denyCk'].forEach(id =>
  document.getElementById(id).addEventListener('click', () =>
    document.getElementById('cookies').classList.add('hide')));

/* ============================================================
   5) الموبايل: قائمة الدرج + سحب البانر بالصباع
   ============================================================ */
const navEl = document.querySelector('.nav');
const overlay = document.getElementById('overlay');
const isMobile = () => window.innerWidth <= 900;
function toggleMenu(open) { navEl.classList.toggle('open', open); overlay.classList.toggle('show', open); }
document.getElementById('burger').addEventListener('click', () => toggleMenu(!navEl.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));
navEl.addEventListener('click', (e) => { if (e.target.closest('a') && isMobile()) toggleMenu(false); });
// سحب البانر بالصباع
let touchX = null;
slidesEl.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
slidesEl.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); autoplay(); }
  touchX = null;
});

/* seed.js - البيانات الأولية (بتتنقل لـ Firebase بزرار في صفحة الإعدادات) */

const SEED_BANNERS = [
  'images/banners/banner-1.jpg',
  'images/banners/banner-2.jpg',
  'images/banners/banner-3.jpg'
];

const SEED_CATS = [
  { name: 'حلويات مصرية', img: 'images/categories/1.jpg' },
  { name: 'حلويات غربية', img: 'images/categories/2.jpg' },
  { name: 'ميكس سويت',    img: 'images/categories/3.jpg' },
  { name: 'مخبوزات',      img: 'images/categories/4.jpg' },
  { name: 'شيكولاته',     img: 'images/categories/5.jpg' },
  { name: 'كحك 2026',     img: 'images/categories/6.jpg' },
  { name: 'المولد 2026',  img: 'images/categories/7.jpg' },
  { name: 'آيس كريم',     img: 'images/categories/8.jpg' }
];

const SEED_SECTIONS = [
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

const SEED_MENU = [
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

// utils.js — أدوات مشتركة + الحالة العامة
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });

let currentPage = 'dash';
let currentRange = 'week';   // 'week' أو 'month'
let statusFilter = '';

const dOf = (t) => (t && t.toDate) ? t.toDate() : (t instanceof Date ? t : new Date());
const dayKey = (d) => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const fmtDate = (t) => dOf(t).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });

function icon(name, size = 20) {
  return `<svg viewBox="0 0 24 24" style="width:${size}px;height:${size}px;stroke:currentColor;fill:none;stroke-width:1.7">${ICONS[name]}</svg>`;
}
function showToast(text) {
  const t = $('#toast'); t.textContent = text; t.classList.add('show');
  clearTimeout(showToast.t); showToast.t = setTimeout(() => t.classList.remove('show'), 2200);
}
function openModal(html) {
  const m = $('#modal');
  m.innerHTML = `<div class="m-box"><button class="m-x" type="button" data-act="close" aria-label="إغلاق">×</button>${html}</div>`;
  m.hidden = false;
}
function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }

// مسار الصورة (لينك Firebase Storage)
const imgSrc = (u) => /^(https?:|data:)/.test(u || '') ? u : (u || '');

// بنصغّر الصورة قبل الرفع (أقصى 1200px) عشان الموقع يفضل سريع
function resizeImage(file, max = 1200) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => { URL.revokeObjectURL(url); b ? resolve(b) : reject(new Error('resize')); }, 'image/jpeg', 0.85);
    };
    img.onerror = () => reject(new Error('الملف مش صورة صالحة'));
    img.src = url;
  });
}
async function uploadImage(file, folder) {
  if (!storage) throw new Error('Storage مش متحمّل');
  const blob = await resizeImage(file);
  const ref = storage.ref(`${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`);
  await ref.put(blob, { contentType: 'image/jpeg' });
  return ref.getDownloadURL();
}
function deleteImage(url) {   // بيمسح الصورة من Storage (لو مرفوعة منه) ومش بيوقف لو فشل
  if (storage && /firebasestorage|appspot\.com/.test(url || '')) storage.refFromURL(url).delete().catch(() => {});
}

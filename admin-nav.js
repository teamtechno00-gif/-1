// nav.js — الشريط الجانبي والانتقال بين الصفحات
function renderNav() {
  $('#nav').innerHTML = PAGES.map(([key, title]) =>
    `<button class="nav ${key === currentPage ? 'on' : ''}" data-page="${key}">${icon(key)}${title}</button>`).join('');
}
function goTo(page, status = '') {
  currentPage = page; statusFilter = status;
  $('#q').value = '';
  renderNav(); renderPage();
  $('#drop').classList.remove('show');
}
$('#nav').addEventListener('click', (e) => {
  const b = e.target.closest('.nav'); if (b) goTo(b.dataset.page);
});

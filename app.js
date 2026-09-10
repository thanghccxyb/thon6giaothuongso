(function () {
  'use strict';

  const productGrid = document.getElementById('productGrid');
  const businessList = document.getElementById('businessList');
  const searchInput = document.getElementById('q');

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderProducts(products) {
    if (!productGrid) return;
    if (!products.length) {
      productGrid.innerHTML = '<div class="placeholder">Chưa có sản phẩm phù hợp.</div>';
      return;
    }
    productGrid.innerHTML = products.map(p => `
      <article class="card product">
        <div class="photo" aria-label="Mã mẫu sản phẩm">${esc(p.code)}</div>
        <div class="body">
          <span class="tag">${esc(p.tag)}</span>
          <h3>${esc(p.name)}</h3>
          <p style="margin:0 0 9px;color:#64788b;font-size:14px">${esc(p.description)}</p>
          <div class="meta"><span>📍 ${esc(p.location)}</span><span>💬 ${esc(p.channel)}</span></div>
          <div class="actions">
            <a class="btn btn-primary" href="${esc(p.contactUrl)}">${esc(p.contactLabel)}</a>
            <a class="btn btn-outline" href="#qr">${esc(p.qrLabel)}</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderBusinesses(businesses) {
    if (!businessList) return;
    businessList.innerHTML = businesses.map(b => `
      <div class="bizitem" data-search="${esc((b.name + ' ' + b.category + ' ' + b.channels).toLowerCase())}">
        <div>
          <strong>${esc(b.name)}</strong>
          <span>${esc(b.category)} · ${esc(b.channels)}</span>
        </div>
        <span class="status">${esc(b.status)}</span>
      </div>
    `).join('');
  }

  function bindSearch() {
    if (!searchInput || !businessList) return;
    searchInput.addEventListener('input', function () {
      const term = searchInput.value.trim().toLowerCase();
      businessList.querySelectorAll('.bizitem').forEach(item => {
        const haystack = item.dataset.search || '';
        item.style.display = !term || haystack.includes(term) ? 'flex' : 'none';
      });
    });
  }

  fetch('data/data.json', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Không tải được data.json');
      return response.json();
    })
    .then(data => {
      renderProducts(Array.isArray(data.products) ? data.products : []);
      renderBusinesses(Array.isArray(data.businesses) ? data.businesses : []);
      bindSearch();
    })
    .catch(error => {
      console.error(error);
      if (productGrid) productGrid.innerHTML = '<div class="placeholder">Không tải được dữ liệu. Kiểm tra thư mục data/data.json.</div>';
      if (businessList) businessList.innerHTML = '<div class="placeholder">Không tải được danh sách hộ. Kiểm tra thư mục data/data.json.</div>';
    });
}());

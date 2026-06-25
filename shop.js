/* ============================================================
   LISHAYY — Products page logic
   - Render products from shared catalogue
   - Category filtering
   - Sorting
   - Mobile filter drawer
   ============================================================ */

let activeCategory = 'all';
let activeSort = 'featured';

function getFilteredProducts() {
  let list = PRODUCTS.slice();

  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }

  switch (activeSort) {
    case 'price-low':  list.sort((a, b) => a.price - b.price); break;
    case 'price-high': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break; // featured = original order
  }
  return list;
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('result-count');
  if (!grid) return;

  const list = getFilteredProducts();
  countEl && (countEl.textContent = `${list.length} item${list.length !== 1 ? 's' : ''}`);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-box-open fa-2x"></i><p>No products found in this category.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(productCardHTML).join('');
  initReveal(); // animate newly added cards
}

function initFilters() {
  // Category buttons
  document.querySelectorAll('.filter-list button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-list button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderProducts();
      closeFilterDrawer();
    });
  });

  // Sort dropdown
  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      activeSort = sortSel.value;
      renderProducts();
    });
  }
}

/* ---------- Mobile filter drawer ---------- */
function openFilterDrawer() {
  document.querySelector('.filters')?.classList.add('open');
  document.getElementById('filter-backdrop')?.classList.add('show');
}
function closeFilterDrawer() {
  document.querySelector('.filters')?.classList.remove('open');
  document.getElementById('filter-backdrop')?.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  // Pre-select category from URL ?category=dresses
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat) {
    const btn = document.querySelector(`.filter-list button[data-category="${cat}"]`);
    if (btn) {
      document.querySelectorAll('.filter-list button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = cat;
    }
  }

  initFilters();
  renderProducts();

  document.getElementById('open-filters')?.addEventListener('click', openFilterDrawer);
  document.getElementById('filter-backdrop')?.addEventListener('click', closeFilterDrawer);
});
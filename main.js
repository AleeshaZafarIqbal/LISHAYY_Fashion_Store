/* ============================================================
   LISHAYY — Shared site logic
   - Mobile nav toggle
   - Cart count (localStorage)
   - Toast notifications
   - Scroll reveal
   - Newsletter form
   - Footer year
   ============================================================ */

/* ---------- Product catalogue (shared data) ---------- */
const PRODUCTS = [
  { id: 1, name: 'Silk Slip Dress',      category: 'dresses',  price: 189, oldPrice: null, rating: 5, badge: 'New',  image: 'images/product1.jpg' },
  { id: 2, name: 'Linen Wrap Blouse',    category: 'tops',     price: 89,  oldPrice: 120,  rating: 4, badge: 'Sale', image: 'images/product2.jpg' },
  { id: 3, name: 'Tailored Blazer',      category: 'outerwear',price: 245, oldPrice: null, rating: 5, badge: null,   image: 'images/product3.jpg' },
  { id: 4, name: 'Pleated Midi Skirt',   category: 'dresses',  price: 129, oldPrice: null, rating: 4, badge: 'New',  image: 'images/product4.jpg' },
  { id: 5, name: 'Tuxedo Jumpsuit',      category: 'dresses',  price: 219, oldPrice: 260,  rating: 5, badge: 'Sale', image: 'images/product5.jpg' },
  { id: 6, name: 'Couture Evening Gown', category: 'dresses',  price: 480, oldPrice: null, rating: 5, badge: null,   image: 'images/product6.jpg' },
  { id: 7, name: 'Classic Trench Coat',  category: 'outerwear',price: 320, oldPrice: null, rating: 5, badge: 'New',  image: 'images/product3.jpg' },
  { id: 8, name: 'Cotton Poplin Shirt',  category: 'tops',     price: 75,  oldPrice: 95,   rating: 4, badge: 'Sale', image: 'images/product2.jpg' },
  { id: 9, name: 'Statement Mini Dress', category: 'dresses',  price: 165, oldPrice: null, rating: 4, badge: null,   image: 'images/product4.jpg' }
];

/* ---------- LocalStorage helpers ---------- */
const Store = {
  getCart()   { return JSON.parse(localStorage.getItem('lishayy_cart')  || '[]'); },
  setCart(c)  { localStorage.setItem('lishayy_cart', JSON.stringify(c)); },
  getWish()   { return JSON.parse(localStorage.getItem('lishayy_wish')  || '[]'); },
  setWish(w)  { localStorage.setItem('lishayy_wish', JSON.stringify(w)); }
};

/* ---------- Toast ---------- */
function showToast(message, icon = 'fa-circle-check') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------- Cart ---------- */
function addToCart(productId) {
  const cart = Store.getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id: productId, qty: 1 }); }
  Store.setCart(cart);
  updateCartCount();
  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`${product ? product.name : 'Item'} added to bag`, 'fa-bag-shopping');
}

function cartTotalItems() {
  return Store.getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) {
    const count = cartTotalItems();
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  }
}

/* ---------- Wishlist ---------- */
function toggleWish(productId, btn) {
  let wish = Store.getWish();
  const idx = wish.indexOf(productId);
  if (idx === -1) {
    wish.push(productId);
    btn && btn.classList.add('active');
    showToast('Saved to wishlist', 'fa-heart');
  } else {
    wish.splice(idx, 1);
    btn && btn.classList.remove('active');
    showToast('Removed from wishlist', 'fa-heart-crack');
  }
  Store.setWish(wish);
}

/* ---------- Mobile navigation ---------- */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      const open = menu.classList.contains('open');
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      })
    );
  }
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

/* ---------- Newsletter ---------- */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(input.value.trim())) {
      showToast('Please enter a valid email', 'fa-triangle-exclamation');
      return;
    }
    showToast('Thanks for subscribing!', 'fa-envelope-circle-check');
    input.value = '';
  });
}

/* ---------- Render a product card ---------- */
function productCardHTML(p) {
  const wished = Store.getWish().includes(p.id);
  const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
  const priceHTML = p.oldPrice
    ? `<span class="old">$${p.oldPrice}</span><span class="sale-price">$${p.price}</span>`
    : `$${p.price}`;
  const badge = p.badge
    ? `<span class="product-badge ${p.badge === 'Sale' ? 'sale' : ''}">${p.badge}</span>` : '';
  return `
    <article class="product-card reveal" data-category="${p.category}" data-price="${p.price}" data-rating="${p.rating}" data-id="${p.id}">
      <div class="product-media">
        ${badge}
        <button class="wish-btn ${wished ? 'active' : ''}" aria-label="Add to wishlist" onclick="toggleWish(${p.id}, this)">
          <i class="fa-${wished ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-actions">
          <button class="btn" onclick="addToCart(${p.id})">Add to Bag</button>
        </div>
      </div>
      <div class="product-info">
        <span class="cat">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="stars">${stars}</div>
        <div class="product-price">${priceHTML}</div>
      </div>
    </article>`;
}

/* ---------- Init on every page ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initNewsletter();
  updateCartCount();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
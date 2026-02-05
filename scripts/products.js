const grid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');

const API = window.location.origin;

/* =========================
   LOAD CATEGORIES
   ========================= */

fetch(`${API}/api/categories`)
  .then(res => res.json())
  .then(categories => {
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categoryFilter.appendChild(option);
    });
  });

/* =========================
   LOAD PRODUCTS
   ========================= */

function loadProducts(categoryId = '') {
  let url = `${API}/api/products`;
  if (categoryId) url += `?category=${categoryId}`;

  fetch(url)
    .then(res => res.json())
    .then(products => {
      if (!products.length) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
      }

      grid.innerHTML = products.map(p => `
        <article class="product-card">
          <img src="/assets/products/${p.image}" alt="${p.name}">
          <div class="product-body">
            <span class="badge">${p.category || ''}</span>
            <h3>${p.name}</h3>
            <p>${p.short_description}</p>
            <div class="product-footer">
              <strong>$${p.price}</strong>
              <button class="btn primary" onclick="openProduct(${p.id})">
                View Details
              </button>
            </div>
          </div>
        </article>
      `).join('');
    })
    .catch(() => {
      grid.innerHTML = '<p>Error loading products.</p>';
    });
}

/* Initial load */
loadProducts();

/* Filter change */
categoryFilter.addEventListener('change', e => {
  loadProducts(e.target.value);
});

/* =========================
   PRODUCT DETAILS MODAL
   ========================= */

let currentProductId = null;

function openProduct(productId) {
  fetch(`${API}/api/products`)
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      currentProductId = product.id;

      document.getElementById('modalTitle').textContent = product.name;
      document.getElementById('modalDescription').textContent =
        product.long_description || product.short_description;
      document.getElementById('modalPrice').textContent =
        `$${product.price}`;

      document.getElementById('productModal').hidden = false;
    });
}

function closeProduct() {
  document.getElementById('productModal').hidden = true;
}

/* =========================
   ENQUIRY HANDOFF
   ========================= */

function openEnquiryFromModal() {
  closeProduct();

  const form = document.getElementById('enquiryForm');
  form.product_id.value = currentProductId;

  document.getElementById('enquiryModal').hidden = false;
}

function closeEnquiry() {
  document.getElementById('enquiryModal').hidden = true;
}

/* Submit enquiry */
document.getElementById('enquiryForm').addEventListener('submit', e => {
  e.preventDefault();

  const form = e.target;

  fetch(`${API}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: form.product_id.value,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value
    })
  })
  .then(res => res.json())
  .then(() => {
    alert('Enquiry sent successfully');
    form.reset();
    closeEnquiry();
  })
  .catch(() => alert('Failed to send enquiry'));
});

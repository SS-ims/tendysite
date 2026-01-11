const token = localStorage.getItem('adminToken');

if (!token) {
  window.location.href = 'admin-login.html';
}

/* Inject admin navbar */
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <nav class="navbar">
    <strong>Admin Panel</strong>
    <a href="admin-dashboard.html" data-page="dashboard">Dashboard</a>
    <a href="admin-enquiries.html" data-page="enquiries">Enquiries</a>
    <a href="#" id="logoutBtn">Logout</a>
  </nav>
  `
);

/* Logout handler */
document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
});

/* Active link highlighting */
const page = document.body.dataset.page;
document
  .querySelector(`.navbar a[data-page="${page}"]`)
  ?.classList.add('active');

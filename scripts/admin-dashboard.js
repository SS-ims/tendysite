const API = 'http://localhost:3000';

/* Fetch dashboard summary */
fetch(`${API}/api/admin/dashboard`, {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('adminToken')
  }
})
  .then(res => {
    if (res.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = 'admin-login.html';
      return;
    }
    return res.json();
  })
  .then(data => {
    if (!data) return;

    document.getElementById('total').textContent = data.total;
    document.getElementById('new').textContent = data.newCount;
    document.getElementById('contacted').textContent = data.contacted;
    document.getElementById('closed').textContent = data.closed;
  });

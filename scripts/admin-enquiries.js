fetch('http://localhost:3000/api/admin/enquiries', {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('adminToken')
  }
})
const API = 'http://localhost:3000';


/* Fetch enquiries */
fetch(`${API}/api/admin/enquiries`, {
  headers: {
    Authorization: 'Bearer ' + token
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
  .then(enquiries => {
    const tbody = document.getElementById('enquiriesTable');

    if (!enquiries || !enquiries.length) {
      tbody.innerHTML =
        '<tr><td colspan="6">No enquiries yet</td></tr>';
      return;
    }

   tbody.innerHTML = enquiries.map(e => `
  <tr>
    <td>${new Date(e.created_at).toLocaleString()}</td>
    <td>${e.product_name}</td>
    <td>${e.name}</td>
    <td>${e.email}</td>
    <td>${e.message}</td>
    <td>
      <select onchange="updateStatus(${e.id}, this.value)">
        <option value="new" ${e.status==='new'?'selected':''}>New</option>
        <option value="contacted" ${e.status==='contacted'?'selected':''}>Contacted</option>
        <option value="closed" ${e.status==='closed'?'selected':''}>Closed</option>
      </select>
    </td>
  </tr>
`).join('');
   });
   function updateStatus(id, status) {
  fetch(`http://localhost:3000/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('adminToken')
    },
    body: JSON.stringify({ status })
  });
}

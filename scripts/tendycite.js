// Simple interactive bits: mobile nav toggle and contact form demo
document.addEventListener('DOMContentLoaded', () => {
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  toggle && toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navList.style.display = expanded ? 'none' : 'flex';
    navList.style.flexDirection = 'column';
    navList.style.gap = '0.75rem';
  });
});

// Demo contact form handler (replace with real endpoint)
function submitContact(e) {
  e.preventDefault();
  const form = e.target;

  // Collect values
  const data = {
    name: form.name.value.trim(),
    company: form.company.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    alert('Please complete required fields.');
    return false;
  }

  // Send to backend API
  fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success || result.message) {
        alert('Thanks, ' + data.name + '! ' + (result.message || 'We have received your message and will be in touch.'));
        form.reset();
      } else if (result.error) {
        alert('Error: ' + result.error);
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('An error occurred. Please try again later.');
    });

  return false;
}

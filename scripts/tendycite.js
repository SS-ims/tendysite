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
function submitContact(e){
  e.preventDefault();
  const form = e.target;
  // Collect values (simple)
  const data = {
    name: form.name.value.trim(),
    company: form.company.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };
  // Basic validation
  if(!data.name || !data.email || !data.message){
    alert('Please complete required fields.');
    return false;
  }
  // Show demo success (swap with real fetch to your server/email service)
  alert('Thanks, ' + data.name + '! We have received your message and will be in touch.');
  form.reset();
  return false;
}

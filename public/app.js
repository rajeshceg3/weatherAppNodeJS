const form = document.querySelector('#weather-form');
form?.addEventListener('submit', () => {
  const button = form.querySelector('button');
  button.disabled = true;
  button.classList.add('is-loading');
  button.querySelector('.button-label').textContent = 'Checking the sky';
  document.querySelector('#loading-status').textContent = 'Loading current conditions...';
  form.setAttribute('aria-busy', 'true');
});
window.addEventListener('pageshow', () => {
  const button = form?.querySelector('button');
  if (!button) return;
  button.disabled = false;
  button.classList.remove('is-loading');
  button.querySelector('.button-label').textContent = 'Look outside';
  document.querySelector('#loading-status').textContent = '';
  form.removeAttribute('aria-busy');
});

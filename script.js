const modal = document.querySelector('.booking-modal');
const openButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const form = document.querySelector('#booking-form');
const toast = document.querySelector('.toast');

openButtons.forEach((button) => button.addEventListener('click', () => modal.showModal()));
closeButtons.forEach((button) => button.addEventListener('click', () => modal.close()));

modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  modal.close();
  form.reset();
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
});

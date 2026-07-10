const modal = document.querySelector('.booking-modal');
const form = document.querySelector('#booking-form');
const toast = document.querySelector('.toast');
const modalPackage = document.querySelector('#modal-package');
const modalDuration = document.querySelector('#modal-duration');
const quickSet = document.querySelector('#quick-set');
const quickDuration = document.querySelector('#quick-duration');
const header = document.querySelector('[data-header]');

const currentPage = document.body.dataset.page;
document.querySelector(`[data-nav="${currentPage}"]`)?.classList.add('is-current');

const menuToggle = document.querySelector('[data-menu-toggle]');
menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('is-menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('is-menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.package) modalPackage.value = button.dataset.package;
    if (button.hasAttribute('data-from-quick')) {
      modalPackage.value = quickSet.value;
      modalDuration.value = quickDuration.value;
    }
    modal.showModal();
  });
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => modal.close());
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  modal.close();
  form.reset();
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 4800);
});

const scenarioContent = {
  friends: 'Турнир, кооператив или просто громкий вечер — четыре контроллера не дадут никому скучать.',
  family: 'Спортивные игры, гонки и приключения для совместного вечера, в котором участвуют все.',
  weekend: 'Два дня без спешки: пройти новую историю, устроить чемпионат и успеть взять реванш.'
};

const scenarioCopy = document.querySelector('[data-scenario-copy]');
document.querySelectorAll('[data-scenario]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-scenario]').forEach((item) => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-selected', String(item === button));
    });
    scenarioCopy.textContent = scenarioContent[button.dataset.scenario];
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const reelVideo = document.querySelector('[data-reel-video]');
const videoToggle = document.querySelector('[data-video-toggle]');

const syncVideoControl = () => {
  if (!reelVideo || !videoToggle) return;
  const paused = reelVideo.paused;
  videoToggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  videoToggle.querySelector('small').textContent = paused ? 'Играть' : 'Пауза';
  videoToggle.setAttribute('aria-label', paused ? 'Воспроизвести видео' : 'Приостановить видео');
};

videoToggle?.addEventListener('click', () => {
  if (reelVideo.paused) reelVideo.play().catch(syncVideoControl);
  else reelVideo.pause();
});

reelVideo?.addEventListener('play', syncVideoControl);
reelVideo?.addEventListener('pause', syncVideoControl);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  reelVideo?.pause();
} else {
  reelVideo?.play().then(syncVideoControl).catch(syncVideoControl);
}
syncVideoControl();

document.querySelectorAll('[data-glow]').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    element.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
});

const scrollProgress = document.querySelector('[data-scroll-progress]');
const parallaxElements = [...document.querySelectorAll('[data-parallax]')];
let scrollFrame = 0;

const updateScrollUI = () => {
  scrollFrame = 0;
  header.classList.toggle('is-scrolled', window.scrollY > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  scrollProgress?.style.setProperty('transform', `scaleX(${progress})`);

  parallaxElements.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom < -100 || bounds.top > window.innerHeight + 100) return;
    const centerOffset = bounds.top + bounds.height / 2 - window.innerHeight / 2;
    const shift = Math.max(-22, Math.min(22, centerOffset * -0.035));
    element.style.setProperty('--media-shift', `${shift}px`);
  });
};

const requestScrollUI = () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollUI);
};

updateScrollUI();
window.addEventListener('scroll', requestScrollUI, { passive: true });
window.addEventListener('resize', requestScrollUI, { passive: true });

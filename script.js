const modal = document.querySelector('.booking-modal');
const form = document.querySelector('#booking-form');
const toast = document.querySelector('.toast');
const modalPackage = document.querySelector('#modal-package');
const modalDuration = document.querySelector('#modal-duration');
const quickSet = document.querySelector('#quick-set');
const quickDuration = document.querySelector('#quick-duration');
const header = document.querySelector('[data-header]');

const currentPage = document.body.dataset.page;
const currentNav = document.querySelector(`[data-nav="${currentPage}"]`);
currentNav?.classList.add('is-current');
currentNav?.setAttribute('aria-current', 'page');

const bookingSummary = document.createElement('div');
bookingSummary.className = 'booking-summary';
bookingSummary.innerHTML = '<div><span>Ваш выбор</span><b data-booking-summary>Базовый · 1 день</b></div><i>01 / 01</i>';
form?.before(bookingSummary);

const commentField = form?.querySelector('textarea')?.closest('label');
const dateField = document.createElement('label');
dateField.className = 'booking-date';
dateField.innerHTML = '<span>Дата начала</span><input name="date" type="date" aria-label="Дата начала аренды" required />';
if (form && commentField) form.insertBefore(dateField, commentField);

const dateInput = form?.querySelector('input[name="date"]');
if (dateInput) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);
}

const syncBookingSummary = () => {
  const summary = document.querySelector('[data-booking-summary]');
  if (summary) summary.textContent = `${modalPackage?.value || 'Базовый'} · ${modalDuration?.value || '1 день'}`;
};

modalPackage?.addEventListener('change', syncBookingSummary);
modalDuration?.addEventListener('change', syncBookingSummary);

const menuToggle = document.querySelector('[data-menu-toggle]');
const mainNav = document.querySelector('.main-nav');
if (mainNav && menuToggle) {
  mainNav.id ||= 'primary-nav';
  menuToggle.setAttribute('aria-controls', mainNav.id);
}
menuToggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('is-menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  if (isOpen) window.setTimeout(() => mainNav?.querySelector('a')?.focus(), 260);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('is-menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const openBooking = (button) => {
  if (!modal) return;
  if (button?.dataset.package && modalPackage) modalPackage.value = button.dataset.package;
  if (button?.hasAttribute('data-from-quick')) {
    if (modalPackage && quickSet) modalPackage.value = quickSet.value;
    if (modalDuration && quickDuration) modalDuration.value = quickDuration.value;
  }
  syncBookingSummary();
  document.body.classList.add('is-booking-open');
  modal.showModal();
};

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => openBooking(button));
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => modal.close());
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

modal.addEventListener('close', () => document.body.classList.remove('is-booking-open'));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  modal.close();
  syncBookingSummary();
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
      item.setAttribute('aria-pressed', String(item === button));
    });
    scenarioCopy.textContent = scenarioContent[button.dataset.scenario];
  });
});

document.documentElement.classList.add('js');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const reelVideo = document.querySelector('[data-reel-video]');
const videoToggle = document.querySelector('[data-video-toggle]');
const videoTime = document.querySelector('[data-video-time]');
const videoProgress = document.querySelector('[data-video-progress]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let reelUserPaused = false;

const formatTime = (seconds) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
};

const syncVideoProgress = () => {
  if (!reelVideo) return;
  const duration = Number.isFinite(reelVideo.duration) ? reelVideo.duration : 10;
  const progress = duration > 0 ? reelVideo.currentTime / duration : 0;
  videoProgress?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`);
  if (videoTime) videoTime.textContent = `${formatTime(reelVideo.currentTime)} / ${formatTime(duration)}`;
};

const syncVideoControl = () => {
  if (!reelVideo || !videoToggle) return;
  const paused = reelVideo.paused;
  videoToggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  videoToggle.querySelector('small').textContent = paused ? 'Играть' : 'Пауза';
  videoToggle.setAttribute('aria-label', paused ? 'Воспроизвести видео' : 'Приостановить видео');
};

videoToggle?.addEventListener('click', () => {
  if (reelVideo.paused) {
    reelUserPaused = false;
    reelVideo.play().catch(syncVideoControl);
  } else {
    reelUserPaused = true;
    reelVideo.pause();
  }
});

reelVideo?.addEventListener('play', syncVideoControl);
reelVideo?.addEventListener('pause', syncVideoControl);
reelVideo?.addEventListener('timeupdate', syncVideoProgress);
reelVideo?.addEventListener('loadedmetadata', syncVideoProgress);

if (reducedMotion) {
  reelVideo?.pause();
} else if (reelVideo) {
  const reelObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !reelUserPaused) {
      reelVideo.play().catch(syncVideoControl);
    } else if (!entry.isIntersecting) {
      reelVideo.pause();
    }
  }, { threshold: 0.24 });
  reelObserver.observe(reelVideo);
}
syncVideoControl();
syncVideoProgress();

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-glow]').forEach((element) => {
    let glowFrame = 0;
    element.addEventListener('pointermove', (event) => {
      if (glowFrame) window.cancelAnimationFrame(glowFrame);
      glowFrame = window.requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        element.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        element.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
        glowFrame = 0;
      });
    });
  });
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.setProperty('--tilt-rotate-x', `${y * -3.5}deg`);
      element.style.setProperty('--tilt-rotate-y', `${x * 4.5}deg`);
      element.style.setProperty('--tilt-move-x', `${x * 11}px`);
      element.style.setProperty('--tilt-move-y', `${y * 9}px`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--tilt-rotate-x', '0deg');
      element.style.setProperty('--tilt-rotate-y', '0deg');
      element.style.setProperty('--tilt-move-x', '0px');
      element.style.setProperty('--tilt-move-y', '0px');
    });
  });
}

const mobileDock = document.createElement('div');
mobileDock.className = 'mobile-booking-dock';
mobileDock.innerHTML = `<span><small>K&P · Омск</small><b>${currentPage === 'contacts' ? 'Оставить заявку' : 'Выбрать комплект'}</b></span><button type="button" aria-label="Открыть форму бронирования">START <i>↗</i></button>`;
document.body.append(mobileDock);
mobileDock.querySelector('button')?.addEventListener('click', () => openBooking());

if (currentPage === 'home') {
  const sectionRail = document.createElement('nav');
  sectionRail.className = 'section-rail';
  sectionRail.setAttribute('aria-label', 'Быстрая навигация по странице');
  sectionRail.innerHTML = '<a href="#top" data-rail="top"><i></i><span>Start</span></a><a href="#sets" data-rail="sets"><i></i><span>Комплекты</span></a><a href="#benefits" data-rail="benefits"><i></i><span>Сервис</span></a><a href="#faq" data-rail="faq"><i></i><span>FAQ</span></a>';
  document.body.append(sectionRail);

  if ('IntersectionObserver' in window) {
    const railLinks = [...sectionRail.querySelectorAll('[data-rail]')];
    const railObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      railLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.rail === visible.target.id));
    }, { rootMargin: '-25% 0px -58%', threshold: [0, 0.2, 0.6] });
    ['top', 'sets', 'benefits', 'faq'].forEach((id) => {
      const section = document.getElementById(id);
      if (section) railObserver.observe(section);
    });
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header?.classList.contains('is-menu-open')) {
    header.classList.remove('is-menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Открыть меню');
    menuToggle?.focus();
  }
});

const scrollProgress = document.querySelector('[data-scroll-progress]');
const parallaxElements = reducedMotion ? [] : [...document.querySelectorAll('[data-parallax]')];
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

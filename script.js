// ==================== HERO H1 WAVE ANIMATION ====================
const heroTitle = document.querySelector('#hero h1');
const titleText = heroTitle.innerText;

heroTitle.innerHTML = titleText
  .split('')
  .map((char, i) =>
    char === ' '
      ? ' '
      : `<span style="animation-delay: ${0.05 + i * 0.05}s">${char}</span>`
  )
  .join('');

// ==================== HAMBURGER MENU ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});




// ==================== DEVICE DETECTION ====================
const isDesktop = () => window.innerWidth >= 769;

// ==================== SCROLL SYSTEM (DESKTOP ONLY) ====================
const sections = Array.from(document.querySelectorAll('section'));
const arrowPrev = document.getElementById('arrow-prev');
const arrowNext = document.getElementById('arrow-next');
let currentIndex = 0;
let isTransitioning = false;
const TRANSITION_DURATION = 600;

function updateArrows() {
  arrowPrev.classList.remove('hidden');
  arrowPrev.classList.add('bounce');
  arrowNext.classList.remove('hidden');
  arrowNext.classList.add('bounce');
}

function resetAnimations(section) {
  section.classList.remove('in-view');
  void section.offsetWidth;
  section.classList.add('in-view');
  setTimeout(() => {
    section.querySelectorAll('.proj-featured, .proj-card').forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
    });
  }, 2200);
}

function goToSection(targetIndex) {
  if (isTransitioning) return;
  if (targetIndex < 0) targetIndex = sections.length - 1;
  if (targetIndex >= sections.length) targetIndex = 0;

  isTransitioning = true;

  const current = sections[currentIndex];
  const target  = sections[targetIndex];

  current.classList.add('section-exit');

  setTimeout(() => {
    current.classList.remove('section-active', 'section-exit');
    currentIndex = targetIndex;
    target.classList.add('section-active');
    resetAnimations(target);
    updateArrows();

      // ---- Update active nav link ----
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === `#${target.id}`) {
        link.classList.add('nav-active');
      }
    });

    isTransitioning = false;
  }, TRANSITION_DURATION);
}

// ---- Arrow buttons ----
arrowPrev.addEventListener('click', () => goToSection(currentIndex - 1));
arrowNext.addEventListener('click', () => goToSection(currentIndex + 1));

// ---- Arrow key navigation ----
document.addEventListener('keydown', (e) => {
  if (!isDesktop()) return;
  if (e.key === 'ArrowRight') goToSection(currentIndex + 1);
  if (e.key === 'ArrowLeft')  goToSection(currentIndex - 1);
});

// ---- Nav link navigation ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);

    if (!isDesktop()) {
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const targetIndex = sections.findIndex(s => s.id === targetId);
    if (targetIndex !== -1) goToSection(targetIndex);
  });
});

// ==================== INIT ====================
function initDesktop() {
  document.body.style.overflow = 'hidden';
  sections.forEach(s => s.classList.remove('section-active', 'in-view'));
  sections[currentIndex].classList.add('section-active');
  resetAnimations(sections[currentIndex]);
  updateArrows();
}

function initMobile() {
  document.body.style.overflow = '';
  sections.forEach(section => {
    section.classList.add('section-active', 'in-view');
  });
}

// Run correct init based on device
if (isDesktop()) {
  initDesktop();
} else {
  initMobile();
}

// ---- Handle orientation/resize ----
let lastMode = isDesktop() ? 'desktop' : 'mobile';

window.addEventListener('resize', () => {
  const currentMode = isDesktop() ? 'desktop' : 'mobile';
  if (currentMode === lastMode) return;
  lastMode = currentMode;
  if (currentMode === 'desktop') {
    initDesktop();
  } else {
    initMobile();
  }
});

// ==================== MODALS ====================
const modalOverlay = document.getElementById('modal-overlay');
const modals       = document.querySelectorAll('.modal');
const statBoxes    = document.querySelectorAll('.stat-box.clickable');

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modalOverlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  modalOverlay.classList.remove('active');
  modals.forEach(m => m.classList.remove('active'));
  // Restore correct scroll state
  if (!isDesktop()) {
    document.body.style.overflow = '';
  }
}

statBoxes.forEach(box => {
  box.addEventListener('click', () => openModal(box.dataset.modal));
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeAllModals());
});

modalOverlay.addEventListener('click', () => closeAllModals());

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// ==================== MOBILE HEADER HIDE ON SCROLL ====================
if (!isDesktop()) {
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (isDesktop()) return;

    const currentScrollY = window.scrollY;
    const pageBottom = document.body.scrollHeight - window.innerHeight;
    const atTop = currentScrollY < 80;
    const atBottom = currentScrollY >= pageBottom - 100;

    if (atTop || atBottom) {
      header.classList.remove('header-hidden');
    } else {
      header.classList.add('header-hidden');
    }
  }, { passive: true });
}
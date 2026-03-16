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

// ==================== SCROLL SYSTEM ====================
const sections = Array.from(document.querySelectorAll('section'));
const arrowPrev = document.getElementById('arrow-prev');
const arrowNext = document.getElementById('arrow-next');
let currentIndex = 0;
let isTransitioning = false;
const TRANSITION_DURATION = 600;

const isDesktop = () => window.innerWidth >= 769;

// ---- Update arrow visibility & bounce ----
function updateArrows() {
  if (!isDesktop()) return;
  arrowPrev.classList.remove('hidden');
  arrowPrev.classList.add('bounce');
  arrowNext.classList.remove('hidden');
  arrowNext.classList.add('bounce');
}

// ---- Animation reset ----
function resetAnimations(section) {
  section.classList.remove('in-view');
  void section.offsetWidth;
  section.classList.add('in-view');

  // After animations complete, remove them so hover states work freely
  setTimeout(() => {
    section.querySelectorAll('.proj-featured, .proj-card').forEach(el => {
      el.style.animation = 'none';
      el.style.opacity = '1';
    });
  }, 2000);
}

// ---- Core navigation ----
function goToSection(targetIndex) {
  if (isTransitioning) return;
  if (targetIndex < 0) targetIndex = sections.length - 1;
  if (targetIndex >= sections.length) targetIndex = 0;
  // if (targetIndex === currentIndex) return;

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

    isTransitioning = false;
  }, TRANSITION_DURATION);
}

// ---- Arrow buttons ----
arrowPrev.addEventListener('click', () => goToSection(currentIndex - 1));
arrowNext.addEventListener('click', () => goToSection(currentIndex + 1));

// ---- Arrow key navigation (desktop only) ----
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
      // Mobile — smooth scroll to section
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Desktop — section transition
    const targetIndex = sections.findIndex(s => s.id === targetId);
    if (targetIndex !== -1) goToSection(targetIndex);
  });
});

// ---- Mobile: vertical swipe ----
document.addEventListener('touchstart', (e) => {
  if (!isDesktop()) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!isDesktop()) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
    if (dy < 0) goToSection(currentIndex + 1);
    if (dy > 0) goToSection(currentIndex - 1);
  }
}, { passive: true });

// ---- Mobile: scroll within a section to trigger next ----
sections.forEach((section, i) => {
  section.addEventListener('scroll', () => {
    if (isDesktop()) return;
    if (isTransitioning) return;

    const scrolled  = section.scrollTop;
    const maxScroll = section.scrollHeight - section.clientHeight;

    if (maxScroll < 5) return;

    if (scrolled >= maxScroll - 5) goToSection(i + 1);
    else if (scrolled <= 5 && i > 0) goToSection(i - 1);
  });
});

// ---- Init ----
sections[0].classList.add('section-active');
resetAnimations(sections[0]);
updateArrows();


// ==================== MODALS ====================
const modalOverlay = document.getElementById('modal-overlay');
const modals = document.querySelectorAll('.modal');
const statBoxes = document.querySelectorAll('.stat-box.clickable');

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
  document.body.style.overflow = '';
}

statBoxes.forEach(box => {
  box.addEventListener('click', () => {
    openModal(box.dataset.modal);
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeAllModals());
});

modalOverlay.addEventListener('click', () => closeAllModals());

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});
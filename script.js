// ============================
// YOGA WITH BINDU — script.js v3
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar state ----
  const navbar = document.querySelector('.navbar');
  const hero   = document.querySelector('.hero');

  function updateNavbar() {
    if (!navbar) return;
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    if (hero) {
      navbar.classList.toggle('hero-dark', !scrolled);
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ---- Hamburger ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  // ---- Parallax hero ----
  const heroParallax = document.getElementById('heroParallax');
  if (heroParallax) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroH   = hero ? hero.offsetHeight : window.innerHeight;
      if (scrollY < heroH) {
        heroParallax.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    }, { passive: true });
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-panel');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => {
      // If already in viewport on load, show immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // ---- Scroll indicator click ----
  const heroScroll = document.getElementById('heroScroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const nextSection = hero ? hero.nextElementSibling : null;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---- Art Gallery — fixed scroll interference ----
  const track   = document.querySelector('.gallery-track');
  if (track) {
    const slides     = document.querySelectorAll('.gallery-slide');
    const prevBtn    = document.querySelector('.gallery-arrow.prev');
    const nextBtn    = document.querySelector('.gallery-arrow.next');
    const counter    = document.querySelector('.gallery-counter');
    let current      = 0;
    let isDragging   = false;
    let startX       = 0;
    let startY       = 0;
    let autoInterval;
    const total      = slides.length;

    function updateCounter() {
      if (counter) counter.textContent = `${String(current + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
    }

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateCounter();
    }

    function startAuto() { autoInterval = setInterval(() => goTo(current + 1), 5000); }
    function stopAuto()  { clearInterval(autoInterval); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      const galleryVisible = track.getBoundingClientRect().top < window.innerHeight &&
                             track.getBoundingClientRect().bottom > 0;
      if (!galleryVisible) return;
      if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
      if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
    });

    // Touch — only trigger on HORIZONTAL swipes, let vertical scroll pass through
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = false;
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!startX) return;
      const diffX = Math.abs(e.touches[0].clientX - startX);
      const diffY = Math.abs(e.touches[0].clientY - startY);
      // Only prevent default if clearly horizontal
      if (diffX > diffY && diffX > 10) {
        isDragging = true;
        e.preventDefault();
      }
    }, { passive: false });

    track.addEventListener('touchend', e => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stopAuto();
        goTo(current + (diff > 0 ? 1 : -1));
        startAuto();
      }
      isDragging = false;
      startX = 0;
      startY = 0;
    }, { passive: true });

    goTo(0);
    startAuto();
  }

});
// ============================
// YOGA WITH BINDU — script.js v2
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll shadow ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ---- Hamburger menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ---- Scroll fade-in for cards ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.offering-card, .testimonial-card, .soft-card, .event-card, .offering-row-card, .credential-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  // ---- Art Gallery Slider ----
  const track  = document.querySelector('.gallery-track');
  if (track) {
    const slides     = document.querySelectorAll('.gallery-slide');
    const dotsWrap   = document.getElementById('galleryDots');
    const thumbsWrap = document.getElementById('galleryThumbs');
    const thumbs     = thumbsWrap ? thumbsWrap.querySelectorAll('.gallery-thumb') : [];
    const prevBtn    = document.querySelector('.gallery-btn.prev');
    const nextBtn    = document.querySelector('.gallery-btn.next');
    let current      = 0;
    let autoInterval;

    // Build dots dynamically
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i+1}`);
        dotsWrap.appendChild(dot);
      });
    }

    const dots = dotsWrap ? dotsWrap.querySelectorAll('.gallery-dot') : [];

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i)   => d.classList.toggle('active', i === current));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
      // scroll thumb into view
      if (thumbs[current]) {
        thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    function startAuto() { autoInterval = setInterval(() => goTo(current + 1), 4500); }
    function stopAuto()  { clearInterval(autoInterval); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
    thumbs.forEach((t, i) => t.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
    });

    // Keyboard nav
    document.addEventListener('keydown', e => {
      if (!document.querySelector('.gallery-container')) return;
      if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
      if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
    });

    goTo(0);
    startAuto();
  }

});

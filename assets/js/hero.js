/* ============================================
   HERO.JS — Slideshow with Crossfade
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlideshow();
});

function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const interval = 6000; // 6 seconds per slide

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');

    // Reset zoom animation
    const img = slides[currentSlide].querySelector('img');
    if (img) {
      img.style.animation = 'none';
      img.offsetHeight; // trigger reflow
      img.style.animation = '';
    }
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  // Auto-advance
  let timer = setInterval(nextSlide, interval);

  // Click indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(timer);
      goToSlide(index);
      timer = setInterval(nextSlide, interval);
    });
  });

  // Initialize first slide
  slides[0].classList.add('active');
  if (indicators[0]) indicators[0].classList.add('active');
}

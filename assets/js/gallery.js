/* ============================================
   GALLERY.JS — Masonry Filter, Pagination + Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

function initGallery() {
  const items = Array.from(document.querySelectorAll('.masonry-item'));
  const filterButtons = document.querySelectorAll('.filter-btn');
  const paginationContainer = document.getElementById('pagination');
  
  if (items.length === 0) return;

  const ITEMS_PER_PAGE = 12;
  let currentPage = 1;
  let currentFilter = 'all';

  // 1. Get filtered items
  function getFilteredItems() {
    if (currentFilter === 'all') {
      return items;
    }
    return items.filter(item => item.dataset.category === currentFilter);
  }

  // 2. Render items on the current page
  function renderPage() {
    const filteredItems = getFilteredItems();
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    // Keep currentPage in valid range
    if (currentPage > totalPages) {
      currentPage = Math.max(1, totalPages);
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Show/Hide items
    items.forEach(item => {
      // Check if it belongs to current filter
      const isFiltered = currentFilter === 'all' || item.dataset.category === currentFilter;
      if (!isFiltered) {
        item.style.display = 'none';
        return;
      }

      // Check if it belongs to current page
      const filteredIndex = filteredItems.indexOf(item);
      if (filteredIndex >= startIndex && filteredIndex < endIndex) {
        item.style.display = '';
        item.style.animation = 'fadeInScale 0.5s var(--ease-out) forwards';
      } else {
        item.style.display = 'none';
      }
    });

    // Render pagination controls
    renderPaginationControls(filteredItems.length, totalPages);
  }

  // 3. Render pagination buttons
  function renderPaginationControls(totalItemsCount, totalPages) {
    if (!paginationContainer) return;

    if (totalItemsCount <= ITEMS_PER_PAGE) {
      paginationContainer.innerHTML = '';
      return;
    }

    let html = '';

    // Prev Button
    html += `<button class="pagination-btn" id="prevPage" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>`;

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-btn ${currentPage === i ? 'active' : ''}" data-page="${i}" aria-label="Page ${i}">${i}</button>`;
    }

    // Next Button
    html += `<button class="pagination-btn" id="nextPage" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>`;

    paginationContainer.innerHTML = html;

    // Add event listeners to page numbers
    paginationContainer.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page, 10);
        renderPage();
        document.querySelector('.gallery-filters').scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Add event listeners to prev/next buttons
    const prevBtn = paginationContainer.querySelector('#prevPage');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage();
          document.querySelector('.gallery-filters').scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const nextBtn = paginationContainer.querySelector('#nextPage');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage();
          document.querySelector('.gallery-filters').scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // 4. Initialize Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.dataset.filter;
      currentPage = 1;
      renderPage();
    });
  });

  // 5. Initial Render
  renderPage();

  // 6. Lightbox Integration
  initLightbox(items);
}

/* === LIGHTBOX === */
function initLightbox(items) {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCounter = document.querySelector('.lightbox-counter');

  if (!lightbox || items.length === 0) return;

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    visibleItems = items.filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    getVisibleItems();
    if (visibleItems.length === 0) return;
    
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    
    const img = visibleItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCounter();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    getVisibleItems();
    if (visibleItems.length === 0) return;
    
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentIndex].querySelector('img');
    
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 200);
    
    updateCounter();
  }

  function updateCounter() {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    }
  }

  // Event bindings
  items.forEach((item) => {
    item.addEventListener('click', () => {
      getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Click outside
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}


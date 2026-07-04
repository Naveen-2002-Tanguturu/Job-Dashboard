/* ============================================
   HIREX — Homepage Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  renderFeaturedJobs();
  renderCategoryGrid();
  initHeroSearch();
  initStatsCounter();
});

// ---- Featured Jobs ----
function renderFeaturedJobs() {
  const container = document.getElementById('featured-jobs');
  if (!container) return;

  // Simulate a brief loading state
  UI.renderSkeletons(container, 6);

  setTimeout(() => {
    const featured = getFeaturedJobs();
    if (!featured.length) {
      container.innerHTML = Render.emptyState('No featured jobs', 'Check back soon for featured listings.');
      return;
    }
    container.innerHTML = featured.map(j => Render.jobCard(j)).join('');
  }, 400);
}

// ---- Category Grid ----
function renderCategoryGrid() {
  const container = document.getElementById('category-grid');
  if (!container) return;

  const catData = {
    Engineering:  { icon: '💻', color: '#6366f1' },
    Design:       { icon: '🎨', color: '#ec4899' },
    Marketing:    { icon: '📢', color: '#f59e0b' },
    Product:      { icon: '📦', color: '#06b6d4' },
    Finance:      { icon: '💰', color: '#10b981' },
    Data:         { icon: '📊', color: '#8b5cf6' },
    HR:           { icon: '🤝', color: '#f97316' },
    Operations:   { icon: '⚙️', color: '#64748b' },
    Sales:        { icon: '🚀', color: '#14b8a6' },
  };

  const cats = CATEGORIES.map(cat => {
    const count = JOBS_DATA.filter(j => j.category === cat).length;
    const meta  = catData[cat] || { icon: '📋', color: '#6366f1' };
    return `
    <a href="jobs.html?category=${encodeURIComponent(cat)}" class="category-card anim-fade-up">
      <div class="category-card__icon" style="background:${meta.color}20;color:${meta.color};font-size:1.4rem">${meta.icon}</div>
      <div>
        <div class="category-card__name">${cat}</div>
        <div class="category-card__count">${count} ${count === 1 ? 'job' : 'jobs'}</div>
      </div>
    </a>`;
  });
  container.innerHTML = cats.join('');
}

// ---- Hero Search ----
function initHeroSearch() {
  const form     = document.getElementById('hero-search-form');
  const input    = document.getElementById('hero-search-input');
  const location = document.getElementById('hero-location-input');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q   = input ? input.value.trim() : '';
    const loc = location ? location.value.trim() : '';
    const params = new URLSearchParams();
    if (q)   params.set('q', q);
    if (loc) params.set('q', `${q} ${loc}`.trim());
    window.location.href = `jobs.html${params.toString() ? '?' + params.toString() : ''}`;
  });

  // Popular tag clicks
  document.querySelectorAll('.hero__popular-tag').forEach(tag => {
    tag.addEventListener('click', e => {
      e.preventDefault();
      const cat = tag.dataset.category;
      if (cat) window.location.href = `jobs.html?category=${encodeURIComponent(cat)}`;
      else if (input) { input.value = tag.textContent.trim(); form.dispatchEvent(new Event('submit')); }
    });
  });
}

// ---- Animated Stats Counter ----
function initStatsCounter() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count);
      const dur = 1800;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * end).toLocaleString() + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  stats.forEach(el => observer.observe(el));
}

/* ============================================
   HIREX — UI Utilities
   Toast, dark mode toggle, skeleton loaders
   ============================================ */

const UI = {
  // ---- Theme ----
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.innerHTML = theme === 'dark'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  },

  initTheme() {
    const saved = Storage.getTheme();
    this.applyTheme(saved);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      Storage.setTheme(next);
      this.applyTheme(next);
    });
  },

  // ---- Header scroll ----
  initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  // ---- Mobile nav ----
  initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const open = nav.classList.contains('open');
      btn.setAttribute('aria-expanded', open);
    });
  },

  // ---- Active nav link ----
  setActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href.includes(page));
    });
  },

  // ---- Toast ----
  showToast(title, message = '', type = 'success', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      info:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;

    container.appendChild(toast);

    const remove = () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 280);
    };
    setTimeout(remove, duration);
  },

  // ---- Skeleton cards ----
  renderSkeletons(container, count = 6) {
    container.innerHTML = Array.from({ length: count }, () => `
      <div class="skeleton-card">
        <div class="flex gap-3" style="margin-bottom:16px">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex:1">
            <div class="skeleton skeleton-text w-40" style="margin-bottom:8px;height:12px"></div>
            <div class="skeleton skeleton-text w-80" style="height:16px"></div>
          </div>
          <div class="skeleton" style="width:34px;height:34px;border-radius:8px"></div>
        </div>
        <div class="skeleton skeleton-text w-80" style="height:13px;margin-bottom:6px"></div>
        <div class="skeleton skeleton-text w-60" style="height:13px;margin-bottom:16px"></div>
        <div class="flex gap-2" style="margin-bottom:16px">
          <div class="skeleton skeleton-badge"></div>
          <div class="skeleton skeleton-badge" style="width:55px"></div>
          <div class="skeleton skeleton-badge" style="width:80px"></div>
        </div>
        <div class="flex" style="justify-content:space-between;align-items:center">
          <div class="skeleton skeleton-text" style="width:90px;height:12px"></div>
          <div class="skeleton skeleton-text" style="width:70px;height:12px"></div>
        </div>
      </div>`).join('');
  },

  // ---- Collapsible filter sections ----
  initCollapsibles() {
    document.querySelectorAll('.filter-section__header').forEach(hdr => {
      const section = hdr.closest('.filter-section');
      const body    = section.querySelector('.filter-section__body');
      if (!section || !body) return;
      section.classList.add('open');
      body.classList.add('open');
      hdr.addEventListener('click', () => {
        section.classList.toggle('open');
        body.classList.toggle('open');
      });
    });
  },

  // ---- Smooth scroll to top ----
  scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },

  // ---- Format salary ----
  formatSalary(min, max) {
    const fmt = n => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`;
    if (!min && !max) return 'Salary not listed';
    if (!max) return `${fmt(min)}+`;
    return `${fmt(min)} – ${fmt(max)}`;
  },

  // ---- Relative date ----
  relativeDate(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7)  return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  },

  // ---- Capitalize ----
  capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; },

  // ---- Init all common UI ----
  init() {
    this.initTheme();
    this.initScrollHeader();
    this.initMobileNav();
    this.setActiveNav();
  }
};

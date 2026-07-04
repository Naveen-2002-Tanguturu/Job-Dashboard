/* ============================================
   HIREX — Render Helpers
   Job cards, company avatars, badges
   ============================================ */

const Render = {

  // ---- SVG Icons ----
  icon: {
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    salary:   `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    bookmark: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    bookmarkFill: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    clock:    `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    arrow:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    check:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    external: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    x:        `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    users:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },

  // ---- Company Avatar ----
  companyAvatar(company, size = '') {
    const s = size ? ` ${size}` : '';
    return `<div class="company-avatar${s}" style="background:${company.color}">${company.initials}</div>`;
  },

  // ---- Type Badge ----
  typeBadge(type) {
    const map = { 'full-time':'Full-time','part-time':'Part-time','contract':'Contract','internship':'Internship','freelance':'Freelance' };
    return `<span class="badge badge-${type.replace('-','')}">${map[type] || type}</span>`;
  },

  // ---- Remote Badge ----
  remoteBadge(remote) {
    const map = { remote:'Remote', hybrid:'Hybrid', onsite:'On-site' };
    return `<span class="badge badge-${remote}">${map[remote] || remote}</span>`;
  },

  // ---- Category Badge ----
  categoryBadge(cat) {
    return `<span class="badge badge-${cat.toLowerCase()}">${cat}</span>`;
  },

  // ---- Level Badge ----
  levelBadge(level) {
    const map = { entry:'Entry', mid:'Mid-level', senior:'Senior', lead:'Lead', executive:'Executive' };
    return `<span class="badge badge-${level}">${map[level] || level}</span>`;
  },

  // ---- Job Card ----
  jobCard(job) {
    const saved = Storage.isJobSaved(job.id);
    const applied = Storage.isJobApplied(job.id);
    const skillTags = job.skills.slice(0, 4).map(s => `<span class="tag">${s}</span>`).join('');
    const appliedBadge = applied ? `<span class="badge badge-applied">${this.icon.check} Applied</span>` : '';

    return `
    <a class="job-card${job.featured ? ' featured' : ''} anim-fade-up" href="job-detail.html?id=${job.id}" id="card-${job.id}">
      <div class="job-card__header">
        ${this.companyAvatar(job.company)}
        <div class="job-card__company-info">
          <div class="job-card__company-name">${job.company.name}</div>
          <div class="job-card__title">${job.title}</div>
        </div>
        <button class="job-card__save-btn${saved ? ' saved' : ''}"
          id="save-${job.id}"
          onclick="event.preventDefault(); Render.toggleSave('${job.id}', this)"
          aria-label="${saved ? 'Unsave' : 'Save'} job"
          title="${saved ? 'Remove from saved' : 'Save job'}">
          ${saved ? this.icon.bookmarkFill : this.icon.bookmark}
        </button>
      </div>

      <div class="job-card__meta">
        <span class="job-card__meta-item">${this.icon.location} ${job.location}</span>
        <span class="job-card__meta-item">${this.icon.salary} ${UI.formatSalary(job.salary.min, job.salary.max)}</span>
      </div>

      <p class="job-card__excerpt">${job.excerpt}</p>

      <div class="job-card__tags">
        ${this.typeBadge(job.type)}
        ${this.remoteBadge(job.remote)}
        ${this.levelBadge(job.level)}
        ${skillTags}
      </div>

      <div class="job-card__footer">
        <span class="job-card__posted">${this.icon.clock} ${UI.relativeDate(job.posted)}</span>
        <div class="flex items-center gap-2">
          ${appliedBadge}
          ${job.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
        </div>
      </div>
    </a>`;
  },

  // ---- Mini Job Card (sidebar similar jobs) ----
  miniJobCard(job) {
    return `
    <a href="job-detail.html?id=${job.id}" class="flex gap-3 items-center" style="padding:12px;background:var(--bg-elevated);border-radius:var(--r-md);border:1px solid var(--border);transition:all var(--t);text-decoration:none;color:inherit;display:flex" onmouseover="this.style.borderColor='var(--border-accent)'" onmouseout="this.style.borderColor='var(--border)'">
      ${this.companyAvatar(job.company)}
      <div style="flex:1;min-width:0">
        <div style="font-size:.85rem;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${job.title}</div>
        <div style="font-size:.75rem;color:var(--text-secondary)">${job.company.name} · ${UI.formatSalary(job.salary.min, job.salary.max)}</div>
      </div>
      <span style="color:var(--text-muted)">${this.icon.arrow}</span>
    </a>`;
  },

  // ---- Toggle Save (called from card button) ----
  toggleSave(jobId, btn) {
    const isSaved = Storage.toggleSaveJob(jobId);
    btn.classList.toggle('saved', isSaved);
    btn.innerHTML = isSaved ? this.icon.bookmarkFill : this.icon.bookmark;
    btn.title = isSaved ? 'Remove from saved' : 'Save job';
    UI.showToast(isSaved ? 'Job saved!' : 'Job removed', isSaved ? 'Added to your saved jobs.' : 'Removed from saved jobs.', isSaved ? 'success' : 'info');
  },

  // ---- Pagination ----
  pagination(currentPage, totalPages, onPage) {
    if (totalPages <= 1) return '';
    const pages = [];

    // Prev
    pages.push(`<button class="pagination__btn" onclick="(${onPage})(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>`);

    // Page numbers
    let start = Math.max(1, currentPage - 2);
    let end   = Math.min(totalPages, currentPage + 2);
    if (start > 1) { pages.push(`<button class="pagination__btn" onclick="(${onPage})(1)">1</button>`); if (start > 2) pages.push(`<span class="pagination__btn" style="pointer-events:none;opacity:.4">…</span>`); }
    for (let i = start; i <= end; i++) {
      pages.push(`<button class="pagination__btn${i === currentPage ? ' active' : ''}" onclick="(${onPage})(${i})">${i}</button>`);
    }
    if (end < totalPages) { if (end < totalPages - 1) pages.push(`<span class="pagination__btn" style="pointer-events:none;opacity:.4">…</span>`); pages.push(`<button class="pagination__btn" onclick="(${onPage})(${totalPages})">${totalPages}</button>`); }

    // Next
    pages.push(`<button class="pagination__btn" onclick="(${onPage})(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`);

    return `<div class="pagination">${pages.join('')}</div>`;
  },

  // ---- Filter Chip ----
  filterChip(label, onRemove) {
    return `<div class="filter-chip chip-enter">
      <span>${label}</span>
      <span class="filter-chip__remove" onclick="${onRemove}" title="Remove filter">${this.icon.x}</span>
    </div>`;
  },

  // ---- Empty State ----
  emptyState(title, desc, ctaHtml = '') {
    return `<div class="empty-state">
      <div class="empty-state__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <h3 class="empty-state__title">${title}</h3>
      <p class="empty-state__desc">${desc}</p>
      ${ctaHtml}
    </div>`;
  }
};

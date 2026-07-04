/* ============================================
   HIREX — Jobs Listing Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  Filters.fromURL();
  syncFormToState();
  renderJobs();
  initFilterListeners();
  initSortListener();
  initSearchBar();
  UI.initCollapsibles();
  initSalarySlider();
  initClearFilters();
  initMobileFilterToggle();
});

// ---- Main Render ----
function renderJobs() {
  const container = document.getElementById('jobs-grid');
  const countEl   = document.getElementById('jobs-count');
  const pagination = document.getElementById('jobs-pagination');
  const activeFiltersEl = document.getElementById('active-filters');
  if (!container) return;

  const filtered = Filters.apply(JOBS_DATA);
  const { jobs, total, totalPages, page } = Filters.paginate(filtered);

  // Count
  if (countEl) countEl.innerHTML = `Showing <strong>${Math.min((page - 1) * Filters.state.perPage + jobs.length, total)}</strong> of <strong>${total}</strong> jobs`;

  // Active filter chips
  if (activeFiltersEl) {
    const chips = Filters.getActiveFilters();
    activeFiltersEl.innerHTML = chips.map(c => {
      const onRemove = c.key === 'salary'
        ? `Filters.set('salaryMin',0);Filters.set('salaryMax',500000);renderJobs();`
        : `Filters.set('${c.key}','');renderJobs();syncFormToState();`;
      return Render.filterChip(c.label, onRemove);
    }).join('');
    if (chips.length) {
      activeFiltersEl.innerHTML += `<button class="btn btn-ghost btn-sm" onclick="Filters.clear();renderJobs();syncFormToState();" style="font-size:.78rem">Clear all</button>`;
    }
  }

  // Jobs grid
  if (!jobs.length) {
    container.innerHTML = Render.emptyState(
      'No jobs found',
      'Try adjusting your search filters or browse all jobs.',
      `<button class="btn btn-secondary btn-sm" onclick="Filters.clear();renderJobs();syncFormToState()">Clear filters</button>`
    );
    if (pagination) pagination.innerHTML = '';
    return;
  }

  container.innerHTML = jobs.map(j => Render.jobCard(j)).join('');

  // Pagination
  if (pagination) {
    pagination.innerHTML = Render.pagination(page, totalPages, `function(p){Filters.set('page',p);Filters.toURL();renderJobs();UI.scrollToTop();}`);
  }

  Filters.toURL();
}

// ---- Sync form inputs to filter state ----
function syncFormToState() {
  const s = Filters.state;
  setValue('search-input', s.search);
  setValue('filter-category', s.category);
  setValue('filter-type', s.type);
  setValue('filter-remote', s.remote);
  setValue('filter-level', s.level);
  setValue('sort-select', s.sort);
  // Checkboxes
  document.querySelectorAll('[data-filter-type]').forEach(cb => { cb.checked = cb.value === s.type; });
  document.querySelectorAll('[data-filter-remote]').forEach(cb => { cb.checked = cb.value === s.remote; });
  document.querySelectorAll('[data-filter-level]').forEach(cb => { cb.checked = cb.value === s.level; });
  document.querySelectorAll('[data-filter-category]').forEach(cb => { cb.checked = cb.value === s.category; });
}
function setValue(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

// ---- Search bar (debounced) ----
function initSearchBar() {
  const input = document.getElementById('search-input');
  if (!input) return;
  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Filters.set('search', input.value); renderJobs(); }, 300);
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(t); Filters.set('search', input.value); renderJobs(); } });
}

// ---- Checkbox filter listeners ----
function initFilterListeners() {
  // Category checkboxes
  document.querySelectorAll('[data-filter-category]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        document.querySelectorAll('[data-filter-category]').forEach(c => { if (c !== cb) c.checked = false; });
        Filters.set('category', cb.value);
      } else { Filters.set('category', ''); }
      renderJobs();
    });
  });

  // Type checkboxes
  document.querySelectorAll('[data-filter-type]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        document.querySelectorAll('[data-filter-type]').forEach(c => { if (c !== cb) c.checked = false; });
        Filters.set('type', cb.value);
      } else { Filters.set('type', ''); }
      renderJobs();
    });
  });

  // Remote checkboxes
  document.querySelectorAll('[data-filter-remote]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        document.querySelectorAll('[data-filter-remote]').forEach(c => { if (c !== cb) c.checked = false; });
        Filters.set('remote', cb.value);
      } else { Filters.set('remote', ''); }
      renderJobs();
    });
  });

  // Level checkboxes
  document.querySelectorAll('[data-filter-level]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        document.querySelectorAll('[data-filter-level]').forEach(c => { if (c !== cb) c.checked = false; });
        Filters.set('level', cb.value);
      } else { Filters.set('level', ''); }
      renderJobs();
    });
  });
}

// ---- Sort ----
function initSortListener() {
  const el = document.getElementById('sort-select');
  if (!el) return;
  el.addEventListener('change', () => { Filters.set('sort', el.value); renderJobs(); });
}

// ---- Salary Slider ----
function initSalarySlider() {
  const minSlider = document.getElementById('salary-min');
  const maxSlider = document.getElementById('salary-max');
  const display   = document.getElementById('salary-display');
  if (!minSlider || !maxSlider) return;

  const update = () => {
    let minVal = parseInt(minSlider.value);
    let maxVal = parseInt(maxSlider.value);
    if (minVal > maxVal) { const tmp = minVal; minVal = maxVal; maxVal = tmp; }
    Filters.set('salaryMin', minVal * 1000);
    Filters.set('salaryMax', maxVal * 1000);
    if (display) display.textContent = `${UI.formatSalary(minVal * 1000, maxVal * 1000)}`;
    renderJobs();
  };

  minSlider.value = Filters.state.salaryMin / 1000;
  maxSlider.value = Filters.state.salaryMax === 500000 ? 500 : Filters.state.salaryMax / 1000;
  if (display) display.textContent = UI.formatSalary(Filters.state.salaryMin, Filters.state.salaryMax);

  minSlider.addEventListener('input', update);
  maxSlider.addEventListener('input', update);
}

// ---- Clear filters ----
function initClearFilters() {
  const btn = document.getElementById('clear-filters-btn');
  if (!btn) return;
  btn.addEventListener('click', () => { Filters.clear(); renderJobs(); syncFormToState(); });
}

// ---- Mobile filter toggle ----
function initMobileFilterToggle() {
  const btn     = document.getElementById('mobile-filter-btn');
  const sidebar = document.getElementById('filter-sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => { sidebar.classList.toggle('hidden'); });
}

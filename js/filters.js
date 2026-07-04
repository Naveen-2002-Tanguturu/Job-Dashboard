/* ============================================
   HIREX — Filter & Search Logic
   ============================================ */

const Filters = {
  state: {
    search:   '',
    category: '',
    type:     '',
    remote:   '',
    level:    '',
    salaryMin: 0,
    salaryMax: 500000,
    sort:     'newest',
    page:     1,
    perPage:  12
  },

  // ---- Apply all filters to JOBS_DATA ----
  apply(jobs) {
    let result = [...jobs];
    const s = this.state;

    // Search
    if (s.search.trim()) {
      const q = s.search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.name.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.skills.some(sk => sk.toLowerCase().includes(q)) ||
        j.location.toLowerCase().includes(q) ||
        j.excerpt.toLowerCase().includes(q)
      );
    }

    if (s.category) result = result.filter(j => j.category === s.category);
    if (s.type)     result = result.filter(j => j.type === s.type);
    if (s.remote)   result = result.filter(j => j.remote === s.remote);
    if (s.level)    result = result.filter(j => j.level === s.level);

    // Salary range
    result = result.filter(j => j.salary.min <= s.salaryMax && j.salary.max >= s.salaryMin);

    // Sort
    result.sort((a, b) => {
      switch (s.sort) {
        case 'newest':  return new Date(b.posted) - new Date(a.posted);
        case 'oldest':  return new Date(a.posted) - new Date(b.posted);
        case 'salary-high': return b.salary.max - a.salary.max;
        case 'salary-low':  return a.salary.min - b.salary.min;
        case 'relevance': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default: return 0;
      }
    });

    return result;
  },

  // ---- Paginate ----
  paginate(jobs) {
    const { page, perPage } = this.state;
    const total = jobs.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    return { jobs: jobs.slice(start, start + perPage), total, totalPages, page };
  },

  // ---- Read URL params ----
  fromURL() {
    const p = new URLSearchParams(location.search);
    if (p.has('q'))        this.state.search   = p.get('q');
    if (p.has('category')) this.state.category = p.get('category');
    if (p.has('type'))     this.state.type     = p.get('type');
    if (p.has('remote'))   this.state.remote   = p.get('remote');
    if (p.has('level'))    this.state.level    = p.get('level');
    if (p.has('sort'))     this.state.sort     = p.get('sort');
    if (p.has('page'))     this.state.page     = parseInt(p.get('page')) || 1;
    if (p.has('salMin'))   this.state.salaryMin = parseInt(p.get('salMin')) || 0;
    if (p.has('salMax'))   this.state.salaryMax = parseInt(p.get('salMax')) || 500000;
  },

  // ---- Push to URL ----
  toURL() {
    const s = this.state;
    const p = new URLSearchParams();
    if (s.search)   p.set('q', s.search);
    if (s.category) p.set('category', s.category);
    if (s.type)     p.set('type', s.type);
    if (s.remote)   p.set('remote', s.remote);
    if (s.level)    p.set('level', s.level);
    if (s.sort !== 'newest') p.set('sort', s.sort);
    if (s.page > 1) p.set('page', s.page);
    if (s.salaryMin > 0)      p.set('salMin', s.salaryMin);
    if (s.salaryMax < 500000) p.set('salMax', s.salaryMax);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  },

  // ---- Set filter and reset page ----
  set(key, value) {
    this.state[key] = value;
    if (key !== 'page') this.state.page = 1;
  },

  // ---- Clear all ----
  clear() {
    this.state = { search:'', category:'', type:'', remote:'', level:'', salaryMin:0, salaryMax:500000, sort:'newest', page:1, perPage:12 };
  },

  // ---- Active filters as chips ----
  getActiveFilters() {
    const chips = [];
    const s = this.state;
    if (s.search)   chips.push({ label: `"${s.search}"`,    key: 'search',   value: '' });
    if (s.category) chips.push({ label: s.category,         key: 'category', value: '' });
    if (s.type)     chips.push({ label: { 'full-time':'Full-time','part-time':'Part-time','contract':'Contract','internship':'Internship','freelance':'Freelance' }[s.type] || s.type, key:'type', value:'' });
    if (s.remote)   chips.push({ label: { remote:'Remote',hybrid:'Hybrid',onsite:'On-site' }[s.remote] || s.remote, key:'remote', value:'' });
    if (s.level)    chips.push({ label: { entry:'Entry',mid:'Mid-level',senior:'Senior',lead:'Lead',executive:'Executive' }[s.level] || s.level, key:'level', value:'' });
    if (s.salaryMin > 0 || s.salaryMax < 500000) chips.push({ label: `${UI.formatSalary(s.salaryMin, s.salaryMax)}`, key:'salary', value:'' });
    return chips;
  },

  // ---- Count results ----
  count() {
    return this.apply(JOBS_DATA).length;
  }
};

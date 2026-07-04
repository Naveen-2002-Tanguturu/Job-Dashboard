/* ============================================
   HIREX — localStorage Utilities
   ============================================ */

const Storage = {
  SAVED_KEY:   'hirex_saved_jobs',
  APPLIED_KEY: 'hirex_applied_jobs',
  THEME_KEY:   'hirex_theme',

  getSavedJobs() {
    try { return JSON.parse(localStorage.getItem(this.SAVED_KEY) || '[]'); } catch { return []; }
  },
  saveJob(id) {
    const s = this.getSavedJobs();
    if (!s.includes(id)) { s.push(id); localStorage.setItem(this.SAVED_KEY, JSON.stringify(s)); }
  },
  unsaveJob(id) {
    localStorage.setItem(this.SAVED_KEY, JSON.stringify(this.getSavedJobs().filter(x => x !== id)));
  },
  isJobSaved(id) { return this.getSavedJobs().includes(id); },
  toggleSaveJob(id) {
    if (this.isJobSaved(id)) { this.unsaveJob(id); return false; }
    this.saveJob(id); return true;
  },

  getAppliedJobs() {
    try { return JSON.parse(localStorage.getItem(this.APPLIED_KEY) || '[]'); } catch { return []; }
  },
  saveApplication(jobId, formData) {
    const list = this.getAppliedJobs();
    const idx  = list.findIndex(a => a.jobId === jobId);
    const entry = { jobId, appliedAt: new Date().toISOString(), ...formData };
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    localStorage.setItem(this.APPLIED_KEY, JSON.stringify(list));
  },
  isJobApplied(id) { return this.getAppliedJobs().some(a => a.jobId === id); },

  getTheme() { return localStorage.getItem(this.THEME_KEY) || 'dark'; },
  setTheme(t) { localStorage.setItem(this.THEME_KEY, t); }
};

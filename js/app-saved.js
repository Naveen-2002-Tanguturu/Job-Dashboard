/* ============================================
   HIREX — Saved Jobs Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  renderSavedJobs();
});

function renderSavedJobs() {
  const grid   = document.getElementById('saved-jobs-grid');
  const countEl = document.getElementById('saved-count');
  if (!grid) return;

  const savedIds = Storage.getSavedJobs();
  const jobs = savedIds.map(id => getJobById(id)).filter(Boolean);

  if (countEl) countEl.textContent = `${jobs.length} saved job${jobs.length !== 1 ? 's' : ''}`;

  if (!jobs.length) {
    grid.innerHTML = Render.emptyState(
      'No saved jobs yet',
      'Browse jobs and click the bookmark icon to save positions you\'re interested in.',
      `<a href="jobs.html" class="btn btn-primary">Browse Jobs</a>`
    );
    return;
  }

  grid.innerHTML = jobs.map(job => {
    const applied = Storage.isJobApplied(job.id);
    const card = Render.jobCard(job);
    // Inject applied badge into footer
    return card.replace('</a>', `
      <div class="flex gap-2" style="border-top:1px solid var(--border);padding-top:12px;margin-top:4px">
        <a href="job-detail.html?id=${job.id}" class="btn btn-primary btn-sm" style="flex:1;justify-content:center">View Job</a>
        ${applied
          ? `<span class="btn btn-success btn-sm" style="pointer-events:none">✓ Applied</span>`
          : `<a href="apply.html?id=${job.id}" class="btn btn-secondary btn-sm" style="flex:1;justify-content:center">Apply Now</a>`}
        <button class="btn btn-ghost btn-sm btn-icon" title="Remove from saved" onclick="event.preventDefault();removeSaved('${job.id}',this.closest('.job-card'))">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </a>`);
  }).join('');
}

function removeSaved(jobId, cardEl) {
  Storage.unsaveJob(jobId);
  cardEl.style.transition = 'all .3s ease';
  cardEl.style.opacity = '0';
  cardEl.style.transform = 'scale(.95)';
  setTimeout(() => { cardEl.remove(); renderSavedJobs(); }, 300);
  UI.showToast('Job removed', 'Removed from your saved jobs.', 'info');
}

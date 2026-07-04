/* ============================================
   HIREX — Job Detail Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  const id  = new URLSearchParams(location.search).get('id');
  const job = id ? getJobById(id) : null;

  if (!job) {
    document.getElementById('detail-main').innerHTML = Render.emptyState('Job not found', 'This job listing may have been removed or expired.', `<a href="jobs.html" class="btn btn-primary">Browse all jobs</a>`);
    return;
  }

  renderJobDetail(job);
  renderSimilarJobs(job.id);
  initSaveButton(job.id);
  initShareButtons(job);
  document.title = `${job.title} at ${job.company.name} — Hirex`;
});

function renderJobDetail(job) {
  // Breadcrumb
  const bc = document.getElementById('breadcrumb-job');
  if (bc) bc.textContent = `${job.company.name} / ${job.title}`;

  // Header info
  const headerEl = document.getElementById('job-header');
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="flex gap-4 items-start" style="flex-wrap:wrap">
        ${Render.companyAvatar(job.company, 'xl')}
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            ${Render.categoryBadge(job.category)}
            ${job.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
            ${Storage.isJobApplied(job.id) ? '<span class="badge badge-applied">✓ Applied</span>' : ''}
          </div>
          <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:4px">${job.title}</h1>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <a href="https://${job.company.website}" target="_blank" rel="noopener" style="font-size:.9rem;font-weight:600;color:var(--text-secondary);display:flex;align-items:center;gap:4px">${job.company.name}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <span style="color:var(--border)">·</span>
            <span style="font-size:.85rem;color:var(--text-secondary)">📍 ${job.location}</span>
            <span style="color:var(--border)">·</span>
            <span style="font-size:.8rem;color:var(--text-muted)">Posted ${UI.relativeDate(job.posted)}</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
        ${Render.typeBadge(job.type)} ${Render.remoteBadge(job.remote)} ${Render.levelBadge(job.level)}
      </div>`;
  }

  // Description
  const descEl = document.getElementById('job-description');
  if (descEl) {
    const responsibilities = job.responsibilities.map(r => `<li>${r}</li>`).join('');
    const requirements     = job.requirements.map(r => `<li>${r}</li>`).join('');
    const niceToHave       = job.nice_to_have.map(r => `<li>${r}</li>`).join('');
    const benefits         = job.benefits.map(b => `<span class="tag">${b}</span>`).join('');
    const skills           = job.skills.map(s => `<span class="tag">${s}</span>`).join('');

    descEl.innerHTML = `
      <div class="job-description">
        <p>${job.description}</p>
        <h3>What You'll Do</h3>
        <ul>${responsibilities}</ul>
        <h3>What We're Looking For</h3>
        <ul>${requirements}</ul>
        <h3>Nice to Have</h3>
        <ul>${niceToHave}</ul>
        <h3>Skills</h3>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">${skills}</div>
        <h3>Benefits & Perks</h3>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${benefits}</div>
      </div>`;
  }

  // Sidebar info card
  const infoEl = document.getElementById('job-info-card');
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <div class="detail-info-item__label">Salary Range</div>
          <div class="detail-info-item__value" style="color:var(--success)">${UI.formatSalary(job.salary.min, job.salary.max)}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-item__label">Job Type</div>
          <div class="detail-info-item__value">${UI.capitalize(job.type.replace('-',' '))}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-item__label">Work Mode</div>
          <div class="detail-info-item__value">${UI.capitalize(job.remote)}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-item__label">Level</div>
          <div class="detail-info-item__value">${UI.capitalize(job.level)}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-item__label">Industry</div>
          <div class="detail-info-item__value">${job.company.industry}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-item__label">Team Size</div>
          <div class="detail-info-item__value">${job.company.size}</div>
        </div>
      </div>`;
  }

  // Company card
  const compEl = document.getElementById('company-card');
  if (compEl) {
    compEl.innerHTML = `
      <div class="flex gap-3 items-center" style="margin-bottom:12px">
        ${Render.companyAvatar(job.company, 'lg')}
        <div>
          <div style="font-weight:700;color:var(--text-primary)">${job.company.name}</div>
          <div style="font-size:.8rem;color:var(--text-muted)">${job.company.industry}</div>
        </div>
      </div>
      <p style="font-size:.82rem;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">${job.company.description}</p>
      <a href="https://${job.company.website}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm w-full">
        Visit ${job.company.name}
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>`;
  }

  // Apply CTA
  const applyBtn = document.getElementById('apply-btn');
  if (applyBtn) {
    if (Storage.isJobApplied(job.id)) {
      applyBtn.textContent = '✓ Applied';
      applyBtn.classList.add('btn-success');
      applyBtn.classList.remove('btn-primary');
    } else {
      applyBtn.href = `apply.html?id=${job.id}`;
    }
  }
}

function renderSimilarJobs(jobId) {
  const container = document.getElementById('similar-jobs');
  if (!container) return;
  const similar = getSimilarJobs(jobId);
  if (!similar.length) { container.closest('.detail-card').style.display = 'none'; return; }
  container.innerHTML = similar.map(j => Render.miniJobCard(j)).join('');
}

function initSaveButton(jobId) {
  const btn = document.getElementById('save-job-btn');
  if (!btn) return;

  const update = () => {
    const saved = Storage.isJobSaved(jobId);
    btn.innerHTML = saved
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Saved`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Save Job`;
    btn.className = `btn btn-secondary${saved ? ' btn-success' : ''}`;
  };
  update();
  btn.addEventListener('click', () => {
    const isSaved = Storage.toggleSaveJob(jobId);
    update();
    UI.showToast(isSaved ? 'Job saved!' : 'Job removed', '', isSaved ? 'success' : 'info');
  });
}

function initShareButtons(job) {
  const copyBtn = document.getElementById('share-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).then(() => {
        UI.showToast('Link copied!', 'Job link copied to clipboard.', 'success');
      });
    });
  }
}

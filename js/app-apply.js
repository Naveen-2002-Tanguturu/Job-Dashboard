/* ============================================
   HIREX — Apply Page Logic (Multi-step form)
   ============================================ */

let currentStep = 1;
const totalSteps = 4;
let jobId  = null;
let formData = {};

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  jobId = new URLSearchParams(location.search).get('id');
  const job = jobId ? getJobById(jobId) : null;

  if (!job) {
    document.getElementById('apply-card').innerHTML = Render.emptyState('Job not found', 'This job listing may have been removed.', `<a href="jobs.html" class="btn btn-primary">Browse jobs</a>`);
    return;
  }

  renderJobSummary(job);
  renderScreeningQuestions(job);
  updateStep(1);
  initFormListeners();
  initFileUpload();
  document.title = `Apply — ${job.title} at ${job.company.name} — Hirex`;
});

function renderJobSummary(job) {
  const el = document.getElementById('apply-job-info');
  if (!el) return;
  el.innerHTML = `
    <div class="flex gap-3 items-center">
      ${Render.companyAvatar(job.company)}
      <div>
        <div style="font-weight:700;color:var(--text-primary)">${job.title}</div>
        <div style="font-size:.82rem;color:var(--text-secondary)">${job.company.name} · ${job.location}</div>
      </div>
    </div>`;
}

function renderScreeningQuestions(job) {
  const container = document.getElementById('screening-questions');
  if (!container || !job.screening_questions?.length) return;
  container.innerHTML = job.screening_questions.map(q => {
    if (q.type === 'textarea') {
      return `<div class="input-group">
        <label class="input-label" for="sq-${q.id}">${q.question}</label>
        <textarea class="textarea" id="sq-${q.id}" name="${q.id}" rows="4" placeholder="Your answer…" required></textarea>
      </div>`;
    }
    if (q.type === 'select') {
      const opts = q.options.map(o => `<option value="${o}">${o}</option>`).join('');
      return `<div class="input-group">
        <label class="input-label" for="sq-${q.id}">${q.question}</label>
        <select class="select" id="sq-${q.id}" name="${q.id}" required>
          <option value="" disabled selected>Select an option</option>
          ${opts}
        </select>
      </div>`;
    }
    return '';
  }).join('');
}

function updateStep(step) {
  currentStep = step;
  // Update step circles
  document.querySelectorAll('.step-item').forEach((el, i) => {
    el.classList.remove('active', 'completed');
    if (i + 1 === step) el.classList.add('active');
    else if (i + 1 < step) el.classList.add('completed');
  });
  // Show correct form step
  document.querySelectorAll('.step-form').forEach(f => f.classList.remove('active'));
  const active = document.getElementById(`step-${step}`);
  if (active) { active.classList.add('active'); active.style.animation = 'fadeUp .3s ease'; }
  // Update buttons
  updateButtons();
}

function updateButtons() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : '';
  if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? '' : 'none';
  if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? '' : 'none';
}

function initFormListeners() {
  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      collectStepData(currentStep);
      if (currentStep === totalSteps - 1) renderReview();
      updateStep(currentStep + 1);
    }
  });
  document.getElementById('prev-btn')?.addEventListener('click', () => {
    if (currentStep > 1) updateStep(currentStep - 1);
  });
  document.getElementById('submit-btn')?.addEventListener('click', submitApplication);
}

function validateStep(step) {
  const form = document.getElementById(`step-${step}`);
  if (!form) return true;
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(el => {
    el.classList.remove('error');
    const errId = `err-${el.id}`;
    document.getElementById(errId)?.remove();
    if (!el.value.trim()) {
      el.classList.add('error');
      const msg = document.createElement('div');
      msg.className = 'field-error'; msg.id = errId;
      msg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> This field is required.`;
      el.parentNode.insertBefore(msg, el.nextSibling);
      valid = false;
    }
  });
  if (!valid) UI.showToast('Please fill in all required fields', '', 'error');
  return valid;
}

function collectStepData(step) {
  const form = document.getElementById(`step-${step}`);
  if (!form) return;
  form.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.name) formData[el.name] = el.value;
  });
}

function renderReview() {
  const el = document.getElementById('review-content');
  if (!el) return;
  const fields = [
    { label: 'Full Name',  value: formData.fullname  },
    { label: 'Email',      value: formData.email     },
    { label: 'Phone',      value: formData.phone     },
    { label: 'LinkedIn',   value: formData.linkedin  },
    { label: 'Location',   value: formData.location  },
    { label: 'Cover Letter', value: formData.cover_letter ? formData.cover_letter.slice(0, 120) + '…' : '—' },
  ].filter(f => f.value);
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px">
      ${fields.map(f => `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:.82rem;color:var(--text-muted);font-weight:500">${f.label}</span>
          <span style="font-size:.85rem;color:var(--text-primary);text-align:right;max-width:60%">${f.value || '—'}</span>
        </div>`).join('')}
    </div>`;
}

function submitApplication() {
  collectStepData(currentStep);
  Storage.saveApplication(jobId, formData);

  // Show success state
  document.getElementById('apply-card').innerHTML = `
    <div class="success-state">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2>Application Submitted! 🎉</h2>
      <p>Your application has been received. The hiring team will review it and reach out to you within 1-2 weeks.</p>
      <div class="flex gap-3" style="flex-wrap:wrap;justify-content:center;margin-top:8px">
        <a href="jobs.html" class="btn btn-primary">Browse More Jobs</a>
        <a href="saved-jobs.html" class="btn btn-secondary">My Saved Jobs</a>
      </div>
    </div>`;

  UI.showToast('Application submitted!', 'Good luck with your application.', 'success', 5000);
}

function initFileUpload() {
  const area   = document.getElementById('resume-upload-area');
  const input  = document.getElementById('resume-file');
  const status = document.getElementById('file-status');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', e => {
    e.preventDefault(); area.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files[0]) handleFile(input.files[0]); });

  function handleFile(file) {
    formData['resume_filename'] = file.name;
    if (status) status.textContent = `✓ ${file.name} (${(file.size/1024).toFixed(0)} KB)`;
    area.style.borderColor = 'var(--success)';
    area.querySelector('.file-upload-text').textContent = 'Resume selected';
    UI.showToast('Resume attached', file.name, 'success');
  }
}

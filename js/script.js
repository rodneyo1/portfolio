/* ============================================================
   THEME
   ============================================================ */
const THEME_KEY = 'portfolio-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
}

// Run immediately to prevent flash of wrong theme
initTheme();

/* ============================================================
   BACKGROUND WAVE CANVAS
   ============================================================ */
function initBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:0'
  ].join(';');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Two clusters matching the reference: top-left fan + right-edge fan
  const CLUSTERS = [
    // { count, yStart, ySpread, freqBase, freqStep, ampBase, ampStep, phaseStep, tMult }
    { count: 16, yStart: 0.0,  ySpread: 0.60, freqBase: 2.2, freqStep: 0.18,
      ampBase: 0.07, ampStep: 0.006, phaseStep: 0.48, tMult: 1.0  },
    { count: 14, yStart: 0.15, ySpread: 0.72, freqBase: 3.1, freqStep: 0.14,
      ampBase: 0.055, ampStep: 0.004, phaseStep: 0.38, tMult: 0.65 },
  ];

  function drawCluster(c, clusterT) {
    const dark  = document.documentElement.getAttribute('data-theme') !== 'light';
    const alpha = dark ? 0.18 : 0.07;
    const rgb   = dark ? '255,255,255' : '20,18,15';

    for (let i = 0; i < c.count; i++) {
      const yBase = H * (c.yStart + (i / c.count) * c.ySpread);
      const freq  = c.freqBase + i * c.freqStep;
      const amp   = H * (c.ampBase + i * c.ampStep);
      const phase = i * c.phaseStep;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth   = 0.75;

      for (let x = 0; x <= W; x += 4) {
        const nx = x / W;
        const y  = yBase
          + Math.sin(nx * freq * Math.PI + phase + clusterT)           * amp
          + Math.sin(nx * freq * 0.55 * Math.PI + phase * 0.8 + clusterT * 0.7) * amp * 0.38;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    CLUSTERS.forEach(c => drawCluster(c, t * c.tMult));
    t += 0.003;
    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener('resize', resize, { passive: true });
}

/* ============================================================
   SCROLL HEADER
   ============================================================ */
function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   ACTIVE NAV
   ============================================================ */
function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-button').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

/* ============================================================
   CONFIG LOADER
   ============================================================ */
async function loadConfig() {
  if (typeof jsyaml === 'undefined') {
    console.warn('js-yaml not loaded — skipping dynamic content.');
    return null;
  }
  try {
    const res = await fetch('config.yaml');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return jsyaml.load(await res.text());
  } catch (err) {
    console.warn('Could not load config.yaml:', err.message,
      '\nTip: run `python3 -m http.server 8000` for local development.');
    return null;
  }
}

/* ============================================================
   RENDERERS
   ============================================================ */
function renderIcons(icons = []) {
  const el = document.querySelector('[data-render="icons"]');
  if (!el) return;
  el.innerHTML = icons.map(i =>
    `<img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${i.slug}.svg"
          alt="${i.name}" class="tech-icon" title="${i.name}" />`
  ).join('');
}

function renderSkills(stack = []) {
  const el = document.querySelector('[data-render="skills"]');
  if (!el) return;
  el.innerHTML = stack.map(cat => `
    <div class="skill-card">
      <h3 class="skill-card__title">${cat.category}</h3>
      <ul class="skill-card__list">
        ${cat.skills.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>`
  ).join('');
}

function buildCard(p) {
  const dest = p.page || p.url;
  const isExternal = !p.page;
  const extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const tags = (p.tags || []).map((t, i) =>
    `<span class="tag${i === 0 ? ' tag--primary' : ''}">${t}</span>`
  ).join('');
  return `
    <article class="card">
      <a class="card__image-wrap" href="${dest}"${extAttrs} aria-label="${p.title}">
        <img src="${p.image}" alt="${p.title}" class="card__image" loading="lazy" />
      </a>
      <div class="card__body">
        <div class="card__title-row">
          <h3 class="card__title">
            <a href="${dest}"${extAttrs}>${p.title}</a>
          </h3>
          <a href="${p.url}" target="_blank" rel="noopener noreferrer"
             class="card__github-icon" aria-label="View ${p.title} on GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
        </div>
        <div class="card__tags">${tags}</div>
        <p class="card__description">${p.description.trim()}</p>
      </div>
    </article>`;
}

function renderProjects(projects = []) {
  document.querySelectorAll('[data-render="projects"]').forEach(el => {
    const list = el.hasAttribute('data-featured')
      ? projects.filter(p => p.featured)
      : projects;
    el.innerHTML = list.length
      ? list.map(buildCard).join('')
      : '<p class="loading">No projects configured.</p>';
  });
}

function renderExperience(items = []) {
  const el = document.querySelector('[data-render="experience"]');
  if (!el || !items.length) return;
  el.innerHTML = items.map(item => `
    <div class="timeline__item">
      <div class="timeline__period">${item.period}</div>
      <div class="timeline__role">${item.role}</div>
      <div class="timeline__company">${item.company}</div>
      ${item.description ? `<p class="timeline__description">${item.description}</p>` : ''}
    </div>`
  ).join('');
}

function renderTestimonials(items = []) {
  const el = document.querySelector('[data-render="testimonials"]');
  if (!el || !items.length) return;
  el.innerHTML = items.map(item => `
    <div class="testimonial-card">
      <p class="testimonial-card__quote">${item.quote}</p>
      <div class="testimonial-card__author">${item.author}</div>
      <div class="testimonial-card__role">${item.role}</div>
    </div>`
  ).join('');
}

function applyOptionalSections(sections = {}) {
  const exp  = document.getElementById('experience-section');
  const test = document.getElementById('testimonials-section');

  if (exp) {
    exp.style.display = sections.experience?.enabled ? '' : 'none';
    if (sections.experience?.enabled) renderExperience(sections.experience.items || []);
  }
  if (test) {
    test.style.display = sections.testimonials?.enabled ? '' : 'none';
    if (sections.testimonials?.enabled) renderTestimonials(sections.testimonials.items || []);
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  initBackground();
  initScrollHeader();
  markActiveNav();
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  const config = await loadConfig();
  if (!config) return;

  renderIcons(config.icons);
  renderSkills(config.stack);
  renderProjects(config.projects);
  applyOptionalSections(config.sections);
});

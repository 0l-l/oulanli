// Oulan Li — homepage behaviour: theme toggle, image carousels, visitor log.

/* ---------- Dark mode ---------- */
(function () {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const sync = () => { btn.textContent = root.dataset.theme === 'dark' ? 'Light' : 'Dark'; };
  sync();
  btn.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    sync();
  });
})();

/* ---------- Corner UI turns white while the hero is behind it ---------- */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const update = () => document.body.classList.toggle('on-hero', hero.getBoundingClientRect().bottom > 40);
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
})();

/* ---------- Carousels: click right half for next, left half for previous ---------- */
document.querySelectorAll('[data-slides]').forEach((box) => {
  const slides = [...box.querySelectorAll('.slide')];
  const count = box.querySelector('.count');
  let i = 0;
  const show = (n) => {
    slides[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    if (count) count.textContent = `${i + 1} / ${slides.length}`;
  };
  const leftHalf = (e) => e.clientX - box.getBoundingClientRect().left < box.offsetWidth / 2;
  box.addEventListener('mousemove', (e) => box.classList.toggle('at-left', leftHalf(e)));
  box.addEventListener('click', (e) => show(leftHalf(e) ? i - 1 : i + 1));
  box.tabIndex = 0;
  box.setAttribute('aria-label', 'Project images — use arrow keys');
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
});

/* ---------- Visitor log ----------
   A quiet note in the right margin that notices how you move through the page,
   the way a researcher takes notes in a playtest. It only lives in this tab:
   nothing is stored or sent anywhere. */
(function () {
  const note = document.getElementById('observer');
  if (!note) return;
  const start = Date.now();
  const pad = (n) => String(n).padStart(2, '0');
  const clock = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

  let watching = null;   // name of the project in view
  let since = 0;         // when it came into view
  let override = null;   // a one-off remark, shown briefly
  let overrideUntil = 0;
  let lastText = '';

  const say = (text, ms = 2600) => { override = text; overrideUntil = Date.now() + ms; };

  const render = () => {
    const now = Date.now();
    let text;
    if (override && now < overrideUntil) {
      text = override;
    } else if (watching && now - since > 2000) {
      text = `paused on ${watching} · ${Math.floor((now - since) / 1000)}s`;
    } else {
      text = `visit · ${clock(Math.floor((now - start) / 1000))}`;
    }
    if (text !== lastText) {
      // Brighten only when the kind of note changes, not every tick.
      const kind = (t) => t.split(' ')[0];
      if (kind(text) !== kind(lastText)) {
        note.classList.add('is-fresh');
        setTimeout(() => note.classList.remove('is-fresh'), 1200);
      }
      note.textContent = text;
      lastText = text;
    }
  };

  // Which project is in view?
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const name = en.target.querySelector('.count')
        ? en.target.querySelector('.slide span').textContent.split(' —')[0]
        : null;
      if (en.isIntersecting && name && watching !== name) { watching = name; since = Date.now(); }
      else if (!en.isIntersecting && watching === name) { watching = null; }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.project').forEach((p) => io.observe(p));

  // Scrolling back up after reading further down.
  let maxY = 0, saidBack = false;
  addEventListener('scroll', () => {
    const y = scrollY;
    maxY = Math.max(maxY, y);
    if (!saidBack && maxY > innerHeight * 2.5 && y < maxY - innerHeight * 1.2) {
      saidBack = true;
      say('scrolled back up — curious?');
    }
  }, { passive: true });

  // Flipping through every image of a project.
  document.querySelectorAll('[data-slides]').forEach((box) => {
    const total = box.querySelectorAll('.slide').length;
    let clicks = 0;
    box.addEventListener('click', () => { if (++clicks === total - 1) say('looked at every image'); });
  });

  // Coming back to the tab.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - start > 5000) say('welcome back');
  });

  render();
  setInterval(render, 1000);
})();

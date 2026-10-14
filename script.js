/* Static HTML remains the content source; JS adds navigation and restrained motion. */
(() => {
  'use strict';
  const menu = document.getElementById('menu');
  const nav = document.getElementById('nav');
  const mobile = matchMedia('(max-width: 767px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menuLabel = menu.querySelector('.menu-label');
  function closeMenu(focus = false) {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menu.setAttribute('aria-expanded', 'false');
    menuLabel.textContent = 'Menu';
    if (focus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu();
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (menu.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const items = [menu, ...nav.querySelectorAll('a')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => closeMenu());
  const strip = document.querySelector('.brand-showcase');
  const pause = document.querySelector('.marquee-toggle');
  pause?.addEventListener('click', () => {
    const paused = strip.classList.toggle('is-paused');
    pause.setAttribute('aria-pressed', String(paused));
    if (!paused) strip.classList.remove('keyboard-browsing');
    pause.setAttribute('aria-label', paused ? 'Resume brand motion' : 'Pause brand motion');
    pause.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
  });
  document.querySelectorAll('.brand-group:not([aria-hidden]) a').forEach(link => {
    link.addEventListener('focus', () => {
      if (link.matches(':focus-visible')) strip.classList.add('keyboard-browsing');
    });
  });
  const sections = ['about', 'work', 'resume', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const timeline = document.querySelector('.timeline');
  let frame = 0;
  function updateScroll() {
    let active = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 145) active = '#' + section.id; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) active = '#contact';
    sectionLinks.forEach(link => {
      if (link.getAttribute('href') === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (timeline) {
      const bounds = timeline.getBoundingClientRect();
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .68 - bounds.top) / bounds.height));
      timeline.style.setProperty('--timeline-progress', progress.toFixed(3));
    }
    frame = 0;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('hashchange', schedule);
  reduced.addEventListener('change', schedule);
  updateScroll();
  // Progressive enhancement: final content remains visible without JS or motion support.
  const running = new Set();
  const counterFinishes = new Set();
  function animate(node, frames, options) {
    if (!node || reduced.matches || document.hidden || !node.animate) return;
    const animation = node.animate(frames, options);
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    return animation;
  }
  // Separate layers prevent entrance, ambient and pointer transforms competing.
  const pointerFine = matchMedia('(hover: hover) and (pointer: fine)');
  const controllers = new Map();
  const activeControllers = new Set();
  let pointerFrame = 0, previousTime = 0, pointerOwner = null;
  function controller(root, layers, kind) {
    if (!root) return;
    root.dataset.motionPointer = kind;
    const state = { root, layers, kind, bounds: null, dirty: true, visible: false, x: 0, y: 0, tx: 0, ty: 0 };
    controllers.set(root, state);
    return state;
  }
  const heroLayers = [...document.querySelectorAll('.social-mark')].map((mark, index) => {
    const layer = document.createElement('div');
    layer.className = 'mark-pointer';
    mark.firstElementChild.before(layer);
    layer.append(mark.querySelector('.mark-face'));
    return { node: layer, strength: [.8, .65, 1, .9, .7][index], direction: [1, -.65, .85, -.8, 1][index], cx: 0, cy: 0 };
  });
  controller(document.querySelector('.hero'), heroLayers, 'hero');
  const portrait = document.querySelector('.portrait-line img');
  if (portrait) {
    const portraitFrame = document.createElement('div');
    portraitFrame.className = 'portrait-motion';
    const portraitAmbient = document.createElement('div');
    portraitAmbient.className = 'portrait-ambient';
    portrait.before(portraitFrame);
    portraitFrame.append(portraitAmbient);
    portraitAmbient.append(portrait);
    controller(portraitFrame, [{ node: portrait }], 'portrait');
  }
  document.querySelectorAll('.creative .art-link, .project-card').forEach((link, index) => {
    const frame = document.createElement('div');
    frame.className = `motion-frame motion-variant-${index % 3}`;
    link.before(frame);
    frame.append(link);
    controller(link, [{ node: link }], 'art');
  });
  function pointerAllowed() { return !reduced.matches && pointerFine.matches && innerWidth >= 768 && !document.hidden; }
  function writePointer(state) {
    if (state.kind === 'hero') {
      const amplitude = innerWidth < 1100 ? 8 : 18;
      state.layers.forEach(layer => {
        const distance = Math.hypot(state.x - layer.cx, state.y - layer.cy);
        const strength = layer.strength * Math.max(.35, 1 - distance * .3);
        layer.node.style.setProperty('--pointer-x', (state.x * amplitude * strength * layer.direction).toFixed(2) + 'px');
        layer.node.style.setProperty('--pointer-y', (state.y * amplitude * strength).toFixed(2) + 'px');
        layer.node.style.setProperty('--pointer-turn', (state.x * strength * 1.2).toFixed(2) + 'deg');
      });
    } else {
      const node = state.layers[0].node;
      node.style.setProperty('--pointer-x', (state.x * (state.kind === 'art' ? 4 : 3)).toFixed(2) + 'px');
      node.style.setProperty('--pointer-y', (state.y * (state.kind === 'art' ? 3 : 4)).toFixed(2) + 'px');
      if (state.kind === 'art') {
        node.style.setProperty('--pointer-rx', (-state.y * 1.5).toFixed(2) + 'deg');
        node.style.setProperty('--pointer-ry', (state.x * 1.8).toFixed(2) + 'deg');
      }
    }
  }
  function interpolate(now) {
    pointerFrame = 0;
    if (!pointerAllowed()) return;
    const dt = Math.min(64, previousTime ? now - previousTime : 16);
    previousTime = now;
    const blend = 1 - Math.exp(-dt / 95);
    activeControllers.forEach(state => {
      state.x += (state.tx - state.x) * blend;
      state.y += (state.ty - state.y) * blend;
      if (Math.abs(state.tx - state.x) + Math.abs(state.ty - state.y) < .002) {
        state.x = state.tx; state.y = state.ty;
        activeControllers.delete(state);
      }
      writePointer(state);
    });
    if (activeControllers.size) pointerFrame = requestAnimationFrame(interpolate);
    else previousTime = 0;
  }
  function wakePointer(state) {
    activeControllers.add(state);
    if (!pointerFrame && pointerAllowed()) pointerFrame = requestAnimationFrame(interpolate);
  }
  function settle(state) { if (state) { state.tx = 0; state.ty = 0; wakePointer(state); } }
  // One delegated handler; bounding boxes are cached until scroll/resize/ownership changes.
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !pointerAllowed()) return;
    const root = event.target.closest('[data-motion-pointer]');
    const state = controllers.get(root);
    if (state !== pointerOwner) {
      settle(pointerOwner);
      pointerOwner = state || null;
      if (state) state.dirty = true;
    }
    if (!state || !state.visible) return;
    if (state.dirty) {
      state.bounds = root.getBoundingClientRect();
      if (state.kind === 'hero') state.layers.forEach(layer => {
        const b = layer.node.parentElement.getBoundingClientRect();
        layer.cx = ((b.left + b.width / 2 - state.bounds.left) / state.bounds.width - .5) * 2;
        layer.cy = ((b.top + b.height / 2 - state.bounds.top) / state.bounds.height - .5) * 2;
      });
      state.dirty = false;
    }
    const b = state.bounds;
    state.tx = Math.max(-1, Math.min(1, ((event.clientX - b.left) / b.width - .5) * 2));
    state.ty = Math.max(-1, Math.min(1, ((event.clientY - b.top) / b.height - .5) * 2));
    wakePointer(state);
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (!pointerOwner) return;
    const next = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-motion-pointer]') : null;
    if (next !== pointerOwner.root) { settle(pointerOwner); pointerOwner = null; }
  }, { passive: true });
  function invalidateBounds() { controllers.forEach(state => { state.dirty = true; }); }
  addEventListener('scroll', invalidateBounds, { passive: true });
  addEventListener('resize', () => { invalidateBounds(); if (!pointerAllowed()) resetPointer(); });
  addEventListener('blur', () => { settle(pointerOwner); pointerOwner = null; });
  function resetPointer() {
    cancelAnimationFrame(pointerFrame); pointerFrame = 0; previousTime = 0;
    activeControllers.clear(); pointerOwner = null;
    controllers.forEach(state => { state.x = state.y = state.tx = state.ty = 0; writePointer(state); });
  }
  const surfaces = document.querySelectorAll('.hero, .portrait-motion, .motion-frame, .capabilities>div, .pharmassist-stat, .outcomes>div, .section-heading, .brand-showcase');
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const node = entry.target;
        node.classList.toggle('motion-visible', entry.isIntersecting);
        const state = controllers.get(node) || controllers.get(node.querySelector('.art-link, .project-card'));
        if (state) { state.visible = entry.isIntersecting; if (!state.visible) settle(state); }
      });
    }, { threshold: 0 });
    surfaces.forEach(node => visibility.observe(node));
  } else {
    surfaces.forEach(node => node.classList.add('motion-visible'));
    controllers.forEach(state => { state.visible = true; });
  }
  function tabVisibility() {
    document.documentElement.classList.toggle('motion-tab-paused', document.hidden);
    if (document.hidden) {
      resetPointer();
      running.forEach(animation => animation.pause());
      counterFinishes.forEach(finish => finish());
    } else running.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
  }
  document.addEventListener('visibilitychange', tabVisibility);
  tabVisibility();
  reduced.addEventListener('change', resetPointer);
  pointerFine.addEventListener('change', resetPointer);

  const ease = 'cubic-bezier(.22,1,.36,1)';
  const hero = document.querySelector('.hero');
  const opening = [];
  function enter(node, delay, duration, distance = 12) {
    const animation = animate(node, [
      { opacity: .65, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration, delay, easing: ease, fill: 'backwards' });
    if (animation) opening.push(animation);
  }
  if (hero && !reduced.matches) {
    const prelude = animate(document.querySelector('.social-orbit'), [{ opacity: .05, scale: .94 }, { opacity: 1, scale: 1 }], { duration: 900, easing: ease });
    if (prelude) opening.push(prelude);
    document.querySelectorAll('.social-mark').forEach((node, i) => {
      const animation = animate(node, [
        { opacity: .35, translate: `${i % 2 ? 12 : -12}px 18px`, scale: .9 },
        { opacity: 1, translate: '0 0', scale: 1 }
      ], { duration: 950, delay: 80 + i * 90, easing: ease, fill: 'backwards' });
      if (animation) opening.push(animation);
    });
    document.querySelectorAll('.hero-main h1 > *').forEach((node, i) => enter(node, i * 110, i === 2 ? 850 : 650, i === 2 ? 16 : 10));
    enter(document.querySelector('.hero-role'), 200, 700);
    enter(document.querySelector('.hero-statement'), 260, 700);
    enter(document.querySelector('.hero-support'), 320, 700);
    enter(document.querySelector('.hero-actions'), 380, 700);
    enter(document.querySelector('.hero-foot'), 900, 750, 6);
  }
  // Finish the opening immediately when visitors skip ahead or focus a hero link.
  function finishOpening() { opening.forEach(animation => { if (animation.playState !== 'finished') animation.finish(); }); }
  if (hero) {
    hero.addEventListener('focusin', finishOpening);
    addEventListener('scroll', () => { if (hero.getBoundingClientRect().bottom < 80) finishOpening(); }, { passive: true });
  }

  function reveal(node) {
    node.classList.add('is-in-view');
    let targets = [node];
    if (node.matches('.project-intro, .section-heading')) targets = [...node.children];
    if (node.matches('.project-card')) targets = [...node.children];
    const pillarDelay = node.matches('.capabilities > div') && innerWidth >= 768 ? [...node.parentElement.children].indexOf(node) * 85 : 0;
    targets.forEach((target, i) => animate(target, [
      { opacity: .28, transform: `translateY(${target.matches('.creative, .portrait-line') ? 30 : 22}px)` },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 720, delay: pillarDelay + i * 85, easing: ease }));
  }
  const revealNodes = document.querySelectorAll('.intro-grid h2, .portrait-line, .intro-copy, .capabilities > div, .section-heading, .case-topline, .case-copy, .project-intro, .creative:not(.case-details .creative), .project-card, .chapter-narrative, .campaign-notes, .support-caption, .ai-module, .contact');
  const metricNodes = document.querySelectorAll('.pharmassist-stat b, .outcomes b');
  function countUp(node) {
    if (reduced.matches) return;
    const final = node.textContent.trim();
    const match = final.match(/^([\d,.]+)([KM%]?)(\+?)$/);
    if (!match) return;
    const number = Number(match[1].replaceAll(',', ''));
    const decimals = (match[1].split('.')[1] || '').length;
    // Stable final value stays in the accessibility tree. Only the visual copy counts.
    const stable = document.createElement('span');
    stable.className = 'sr-only';
    stable.textContent = final;
    const visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    visible.textContent = final;
    node.replaceChildren(stable, visible);
    node.dataset.counted = 'true';
    const start = performance.now();
    let request = 0;
    const finish = () => { cancelAnimationFrame(request); visible.textContent = final; counterFinishes.delete(finish); };
    counterFinishes.add(finish);
    function tick(now) {
      const progress = Math.min((now - start) / 1100, 1);
      const value = number * (1 - Math.pow(1 - progress, 3));
      visible.textContent = value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + match[2] + match[3];
      if (progress < 1 && !reduced.matches) request = requestAnimationFrame(tick);
      else finish();
    }
    request = requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { reveal(entry.target); reveals.unobserve(entry.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    revealNodes.forEach(node => reveals.observe(node));
    const counters = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { countUp(entry.target); counters.unobserve(entry.target); } });
    }, { threshold: .5 });
    metricNodes.forEach(node => counters.observe(node));
    if (hero) {
      const ambient = new IntersectionObserver(entries => {
        hero.classList.toggle('hero-inactive', !entries[0].isIntersecting);
      });
      ambient.observe(hero);
    }
  }
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    running.forEach(animation => animation.finish());
    counterFinishes.forEach(finish => finish());
  });
  addEventListener('beforeprint', () => {
    running.forEach(animation => animation.finish());
    counterFinishes.forEach(finish => finish());
  });
  document.querySelectorAll('.case-details').forEach(details => {
    const label = details.querySelector('.detail-label');
    const closedLabel = label.textContent;
    details.addEventListener('toggle', () => { label.textContent = details.open ? 'Close details' : closedLabel; });
  });
  const printState = new Map();
  addEventListener('beforeprint', () => {
    document.querySelectorAll('#resume details').forEach(details => { printState.set(details, details.open); details.open = true; });
  });
  addEventListener('afterprint', () => { printState.forEach((open, details) => { details.open = open; }); printState.clear(); });
  document.getElementById('print-resume')?.addEventListener('click', () => print());
})();

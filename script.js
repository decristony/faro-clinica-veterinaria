(() => {
  const nav = document.querySelector('.nav');
  const onS = () => nav.classList.toggle('solid', scrollY > 60);
  addEventListener('scroll', onS, { passive: true }); onS();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = matchMedia('(hover: hover)').matches;

  // luz do otoscópio no hero + leve paralaxe
  const hero = document.querySelector('.hero');
  const pic = hero.querySelector('.hero-pic img');
  if (hover && !reduce) {
    let tx = 72, ty = 56, x = tx, y = ty, raf;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width * 100; ty = (e.clientY - r.top) / r.height * 100;
      if (!raf) raf = requestAnimationFrame(step);
    });
    function step() {
      x += (tx - x) * .14; y += (ty - y) * .14;
      hero.style.setProperty('--mx', x + '%'); hero.style.setProperty('--my', y + '%');
      pic.style.transform = `scale(1.06) translate(${(50 - x) * .03}%, ${(50 - y) * .03}%)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .1 ? requestAnimationFrame(step) : null;
    }
  }

  // pontos que seguem o cursor na seção da calculadora
  const age = document.querySelector('.age');
  if (hover) age.addEventListener('pointermove', e => {
    const r = age.getBoundingClientRect();
    age.style.setProperty('--dx', (e.clientX - r.left) + 'px'); age.style.setProperty('--dy', (e.clientY - r.top) + 'px');
  });

  // calculadora de idade
  const anos = document.getElementById('anos');
  const anosOut = document.getElementById('anosOut');
  const humano = document.getElementById('humano');
  const stage = document.getElementById('stage');
  const img = document.getElementById('ageImg');
  const rCheck = document.getElementById('rCheck');
  const rFoco = document.getElementById('rFoco');
  const porteBox = document.getElementById('porteBox');
  const fotos = {
    filhote: ['assets/filhote-sim-500.webp', 'Filhote de beagle no colo de uma veterinária'],
    adulto: ['assets/checkup-700.webp', 'Golden retriever adulto em consulta'],
    senior: ['assets/reabilitacao-700.webp', 'Cachorro idoso na hidroterapia'],
    gato: ['assets/ultrassom-700.webp', 'Gato rajado em exame de ultrassom']
  };
  let atual = '';
  function calc(esp, porte, a) {
    if (esp === 'gato') return a <= 1 ? a * 15 : a <= 2 ? 15 + (a - 1) * 9 : 24 + (a - 2) * 4;
    const k = { p: 4, m: 5, g: 6 }[porte];
    return a <= 1 ? a * 15 : a <= 2 ? 15 + (a - 1) * 9 : 24 + (a - 2) * k;
  }
  function render() {
    const esp = document.querySelector('input[name=esp]:checked').value;
    const porte = document.querySelector('input[name=porte]:checked').value;
    const a = +anos.value;
    porteBox.classList.toggle('hide', esp === 'gato');
    anos.style.setProperty('--f', ((a - .5) / 17.5 * 100) + '%');
    anosOut.textContent = a < 1 ? '6 meses' : (a === 1 ? '1 ano' : (a % 1 ? String(a).replace('.', ',') + ' anos' : a + ' anos'));
    const h = Math.round(calc(esp, porte, a));
    humano.textContent = h;
    const seniorAt = esp === 'gato' ? 10 : { p: 9, m: 8, g: 7 }[porte];
    let fase = a < 1 ? 'filhote' : a >= seniorAt ? 'senior' : 'adulto';
    stage.textContent = { filhote: esp === 'gato' ? 'Filhote' : 'Filhote', adulto: 'Adulto', senior: 'Sênior' }[fase];
    rCheck.textContent = fase === 'filhote' ? 'a cada 3 a 4 semanas até completar as vacinas' : fase === 'adulto' ? '1 vez por ano' : 'a cada 6 meses, com exames de sangue';
    rFoco.textContent = fase === 'filhote' ? 'vacinas, vermífugo e socialização' : fase === 'adulto' ? (esp === 'gato' ? 'peso, rins e tártaro' : 'peso, tártaro e pele') : (esp === 'gato' ? 'rins, tireoide e pressão' : 'articulações, coração e rins');
    const key = esp === 'gato' ? 'gato' : fase;
    if (key !== atual) {
      atual = key; img.classList.add('swap');
      setTimeout(() => { img.src = fotos[key][0]; img.alt = fotos[key][1]; setTimeout(() => img.classList.remove('swap'), 60); }, 220);
    }
  }
  document.querySelectorAll('input[name=esp],input[name=porte]').forEach(i => i.addEventListener('change', render));
  anos.addEventListener('input', render);
  render();
})();

/* TRANSIÇÕES v2 · Faro Veterinária · cada coisa chega seguindo o rastro
   Entradas de textos, imagens e cartões + traço de passagem entre seções, com assinatura própria do nicho.
   Só roda com JS e sem prefers-reduced-motion; o conteúdo nunca fica escondido sem JS. */
(() => {
  const C = {"step": 0.09, "settle": 2.4, "divider": "<svg viewBox=\"0 0 1200 28\"><ellipse class=\"dot\" cx=\"60\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.00s\"/><ellipse class=\"dot\" cx=\"132\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.07s\"/><ellipse class=\"dot\" cx=\"204\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.14s\"/><ellipse class=\"dot\" cx=\"276\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.21s\"/><ellipse class=\"dot\" cx=\"348\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.28s\"/><ellipse class=\"dot\" cx=\"420\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.35s\"/><ellipse class=\"dot\" cx=\"492\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.42s\"/><ellipse class=\"dot\" cx=\"564\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.49s\"/><ellipse class=\"dot\" cx=\"636\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.56s\"/><ellipse class=\"dot\" cx=\"708\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.63s\"/><ellipse class=\"dot\" cx=\"780\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.70s\"/><ellipse class=\"dot\" cx=\"852\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.77s\"/><ellipse class=\"dot\" cx=\"924\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.84s\"/><ellipse class=\"dot\" cx=\"996\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.91s\"/><ellipse class=\"dot\" cx=\"1068\" cy=\"19\" rx=\"6\" ry=\"4.5\" style=\"--ld:0.98s\"/><ellipse class=\"dot\" cx=\"1140\" cy=\"9\" rx=\"6\" ry=\"4.5\" style=\"--ld:1.05s\"/></svg>", "words": false, wordDelay: (i) => i * .08, cardDelay: (n) => Math.min(n, 6) * .1};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const html = document.documentElement;
  html.classList.add('fx');
  const mob = matchMedia('(max-width: 760px)').matches;
  const SKIP = '.hero, body > header, nav, footer, .nav, .wa, .whats, .wpp, [class*="whatsapp"], canvas, video, iframe, [data-nofx], [class*="marquee"], [class*="ticker"], [aria-hidden="true"]' + (C.skip ? ', ' + C.skip : '');
  const pinned = el => { for (let p = el; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p).position; if (s === 'sticky' || s === 'fixed') return true; } return false; };
  const F0 = new Map();
  if (C.imgFilter) document.querySelectorAll('section img').forEach(i => F0.set(i, getComputedStyle(i).filter));
  const sections = [...document.querySelectorAll('section')].filter(s => !s.parentElement.closest('section') && !s.matches(SKIP) && !s.closest(SKIP));

  // o sistema antigo de revelação (fade genérico) sai de cena fora da hero
  sections.forEach(s => s.querySelectorAll('.rv, .reveal').forEach(el => { el.classList.remove('rv', 'reveal'); el.style.transitionDelay = ''; }));
  sections.forEach(s => s.classList.remove('rv', 'reveal'));

  const items = []; // {el, kind}
  const taken = new Set();
  const isTaken = el => { for (const t of taken) if (t !== el && t.contains(el)) return true; return false; };

  sections.forEach(sec => {
    // 1. cartões: grupos de 3+ irmãos parecidos com imagem ou título
    const groups = [];
    sec.querySelectorAll('*').forEach(p => {
      const ch = [...p.children].filter(c => !['SCRIPT', 'TEMPLATE', 'BR'].includes(c.tagName));
      if (ch.length < 3 || p.closest(SKIP)) return;
      const sig = c => c.tagName + '.' + (c.classList[0] || '');
      const cnt = {}; ch.forEach(c => cnt[sig(c)] = (cnt[sig(c)] || 0) + 1);
      const best = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
      if (best[1] < 3 || best[1] < ch.length * .7) return;
      const cards = ch.filter(c => sig(c) === best[0]);
      if (!cards.every(c => c.querySelector('img, h3, h4, strong, summary, dt') && c.getBoundingClientRect().height > 50)) return;
      if (cards.some(c => pinned(c))) return;
      if (groups.some(g => g.some(c => c.contains(p)))) return;
      groups.push(cards);
    });
    groups.forEach(g => g.forEach((c, i) => { if (!isTaken(c)) { c.classList.add('fx-c'); c.style.setProperty('--n', i); taken.add(c); items.push({ el: c, kind: 'c', i }); } }));

    // 2. imagens soltas (fora de cartões, fundos fixos e áreas presas)
    sec.querySelectorAll('img').forEach(img => {
      if (img.closest(SKIP) || isTaken(img) || pinned(img)) return;
      let w = img.parentElement; if (w.tagName === 'PICTURE') w = w.parentElement;
      const ws = getComputedStyle(img);
      if (ws.position === 'absolute' && w === sec) return;
      const r = w.getBoundingClientRect(), rs = sec.getBoundingClientRect();
      if (r.width * r.height > rs.width * rs.height * .85) return; // foto de fundo da seção
      let target = w;
      if (w === sec || w.querySelector('h1, h2, h3, p, a, button') ) target = img;
      if (isTaken(target) || taken.has(target)) return;
      target.classList.add('fx-i'); if (target === img) target.classList.add('fx-self');
      if (getComputedStyle(target).clipPath !== 'none') target.classList.add('fx-noclip');
      taken.add(target); items.push({ el: target, kind: 'i' });
    });

    // 3. textos: títulos, parágrafos, listas de dados, botões e formulários, em cascata
    sec.querySelectorAll('h2, h3, h4, p, li, blockquote, dl, form, ' + (C.extraText || '.eyebrow') + ', a[class*="btn"], a[class*="cta"], button[class*="btn"]').forEach(el => {
      if (el.closest(SKIP) || isTaken(el) || taken.has(el) || pinned(el)) return;
      if (el.closest('form') && el.tagName !== 'FORM') return;
      if (!el.textContent.trim() && el.tagName !== 'FORM') return;
      if (el.tagName === 'H2' && C.words) splitWords(el);
      else el.classList.add('fx-t');
      taken.add(el); items.push({ el, kind: el.classList.contains('fx-ws') ? 'w' : 't' });
    });
  });

  function splitWords(h) {
    h.classList.add('fx-ws');
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(t => { if (!t) return; if (/^\s+$/.test(t)) frag.append(t); else { const s = document.createElement('span'); s.className = 'fx-w'; s.textContent = t; frag.append(s); } });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !/^(BR|SVG|IMG)$/i.test(n.tagName)) {
          const cs = getComputedStyle(n);
          if (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text' || cs.display === 'block') { n.classList.add('fx-w'); return; }
          walk(n);
        }
      });
    };
    walk(h);
    [...h.querySelectorAll('.fx-w')].forEach((w, i, all) => w.style.setProperty('--wd', C.wordDelay(i, all.length) + 's'));
  }

  // filtro de cor de cada foto preservado: a entrada soma o efeito ao filtro original
  if (C.imgFilter) document.querySelectorAll('.fx-i img, img.fx-i, .fx-c img').forEach(img => {
    const f = F0.get(img); img.style.setProperty('--f0', (f && f !== 'none' ? f + ' ' : '') + C.imgFilter);
  });

  // 4. traço de passagem entre seções
  let nDiv = 0;
  sections.forEach((sec, k) => {
    if (nDiv >= (C.maxDiv || 7) || k === 0 && C.skipFirstDiv) return;
    if (sec.matches(C.noDiv || '.fixo, .window, .janela, .sky')) return;
    if (!sec.querySelector('h2')) return;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    const box = document.createElement('div');
    box.className = 'fx-div'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = C.divider;
    sec.prepend(box); nDiv++;
    items.push({ el: box, kind: 'd' });
  });

  // entrada: os elementos que chegam juntos entram em cascata, na ordem do texto
  const step = C.step * (mob ? .7 : 1);
  const show = (el, d) => {
    el.style.transitionDelay = d + 's';
    el.style.setProperty('--dl', d + 's');
    el.classList.add('fx-on');
    setTimeout(() => { el.classList.add('fx-done'); el.style.transitionDelay = ''; }, (d + C.settle) * 1000);
  };
  // elementos recortados (clip-path) são observados pelo pai, porque o recorte zera a área visível
  const proxyOf = el => ((el.classList.contains('fx-i') && !el.classList.contains('fx-noclip')) || (C.textClip && el.classList.contains('fx-t'))) ? el.parentElement : el;
  const watch = new Map();
  items.forEach(({ el }) => { const p = proxyOf(el); if (!watch.has(p)) watch.set(p, []); watch.get(p).push(el); });
  const io = new IntersectionObserver(es => {
    const ins = es.filter(e => e.isIntersecting).flatMap(e => { io.unobserve(e.target); return watch.get(e.target) || []; })
      .sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1);
    ins.forEach((el, i) => {
      const n = el.classList.contains('fx-c') ? C.cardDelay(+el.style.getPropertyValue('--n') || 0) : Math.min(i, 7) * step;
      show(el, n);
    });
  }, { threshold: .14, rootMargin: '0px 0px -7% 0px' });
  watch.forEach((_, p) => io.observe(p));
  // quem chega por âncora já encontra o que ficou acima pronto
  requestAnimationFrame(() => watch.forEach((els, p) => { if (p.getBoundingClientRect().bottom < 0) { io.unobserve(p); els.forEach(el => show(el, 0)); } }));
})();

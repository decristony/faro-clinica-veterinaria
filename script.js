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

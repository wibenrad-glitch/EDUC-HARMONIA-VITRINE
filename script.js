/* ═══════════════════════════════════════════
   EDUC'HARMONIA — Script principal
═══════════════════════════════════════════ */

/* ─── BANDEAU PROMO ─── */
(function() {
  const bandeau  = document.getElementById('bandeau-promo');
  const closeBtn = document.getElementById('bandeau-close');
  const navbar   = document.getElementById('navbar');
  if (!bandeau || !closeBtn) return;

  function applyOffset() {
    navbar.style.top = bandeau.classList.contains('hidden') ? '0px' : bandeau.offsetHeight + 'px';
  }

  applyOffset();
  window.addEventListener('resize', applyOffset);

  closeBtn.addEventListener('click', () => {
    bandeau.classList.add('hidden');
    navbar.style.top = '0px';
  });
})();

/* ─── MENU HAMBURGER ─── */
const burger      = document.getElementById('burger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── GROUPES REPLIABLES MOBILE ─── */
document.querySelectorAll('.mobile-group-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.parentElement;
    group.classList.toggle('open');
  });
});

document.querySelectorAll('.mobile-sublink').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── NAVBAR AU SCROLL ─── */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── ANIMATIONS REVEAL AU SCROLL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

/* Décalage en cascade pour les grilles */
document.querySelectorAll('.reveal').forEach((el, i) => {
  const parent = el.parentElement;
  const siblings = parent ? [...parent.querySelectorAll(':scope > .reveal')] : [];
  const indexInGroup = siblings.indexOf(el);
  if (indexInGroup > 0) {
    el.dataset.delay = indexInGroup * 100;
  }
  revealObserver.observe(el);
});

/* ─── ACCORDION FAQ ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const reponse = btn.nextElementSibling;
    const isOpen  = btn.classList.contains('open');

    // Ferme tous les autres
    document.querySelectorAll('.faq-question.open').forEach(other => {
      if (other !== btn) {
        other.classList.remove('open');
        other.nextElementSibling.classList.remove('open');
      }
    });

    btn.classList.toggle('open', !isOpen);
    reponse.classList.toggle('open', !isOpen);
  });
});


/* ─── CARROUSEL ─── */
(function() {
  const track = document.querySelector('.carrousel-track');
  if (!track) return;
  const btnPrev = document.querySelector('.carrousel-prev');
  const btnNext = document.querySelector('.carrousel-next');
  const dots    = document.querySelectorAll('.carrousel-dot');
  const cards   = track.querySelectorAll('.duo-card');
  const cardW   = () => cards[0].offsetWidth + 24;

  function scrollTo(index) {
    track.scrollTo({ left: index * cardW(), behavior: 'smooth' });
  }

  btnNext.addEventListener('click', () => {
    const idx = Math.round(track.scrollLeft / cardW());
    scrollTo(Math.min(idx + 1, cards.length - 1));
  });
  btnPrev.addEventListener('click', () => {
    const idx = Math.round(track.scrollLeft / cardW());
    scrollTo(Math.max(idx - 1, 0));
  });

  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollTo(i)));

  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / cardW());
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, { passive: true });

  /* drag souris */
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave', () => isDown = false);
  track.addEventListener('mouseup',   () => isDown = false);
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX);
  });
})();

/* ─── SÉLECTEUR DE CLASSE TARIFS ─── */
(function() {
  const classeNames = {
    'Maternelle': 'Maternelle (MS & GS)',
    'CP':  'Cours Préparatoire (CP)',
    'CE1': 'Cours Élémentaire 1 (CE1)',
    'CE2': 'Cours Élémentaire 2 (CE2)',
    'CM1': 'Cours Moyen 1 (CM1)',
    'CM2': 'Cours Moyen 2 (CM2)',
  };

  const tarifs = {
    'Maternelle': { mensuel: 60, mensuelDetail: 'Soit 600 € sur 10 mois', trimestriel: 180, trimestrielDetail: 'Soit 540 € sur 3 trimestres', trimestrielEco: '60 € d\'économie', annuel: 500, annuelDetail: 'Soit 500 € en 1 fois', annuelEco: '100 € d\'économie' },
    'default':    { mensuel: 90, mensuelDetail: 'Soit 900 € sur 10 mois', trimestriel: 280, trimestrielDetail: 'Soit 840 € sur 3 trimestres', trimestrielEco: '60 € d\'économie', annuel: 800, annuelDetail: 'Soit 800 € en 1 fois', annuelEco: '100 € d\'économie' },
  };

  function applyTarif(classe) {
    const t = tarifs[classe] || tarifs['default'];
    document.getElementById('tarif-mensuel-montant').textContent      = t.mensuel;
    document.getElementById('tarif-mensuel-detail').textContent        = t.mensuelDetail;
    document.getElementById('tarif-trimestriel-montant').textContent   = t.trimestriel;
    document.getElementById('tarif-trimestriel-detail').textContent    = t.trimestrielDetail;
    document.getElementById('tarif-trimestriel-economie').textContent  = t.trimestrielEco;
    document.getElementById('tarif-annuel-montant').textContent        = t.annuel;
    document.getElementById('tarif-annuel-detail').textContent         = t.annuelDetail;
    document.getElementById('tarif-annuel-economie').textContent       = t.annuelEco;
  }

  const btns  = document.querySelectorAll('.tarif-classe-btn');
  const label = document.getElementById('tarif-classe-active');
  if (!btns.length || !label) return;

  applyTarif('Maternelle');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      label.textContent = classeNames[btn.dataset.classe] || btn.dataset.classe;
      applyTarif(btn.dataset.classe);
    });
  });
})();

/* ─── SMOOTH SCROLL pour les ancres ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

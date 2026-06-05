const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'dark') html.setAttribute('data-theme','dark');

function loadParticles() {
  const dark = html.getAttribute('data-theme') === 'dark';
  const accent = dark ? '#a371f7' : '#6c5ce7';
  const particleOpacity = dark ? 0.28 : 0.4;
  const linkOpacity = dark ? 0.06 : 0.07;

  if (window._tsParticles) { window._tsParticles.destroy(); }

  tsParticles.load({
    id: 'particles-js',
    options: {
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 55, density: { enable: true } },
        color: { value: accent },
        shape: { type: 'circle' },
        opacity: { value: particleOpacity, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.12, sync: false } },
        size: { value: 2.5, random: true, anim: { enable: true, speed: 1, size_min: 0.5, sync: false } },
        links: { enable: true, distance: 130, color: accent, opacity: linkOpacity, width: 1 },
        move: { enable: true, speed: 0.7, direction: 'none', random: true, straight: false, outModes: 'bounce', attract: { enable: true, rotateX: 700, rotateY: 1200 } },
      },
      interactivity: {
        events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: true, mode: 'push' } },
        modes: { grab: { distance: 160, links: { opacity: 0.2 } }, push: { quantity: 3 } },
      },
      detectRetina: true,
    },
  }).then(container => { window._tsParticles = container; });
}

loadParticles();

themeToggle.addEventListener('click',() => {
  const next = html.getAttribute('data-theme') === 'dark' ? '' : 'dark';
  html.setAttribute('data-theme',next);
  localStorage.setItem('theme',next||'light');
  loadParticles();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      e.target.classList.remove('visible');
    }
  });
}, { threshold:0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  if (clickCooldown) return;

  let current = '';
  const scrollBottom = window.innerHeight + window.scrollY;
  const pageBottom = document.body.scrollHeight - 50;

  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) current = sec.id;
    if (top <= window.innerHeight && top > 100) {
      if (!current) current = sec.id;
    }
  });

  if (scrollBottom >= pageBottom && sections.length > 0) {
    current = sections[sections.length - 1].id;
  }

  if (current) {
    navLinksAll.forEach(a => a.classList.remove('active'));
    const link = document.querySelector(`.nav-links a[href="#${current}"]`);
    if (link) link.classList.add('active');
  }
}

let clickCooldown = false;
navLinksAll.forEach(link => {
  link.addEventListener('click', () => {
    navLinksAll.forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    clickCooldown = true;
    clearTimeout(window._navCooldown);
    window._navCooldown = setTimeout(() => { clickCooldown = false; }, 700);
  });
});

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      updateActiveNav();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

updateActiveNav();

document.querySelectorAll('.code-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.code-snippet').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.code-snippet[data-lang="${tab.dataset.lang}"]`).classList.add('active');
  });
});

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button');
  const status = contactForm.querySelector('.form-status');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner" style="animation:spin 0.8s linear infinite"></i> Sending...';
  try {
    const res = await fetch(contactForm.action, { method:'POST', body: new FormData(contactForm) });
    const data = await res.json();
    if (data.success) {
      status.style.display = 'block';
      contactForm.reset();
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent';
      setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; btn.disabled = false; status.style.display = 'none'; }, 4000);
    } else {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      alert('Failed to send. Check your access key or try again.');
    }
  } catch (err) {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    alert('Failed to send. Check your access key or try again.');
  }
});

(() => {
  const stage = document.querySelector('#carousel-stage');
  const dots = document.querySelector('#carousel-dots');
  const counter = document.querySelector('#carousel-counter');
  const carousel = document.querySelector('.story-carousel');
  const prevButton = document.querySelector('.carousel-arrow.prev');
  const nextButton = document.querySelector('.carousel-arrow.next');
  const root = window.MH_SITE_ROOT || new URL('./', document.baseURI);
  const asset = (path) => new URL(path, root).href;

  const fallbackData = {
    intervaloMs: 6000,
    historias: [
      {
        tipo: 'perfil',
        etiqueta: 'Perfil',
        titulo: 'Hola, soy Marcos',
        descripcion: 'Ingeniero de Ejecución en Informática con más de 19 años de experiencia desarrollando e integrando soluciones de software.'
      },
      {
        tipo: 'codigo',
        etiqueta: 'Desarrollo',
        titulo: 'Backend como base, Full-Stack como evolución',
        descripcion: 'Mi experiencia principal está en .NET, C# y SQL Server. Hoy amplío ese conocimiento con JavaScript, TypeScript y tecnologías frontend modernas.'
      },
      {
        tipo: 'proyecto',
        etiqueta: 'Proyectos',
        titulo: 'Aprender construyendo',
        descripcion: 'Mis proyectos propios me permiten practicar APIs REST, arquitectura, datos, automatización y buenas prácticas, dejando el código disponible en GitHub.'
      },
      {
        tipo: 'cloud',
        etiqueta: 'Ecosistema actual',
        titulo: 'Full-Stack, Cloud y DevOps',
        descripcion: 'Complemento mi base .NET con Angular y Node.js, además de Azure y Docker para cloud y entrega de software. React es la tecnología que sigo fortaleciendo.'
      }
    ]
  };

  const visuals = {
    perfil: () => `<figure class="portrait-photo"><img src="${asset('img/profile/marcos-mar.webp')}" alt="Marcos Hernández junto al mar durante la noche"><figcaption>Desarrollo de software · Backend · Integración</figcaption></figure>`,
    codigo: () => `<div class="code-window" aria-hidden="true"><div class="window-bar"><i></i><i></i><i></i></div><pre><span class="key">const</span> marcos = {
  perfil: <span class="string">"Full-Stack"</span>,
  base: [<span class="string">".NET"</span>, <span class="string">"C#"</span>, <span class="string">"SQL"</span>],
  web: [<span class="string">"JavaScript"</span>, <span class="string">"TypeScript"</span>],
  siempreAprendiendo: <span class="bool">true</span>
};</pre></div>`,
    proyecto: () => `<div class="project-visual" aria-hidden="true"><div class="project-browser"><div class="browser-top"></div><div class="browser-body"><div class="api-title"></div><div class="api-row"><span class="verb">GET</span><span class="line"></span></div><div class="api-row"><span class="verb">POST</span><span class="line"></span></div><div class="api-row"><span class="verb">PUT</span><span class="line"></span></div><div class="api-row"><span class="verb">DELETE</span><span class="line"></span></div></div></div><div class="project-tags"><span>.NET</span><span>REST API</span><span>SQL</span><span>Git</span></div></div>`,
    cloud: () => `<div class="learning-visual" aria-hidden="true">
      <div class="learning-center">Cloud & Web</div>
      <div class="learning-icons">
        <span><img src="${asset('img/icons/angular.svg')}" alt="">Angular</span>
        <span><img src="${asset('img/icons/react.svg')}" alt="">React</span>
        <span><img src="${asset('img/icons/nodejs.svg')}" alt="">Node.js</span>
        <span><img src="${asset('img/icons/docker.svg')}" alt="">Docker</span>
        <span><img src="${asset('img/icons/azure.svg')}" alt="">Azure</span>
      </div>
    </div>`
  };

  function buildCarousel(data) {
    if (!stage || !dots || !counter || !data?.historias?.length) return;

    const stories = data.historias;
    let current = 0;
    let timer = null;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    stage.innerHTML = stories.map((story, index) => `
      <article class="story-slide${index === 0 ? ' active' : ''}" aria-hidden="${index === 0 ? 'false' : 'true'}">
        <div class="story-visual">${(visuals[story.tipo] || visuals.codigo)()}</div>
        <div class="story-content">
          <span class="story-kicker">${String(index + 1).padStart(2, '0')} / ${String(stories.length).padStart(2, '0')} · ${story.etiqueta}</span>
          <h2>${story.titulo}</h2>
          <p>${story.descripcion}</p>
        </div>
      </article>`).join('');

    dots.innerHTML = stories.map((_, index) => `<button class="carousel-dot${index === 0 ? ' active' : ''}" type="button" data-index="${index}" aria-label="Ver historia ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('');

    const slides = [...stage.querySelectorAll('.story-slide')];
    const dotButtons = [...dots.querySelectorAll('.carousel-dot')];

    const render = (index) => {
      current = (index + stories.length) % stories.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dotButtons.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', String(active));
      });
      counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(stories.length).padStart(2, '0')}`;
    };

    const restart = () => {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => render(current + 1), Number(data.intervaloMs) || 6000);
    };

    prevButton?.addEventListener('click', () => { render(current - 1); restart(); });
    nextButton?.addEventListener('click', () => { render(current + 1); restart(); });
    dotButtons.forEach((dot) => dot.addEventListener('click', () => { render(Number(dot.dataset.index)); restart(); }));
    carousel?.addEventListener('mouseenter', () => clearInterval(timer));
    carousel?.addEventListener('mouseleave', restart);
    carousel?.addEventListener('focusin', () => clearInterval(timer));
    carousel?.addEventListener('focusout', restart);
    document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : restart());
    restart();
  }

  // file:// bloquea fetch() de archivos JSON en muchos navegadores. Al publicar
  // en GitHub Pages se usa data/home.json; al abrir localmente se usa el mismo
  // contenido como fallback para que el carrusel funcione sin servidor.
  if (location.protocol === 'file:') {
    buildCarousel(fallbackData);
  } else {
    fetch(new URL('data/home.json', root), { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(buildCarousel)
      .catch(() => buildCarousel(fallbackData));
  }
})();

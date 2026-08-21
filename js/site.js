(() => {
  const thisScript = document.currentScript;
  const siteRootUrl = thisScript?.src ? new URL('../', thisScript.src) : new URL('./', document.baseURI);
  window.MH_SITE_ROOT = siteRootUrl;

  const toSite = (path) => new URL(path, siteRootUrl).href;

  // Favicon compartido. Se resuelve desde la ubicación real de site.js, por lo que
  // funciona igual desde index.html, subcarpetas y file://.
  if (!document.querySelector('link[data-mh-favicon]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = toSite('img/icons/favicon.svg');
    favicon.dataset.mhFavicon = 'true';
    document.head.appendChild(favicon);
  }

  const iconImg = (file, alt = '') => `<img class="ui-icon" src="${toSite(`img/icons/${file}`)}" alt="${alt}">`;

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const active = this.dataset.active || '';
      const nav = [
        ['inicio', 'Inicio', 'index.html'],
        ['sobre-mi', 'Sobre mí', 'sobre-mi/index.html'],
        ['proyectos', 'Proyectos', 'proyectos/index.html'],
        ['blog', 'Blog', 'blog/index.html'],
        ['contacto', 'Contacto', 'contacto/index.html']
      ];

      this.innerHTML = `<header class="site-header"><div class="container nav-wrap">
        <a class="brand" href="${toSite('index.html')}" aria-label="Ir al inicio">
          <img class="brand-icon" src="${toSite('img/icons/favicon.svg')}" alt="" aria-hidden="true">
          <span>MarcosHernandez<span class="brand-accent">.dev</span></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span><span></span></button>
        <nav class="main-nav" aria-label="Navegación principal">${nav.map(([key, label, path]) => `<a${key === active ? ' class="active" aria-current="page"' : ''} href="${toSite(path)}">${label}</a>`).join('')}</nav>
        <div class="header-social" aria-label="Redes profesionales">
          <a class="icon-button icon-github" href="https://github.com/marcoshernandezti" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Marcos Hernández">${iconImg('github.svg', '')}</a>
          <a class="icon-button" href="https://www.linkedin.com/in/marcoshernandezalvarez/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Marcos Hernández">${iconImg('linkedin.svg', '')}</a>
        </div>
      </div></header>`;

      const btn = this.querySelector('.menu-toggle');
      const menu = this.querySelector('.main-nav');
      btn?.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      });
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<footer class="site-footer container">
        <span>© <span data-year></span> Marcos Hernández. Todos los derechos reservados.</span>
        <span class="footer-meta"><a href="${toSite('index.html')}">MarcosHernandez.dev</a> · Construido con HTML5, CSS3, JavaScript y JSON.</span>
      </footer>`;
      const y = this.querySelector('[data-year]');
      if (y) y.textContent = new Date().getFullYear();
    }
  }

  if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
  if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter);
})();

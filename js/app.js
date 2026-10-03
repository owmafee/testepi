/* ============================================================
   SPORTMATCH — APP.JS
   Main application entry and router
   ============================================================ */

const App = {
  // Map hash routes to page modules
  routes: {
    '/': LandingPage,
    '/login': LoginPage,
    '/register': LoginPage, // Handled by same component
    '/onboarding': OnboardingPage,
    '/dashboard': DashboardPage,
    '/discover': DiscoverPage,
    '/match/create': MatchCreatePage,
    '/match/:id': MatchDetailPage,
    '/profile': ProfilePage,
    '/profile/:id': ProfilePage,
    '/admin': window.AdminPage || { render: () => '<h2>Página Admin</h2>' },
    '/notifications': { render: () => '<h2>Notificações (Em breve)</h2>' }
  },

  init() {
    console.log('SportMatch Initializing...');

    // Listen to route changes
    window.addEventListener('hashchange', () => this.handleRoute());

    // Artificial loading delay for demo purposes
    setTimeout(() => {
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('root').style.display = 'block';
      this.handleRoute();
    }, 1000);
  },

  handleRoute() {
    let hash = window.location.hash.slice(1) || '/';
    const root = document.getElementById('root');

    // Simple params parsing
    let matchedRoute = null;
    let params = {};

    for (const route in this.routes) {
      const routeParts = route.split('/');
      const hashParts = hash.split('?')[0].split('/');

      if (routeParts.length === hashParts.length) {
        let match = true;
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':')) {
            params[routeParts[i].slice(1)] = hashParts[i];
          } else if (routeParts[i] !== hashParts[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          matchedRoute = route;
          break;
        }
      }
    }

    if (!matchedRoute) {
      hash = '/';
      matchedRoute = '/';
    }

    // Special logic for register mode
    if (hash === '/register') {
      params.mode = 'register';
    }

    // Check auth guards
    const publicRoutes = ['/', '/login', '/register'];
    const page = this.routes[matchedRoute];

    if (!publicRoutes.includes(matchedRoute) && !Auth.isLoggedIn()) {
      window.location.hash = '#/login';
      return;
    }

    if (publicRoutes.includes(matchedRoute) && Auth.isLoggedIn() && matchedRoute !== '/') {
      window.location.hash = '#/dashboard';
      return;
    }

    let contentHtml = '';
    
    // Add top navigation for authenticated routes
    if (!publicRoutes.includes(matchedRoute) && Auth.isLoggedIn()) {
      contentHtml += this.renderTopNav(matchedRoute);
    }
    
    // Render page
    contentHtml += page.render(params);
    root.innerHTML = contentHtml;

    // Call afterRender lifecycle if it exists
    if (page.afterRender) {
      setTimeout(() => page.afterRender(params), 0);
    }

    this.updateNav();
    window.scrollTo(0, 0);
  },

  renderTopNav(activeRoute) {
    const user = Auth.getCurrentUser();
    if (!user) return '';
    
    const unreadCount = Store.getNotifications(user.id).filter(n => !n.read).length;
    const badgeStyle = unreadCount > 0 ? 'display:flex;' : 'display:none;';
    
    return `
      <div class="top-nav">
        <div class="top-nav-logo" onclick="Utils.navigate('#/')">
          <div class="nav-logo-icon" style="width:28px;height:28px;font-size:0.9rem;">⚡</div>
          <span>SportMatch</span>
        </div>
        <div class="top-nav-links">
          <div class="top-nav-link ${activeRoute === '/dashboard' ? 'active' : ''}" onclick="Utils.navigate('#/dashboard')">Início</div>
          <div class="top-nav-link ${activeRoute === '/discover' ? 'active' : ''}" onclick="Utils.navigate('#/discover')">Descobrir</div>
          <div class="top-nav-link ${activeRoute === '/match/create' ? 'active' : ''}" onclick="Utils.navigate('#/match/create')">Criar Partida</div>
        </div>
        <div class="top-nav-actions">
          <div style="position:relative;cursor:pointer;" onclick="Utils.navigate('#/notifications')">
            <span style="font-size:1.25rem;">🔔</span>
            <div class="nav-badge" style="${badgeStyle}">${unreadCount}</div>
          </div>
          <div style="cursor:pointer;" onclick="Utils.navigate('#/profile')">
            ${Utils.renderAvatar(user, 'avatar-sm')}
          </div>
        </div>
      </div>
    `;
  },

  renderPage() {
    this.handleRoute();
  },

  updateNav() {
    this.updateNavBadge();
    const user = Auth.getCurrentUser();
    if (user) {
      document.querySelectorAll('.avatar-nav-update').forEach(el => {
        el.outerHTML = Utils.renderAvatar(user, 'avatar-sm');
      });
    }
  },

  updateNavBadge() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const unread = Store.getNotifications(user.id).filter(n => !n.read).length;
    document.querySelectorAll('.nav-badge').forEach(badge => {
      if (unread > 0) {
        badge.textContent = unread;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  },

  renderMobileNav(active = '') {
    const user = Auth.getCurrentUser();
    if (!user) return '';

    const unreadCount = Store.getNotifications(user.id).filter(n => !n.read).length;
    const hasUnread = unreadCount > 0 ? `<div class="mobile-nav-badge">${unreadCount}</div>` : '';

    return `
      <div class="mobile-nav">
        <div class="mobile-nav-item ${active === 'dashboard' ? 'active' : ''}" onclick="Utils.navigate('#/dashboard')">
          <span class="icon">🏠</span>
          <span>Início</span>
        </div>
        <div class="mobile-nav-item ${active === 'discover' ? 'active' : ''}" onclick="Utils.navigate('#/discover')">
          <span class="icon">🔍</span>
          <span>Buscar</span>
        </div>
        <div class="mobile-nav-item ${active === 'create' ? 'active' : ''}" onclick="Utils.navigate('#/match/create')">
          <div class="mobile-nav-action">+</div>
        </div>
        <div class="mobile-nav-item ${active === 'notifications' ? 'active' : ''}" onclick="Utils.navigate('#/notifications')">
          <span class="icon" style="position:relative;">🔔${hasUnread}</span>
          <span>Avisos</span>
        </div>
        <div class="mobile-nav-item ${active === 'profile' ? 'active' : ''}" onclick="Utils.navigate('#/profile')">
          <span class="icon">👤</span>
          <span>Perfil</span>
        </div>
      </div>
    `;
  }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

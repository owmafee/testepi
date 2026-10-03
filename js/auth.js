/* ============================================================
   SPORTMATCH — AUTH.JS
   Authentication module
   ============================================================ */

const Auth = {
  isLoggedIn() {
    return Store.getCurrentUser() !== null;
  },

  getCurrentUser() {
    return Store.getCurrentUser();
  },

  login(email, password) {
    const user = Store.getUserByEmail(email);
    if (!user) return { success: false, error: 'E-mail não encontrado.' };
    if (user.isSuspended) return { success: false, error: 'Sua conta foi suspensa. Entre em contato com o suporte.' };
    if (user.password !== Utils.simpleHash(password)) return { success: false, error: 'Senha incorreta.' };

    Store.saveSession(user.id);
    return { success: true, user };
  },

  register(name, email, password) {
    if (!name?.trim()) return { success: false, error: 'Nome é obrigatório.' };
    if (!email?.trim()) return { success: false, error: 'E-mail é obrigatório.' };
    if (!password || password.length < 6) return { success: false, error: 'Senha deve ter pelo menos 6 caracteres.' };

    const existing = Store.getUserByEmail(email);
    if (existing) return { success: false, error: 'Este e-mail já está cadastrado.' };

    const user = Store.createUser({ name: name.trim(), email: email.trim(), password });
    Store.saveSession(user.id);
    return { success: true, user };
  },

  logout() {
    Store.clearSession();
    window.location.hash = '#/';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  },

  requireAdmin() {
    const user = this.getCurrentUser();
    if (!user || !user.isAdmin) {
      Utils.toast('error', 'Acesso negado', 'Você não tem permissão para acessar esta área.');
      window.location.hash = '#/dashboard';
      return false;
    }
    return true;
  }
};

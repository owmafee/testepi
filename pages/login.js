/* ============================================================
   SPORTMATCH — LOGIN PAGE
   ============================================================ */

const LoginPage = {
  _isRegister: false,

  render(params) {
    this._isRegister = params?.mode === 'register' || window.location.hash === '#/register';
    return this._isRegister ? this._renderRegister() : this._renderLogin();
  },

  _renderLogin() {
    return `
      <div class="auth-page">
        <div class="auth-left">
          <div class="auth-left-bg"><div class="auth-left-glow"></div></div>
          <div class="auth-form-container">
            <div class="auth-logo" style="cursor:pointer;" onclick="Utils.navigate('#/')">
              <div class="auth-logo-icon">⚡</div>
              SportMatch
            </div>

            <h1 class="auth-title">Bem-vindo de volta</h1>
            <p class="auth-subtitle">Entre para encontrar partidas e jogar com pessoas compatíveis.</p>

            <form class="auth-form" id="login-form" onsubmit="LoginPage.handleLogin(event)">
              <div class="form-group">
                <label class="form-label" for="login-email">E-mail</label>
                <div class="input-group">
                  <span class="input-group-icon">📧</span>
                  <input type="email" id="login-email" class="input" placeholder="seu@email.com" required autocomplete="email" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">Senha</label>
                <div class="input-group">
                  <span class="input-group-icon">🔒</span>
                  <input type="password" id="login-password" class="input" placeholder="••••••••" required autocomplete="current-password" />
                </div>
              </div>

              <div id="login-error" class="form-error" style="display:none;"></div>

              <button type="submit" class="btn btn-primary btn-full btn-lg" id="login-submit">
                Entrar na plataforma
              </button>
            </form>

            <div class="auth-divider"><span>ou acesse com demo</span></div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="LoginPage.loginDemo('joao@demo.com')">👤 João Silva</button>
              <button class="btn btn-outline btn-sm" onclick="LoginPage.loginDemo('admin@sportmatch.com')">🛡️ Admin</button>
            </div>

            <p class="auth-footer-text">
              Não tem conta? <a onclick="Utils.navigate('#/register')">Criar conta grátis</a>
            </p>
            <p style="text-align:center;margin-top:8px;">
              <a onclick="Utils.navigate('#/')" style="font-size:0.8rem;color:var(--text-muted);cursor:pointer;">← Voltar ao início</a>
            </p>
          </div>
        </div>

        <div class="auth-right">
          <div class="auth-visual">
            <div style="margin-bottom:32px;">
              <h2 style="font-size:1.5rem;margin-bottom:8px;">Conectando atletas</h2>
              <p style="font-size:0.9rem;">Mais de 12 esportes, sistema de reputação e partidas compatíveis com seu nível.</p>
            </div>
            <div class="auth-feature-list">
              ${[
                { icon: '🏆', color: 'rgba(108,99,255,0.15)', title: 'Sistema de reputação', desc: 'Avaliações em duas dimensões: esportivo e comportamental.' },
                { icon: '✅', color: 'rgba(34,197,94,0.1)', title: 'Aprovação pelo admin', desc: 'O dono da partida analisa seu perfil antes de aceitar.' },
                { icon: '🔍', color: 'rgba(0,212,170,0.1)', title: 'Busca inteligente', desc: 'Encontre partidas por esporte, local, nível e muito mais.' },
              ].map(f => `
                <div class="auth-feature-item">
                  <div class="auth-feature-icon" style="background:${f.color};">${f.icon}</div>
                  <div>
                    <div class="auth-feature-title">${f.title}</div>
                    <div class="auth-feature-desc">${f.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderRegister() {
    return `
      <div class="auth-page">
        <div class="auth-left">
          <div class="auth-left-bg"><div class="auth-left-glow"></div></div>
          <div class="auth-form-container">
            <div class="auth-logo" style="cursor:pointer;" onclick="Utils.navigate('#/')">
              <div class="auth-logo-icon">⚡</div>
              SportMatch
            </div>

            <h1 class="auth-title">Criar conta</h1>
            <p class="auth-subtitle">Junte-se à comunidade e comece a jogar hoje mesmo.</p>

            <form class="auth-form" id="register-form" onsubmit="LoginPage.handleRegister(event)">
              <div class="form-group">
                <label class="form-label" for="reg-name">Nome completo <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-group-icon">👤</span>
                  <input type="text" id="reg-name" class="input" placeholder="Seu nome" required autocomplete="name" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-email">E-mail <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-group-icon">📧</span>
                  <input type="email" id="reg-email" class="input" placeholder="seu@email.com" required autocomplete="email" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-city">Cidade/Região <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-group-icon">📍</span>
                  <input type="text" id="reg-city" class="input" placeholder="Ex: São Paulo, SP" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-password">Senha <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-group-icon">🔒</span>
                  <input type="password" id="reg-password" class="input" placeholder="Mínimo 6 caracteres" required autocomplete="new-password" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-confirm">Confirmar senha <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-group-icon">🔒</span>
                  <input type="password" id="reg-confirm" class="input" placeholder="Repita a senha" required autocomplete="new-password" />
                </div>
              </div>

              <div id="reg-error" class="form-error" style="display:none;"></div>

              <button type="submit" class="btn btn-primary btn-full btn-lg" id="reg-submit">
                🚀 Criar minha conta
              </button>
            </form>

            <p class="auth-footer-text">
              Já tem conta? <a onclick="Utils.navigate('#/login')">Entrar</a>
            </p>
            <p style="text-align:center;margin-top:8px;">
              <a onclick="Utils.navigate('#/')" style="font-size:0.8rem;color:var(--text-muted);cursor:pointer;">← Voltar ao início</a>
            </p>
          </div>
        </div>

        <div class="auth-right">
          <div class="auth-visual">
            <div style="margin-bottom:32px;">
              <h2 style="font-size:1.5rem;margin-bottom:8px;">Junte-se à comunidade</h2>
              <p style="font-size:0.9rem;">Depois do cadastro, você vai configurar seu perfil esportivo em um wizard simples.</p>
            </div>
            <div class="auth-feature-list">
              ${[
                { icon: '⚽', color: 'rgba(34,197,94,0.1)', title: 'Escolha seus esportes', desc: 'Informe os esportes que pratica e seu nível em cada um.' },
                { icon: '💪', color: 'rgba(108,99,255,0.12)', title: 'Pontos fortes e fracos', desc: 'Ajude administradores a entender seu estilo de jogo.' },
                { icon: '🔍', color: 'rgba(0,212,170,0.1)', title: 'Encontre partidas', desc: 'Veja partidas recomendadas baseadas no seu perfil.' },
              ].map(f => `
                <div class="auth-feature-item">
                  <div class="auth-feature-icon" style="background:${f.color};">${f.icon}</div>
                  <div>
                    <div class="auth-feature-title">${f.title}</div>
                    <div class="auth-feature-desc">${f.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    const btn = document.getElementById('login-submit');

    btn.disabled = true;
    btn.textContent = 'Entrando...';
    errEl.style.display = 'none';

    setTimeout(() => {
      const result = Auth.login(email, password);
      if (result.success) {
        const user = result.user;
        Utils.toast('success', 'Bem-vindo!', `Olá, ${user.name.split(' ')[0]}!`);
        if (!user.onboardingComplete) {
          Utils.navigate('#/onboarding');
        } else {
          Utils.navigate('#/dashboard');
        }
      } else {
        errEl.textContent = result.error;
        errEl.style.display = 'flex';
        btn.disabled = false;
        btn.textContent = 'Entrar na plataforma';
      }
    }, 400);
  },

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const city = document.getElementById('reg-city').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const errEl = document.getElementById('reg-error');
    const btn = document.getElementById('reg-submit');

    errEl.style.display = 'none';

    if (password !== confirm) {
      errEl.textContent = 'As senhas não coincidem.';
      errEl.style.display = 'flex';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Criando conta...';

    setTimeout(() => {
      const result = Auth.register(name, email, password);
      if (result.success) {
        Store.updateUser(result.user.id, { city });
        Utils.toast('success', 'Conta criada!', 'Vamos configurar seu perfil esportivo.');
        Utils.navigate('#/onboarding');
      } else {
        errEl.textContent = result.error;
        errEl.style.display = 'flex';
        btn.disabled = false;
        btn.textContent = '🚀 Criar minha conta';
      }
    }, 400);
  },

  loginDemo(email) {
    const result = Auth.login(email, email === 'admin@sportmatch.com' ? 'admin123' : '123456');
    if (result.success) {
      const user = result.user;
      Utils.toast('success', 'Bem-vindo!', `Logado como ${user.name}`);
      if (!user.onboardingComplete) Utils.navigate('#/onboarding');
      else Utils.navigate('#/dashboard');
    }
  },

  afterRender() {}
};

/* ============================================================
   SPORTMATCH — LANDING PAGE
   ============================================================ */

const LandingPage = {
  render() {
    return `
      <div class="landing-page">
        <!-- Nav -->
        <nav class="landing-nav" id="landing-nav">
          <div style="display:flex;align-items:center;gap:12px;flex:1;">
            <div class="nav-logo" style="cursor:pointer;" onclick="Utils.navigate('#/')">
              <div class="nav-logo-icon">⚡</div>
              SportMatch
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <button class="btn btn-ghost" onclick="Utils.navigate('#/login')">Entrar</button>
            <button class="btn btn-primary" onclick="Utils.navigate('#/register')">Criar conta</button>
          </div>
        </nav>

        <!-- Hero -->
        <section class="landing-hero">
          <div class="hero-bg">
            <div class="hero-bg-glow-1"></div>
            <div class="hero-bg-glow-2"></div>
            <div class="hero-bg-grid"></div>
          </div>

          <div class="hero-content">
            <div class="hero-eyebrow">
              <div class="hero-eyebrow-dot"></div>
              Plataforma esportiva social
            </div>

            <h1 class="hero-title">
              Encontre quem quer<br />
              <span class="highlight">jogar junto</span> com você
            </h1>

            <p class="hero-subtitle">
              Crie seu perfil esportivo, encontre partidas próximas compatíveis com seu nível
              e conecte-se com outros atletas da sua região. Da solicitação à avaliação — tudo em um só lugar.
            </p>

            <div class="hero-actions">
              <button class="btn btn-primary btn-xl" onclick="Utils.navigate('#/register')">
                🚀 Começar grátis
              </button>
              <button class="btn btn-outline btn-lg" onclick="Utils.navigate('#/login')">
                Ver demonstração
              </button>
            </div>

            <div class="hero-stats">
              <div>
                <div class="hero-stat-value">12+</div>
                <div class="hero-stat-label">Esportes disponíveis</div>
              </div>
              <div>
                <div class="hero-stat-value">100%</div>
                <div class="hero-stat-label">Gratuito no MVP</div>
              </div>
              <div>
                <div class="hero-stat-value">🔒</div>
                <div class="hero-stat-label">Sistema seguro</div>
              </div>
            </div>
          </div>

          <!-- Hero visual -->
          <div class="hero-visual">
            <div class="hero-cards-preview">
              <div class="hero-card-preview">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                  <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#8a84ff);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;">JS</div>
                  <div>
                    <div style="font-weight:700;font-size:0.95rem;">João Silva</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">📍 São Paulo, SP</div>
                  </div>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                  <span class="badge badge-accent">⚽ Futebol</span>
                  <span class="badge level-3">Intermediário</span>
                </div>
                <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">Pontos fortes:</div>
                <div class="tags-wrap">
                  <span class="tag tag-strength">💪 Passe</span>
                  <span class="tag tag-strength">💪 Visão de jogo</span>
                </div>
                <div style="display:flex;gap:16px;margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
                  <div style="text-align:center;">
                    <div style="font-weight:800;font-size:1.1rem;">4.8</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);">Esportivo</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-weight:800;font-size:1.1rem;">4.9</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);">Comportamento</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-weight:800;font-size:1.1rem;">37</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);">Partidas</div>
                  </div>
                </div>
              </div>
              <div class="hero-card-preview-2">
                <div style="font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:8px;">Próxima partida</div>
                <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">⚽ Futebol Society</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);">📅 Domingo, 16h00</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);">📍 Arena Society Moema</div>
                <div style="margin-top:10px;"><span class="badge badge-success">✅ Aceito</span></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="landing-features">
          <div style="text-align:center;max-width:560px;margin:0 auto;">
            <div class="hero-eyebrow" style="margin:0 auto 16px;">Funcionalidades</div>
            <h2>Tudo que você precisa para <span style="color:var(--primary-light)">jogar</span></h2>
            <p style="margin-top:12px;font-size:0.95rem;">Da criação do seu perfil até a avaliação pós-partida, o SportMatch acompanha cada etapa da sua jornada esportiva.</p>
          </div>

          <div class="features-grid">
            ${[
              { icon: '👤', title: 'Perfil Esportivo', desc: 'Crie um perfil completo com seus esportes, níveis, pontos fortes e fracos para que outros usuários conheçam seu estilo de jogo.' },
              { icon: '⚽', title: 'Crie Partidas', desc: 'Organize sua própria partida definindo esporte, local, horário, nível desejado e muito mais. Você é o administrador.' },
              { icon: '🔍', title: 'Descubra Partidas', desc: 'Encontre partidas próximas compatíveis com seu esporte, nível e disponibilidade. Filtros avançados para facilitar a busca.' },
              { icon: '✅', title: 'Sistema de Aprovação', desc: 'Analise o perfil completo dos solicitantes antes de aceitar. Veja nível, pontos fortes, histórico e avaliações.' },
              { icon: '⭐', title: 'Avaliações e Reputação', desc: 'Após cada partida, avalie os participantes em duas dimensões: esportivo e comportamental. Construa sua reputação.' },
              { icon: '🔔', title: 'Notificações', desc: 'Receba notificações sobre solicitações aceitas, partidas próximas, novas mensagens e muito mais em tempo real.' }
            ].map(f => `
              <div class="feature-card">
                <div class="feature-icon-wrap">${f.icon}</div>
                <div class="feature-title">${f.title}</div>
                <p class="feature-desc">${f.desc}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Sports -->
        <section class="landing-sports">
          <div style="max-width:var(--container-max);margin:0 auto;">
            <div style="text-align:center;margin-bottom:8px;">
              <h2>Esportes disponíveis</h2>
              <p style="margin-top:8px;">Futebol, vôlei, basquete e muito mais. Todos num único lugar.</p>
            </div>
            <div class="sports-scroll">
              ${Store.SPORTS.map(s => `
                <div class="sport-pill">${s.icon} ${s.name}</div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Flow -->
        <section style="padding:var(--space-20) var(--space-8);max-width:800px;margin:0 auto;text-align:center;">
          <div class="hero-eyebrow" style="margin:0 auto 16px;">Como funciona</div>
          <h2>Simples do início ao fim</h2>
          <p style="margin-top:12px;margin-bottom:40px;">Em poucos passos você está jogando com pessoas novas.</p>

          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
            ${[
              { step: '01', icon: '👤', title: 'Crie seu perfil', desc: 'Informe seus esportes e nível' },
              { step: '02', icon: '🔍', title: 'Encontre uma partida', desc: 'Filtre por esporte, nível e local' },
              { step: '03', icon: '✋', title: 'Solicite participação', desc: 'O admin analisa seu perfil' },
              { step: '04', icon: '⭐', title: 'Jogue e avalie', desc: 'Construa sua reputação' }
            ].map(s => `
              <div style="padding:24px 16px;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-xl);">
                <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;color:var(--primary-light);margin-bottom:8px;">${s.step}</div>
                <div style="font-size:2rem;margin-bottom:8px;">${s.icon}</div>
                <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">${s.title}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">${s.desc}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- CTA -->
        <section style="padding:var(--space-16) var(--space-8);text-align:center;position:relative;overflow:hidden;">
          <div class="landing-cta-glow"></div>
          <div style="position:relative;z-index:1;max-width:560px;margin:0 auto;">
            <h2>Pronto para <span style="color:var(--accent-light);">jogar</span>?</h2>
            <p style="margin:16px 0 32px;">Crie sua conta gratuitamente e comece a encontrar pessoas para praticar seu esporte favorito hoje mesmo.</p>
            <button class="btn btn-primary btn-xl" onclick="Utils.navigate('#/register')">
              🚀 Criar conta gratuita
            </button>
            <div style="margin-top:16px;font-size:0.8rem;color:var(--text-muted);">Sem cartão de crédito • Totalmente gratuito</div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="nav-logo-icon" style="width:24px;height:24px;font-size:0.8rem;">⚡</div>
            <span style="font-weight:700;color:var(--text-secondary);">SportMatch</span>
          </div>
          <div>© 2026 SportMatch. Todos os direitos reservados.</div>
          <div style="display:flex;gap:16px;">
            <span style="cursor:pointer;">Privacidade</span>
            <span style="cursor:pointer;">Termos</span>
            <span style="cursor:pointer;">Contato</span>
          </div>
        </footer>
      </div>
    `;
  },

  afterRender() {
    // Scroll effect for nav
    const nav = document.getElementById('landing-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }, { passive: true });
    }
  }
};

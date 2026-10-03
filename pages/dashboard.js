/* ============================================================
   SPORTMATCH — DASHBOARD PAGE
   Main feed for logged in users
   ============================================================ */

const DashboardPage = {
  render() {
    const user = Auth.getCurrentUser();
    if (!user) { Utils.navigate('#/login'); return ''; }

    const firstName = user.name.split(' ')[0];
    const recommended = Matches.getRecommended(user.id, 6);
    const userSports = Store.getUserSportsByUserId(user.id);
    const myParticipations = Store.getUserRequests(user.id);
    const upcomingMatches = myParticipations
      .filter(p => p.status === 'accepted')
      .map(p => ({ p, match: Store.getMatchById(p.matchId) }))
      .filter(({ match }) => match && !Utils.isMatchPast(match))
      .slice(0, 3);
    const pendingCount = myParticipations.filter(p => p.status === 'pending').length;

    // Admin pending requests count
    const adminMatches = Store.getMatches().filter(m => m.creatorId === user.id);
    const adminPending = adminMatches.reduce((acc, m) => {
      return acc + Store.getMatchParticipants(m.id).filter(p => p.status === 'pending').length;
    }, 0);

    const stats = Store.getUserStats(user.id);
    const greetings = ['Bom jogo,', 'E aí,', 'Olá,', 'Bem-vindo,', 'Fala,'];
    const greeting = greetings[new Date().getHours() % greetings.length];

    return `
      <div class="main-content">
        <div class="dashboard-page">
          <!-- Welcome -->
          <div class="dashboard-welcome animate-fade-in">
            <div class="dashboard-welcome-glow"></div>
            <div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
              <div>
                <div class="dashboard-welcome-title">${greeting} ${Utils.esc(firstName)}! 👋</div>
                <div class="dashboard-welcome-sub">
                  ${userSports.length ? `Você pratica ${userSports.length} esporte${userSports.length > 1 ? 's' : ''}. Encontre uma partida hoje!` : 'Configure seu perfil esportivo para ver recomendações personalizadas.'}
                </div>
              </div>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="Utils.navigate('#/discover')">🔍 Encontrar partidas</button>
                <button class="btn btn-outline" onclick="Utils.navigate('#/match/create')">➕ Criar partida</button>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- Main column -->
            <div>
              <!-- Stats quick view -->
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">
                <div class="stat-card">
                  <div class="stat-label">Partidas realizadas</div>
                  <div class="stat-value">${stats.totalMatches}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Próximas partidas</div>
                  <div class="stat-value">${stats.upcomingMatches}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label">Avaliação média</div>
                  <div class="stat-value">${stats.ratings.count > 0 ? ((stats.ratings.sport + stats.ratings.behavior) / 2).toFixed(1) + ' ⭐' : '—'}</div>
                </div>
              </div>

              <!-- Pending alerts -->
              ${pendingCount > 0 ? `
                <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-lg);padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="Utils.navigate('#/discover')">
                  <span style="font-size:1.3rem;">⏳</span>
                  <div>
                    <div style="font-weight:600;font-size:0.9rem;">Você tem ${pendingCount} solicitação${pendingCount > 1 ? 'ões' : ''} pendente${pendingCount > 1 ? 's' : ''}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);">Aguardando aprovação dos administradores</div>
                  </div>
                </div>
              ` : ''}

              ${adminPending > 0 ? `
                <div style="background:rgba(108,99,255,0.06);border:1px solid rgba(108,99,255,0.2);border-radius:var(--radius-lg);padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="Utils.navigate('#/discover')">
                  <span style="font-size:1.3rem;">👥</span>
                  <div>
                    <div style="font-weight:600;font-size:0.9rem;">${adminPending} pessoa${adminPending > 1 ? 's' : ''} quer${adminPending > 1 ? 'em' : ''} entrar nas suas partidas</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);">Analise os perfis e aprove ou recuse</div>
                  </div>
                </div>
              ` : ''}

              <!-- Recommended matches -->
              <div class="section-header">
                <div class="section-title"><span class="icon">⭐</span> Partidas recomendadas</div>
                <a onclick="Utils.navigate('#/discover')" style="font-size:0.8rem;color:var(--primary-light);cursor:pointer;font-weight:600;">Ver todas →</a>
              </div>

              ${recommended.length ? `
                <div class="matches-grid">
                  ${recommended.map(m => this._renderMatchCard(m, user.id)).join('')}
                </div>
              ` : `
                <div class="empty-state">
                  <div class="empty-state-icon">🔍</div>
                  <div class="empty-state-title">Sem recomendações ainda</div>
                  <div class="empty-state-desc">
                    ${userSports.length ? 'Nenhuma partida compatível disponível. Tente criar a sua!' : 'Configure seu perfil esportivo para ver recomendações.'}
                  </div>
                  <button class="btn btn-primary mt-4" onclick="Utils.navigate('${userSports.length ? '#/match/create' : '#/profile'}')">
                    ${userSports.length ? '➕ Criar partida' : '👤 Configurar perfil'}
                  </button>
                </div>
              `}

              <!-- All upcoming public matches -->
              <div class="section-header mt-8">
                <div class="section-title"><span class="icon">🗓️</span> Partidas próximas</div>
                <a onclick="Utils.navigate('#/discover')" style="font-size:0.8rem;color:var(--primary-light);cursor:pointer;font-weight:600;">Ver todas →</a>
              </div>
              <div class="matches-grid">
                ${Matches.search({ upcoming: true, isPublic: true }).slice(0, 3).map(m => this._renderMatchCard(m, user.id)).join('')}
              </div>
            </div>

            <!-- Sidebar -->
            <div style="display:flex;flex-direction:column;gap:16px;">
              <!-- Quick profile -->
              <div class="sidebar-card">
                <div class="sidebar-card-header">
                  Meu perfil
                  <a onclick="Utils.navigate('#/profile')" style="font-size:0.78rem;color:var(--primary-light);cursor:pointer;">Editar</a>
                </div>
                <div style="padding:16px;">
                  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                    ${Utils.renderAvatar(user, 'avatar-lg')}
                    <div>
                      <div style="font-weight:700;">${Utils.esc(user.name)}</div>
                      <div style="font-size:0.78rem;color:var(--text-muted);">📍 ${Utils.esc(user.city || 'Sem localização')}</div>
                    </div>
                  </div>
                  ${userSports.length ? `
                    <div class="tags-wrap">
                      ${userSports.slice(0, 4).map(us => `
                        <span class="badge badge-primary">${Store.getSportIcon(us.sportId)} ${Store.getSportName(us.sportId)}</span>
                      `).join('')}
                    </div>
                  ` : `
                    <button class="btn btn-outline btn-sm btn-full" onclick="Utils.navigate('#/profile')">Adicionar esportes</button>
                  `}
                </div>
              </div>

              <!-- My upcoming matches -->
              <div class="sidebar-card">
                <div class="sidebar-card-header">
                  Minhas partidas
                  <a onclick="Utils.navigate('#/discover')" style="font-size:0.78rem;color:var(--primary-light);cursor:pointer;">Ver histórico</a>
                </div>
                <div>
                  ${upcomingMatches.length ? upcomingMatches.map(({ match }) => `
                    <div style="padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;" onclick="Utils.navigate('#/match/${match.id}')">
                      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                        <span>${Store.getSportIcon(match.sportId)}</span>
                        <span style="font-weight:600;font-size:0.875rem;">${Utils.esc(match.title)}</span>
                      </div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">
                        📅 ${Utils.formatDate(match.date)} às ${Utils.formatTime(match.time)}
                      </div>
                    </div>
                  `).join('') : `
                    <div style="padding:24px 16px;text-align:center;">
                      <div style="font-size:2rem;margin-bottom:8px;opacity:0.4;">🏃</div>
                      <div style="font-size:0.8rem;color:var(--text-muted);">Nenhuma partida próxima</div>
                      <button class="btn btn-outline btn-sm mt-3" onclick="Utils.navigate('#/discover')">Encontrar partidas</button>
                    </div>
                  `}
                </div>
              </div>

              <!-- Quick actions -->
              <div class="sidebar-card">
                <div class="sidebar-card-header">Ações rápidas</div>
                <div style="padding:12px;display:flex;flex-direction:column;gap:8px;">
                  <button class="btn btn-outline btn-sm" onclick="Utils.navigate('#/match/create')" style="justify-content:flex-start;gap:8px;">
                    ➕ Criar nova partida
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="Utils.navigate('#/discover')" style="justify-content:flex-start;gap:8px;">
                    🔍 Descobrir partidas
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="Utils.navigate('#/profile')" style="justify-content:flex-start;gap:8px;">
                    ✏️ Editar meu perfil
                  </button>
                  ${user.isAdmin ? `
                    <button class="btn btn-outline btn-sm" onclick="Utils.navigate('#/admin')" style="justify-content:flex-start;gap:8px;color:var(--warning);">
                      🛡️ Painel Admin
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        ${App.renderMobileNav('dashboard')}
      </div>
    `;
  },

  _renderMatchCard(match, currentUserId) {
    const sport = Store.getSportById(match.sportId);
    const participants = Store.getMatchParticipants(match.id);
    const accepted = participants.filter(p => p.status === 'accepted');
    const slotsLeft = match.maxParticipants - accepted.length;
    const gradient = Utils.sportGradient(match.sportId);
    const isPast = Utils.isMatchPast(match);

    return `
      <div class="match-card" onclick="Utils.navigate('#/match/${match.id}')">
        <div class="match-card-banner" style="background:${gradient};"></div>
        <div class="match-card-body">
          <div class="match-card-sport">${sport?.icon || '🏅'} ${sport?.name || match.sportId}</div>
          <div class="match-card-title">${Utils.esc(match.title)}</div>
          <div class="match-card-meta">
            <div class="match-meta-item"><span class="icon">📅</span>${Utils.formatDate(match.date)} às ${Utils.formatTime(match.time)}</div>
            <div class="match-meta-item"><span class="icon">📍</span>${Utils.esc(match.city)}</div>
            <div class="match-meta-item"><span class="icon">📊</span>${Utils.levelLabel(match.level)}</div>
          </div>
        </div>
        <div class="match-card-footer">
          <div class="flex items-center gap-2">
            ${Utils.renderStatusBadge(isPast ? 'completed' : match.status)}
            ${match.requiresApproval ? '<span class="badge badge-muted">Com aprovação</span>' : ''}
          </div>
          <div style="font-size:0.78rem;color:${slotsLeft <= 2 ? 'var(--warning)' : 'var(--text-muted)'};">
            ${isPast ? `${accepted.length} participante${accepted.length !== 1 ? 's' : ''}` : `${slotsLeft} vaga${slotsLeft !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {}
};

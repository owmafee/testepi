/* ============================================================
   SPORTMATCH — DISCOVER PAGE
   Search and browse matches
   ============================================================ */

const DiscoverPage = {
  _filters: { sportId: '', city: '', level: '', status: 'open', query: '' },

  render() {
    const user = Auth.getCurrentUser();
    if (!user) { Utils.navigate('#/login'); return ''; }

    this._filters = { sportId: '', city: '', level: '', status: '', query: '' };
    const allMatches = Matches.search({ upcoming: true, isPublic: true });

    return `
      <div class="main-content">
        <div class="discover-page">
          <div class="discover-header">
            <h1 style="font-family:var(--font-head);font-size:1.75rem;font-weight:800;margin-bottom:4px;">Descobrir partidas</h1>
            <p style="color:var(--text-secondary);">Encontre partidas próximas compatíveis com seu perfil e nível.</p>
          </div>

          <!-- Filters -->
          <div class="discover-filters">
            <div class="filter-group" style="flex:2;min-width:200px;">
              <div class="filter-label">🔍 Buscar</div>
              <div class="input-group">
                <span class="input-group-icon">🔍</span>
                <input type="text" id="filter-query" class="input" placeholder="Esporte, local, cidade..." oninput="DiscoverPage.applyFilters()" />
              </div>
            </div>

            <div class="filter-group">
              <div class="filter-label">⚽ Esporte</div>
              <select id="filter-sport" class="select" onchange="DiscoverPage.applyFilters()">
                <option value="">Todos</option>
                ${Store.SPORTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="filter-group">
              <div class="filter-label">📊 Nível</div>
              <select id="filter-level" class="select" onchange="DiscoverPage.applyFilters()">
                <option value="">Todos</option>
                ${Store.LEVELS.map(l => `<option value="${l.value}">${l.label}</option>`).join('')}
              </select>
            </div>

            <div class="filter-group">
              <div class="filter-label">📍 Cidade</div>
              <input type="text" id="filter-city" class="input" placeholder="São Paulo, SP..." oninput="DiscoverPage.applyFilters()" style="min-width:130px;" />
            </div>

            <div class="filter-group">
              <div class="filter-label">Status</div>
              <select id="filter-status" class="select" onchange="DiscoverPage.applyFilters()">
                <option value="">Todos</option>
                <option value="open" selected>Abertas</option>
                <option value="full">Lotadas</option>
              </select>
            </div>

            <button class="btn btn-ghost btn-sm" onclick="DiscoverPage.clearFilters()" style="margin-top:18px;">✕ Limpar</button>
          </div>

          <!-- My matches section -->
          ${this._renderMyMatchesSection(user)}

          <!-- Results -->
          <div class="discover-results-header">
            <div class="section-title"><span class="icon">🗓️</span> Partidas disponíveis</div>
            <div class="results-count" id="results-count">${allMatches.length} partida${allMatches.length !== 1 ? 's' : ''}</div>
          </div>

          <div id="matches-results" class="matches-grid">
            ${allMatches.map(m => this._renderMatchCard(m, user.id)).join('')}
          </div>

          ${!allMatches.length ? `
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">Nenhuma partida encontrada</div>
              <div class="empty-state-desc">Tente outros filtros ou crie sua própria partida!</div>
              <button class="btn btn-primary mt-4" onclick="Utils.navigate('#/match/create')">➕ Criar partida</button>
            </div>
          ` : ''}
        </div>
        ${App.renderMobileNav('discover')}
      </div>
    `;
  },

  _renderMyMatchesSection(user) {
    const myParticipations = Store.getUserRequests(user.id);
    const pending = myParticipations.filter(p => p.status === 'pending');
    const upcoming = myParticipations
      .filter(p => p.status === 'accepted')
      .map(p => ({ p, match: Store.getMatchById(p.matchId) }))
      .filter(({ match }) => match && !Utils.isMatchPast(match));

    // Admin requests to manage
    const myAdminMatches = Store.getMatches().filter(m => m.creatorId === user.id && !Utils.isMatchPast(m));
    const pendingRequests = myAdminMatches.flatMap(m =>
      Store.getMatchParticipants(m.id).filter(p => p.status === 'pending').map(p => ({ p, match: m }))
    );

    if (!pending.length && !upcoming.length && !pendingRequests.length) return '';

    return `
      <div style="margin-bottom:32px;">
        ${pendingRequests.length > 0 ? `
          <div class="section-header mb-4">
            <div class="section-title"><span class="icon">👥</span> Solicitações para aprovar</div>
            <span class="badge badge-warning">${pendingRequests.length}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
            ${pendingRequests.slice(0, 3).map(({ p, match }) => {
              const requester = Store.getUserById(p.userId);
              const userSport = Store.getUserSportsByUserId(p.userId).find(us => us.sportId === match.sportId);
              return `
                <div class="request-card">
                  <div class="request-card-header">
                    ${Utils.renderAvatar(requester, 'avatar-md')}
                    <div class="flex-1">
                      <div style="font-weight:700;">${Utils.esc(requester?.name || 'Usuário')}</div>
                      <div style="font-size:0.78rem;color:var(--text-muted);">Quer entrar em: ${Utils.esc(match.title)}</div>
                      ${userSport ? `<div class="mt-1">${Utils.renderLevelBadge(userSport.level)}</div>` : ''}
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${Utils.timeAgo(p.joinedAt)}</div>
                  </div>
                  ${userSport?.strengths?.length ? `
                    <div class="request-card-body">
                      <div class="tags-wrap">
                        ${userSport.strengths.slice(0, 3).map(s => `<span class="tag tag-strength">💪 ${Utils.esc(s)}</span>`).join('')}
                        ${userSport.weaknesses?.slice(0, 2).map(w => `<span class="tag tag-weakness">📉 ${Utils.esc(w)}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                  <div class="request-card-footer">
                    <button class="btn btn-ghost btn-sm" onclick="DiscoverPage.viewProfile('${p.userId}', '${match.sportId}')">Ver perfil</button>
                    <button class="btn btn-danger btn-sm" onclick="DiscoverPage.handleRequest('${match.id}', '${p.userId}', 'decline', '${user.id}')">✕ Recusar</button>
                    <button class="btn btn-success btn-sm" onclick="DiscoverPage.handleRequest('${match.id}', '${p.userId}', 'accept', '${user.id}')">✓ Aceitar</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${upcoming.length > 0 ? `
          <div class="section-header mb-4">
            <div class="section-title"><span class="icon">✅</span> Minhas próximas partidas</div>
          </div>
          <div class="matches-grid" style="margin-bottom:24px;">
            ${upcoming.slice(0, 3).map(({ match }) => this._renderMatchCard(match, user.id)).join('')}
          </div>
        ` : ''}

        ${pending.length > 0 ? `
          <div class="section-header mb-4">
            <div class="section-title"><span class="icon">⏳</span> Aguardando aprovação</div>
          </div>
          <div class="matches-grid" style="margin-bottom:24px;">
            ${pending.map(({ matchId }) => {
              const match = Store.getMatchById(matchId);
              return match ? this._renderMatchCard(match, user.id) : '';
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  applyFilters() {
    this._filters.query = document.getElementById('filter-query')?.value || '';
    this._filters.sportId = document.getElementById('filter-sport')?.value || '';
    this._filters.level = document.getElementById('filter-level')?.value || '';
    this._filters.city = document.getElementById('filter-city')?.value || '';
    this._filters.status = document.getElementById('filter-status')?.value || '';

    const user = Auth.getCurrentUser();
    const results = Matches.search({ ...this._filters, upcoming: !this._filters.status, isPublic: true });

    const container = document.getElementById('matches-results');
    const count = document.getElementById('results-count');

    if (container) container.innerHTML = results.length
      ? results.map(m => this._renderMatchCard(m, user?.id)).join('')
      : `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Nenhuma partida encontrada</div><div class="empty-state-desc">Tente outros filtros.</div></div>`;

    if (count) count.textContent = `${results.length} partida${results.length !== 1 ? 's' : ''}`;
  },

  clearFilters() {
    ['filter-query', 'filter-city'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['filter-sport', 'filter-level', 'filter-status'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    this.applyFilters();
  },

  handleRequest(matchId, userId, action, adminId) {
    const result = Matches.handleRequest(matchId, userId, action, adminId);
    if (result.success) {
      Utils.toast('success', action === 'accept' ? 'Participante aceito!' : 'Solicitação recusada', '');
      App.renderPage();
    } else {
      Utils.toast('error', 'Erro', result.error);
    }
  },

  viewProfile(userId, sportId) {
    const content = `
      <div class="modal-header">
        <h3 class="modal-title">Perfil do jogador</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        ${Profiles.renderMiniProfile(userId, sportId)}
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Fechar</button>
        <button class="btn btn-primary" onclick="Utils.closeModal();Utils.navigate('#/profile/${userId}')">Ver perfil completo</button>
      </div>
    `;
    Utils.showModal(content);
  },

  _renderMatchCard(match, currentUserId) {
    const sport = Store.getSportById(match.sportId);
    const participants = Store.getMatchParticipants(match.id);
    const accepted = participants.filter(p => p.status === 'accepted');
    const slotsLeft = match.maxParticipants - accepted.length;
    const gradient = Utils.sportGradient(match.sportId);
    const isPast = Utils.isMatchPast(match);
    const myStatus = currentUserId ? Store.getUserParticipation(match.id, currentUserId) : null;

    return `
      <div class="match-card" onclick="Utils.navigate('#/match/${match.id}')">
        <div class="match-card-banner" style="background:${gradient};"></div>
        <div class="match-card-body">
          <div class="flex items-center justify-between mb-2">
            <div class="match-card-sport">${sport?.icon || '🏅'} ${sport?.name || match.sportId}</div>
            ${myStatus ? Utils.renderStatusBadge(myStatus.status) : ''}
          </div>
          <div class="match-card-title">${Utils.esc(match.title)}</div>
          <div class="match-card-meta">
            <div class="match-meta-item"><span class="icon">📅</span>${Utils.formatDate(match.date)} às ${Utils.formatTime(match.time)}</div>
            <div class="match-meta-item"><span class="icon">📍</span>${Utils.esc(match.city)}</div>
            <div class="match-meta-item"><span class="icon">📊</span>${Utils.levelLabel(match.level)}</div>
            <div class="match-meta-item"><span class="icon">👥</span>${accepted.length}/${match.maxParticipants} participantes</div>
          </div>
        </div>
        <div class="match-card-footer">
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${Utils.renderStatusBadge(isPast ? 'completed' : match.status)}
            ${match.requiresApproval ? '<span class="badge badge-muted" title="Requer aprovação">🔑</span>' : '<span class="badge badge-accent" title="Entrada livre">🟢</span>'}
          </div>
          <div style="font-size:0.78rem;color:${slotsLeft <= 2 && !isPast ? 'var(--warning)' : 'var(--text-muted)'};">
            ${isPast ? 'Encerrada' : slotsLeft <= 0 ? 'Lotada' : `${slotsLeft} vaga${slotsLeft !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {}
};

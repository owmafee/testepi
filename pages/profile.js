/* ============================================================
   SPORTMATCH — PROFILE PAGE
   ============================================================ */

const ProfilePage = {
  _userId: null,
  _activeTab: 'sports',

  render(params) {
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) { Utils.navigate('#/login'); return ''; }

    this._userId = params?.id || currentUser.id;
    this._activeTab = 'sports';

    const profile = Profiles.getFullProfile(this._userId);
    if (!profile) {
      return `<div class="main-content"><div style="text-align:center;padding:80px 24px;"><h2>Usuário não encontrado</h2><button class="btn btn-primary mt-6" onclick="history.back()">← Voltar</button></div></div>`;
    }

    const isOwnProfile = this._userId === currentUser.id;

    return `
      <div class="main-content">
        <div class="profile-page">
          <!-- Back -->
          <button class="btn btn-ghost mb-4" onclick="history.back()">← Voltar</button>

          <!-- Profile header -->
          <div class="profile-header-card animate-fade-in">
            <div class="profile-banner">
              <div class="profile-banner-overlay"></div>
              <div class="profile-banner-glow"></div>
              <!-- Sport icons on banner -->
              <div style="position:absolute;right:24px;top:50%;transform:translateY(-50%);display:flex;gap:8px;opacity:0.6;">
                ${profile.userSports.slice(0, 4).map(us => `<span style="font-size:1.75rem;">${Store.getSportIcon(us.sportId)}</span>`).join('')}
              </div>
            </div>

            <div class="profile-info-area">
              <div class="profile-avatar-wrapper">
                <div class="profile-avatar-border">
                  <div class="profile-avatar-inner" style="background:${this._getAvatarBg(profile.name)};">
                    ${profile.avatar ? `<img src="${Utils.esc(profile.avatar)}" alt="${Utils.esc(profile.name)}" />` : `<span style="font-size:2.5rem;font-weight:800;color:#fff;">${Utils.getInitials(profile.name)}</span>`}
                  </div>
                </div>
                ${profile.isVerified ? `<div class="profile-verified">✓</div>` : ''}
              </div>

              <div class="profile-main-info">
                <div class="profile-name">
                  ${Utils.esc(profile.name)}
                  ${profile.isAdmin ? '<span style="background:rgba(245,158,11,0.1);color:#fbbf24;font-size:0.7rem;padding:2px 8px;border-radius:4px;margin-left:8px;font-weight:600;">Admin</span>' : ''}
                </div>
                <div class="profile-location">
                  <span>📍</span>
                  ${Utils.esc(profile.city || 'Sem localização')}
                </div>
                ${profile.bio ? `<p class="profile-bio">${Utils.esc(profile.bio)}</p>` : ''}
                ${profile.profession || profile.hobbies ? `
                  <div style="display:flex;gap:16px;margin-top:8px;flex-wrap:wrap;">
                    ${profile.profession ? `<span style="font-size:0.8rem;color:var(--text-muted);">💼 ${Utils.esc(profile.profession)}</span>` : ''}
                    ${profile.hobbies ? `<span style="font-size:0.8rem;color:var(--text-muted);">🎯 ${Utils.esc(profile.hobbies)}</span>` : ''}
                  </div>
                ` : ''}
              </div>

              <div style="flex-shrink:0;display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
                ${isOwnProfile ? `
                  <button class="btn btn-outline btn-sm" onclick="ProfilePage.openEditModal()">✏️ Editar perfil</button>
                ` : `
                  <button class="btn btn-outline btn-sm" onclick="ProfilePage.reportUser()">⚠️ Denunciar</button>
                `}
              </div>
            </div>

            <!-- Stats row -->
            <div class="profile-stats-row">
              <div class="profile-stat">
                <div class="profile-stat-value">${profile.stats.totalMatches}</div>
                <div class="profile-stat-label">Partidas</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${profile.stats.upcomingMatches}</div>
                <div class="profile-stat-label">Próximas</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${profile.stats.ratings.count > 0 ? profile.stats.ratings.sport.toFixed(1) + ' ⭐' : '—'}</div>
                <div class="profile-stat-label">Esportivo</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${profile.stats.ratings.count > 0 ? profile.stats.ratings.behavior.toFixed(1) + ' ⭐' : '—'}</div>
                <div class="profile-stat-label">Comportamento</div>
              </div>
              ${profile.stats.attendanceRate !== null ? `
              <div class="profile-stat">
                <div class="profile-stat-value">${profile.stats.attendanceRate}%</div>
                <div class="profile-stat-label">Presença</div>
              </div>
              ` : ''}
              <div class="profile-stat">
                <div class="profile-stat-value">${profile.stats.ratings.count}</div>
                <div class="profile-stat-label">Avaliações</div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="card">
            <div class="profile-tabs">
              <div class="profile-tab active" id="tab-sports" onclick="ProfilePage.switchTab('sports')">⚽ Esportes</div>
              <div class="profile-tab" id="tab-reviews" onclick="ProfilePage.switchTab('reviews')">⭐ Avaliações</div>
              <div class="profile-tab" id="tab-history" onclick="ProfilePage.switchTab('history')">🏆 Histórico</div>
              ${isOwnProfile ? `<div class="profile-tab" id="tab-settings" onclick="ProfilePage.switchTab('settings')">⚙️ Configurações</div>` : ''}
            </div>

            <div id="tab-content" style="padding:24px;">
              ${this._renderSportsTab(profile)}
            </div>
          </div>
        </div>
        ${App.renderMobileNav('profile')}
      </div>
    `;
  },

  _getAvatarBg(name) {
    const colors = ['#6c63ff','#00d4aa','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#10b981'];
    return colors[(name || '').charCodeAt(0) % colors.length];
  },

  switchTab(tab) {
    this._activeTab = tab;
    ['sports','reviews','history','settings'].forEach(t => {
      const el = document.getElementById(`tab-${t}`);
      if (el) el.classList.toggle('active', t === tab);
    });
    const profile = Profiles.getFullProfile(this._userId);
    const content = document.getElementById('tab-content');
    if (!content || !profile) return;

    let html = '';
    if (tab === 'sports') html = this._renderSportsTab(profile);
    else if (tab === 'reviews') html = this._renderReviewsTab(profile);
    else if (tab === 'history') html = this._renderHistoryTab(profile);
    else if (tab === 'settings') html = this._renderSettingsTab(profile);

    content.innerHTML = html;
  },

  _renderSportsTab(profile) {
    if (!profile.userSports.length) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">⚽</div>
          <div class="empty-state-title">Nenhum esporte cadastrado</div>
          <div class="empty-state-desc">Adicione os esportes que você pratica para aparecer em partidas compatíveis.</div>
          ${this._userId === Auth.getCurrentUser()?.id ? `<button class="btn btn-primary mt-4" onclick="ProfilePage.openAddSportModal()">+ Adicionar esporte</button>` : ''}
        </div>
      `;
    }

    return `
      ${this._userId === Auth.getCurrentUser()?.id ? `
        <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
          <button class="btn btn-outline btn-sm" onclick="ProfilePage.openAddSportModal()">+ Adicionar esporte</button>
        </div>
      ` : ''}
      ${profile.userSports.map(us => {
        const sport = Store.getSportById(us.sportId);
        return `
          <div class="profile-sport-card">
            <div class="profile-sport-header">
              <span class="profile-sport-icon">${sport?.icon || '🏅'}</span>
              <div>
                <div class="profile-sport-name">${sport?.name || us.sportId}</div>
              </div>
              ${Utils.renderLevelBadge(us.level)}
              ${this._userId === Auth.getCurrentUser()?.id ? `
                <div style="margin-left:auto;display:flex;gap:4px;">
                  <button class="btn btn-ghost btn-sm" onclick="ProfilePage.editSport('${us.sportId}')">✏️</button>
                  <button class="btn btn-ghost btn-sm" onclick="ProfilePage.removeSport('${us.sportId}')">🗑️</button>
                </div>
              ` : ''}
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div>
                <div class="review-section-title" style="margin-bottom:8px;">Pontos fortes</div>
                ${us.strengths?.length ? `
                  <div class="tags-wrap">
                    ${us.strengths.map(s => `<span class="tag tag-strength">💪 ${Utils.esc(s)}</span>`).join('')}
                  </div>
                ` : '<span class="text-muted" style="font-size:0.8rem;">Não informado</span>'}
              </div>
              <div>
                <div class="review-section-title" style="margin-bottom:8px;">Pontos fracos</div>
                ${us.weaknesses?.length ? `
                  <div class="tags-wrap">
                    ${us.weaknesses.map(w => `<span class="tag tag-weakness">📉 ${Utils.esc(w)}</span>`).join('')}
                  </div>
                ` : '<span class="text-muted" style="font-size:0.8rem;">Não informado</span>'}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  },

  _renderReviewsTab(profile) {
    if (!profile.reviews.length) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">⭐</div>
          <div class="empty-state-title">Sem avaliações</div>
          <div class="empty-state-desc">Participe de partidas para receber avaliações de outros jogadores.</div>
        </div>
      `;
    }

    const avgSport = profile.ratings.sport.toFixed(1);
    const avgBehavior = profile.ratings.behavior.toFixed(1);

    return `
      <!-- Rating summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        <div class="rep-card">
          <span class="rep-icon">⚽</span>
          <div class="rep-info">
            <div class="rep-label">Nível esportivo</div>
            <div class="rep-value">${avgSport} <span class="rep-stars">★</span></div>
          </div>
        </div>
        <div class="rep-card">
          <span class="rep-icon">🤝</span>
          <div class="rep-info">
            <div class="rep-label">Comportamento</div>
            <div class="rep-value">${avgBehavior} <span class="rep-stars">★</span></div>
          </div>
        </div>
      </div>

      <!-- Individual reviews -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${profile.reviews.map(review => {
          const reviewer = Store.getUserById(review.reviewerId);
          return `
            <div style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                ${Utils.renderAvatar(reviewer, 'avatar-sm')}
                <div style="flex:1;">
                  <div style="font-weight:600;font-size:0.875rem;">${Utils.esc(reviewer?.name || 'Usuário anônimo')}</div>
                  <div style="font-size:0.72rem;color:var(--text-muted);">${Utils.timeAgo(review.createdAt)}</div>
                </div>
                <div style="display:flex;gap:12px;">
                  <div style="text-align:center;">
                    <div style="font-size:0.65rem;color:var(--text-muted);">Esporte</div>
                    <div style="font-weight:700;color:#fbbf24;">★ ${review.sportRating}</div>
                  </div>
                  <div style="text-align:center;">
                    <div style="font-size:0.65rem;color:var(--text-muted);">Comportamento</div>
                    <div style="font-weight:700;color:#fbbf24;">★ ${review.behaviorRating}</div>
                  </div>
                </div>
              </div>
              ${review.comment ? `<p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">"${Utils.esc(review.comment)}"</p>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  _renderHistoryTab(profile) {
    const participations = Store.getUserRequests(this._userId).filter(p => p.status === 'accepted');
    const matches = participations.map(p => Store.getMatchById(p.matchId)).filter(Boolean);
    const past = matches.filter(m => Utils.isMatchPast(m));
    const upcoming = matches.filter(m => !Utils.isMatchPast(m));

    if (!matches.length) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">🏆</div>
          <div class="empty-state-title">Sem histórico ainda</div>
          <div class="empty-state-desc">Participe de partidas para construir seu histórico.</div>
          <button class="btn btn-primary mt-4" onclick="Utils.navigate('#/discover')">🔍 Encontrar partidas</button>
        </div>
      `;
    }

    const renderMatchRow = (match) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:var(--radius-md);cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''" onclick="Utils.navigate('#/match/${match.id}')">
        <div style="font-size:1.5rem;">${Store.getSportIcon(match.sportId)}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${Utils.esc(match.title)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">${Utils.formatDate(match.date)} · ${Utils.esc(match.city)}</div>
        </div>
        ${Utils.renderLevelBadge(match.level)}
        ${Utils.renderStatusBadge(Utils.isMatchPast(match) ? 'completed' : match.status)}
      </div>
    `;

    return `
      ${upcoming.length ? `
        <div class="section-header mb-3"><div class="section-title">🗓️ Próximas partidas</div></div>
        ${upcoming.map(renderMatchRow).join('')}
        <div style="margin-bottom:24px;"></div>
      ` : ''}
      ${past.length ? `
        <div class="section-header mb-3"><div class="section-title">🏆 Partidas realizadas</div></div>
        ${past.map(renderMatchRow).join('')}
      ` : ''}
    `;
  },

  _renderSettingsTab(profile) {
    return `
      <div style="max-width:500px;">
        <h4 style="margin-bottom:20px;">Editar informações pessoais</h4>
        <form onsubmit="ProfilePage.saveProfile(event)">
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="form-group">
              <label class="form-label" for="edit-name">Nome</label>
              <input type="text" id="edit-name" class="input" value="${Utils.esc(profile.name)}" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-city">Cidade/Região</label>
              <input type="text" id="edit-city" class="input" value="${Utils.esc(profile.city || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-bio">Biografia</label>
              <textarea id="edit-bio" class="textarea" rows="3">${Utils.esc(profile.bio || '')}</textarea>
            </div>
            <div class="create-form-grid">
              <div class="form-group">
                <label class="form-label" for="edit-prof">Profissão</label>
                <input type="text" id="edit-prof" class="input" value="${Utils.esc(profile.profession || '')}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-hobb">Hobbies</label>
                <input type="text" id="edit-hobb" class="input" value="${Utils.esc(profile.hobbies || '')}" />
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;">
              <button type="submit" class="btn btn-primary">💾 Salvar alterações</button>
            </div>
          </div>
        </form>

        <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--border);">
          <h4 style="margin-bottom:16px;color:var(--danger);">Zona de perigo</h4>
          <button class="btn btn-danger btn-sm" onclick="ProfilePage.confirmLogout()">🚪 Sair da conta</button>
        </div>
      </div>
    `;
  },

  saveProfile(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    Store.updateUser(user.id, {
      name: document.getElementById('edit-name').value,
      city: document.getElementById('edit-city').value,
      bio: document.getElementById('edit-bio').value,
      profession: document.getElementById('edit-prof')?.value || '',
      hobbies: document.getElementById('edit-hobb')?.value || ''
    });
    Utils.toast('success', 'Perfil atualizado!', '');
    App.updateNav();
  },

  confirmLogout() {
    Utils.confirm('Sair da conta', 'Tem certeza que deseja sair?', () => Auth.logout(), 'Sair', true);
  },

  openAddSportModal() {
    const profile = Profiles.getFullProfile(this._userId);
    const existingSportIds = profile?.userSports.map(us => us.sportId) || [];
    const availableSports = Store.SPORTS.filter(s => !existingSportIds.includes(s.id));

    if (!availableSports.length) {
      Utils.toast('info', 'Todos os esportes já foram adicionados');
      return;
    }

    let selectedSportId = null;
    let selectedLevel = 3;

    const content = `
      <div class="modal-header">
        <h3 class="modal-title">Adicionar esporte</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-4">
          <label class="form-label">Esporte</label>
          <div class="sports-grid" style="grid-template-columns:repeat(auto-fill,minmax(80px,1fr));">
            ${availableSports.map(s => `
              <div class="sport-icon-card" id="add-sport-${s.id}" onclick="ProfilePage._selectAddSport('${s.id}')">
                <span class="icon">${s.icon}</span>
                <span class="name">${s.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Seu nível</label>
          <div class="level-buttons">
            ${Store.LEVELS.map(l => `
              <button type="button" class="level-btn ${l.value === 3 ? 'active' : ''}" id="add-lvl-${l.value}" onclick="ProfilePage._selectAddLevel(${l.value})">${l.label}</button>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="ProfilePage._saveAddSport()">Adicionar</button>
      </div>
    `;
    this._addSportId = null;
    this._addSportLevel = 3;
    Utils.showModal(content);
  },

  _addSportId: null,
  _addSportLevel: 3,

  _selectAddSport(sportId) {
    this._addSportId = sportId;
    document.querySelectorAll('[id^="add-sport-"]').forEach(el => el.classList.remove('selected'));
    document.getElementById(`add-sport-${sportId}`)?.classList.add('selected');
  },

  _selectAddLevel(level) {
    this._addSportLevel = level;
    Store.LEVELS.forEach(l => {
      document.getElementById(`add-lvl-${l.value}`)?.classList.toggle('active', l.value === level);
    });
  },

  _saveAddSport() {
    if (!this._addSportId) { Utils.toast('warning', 'Selecione um esporte'); return; }
    const user = Auth.getCurrentUser();
    Store.saveUserSport(user.id, this._addSportId, this._addSportLevel, [], []);
    Utils.toast('success', 'Esporte adicionado!', 'Agora adicione seus pontos fortes e fracos.');
    Utils.closeModal();
    App.renderPage();
  },

  editSport(sportId) {
    const profile = Profiles.getFullProfile(this._userId);
    const us = profile?.userSports.find(s => s.sportId === sportId);
    if (!us) return;

    const sport = Store.getSportById(sportId);
    const strengths = Store.STRENGTHS_BY_SPORT[sportId] || Store.STRENGTHS_BY_SPORT.other;
    const weaknesses = Store.WEAKNESSES_BY_SPORT[sportId] || Store.WEAKNESSES_BY_SPORT.other;

    this._editStrengths = [...(us.strengths || [])];
    this._editWeaknesses = [...(us.weaknesses || [])];
    this._editLevel = us.level;

    const content = `
      <div class="modal-header">
        <h3 class="modal-title">${sport?.icon} Editar ${sport?.name}</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-4">
          <label class="form-label">Nível</label>
          <div class="level-buttons">
            ${Store.LEVELS.map(l => `<button type="button" class="level-btn ${l.value === us.level ? 'active' : ''}" id="edit-lvl-${l.value}" onclick="ProfilePage._setEditLevel(${l.value})">${l.label}</button>`).join('')}
          </div>
        </div>
        <div class="mb-4">
          <div class="review-section-title mb-2">Pontos fortes (máx. 5)</div>
          <div class="tags-wrap">
            ${strengths.map(s => `<span class="tag tag-selectable ${us.strengths?.includes(s) ? 'selected' : ''}" id="es-${sportId}-${s.replace(/\s/g,'_')}" onclick="ProfilePage._toggleEditStrength('${s}')">${s}</span>`).join('')}
          </div>
        </div>
        <div>
          <div class="review-section-title mb-2">Pontos fracos (máx. 5)</div>
          <div class="tags-wrap">
            ${weaknesses.map(w => `<span class="tag tag-selectable ${us.weaknesses?.includes(w) ? 'selected' : ''}" id="ew-${sportId}-${w.replace(/\s/g,'_')}" onclick="ProfilePage._toggleEditWeakness('${w}')">${w}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="ProfilePage._saveEditSport('${sportId}')">💾 Salvar</button>
      </div>
    `;
    Utils.showModal(content);
  },

  _editStrengths: [], _editWeaknesses: [], _editLevel: 3,

  _setEditLevel(level) {
    this._editLevel = level;
    Store.LEVELS.forEach(l => document.getElementById(`edit-lvl-${l.value}`)?.classList.toggle('active', l.value === level));
  },

  _toggleEditStrength(s) {
    const idx = this._editStrengths.indexOf(s);
    if (idx === -1) {
      if (this._editStrengths.length >= 5) { Utils.toast('warning', 'Máximo de 5'); return; }
      this._editStrengths.push(s);
    } else this._editStrengths.splice(idx, 1);
  },

  _toggleEditWeakness(w) {
    const idx = this._editWeaknesses.indexOf(w);
    if (idx === -1) {
      if (this._editWeaknesses.length >= 5) { Utils.toast('warning', 'Máximo de 5'); return; }
      this._editWeaknesses.push(w);
    } else this._editWeaknesses.splice(idx, 1);
  },

  _saveEditSport(sportId) {
    const user = Auth.getCurrentUser();
    Store.saveUserSport(user.id, sportId, this._editLevel, this._editStrengths, this._editWeaknesses);
    Utils.toast('success', 'Esporte atualizado!', '');
    Utils.closeModal();
    this.switchTab('sports');
  },

  removeSport(sportId) {
    const sport = Store.getSportById(sportId);
    Utils.confirm(`Remover ${sport?.name}`, 'Tem certeza que deseja remover este esporte do seu perfil?', () => {
      const user = Auth.getCurrentUser();
      Store.removeUserSport(user.id, sportId);
      Utils.toast('info', 'Esporte removido', '');
      this.switchTab('sports');
    }, 'Remover', true);
  },

  reportUser() {
    const reasons = ['Comportamento inadequado', 'Perfil falso', 'Assédio', 'Spam', 'Discriminação', 'Outro'];
    const content = `
      <div class="modal-header">
        <h3 class="modal-title">⚠️ Denunciar usuário</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-4">
          <label class="form-label">Motivo</label>
          <select id="report-reason" class="select">
            ${reasons.map(r => `<option>${r}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <textarea id="report-desc" class="textarea" rows="3" placeholder="Descreva o problema..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Cancelar</button>
        <button class="btn btn-danger" onclick="ProfilePage._submitUserReport()">Enviar denúncia</button>
      </div>
    `;
    Utils.showModal(content, 'modal-sm');
  },

  _submitUserReport() {
    const user = Auth.getCurrentUser();
    Store.createReport(user.id, this._userId, 'user', document.getElementById('report-reason')?.value, document.getElementById('report-desc')?.value);
    Utils.closeModal();
    Utils.toast('success', 'Denúncia enviada', 'Nossa equipe analisará em breve.');
  },

  afterRender() {}
};

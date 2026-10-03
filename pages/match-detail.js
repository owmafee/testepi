/* ============================================================
   SPORTMATCH — MATCH DETAIL PAGE
   ============================================================ */

const MatchDetailPage = {
  _matchId: null,

  render(params) {
    const user = Auth.getCurrentUser();
    if (!user) { Utils.navigate('#/login'); return ''; }

    this._matchId = params?.id;
    const details = Matches.getMatchDetails(this._matchId);

    if (!details) {
      return `
        <div class="main-content">
          <div style="max-width:600px;margin:80px auto;text-align:center;">
            <div style="font-size:4rem;margin-bottom:16px;">🏅</div>
            <h2>Partida não encontrada</h2>
            <p style="margin-top:8px;color:var(--text-secondary);">Esta partida pode ter sido cancelada ou removida.</p>
            <button class="btn btn-primary mt-6" onclick="Utils.navigate('#/discover')">← Voltar às partidas</button>
          </div>
        </div>
      `;
    }

    const myParticipation = Store.getUserParticipation(this._matchId, user.id);
    const isCreator = details.creatorId === user.id;
    const isAdmin = user.isAdmin;
    const isAccepted = myParticipation?.status === 'accepted';
    const isPending = myParticipation?.status === 'pending';
    const isDeclined = myParticipation?.status === 'declined';
    const gradient = Utils.sportGradient(details.sportId);
    const canReview = details.isPast && isAccepted && !isCreator;

    return `
      <div class="main-content">
        <div class="match-detail-page">
          <!-- Back + actions -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
            <button class="btn btn-ghost" onclick="history.back()">← Voltar</button>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${isCreator ? `
                <button class="btn btn-outline btn-sm" onclick="MatchDetailPage.cancelMatch()">🚫 Cancelar partida</button>
              ` : ''}
              ${isAdmin ? `
                <button class="btn btn-outline btn-sm" style="color:var(--warning);" onclick="MatchDetailPage.adminRemove()">🛡️ Admin: Remover</button>
              ` : ''}
              <button class="btn btn-ghost btn-sm" onclick="MatchDetailPage.reportMatch()">⚠️ Denunciar</button>
            </div>
          </div>

          <!-- Header card -->
          <div class="match-detail-header">
            <div class="match-detail-banner" style="background:${gradient};height:16px;"></div>
            <div class="match-detail-body">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                <div>
                  <div class="flex gap-2 mb-3">
                    <span class="badge badge-primary">${details.sport?.icon || '🏅'} ${details.sport?.name || details.sportId}</span>
                    ${Utils.renderLevelBadge(details.level)}
                    ${Utils.renderStatusBadge(details.isPast ? 'completed' : details.status)}
                    ${details.requiresApproval ? '<span class="badge badge-muted">🔑 Com aprovação</span>' : '<span class="badge badge-accent">🟢 Entrada livre</span>'}
                  </div>
                  <h1 class="match-detail-title">${Utils.esc(details.title)}</h1>
                </div>
                <!-- Join button -->
                <div style="flex-shrink:0;">
                  ${this._renderJoinButton(details, user, myParticipation, isCreator)}
                </div>
              </div>

              <!-- Meta grid -->
              <div class="match-detail-meta">
                <div class="match-detail-meta-item">
                  <div class="match-meta-icon">📅</div>
                  <div>
                    <div class="match-detail-meta-label">Data</div>
                    <div class="match-detail-meta-value">${Utils.formatDate(details.date)}</div>
                  </div>
                </div>
                <div class="match-detail-meta-item">
                  <div class="match-meta-icon">⏰</div>
                  <div>
                    <div class="match-detail-meta-label">Horário</div>
                    <div class="match-detail-meta-value">${Utils.formatTime(details.time)}</div>
                  </div>
                </div>
                <div class="match-detail-meta-item">
                  <div class="match-meta-icon">📍</div>
                  <div>
                    <div class="match-detail-meta-label">Local</div>
                    <div class="match-detail-meta-value">
                      ${isAccepted || isCreator ? Utils.esc(details.location) : Utils.esc(details.city) + ' <span style="font-size:0.72rem;color:var(--text-muted);">(visível após aprovação)</span>'}
                    </div>
                  </div>
                </div>
                <div class="match-detail-meta-item">
                  <div class="match-meta-icon">👥</div>
                  <div>
                    <div class="match-detail-meta-label">Vagas</div>
                    <div class="match-detail-meta-value">${details.acceptedCount}/${details.maxParticipants} (${Math.max(0, details.slotsLeft)} restante${details.slotsLeft !== 1 ? 's' : ''})</div>
                  </div>
                </div>
              </div>

              <!-- Slots visualization -->
              <div class="match-slots">
                ${Array.from({length: details.maxParticipants}, (_, i) => `
                  <div class="slot-dot ${i < details.acceptedCount ? 'filled' : ''}"></div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Detail grid -->
          <div class="match-detail-grid">
            <!-- Left: description, rules, participants -->
            <div>
              ${details.description ? `
                <div class="card mb-5">
                  <div class="card-header"><h4>📝 Sobre a partida</h4></div>
                  <div class="card-body">
                    <p style="line-height:1.7;font-size:0.9rem;">${Utils.esc(details.description)}</p>
                  </div>
                </div>
              ` : ''}

              ${details.rules ? `
                <div class="card mb-5">
                  <div class="card-header"><h4>📋 Regras</h4></div>
                  <div class="card-body">
                    <p style="line-height:1.7;font-size:0.9rem;">${Utils.esc(details.rules)}</p>
                  </div>
                </div>
              ` : ''}

              <!-- Participants -->
              <div class="card mb-5">
                <div class="card-header">
                  <h4>👥 Participantes (${details.acceptedCount})</h4>
                </div>
                <div class="card-body" style="padding:12px;">
                  ${details.participants.length ? `
                    <div class="participants-grid">
                      ${details.participants.map(p => `
                        <div class="participant-avatar-item" onclick="Utils.navigate('#/profile/${p.userId}')">
                          ${Utils.renderAvatar(p.user, 'avatar-md')}
                          <div class="participant-avatar-name">${Utils.esc(p.user?.name?.split(' ')[0] || '?')}</div>
                          ${p.userId === details.creatorId ? `<div style="font-size:0.6rem;color:var(--primary-light);">Admin</div>` : ''}
                          ${p.checkedIn ? `<div style="font-size:0.65rem;color:var(--success);">✓ Check-in</div>` : ''}
                        </div>
                      `).join('')}
                    </div>
                  ` : `
                    <div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.875rem;">Nenhum participante ainda.</div>
                  `}
                </div>
              </div>

              <!-- Pending requests (creator only) -->
              ${isCreator && details.pendingRequests.length > 0 ? `
                <div class="card mb-5">
                  <div class="card-header">
                    <h4>⏳ Solicitações pendentes</h4>
                    <span class="badge badge-warning">${details.pendingRequests.length}</span>
                  </div>
                  <div class="card-body" style="padding:0;">
                    ${details.pendingRequests.map(req => {
                      const userSport = Store.getUserSportsByUserId(req.userId).find(us => us.sportId === details.sportId);
                      return `
                        <div class="participant-item" style="padding:16px;border-bottom:1px solid var(--border);">
                          ${Utils.renderAvatar(req.user, 'avatar-md')}
                          <div class="participant-info">
                            <div class="participant-name">${Utils.esc(req.user?.name || '?')}</div>
                            <div class="participant-meta">
                              ${userSport ? Utils.renderLevelBadge(userSport.level) : ''}
                              <span>${Utils.timeAgo(req.joinedAt)}</span>
                            </div>
                          </div>
                          <div style="display:flex;gap:6px;">
                            <button class="btn btn-ghost btn-sm" onclick="MatchDetailPage.viewRequesterProfile('${req.userId}')">Ver perfil</button>
                            <button class="btn btn-icon-sm btn-danger" onclick="MatchDetailPage.handleRequest('${req.userId}', 'decline')" title="Recusar">✕</button>
                            <button class="btn btn-icon-sm btn-success" onclick="MatchDetailPage.handleRequest('${req.userId}', 'accept')" title="Aceitar">✓</button>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Review section for past matches -->
              ${canReview ? `
                <div class="card mb-5" style="border-color:rgba(251,191,36,0.2);background:rgba(251,191,36,0.02);">
                  <div class="card-header"><h4>⭐ Avaliar participantes</h4></div>
                  <div class="card-body">
                    <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:16px;">A partida foi encerrada. Avalie os outros participantes!</p>
                    ${details.participants
                      .filter(p => p.userId !== user.id)
                      .map(p => {
                        const reviewed = Store.hasReviewed(this._matchId, user.id, p.userId);
                        return `
                          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--bg-surface-2);border-radius:var(--radius-md);margin-bottom:8px;">
                            <div style="display:flex;align-items:center;gap:10px;">
                              ${Utils.renderAvatar(p.user, 'avatar-sm')}
                              <span style="font-weight:600;font-size:0.875rem;">${Utils.esc(p.user?.name || '?')}</span>
                            </div>
                            ${reviewed
                              ? `<span class="badge badge-success">✅ Avaliado</span>`
                              : `<button class="btn btn-outline btn-sm" onclick="MatchDetailPage.openReviewModal('${p.userId}', '${Utils.esc(p.user?.name || '')}')">⭐ Avaliar</button>`
                            }
                          </div>
                        `;
                      }).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Right sidebar -->
            <div>
              <!-- Organizer -->
              <div class="card mb-4">
                <div class="card-header"><h4>👤 Organizador</h4></div>
                <div class="card-body">
                  <div style="display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="Utils.navigate('#/profile/${details.creatorId}')">
                    ${Utils.renderAvatar(details.creator, 'avatar-lg')}
                    <div>
                      <div style="font-weight:700;">${Utils.esc(details.creator?.name || '?')}</div>
                      <div style="font-size:0.78rem;color:var(--text-muted);">📍 ${Utils.esc(details.creator?.city || 'Sem localização')}</div>
                      ${(() => {
                        const r = Store.getUserAverageRating(details.creatorId);
                        return r.count > 0 ? `
                          <div style="display:flex;align-items:center;gap:4px;margin-top:4px;">
                            <span style="color:#fbbf24;font-size:0.85rem;">★</span>
                            <span style="font-weight:600;font-size:0.85rem;">${((r.sport + r.behavior) / 2).toFixed(1)}</span>
                            <span style="font-size:0.72rem;color:var(--text-muted);">(${r.count} avaliações)</span>
                          </div>
                        ` : '';
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="card mb-4">
                <div class="card-header"><h4>Ações</h4></div>
                <div class="card-body" style="display:flex;flex-direction:column;gap:8px;">
                  ${this._renderActionButtons(details, user, myParticipation, isCreator)}
                </div>
              </div>

              <!-- Share -->
              <div class="card">
                <div class="card-body" style="display:flex;flex-direction:column;gap:8px;">
                  <button class="btn btn-ghost btn-sm" onclick="MatchDetailPage.shareMatch()">📤 Compartilhar partida</button>
                  <button class="btn btn-ghost btn-sm" onclick="MatchDetailPage.reportMatch()">⚠️ Denunciar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        ${App.renderMobileNav('')}
      </div>
    `;
  },

  _renderJoinButton(details, user, myParticipation, isCreator) {
    if (isCreator) return '<span class="badge badge-primary">🛡️ Você é o admin</span>';
    if (details.isPast) return '<span class="badge badge-muted">Partida encerrada</span>';

    const status = myParticipation?.status;

    if (status === 'accepted') {
      return `
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <span class="badge badge-success">✅ Participando</span>
          <button class="btn btn-outline btn-sm" onclick="MatchDetailPage.cancelParticipation()">Cancelar participação</button>
        </div>
      `;
    }

    if (status === 'pending') {
      return `
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <span class="badge badge-warning">⏳ Aguardando aprovação</span>
          <button class="btn btn-ghost btn-sm" onclick="MatchDetailPage.cancelParticipation()">Cancelar solicitação</button>
        </div>
      `;
    }

    if (status === 'declined') {
      return `<span class="badge badge-danger">❌ Solicitação recusada</span>`;
    }

    if (details.slotsLeft <= 0 || details.status === 'full') {
      return `<span class="badge badge-danger">🚫 Partida lotada</span>`;
    }

    return `
      <button class="btn btn-primary btn-lg" onclick="MatchDetailPage.requestJoin()">
        ${details.requiresApproval ? '✋ Solicitar participação' : '✅ Entrar na partida'}
      </button>
    `;
  },

  _renderActionButtons(details, user, myParticipation, isCreator) {
    const btns = [];

    if (!isCreator && !details.isPast && myParticipation?.status === 'accepted') {
      btns.push(`<button class="btn btn-outline btn-sm" onclick="MatchDetailPage.cancelParticipation()">🚪 Cancelar participação</button>`);
    }

    if (isCreator && details.isPast && details.status !== 'completed') {
      btns.push(`<button class="btn btn-accent btn-sm" onclick="MatchDetailPage.completeMatch()">✅ Marcar como encerrada</button>`);
    }

    if (isCreator && myParticipation?.status === 'accepted' && !details.isPast) {
      btns.push(`<button class="btn btn-outline btn-sm" onclick="MatchDetailPage.checkIn()">✓ Fazer check-in</button>`);
    } else if (!isCreator && myParticipation?.status === 'accepted' && !details.isPast && !myParticipation.checkedIn) {
      btns.push(`<button class="btn btn-outline btn-sm" onclick="MatchDetailPage.checkIn()">✓ Fazer check-in</button>`);
    }

    return btns.length ? btns.join('') : '<p style="font-size:0.8rem;color:var(--text-muted);">Nenhuma ação disponível.</p>';
  },

  requestJoin() {
    const user = Auth.getCurrentUser();
    const result = Matches.requestJoin(this._matchId, user.id);
    if (result.success) {
      const msg = result.status === 'accepted' ? 'Você entrou na partida!' : 'Solicitação enviada! Aguarde a aprovação.';
      Utils.toast('success', result.status === 'accepted' ? '✅ Confirmado!' : '⏳ Solicitação enviada', msg);
      App.renderPage();
    } else {
      Utils.toast('error', 'Não foi possível', result.error);
    }
  },

  cancelParticipation() {
    Utils.confirm(
      'Cancelar participação',
      'Tem certeza que deseja cancelar sua participação nesta partida?',
      () => {
        const user = Auth.getCurrentUser();
        Matches.cancelParticipation(this._matchId, user.id);
        Utils.toast('info', 'Participação cancelada', 'Sua participação foi cancelada.');
        App.renderPage();
      },
      'Cancelar participação',
      true
    );
  },

  handleRequest(userId, action) {
    const user = Auth.getCurrentUser();
    const result = Matches.handleRequest(this._matchId, userId, action, user.id);
    if (result.success) {
      Utils.toast('success', action === 'accept' ? '✅ Aceito!' : '❌ Recusado', '');
      App.renderPage();
    } else {
      Utils.toast('error', 'Erro', result.error);
    }
  },

  cancelMatch() {
    Utils.confirm(
      'Cancelar partida',
      'Tem certeza? Todos os participantes serão notificados. Esta ação não pode ser desfeita.',
      () => {
        const user = Auth.getCurrentUser();
        const result = Matches.cancelMatch(this._matchId, user.id);
        if (result.success) {
          Utils.toast('info', 'Partida cancelada', 'Todos os participantes foram notificados.');
          App.renderPage();
        }
      },
      'Cancelar partida',
      true
    );
  },

  completeMatch() {
    Store.updateMatch(this._matchId, { status: 'completed' });
    Utils.toast('success', 'Partida encerrada!', 'Agora os participantes podem se avaliar.');
    App.renderPage();
  },

  checkIn() {
    const user = Auth.getCurrentUser();
    Matches.checkIn(this._matchId, user.id);
    Utils.toast('success', 'Check-in realizado!', 'Sua presença foi confirmada.');
    App.renderPage();
  },

  viewRequesterProfile(userId) {
    const details = Matches.getMatchDetails(this._matchId);
    const content = `
      <div class="modal-header">
        <h3 class="modal-title">Perfil do solicitante</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        ${Profiles.renderMiniProfile(userId, details?.sportId)}
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger btn-sm" onclick="Utils.closeModal();MatchDetailPage.handleRequest('${userId}', 'decline')">✕ Recusar</button>
        <button class="btn btn-success btn-sm" onclick="Utils.closeModal();MatchDetailPage.handleRequest('${userId}', 'accept')">✓ Aceitar</button>
      </div>
    `;
    Utils.showModal(content);
  },

  openReviewModal(reviewedId, reviewedName) {
    const user = Auth.getCurrentUser();
    let sportRating = 0, behaviorRating = 0;

    const content = `
      <div class="modal-header">
        <h3 class="modal-title">Avaliar jogador</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body review-form">
        <div class="review-participant">
          ${Utils.renderAvatar(Store.getUserById(reviewedId), 'avatar-md')}
          <div>
            <div style="font-weight:700;">${Utils.esc(reviewedName)}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">Avaliação pós-partida</div>
          </div>
        </div>

        <div>
          <div class="review-section-title">⚽ Avaliação esportiva</div>
          <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">Nível técnico, competitividade saudável e respeito às regras.</p>
          <div id="sport-stars" class="stars stars-interactive">
            ${[1,2,3,4,5].map(v => `<span class="star" data-value="${v}" onclick="MatchDetailPage._setSportRating(${v},'${reviewedId}')">★</span>`).join('')}
          </div>
        </div>

        <div>
          <div class="review-section-title">🤝 Avaliação de comportamento</div>
          <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">Pontualidade, respeito, convivência e fair play.</p>
          <div id="behavior-stars" class="stars stars-interactive">
            ${[1,2,3,4,5].map(v => `<span class="star" data-value="${v}" onclick="MatchDetailPage._setBehaviorRating(${v},'${reviewedId}')">★</span>`).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Comentário (opcional)</label>
          <textarea id="review-comment" class="textarea" rows="2" placeholder="Deixe um comentário sobre o jogador..."></textarea>
        </div>

        <div id="review-error" class="form-error" style="display:none;">Selecione as notas esportiva e de comportamento.</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="MatchDetailPage.submitReview('${reviewedId}')">⭐ Enviar avaliação</button>
      </div>
    `;
    this._sportRating = 0;
    this._behaviorRating = 0;
    Utils.showModal(content);
  },

  _sportRating: 0,
  _behaviorRating: 0,

  _setSportRating(value) {
    this._sportRating = value;
    document.querySelectorAll('#sport-stars .star').forEach(s => {
      s.classList.toggle('filled', parseInt(s.dataset.value) <= value);
    });
  },

  _setBehaviorRating(value) {
    this._behaviorRating = value;
    document.querySelectorAll('#behavior-stars .star').forEach(s => {
      s.classList.toggle('filled', parseInt(s.dataset.value) <= value);
    });
  },

  submitReview(reviewedId) {
    const errEl = document.getElementById('review-error');
    if (!this._sportRating || !this._behaviorRating) {
      errEl.style.display = 'flex';
      return;
    }
    const user = Auth.getCurrentUser();
    const comment = document.getElementById('review-comment')?.value || '';

    Store.createReview({
      matchId: this._matchId,
      reviewerId: user.id,
      reviewedId,
      sportRating: this._sportRating,
      behaviorRating: this._behaviorRating,
      comment
    });

    // Notify reviewed user
    Store.createNotification(reviewedId, 'review_received', `${user.name} avaliou você com ${this._sportRating}⭐ no esporte`, {});

    Utils.toast('success', 'Avaliação enviada!', 'Obrigado pelo feedback.');
    Utils.closeModal();
    App.renderPage();
  },

  shareMatch() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => Utils.toast('success', 'Link copiado!', 'Compartilhe com seus amigos.'));
    } else {
      Utils.toast('info', 'Link da partida', url);
    }
  },

  reportMatch() {
    MatchDetailPage._openReportModal('match', this._matchId);
  },

  _openReportModal(targetType, targetId) {
    const reasons = ['Conteúdo inapropriado', 'Informações falsas', 'Spam', 'Discriminação', 'Outro'];
    const content = `
      <div class="modal-header">
        <h3 class="modal-title">⚠️ Fazer denúncia</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group mb-4">
          <label class="form-label">Motivo <span class="required">*</span></label>
          <select id="report-reason" class="select">
            ${reasons.map(r => `<option value="${r}">${r}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <textarea id="report-desc" class="textarea" rows="3" placeholder="Descreva o problema em detalhes..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Cancelar</button>
        <button class="btn btn-danger" onclick="MatchDetailPage._submitReport('${targetType}', '${targetId}')">Enviar denúncia</button>
      </div>
    `;
    Utils.showModal(content, 'modal-sm');
  },

  _submitReport(targetType, targetId) {
    const user = Auth.getCurrentUser();
    const reason = document.getElementById('report-reason')?.value;
    const desc = document.getElementById('report-desc')?.value;
    Store.createReport(user.id, targetId, targetType, reason, desc);
    Utils.closeModal();
    Utils.toast('success', 'Denúncia enviada', 'Nossa equipe analisará em breve. Obrigado!');
  },

  afterRender() {}
};

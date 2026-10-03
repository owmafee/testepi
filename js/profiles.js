/* ============================================================
   SPORTMATCH — PROFILES.JS
   Profile rendering helpers
   ============================================================ */

const Profiles = {
  // Get full profile data for a user
  getFullProfile(userId) {
    const user = Store.getUserById(userId);
    if (!user) return null;

    const userSports = Store.getUserSportsByUserId(userId);
    const stats = Store.getUserStats(userId);
    const reviews = Store.getReviewsForUser(userId);
    const ratings = Store.getUserAverageRating(userId);

    return {
      ...user,
      userSports,
      stats,
      reviews,
      ratings
    };
  },

  // Render mini profile card for approval view
  renderMiniProfile(userId, sportId = null) {
    const profile = this.getFullProfile(userId);
    if (!profile) return '<p>Usuário não encontrado</p>';

    const relevantSport = sportId ? profile.userSports.find(us => us.sportId === sportId) : profile.userSports[0];
    const sport = relevantSport ? Store.getSportById(relevantSport.sportId) : null;

    const strengthsHtml = relevantSport?.strengths?.length
      ? `<div class="tags-wrap mt-2">${relevantSport.strengths.map(s => `<span class="tag tag-strength">💪 ${Utils.esc(s)}</span>`).join('')}</div>`
      : '';

    const weaknessesHtml = relevantSport?.weaknesses?.length
      ? `<div class="tags-wrap mt-2">${relevantSport.weaknesses.map(w => `<span class="tag tag-weakness">📉 ${Utils.esc(w)}</span>`).join('')}</div>`
      : '';

    const ratingHtml = profile.ratings.count > 0
      ? `<div class="flex gap-4 mt-3">
          <div class="rep-card flex-1">
            <span class="rep-icon">⚽</span>
            <div class="rep-info">
              <div class="rep-label">Esportivo</div>
              <div class="rep-value">${profile.ratings.sport.toFixed(1)} <span class="rep-stars">★</span></div>
            </div>
          </div>
          <div class="rep-card flex-1">
            <span class="rep-icon">🤝</span>
            <div class="rep-info">
              <div class="rep-label">Comportamento</div>
              <div class="rep-value">${profile.ratings.behavior.toFixed(1)} <span class="rep-stars">★</span></div>
            </div>
          </div>
        </div>`
      : '<p class="text-muted mt-3" style="font-size:0.8rem;">Sem avaliações ainda.</p>';

    return `
      <div class="flex items-start gap-4 mb-4">
        ${Utils.renderAvatar(profile, 'avatar-lg')}
        <div class="flex-1">
          <div class="fw-700" style="font-size:1.1rem;">${Utils.esc(profile.name)}</div>
          <div class="text-secondary" style="font-size:0.85rem;">📍 ${Utils.esc(profile.city || 'Localização não informada')}</div>
          ${relevantSport ? `<div class="mt-2">${Utils.renderLevelBadge(relevantSport.level)} <span style="font-size:0.78rem;color:var(--text-muted);margin-left:6px;">${sport?.name || ''}</span></div>` : ''}
        </div>
      </div>
      ${profile.bio ? `<p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;margin-bottom:12px;">${Utils.esc(profile.bio)}</p>` : ''}
      ${strengthsHtml ? `<div class="mb-3"><div class="review-section-title">Pontos fortes</div>${strengthsHtml}</div>` : ''}
      ${weaknessesHtml ? `<div class="mb-3"><div class="review-section-title">Pontos fracos</div>${weaknessesHtml}</div>` : ''}
      <div class="flex gap-4 mt-3">
        <div class="flex flex-col items-center">
          <div class="fw-700" style="font-size:1.2rem;">${profile.stats.totalMatches}</div>
          <div class="text-muted" style="font-size:0.7rem;">Partidas</div>
        </div>
        ${profile.stats.attendanceRate !== null ? `
        <div class="flex flex-col items-center">
          <div class="fw-700" style="font-size:1.2rem;">${profile.stats.attendanceRate}%</div>
          <div class="text-muted" style="font-size:0.7rem;">Presença</div>
        </div>` : ''}
        <div class="flex flex-col items-center">
          <div class="fw-700" style="font-size:1.2rem;">${profile.ratings.count}</div>
          <div class="text-muted" style="font-size:0.7rem;">Avaliações</div>
        </div>
      </div>
      ${ratingHtml}
    `;
  }
};

/* ============================================================
   SPORTMATCH — MATCH CREATE PAGE
   ============================================================ */

const MatchCreatePage = {
  render() {
    const user = Auth.getCurrentUser();
    if (!user) { Utils.navigate('#/login'); return ''; }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return `
      <div class="main-content">
        <div class="match-create-page">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
            <button class="btn btn-ghost btn-icon" onclick="history.back()">←</button>
            <div>
              <h1 style="font-family:var(--font-head);font-size:1.75rem;font-weight:800;">Criar partida</h1>
              <p style="color:var(--text-secondary);font-size:0.875rem;">Organize sua partida e convide jogadores compatíveis.</p>
            </div>
          </div>

          <div class="create-form-card animate-fade-in">
            <form id="create-match-form" onsubmit="MatchCreatePage.handleSubmit(event)">

              <!-- Sport -->
              <div class="form-group mb-6">
                <label class="form-label">Esporte <span class="required">*</span></label>
                <div class="sports-grid" id="sport-selector" style="grid-template-columns:repeat(auto-fill,minmax(90px,1fr));">
                  ${Store.SPORTS.map(s => `
                    <div class="sport-icon-card" id="create-sport-${s.id}" onclick="MatchCreatePage.selectSport('${s.id}')">
                      <span class="icon">${s.icon}</span>
                      <span class="name">${s.name}</span>
                    </div>
                  `).join('')}
                </div>
                <input type="hidden" id="selected-sport" value="" />
                <div id="sport-error" class="form-error" style="display:none;">Selecione um esporte.</div>
              </div>

              <!-- Title and location -->
              <div class="create-form-grid" style="margin-bottom:20px;">
                <div class="form-group">
                  <label class="form-label" for="match-title">Título da partida <span class="required">*</span></label>
                  <input type="text" id="match-title" class="input" placeholder="Ex: Futebol Society — Domingo" required maxlength="80" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="match-city">Cidade/Região <span class="required">*</span></label>
                  <input type="text" id="match-city" class="input" placeholder="Ex: São Paulo, SP" required value="${Utils.esc(Auth.getCurrentUser()?.city || '')}" />
                </div>
              </div>

              <div class="form-group mb-5">
                <label class="form-label" for="match-location">Endereço/Local <span class="required">*</span></label>
                <div class="input-group">
                  <span class="input-group-icon">📍</span>
                  <input type="text" id="match-location" class="input" placeholder="Nome do local, rua e número..." required />
                </div>
                <div class="form-hint">O endereço exato será visível apenas para participantes aceitos.</div>
              </div>

              <!-- Date, Time, Slots -->
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;" class="create-form-grid-3">
                <div class="form-group">
                  <label class="form-label" for="match-date">Data <span class="required">*</span></label>
                  <input type="date" id="match-date" class="input" min="${minDate}" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="match-time">Horário <span class="required">*</span></label>
                  <input type="time" id="match-time" class="input" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="match-slots">Vagas máximas <span class="required">*</span></label>
                  <input type="number" id="match-slots" class="input" min="2" max="100" value="10" required />
                </div>
              </div>

              <!-- Level -->
              <div class="form-group mb-5">
                <label class="form-label">Nível desejado <span class="required">*</span></label>
                <div class="level-buttons" style="gap:8px;">
                  ${Store.LEVELS.map(l => `
                    <button type="button" class="level-btn" id="lvl-btn-${l.value}" onclick="MatchCreatePage.setLevel(${l.value})">${l.label}</button>
                  `).join('')}
                </div>
                <input type="hidden" id="match-level" value="" />
                <div id="level-error" class="form-error" style="display:none;">Selecione um nível.</div>
              </div>

              <!-- Description -->
              <div class="form-group mb-5">
                <label class="form-label" for="match-desc">Descrição</label>
                <textarea id="match-desc" class="textarea" placeholder="Descreva a partida: estilo de jogo, objetivos, o que trazer..." rows="3"></textarea>
              </div>

              <!-- Rules -->
              <div class="form-group mb-6">
                <label class="form-label" for="match-rules">Regras específicas</label>
                <textarea id="match-rules" class="textarea" placeholder="Ex: Chuteira society obrigatória. Sem linguagem ofensiva..." rows="2"></textarea>
              </div>

              <!-- Options -->
              <div style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;margin-bottom:24px;">
                <div style="font-weight:700;font-size:0.875rem;margin-bottom:16px;">Configurações</div>
                <div style="display:flex;flex-direction:column;gap:16px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div>
                      <div style="font-weight:600;font-size:0.875rem;">Partida pública</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">Qualquer pessoa pode encontrar e solicitar participação</div>
                    </div>
                    <label class="toggle">
                      <input type="checkbox" id="match-public" checked onchange="MatchCreatePage.updatePublicToggle(this)">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div>
                      <div style="font-weight:600;font-size:0.875rem;">Requer aprovação</div>
                      <div style="font-size:0.75rem;color:var(--text-muted);">Você analisa cada solicitação antes de aceitar</div>
                    </div>
                    <label class="toggle">
                      <input type="checkbox" id="match-approval" checked>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div id="form-error" class="form-error" style="display:none;margin-bottom:16px;"></div>

              <div style="display:flex;gap:12px;justify-content:flex-end;">
                <button type="button" class="btn btn-ghost" onclick="history.back()">Cancelar</button>
                <button type="submit" class="btn btn-primary btn-lg" id="create-btn">🚀 Publicar partida</button>
              </div>
            </form>
          </div>
        </div>
        ${App.renderMobileNav('create')}
      </div>
    `;
  },

  _selectedSport: null,
  _selectedLevel: null,

  selectSport(sportId) {
    this._selectedSport = sportId;
    document.getElementById('selected-sport').value = sportId;
    document.getElementById('sport-error').style.display = 'none';

    // Update UI
    Store.SPORTS.forEach(s => {
      const card = document.getElementById(`create-sport-${s.id}`);
      if (card) card.classList.toggle('selected', s.id === sportId);
    });
  },

  setLevel(level) {
    this._selectedLevel = level;
    document.getElementById('match-level').value = level;
    document.getElementById('level-error').style.display = 'none';

    Store.LEVELS.forEach(l => {
      const btn = document.getElementById(`lvl-btn-${l.value}`);
      if (btn) btn.classList.toggle('active', l.value === level);
    });
  },

  updatePublicToggle(el) {
    const approvalToggle = document.getElementById('match-approval');
    if (!el.checked && approvalToggle) {
      approvalToggle.checked = false;
      approvalToggle.disabled = true;
    } else if (approvalToggle) {
      approvalToggle.disabled = false;
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const errEl = document.getElementById('form-error');
    errEl.style.display = 'none';

    if (!this._selectedSport) {
      document.getElementById('sport-error').style.display = 'flex';
      return;
    }
    if (!this._selectedLevel) {
      document.getElementById('level-error').style.display = 'flex';
      return;
    }

    const user = Auth.getCurrentUser();
    const btn = document.getElementById('create-btn');
    btn.disabled = true;
    btn.textContent = 'Publicando...';

    setTimeout(() => {
      try {
        const match = Store.createMatch({
          title: document.getElementById('match-title').value,
          sportId: this._selectedSport,
          creatorId: user.id,
          date: document.getElementById('match-date').value,
          time: document.getElementById('match-time').value,
          location: document.getElementById('match-location').value,
          city: document.getElementById('match-city').value,
          maxParticipants: document.getElementById('match-slots').value,
          level: this._selectedLevel,
          description: document.getElementById('match-desc').value,
          rules: document.getElementById('match-rules').value,
          isPublic: document.getElementById('match-public').checked,
          requiresApproval: document.getElementById('match-approval').checked
        });

        Utils.toast('success', 'Partida criada!', 'Sua partida foi publicada com sucesso.');
        Utils.navigate(`#/match/${match.id}`);
      } catch (err) {
        errEl.textContent = 'Erro ao criar partida. Tente novamente.';
        errEl.style.display = 'flex';
        btn.disabled = false;
        btn.textContent = '🚀 Publicar partida';
      }
    }, 400);
  },

  afterRender() {
    this._selectedSport = null;
    this._selectedLevel = null;

    // Add CSS for 3-col grid
    const style = document.createElement('style');
    style.textContent = `.create-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; } @media(max-width:600px){.create-form-grid-3{grid-template-columns:1fr;}}`;
    document.head.appendChild(style);
  }
};

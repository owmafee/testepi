/* ============================================================
   SPORTMATCH — ONBOARDING PAGE
   5-step wizard for profile setup
   ============================================================ */

const OnboardingPage = {
  _step: 1,
  _totalSteps: 5,
  _data: {
    sports: [],      // [{sportId, level, strengths, weaknesses}]
    bio: '',
    profession: '',
    hobbies: ''
  },

  render() {
    const user = Auth.getCurrentUser();
    if (!user) { Utils.navigate('#/login'); return ''; }

    this._step = 1;
    this._data = { sports: [], bio: '', profession: '', hobbies: '' };

    return `
      <div class="onboarding-page">
        <div class="onboarding-header">
          <div class="nav-logo" style="cursor:pointer;" onclick="Utils.navigate('#/')">
            <div class="nav-logo-icon">⚡</div>
            SportMatch
          </div>
          <div class="onboarding-progress" style="flex:1;max-width:400px;">
            <div class="onboarding-progress-label" id="ob-step-label">Passo 1 de ${this._totalSteps} — Escolha seus esportes</div>
            <div class="progress">
              <div class="progress-bar" id="ob-progress-bar" style="width:20%;"></div>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="OnboardingPage.skip()">Pular configuração</button>
        </div>

        <div class="onboarding-main">
          <div class="onboarding-card" id="ob-card">
            ${this._renderStep(1)}
          </div>
        </div>

        <div class="onboarding-footer">
          <button class="btn btn-ghost" id="ob-back-btn" onclick="OnboardingPage.prevStep()" style="visibility:hidden;">
            ← Voltar
          </button>
          <div style="display:flex;align-items:center;gap:8px;">
            ${Array.from({length: this._totalSteps}, (_, i) => `
              <div style="width:8px;height:8px;border-radius:50%;background:${i === 0 ? 'var(--primary)' : 'var(--bg-surface-3)'};" id="ob-dot-${i}"></div>
            `).join('')}
          </div>
          <button class="btn btn-primary" id="ob-next-btn" onclick="OnboardingPage.nextStep()">
            Próximo →
          </button>
        </div>
      </div>
    `;
  },

  _stepTitles: [
    'Quais esportes você pratica?',
    'Seu nível em cada esporte',
    'Pontos fortes e fracos',
    'Sobre você (opcional)',
    'Tudo pronto! 🎉'
  ],

  _stepDescs: [
    'Selecione um ou mais esportes que você pratica regularmente. Você pode adicionar mais depois.',
    'Informe seu nível atual em cada esporte selecionado. Seja honesto — isso ajuda a encontrar partidas compatíveis.',
    'Quais são seus pontos fortes e onde você pode melhorar? Essas informações ajudam administradores de partidas.',
    'Conte um pouco mais sobre você. Essas informações são opcionais, mas enriquecem seu perfil.',
    'Seu perfil está quase configurado. Você já pode começar a explorar partidas!'
  ],

  _renderStep(step) {
    const title = this._stepTitles[step - 1];
    const desc = this._stepDescs[step - 1];

    return `
      <div class="onboarding-step-title">${title}</div>
      <p class="onboarding-step-desc">${desc}</p>
      <div id="ob-step-content">
        ${this._renderStepContent(step)}
      </div>
    `;
  },

  _renderStepContent(step) {
    switch (step) {
      case 1: return this._renderStep1();
      case 2: return this._renderStep2();
      case 3: return this._renderStep3();
      case 4: return this._renderStep4();
      case 5: return this._renderStep5();
      default: return '';
    }
  },

  _renderStep1() {
    return `
      <div class="sports-grid">
        ${Store.SPORTS.map(s => `
          <div class="sport-icon-card ${this._data.sports.find(es => es.sportId === s.id) ? 'selected' : ''}"
               id="sport-card-${s.id}"
               onclick="OnboardingPage.toggleSport('${s.id}')">
            <span class="icon">${s.icon}</span>
            <span class="name">${s.name}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderStep2() {
    if (!this._data.sports.length) {
      return '<p class="text-muted text-center" style="padding:32px 0;">Volte e selecione pelo menos um esporte.</p>';
    }

    return this._data.sports.map(es => {
      const sport = Store.getSportById(es.sportId);
      return `
        <div class="sport-level-item" id="level-item-${es.sportId}">
          <div class="sport-level-header">
            <span class="sport-level-icon">${sport.icon}</span>
            <span class="sport-level-name">${sport.name}</span>
          </div>
          <div class="level-buttons">
            ${Store.LEVELS.map(l => `
              <button class="level-btn ${es.level === l.value ? 'active' : ''}"
                      onclick="OnboardingPage.setLevel('${es.sportId}', ${l.value})"
                      title="${l.desc}">${l.label}</button>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  },

  _renderStep3() {
    if (!this._data.sports.length) {
      return '<p class="text-muted text-center" style="padding:32px 0;">Volte e selecione pelo menos um esporte.</p>';
    }

    return this._data.sports.map(es => {
      const sport = Store.getSportById(es.sportId);
      const strengths = Store.STRENGTHS_BY_SPORT[es.sportId] || Store.STRENGTHS_BY_SPORT.other;
      const weaknesses = Store.WEAKNESSES_BY_SPORT[es.sportId] || Store.WEAKNESSES_BY_SPORT.other;

      return `
        <div class="sport-level-item" id="sw-item-${es.sportId}">
          <div class="sport-level-header">
            <span class="sport-level-icon">${sport.icon}</span>
            <span class="sport-level-name">${sport.name}</span>
            ${Utils.renderLevelBadge(es.level)}
          </div>

          <div class="mb-3">
            <div class="review-section-title" style="margin-bottom:8px;">Pontos fortes <span class="required" style="font-size:0.8rem;">*</span></div>
            <div class="tags-wrap">
              ${strengths.map(s => `
                <span class="tag tag-selectable ${es.strengths?.includes(s) ? 'selected' : ''}"
                      onclick="OnboardingPage.toggleStrength('${es.sportId}', '${s}')">
                  💪 ${s}
                </span>
              `).join('')}
            </div>
          </div>

          <div>
            <div class="review-section-title" style="margin-bottom:8px;">Pontos fracos <span class="required" style="font-size:0.8rem;">*</span></div>
            <div class="tags-wrap">
              ${weaknesses.map(w => `
                <span class="tag tag-selectable ${es.weaknesses?.includes(w) ? 'selected' : ''}"
                      onclick="OnboardingPage.toggleWeakness('${es.sportId}', '${w}')">
                  📉 ${w}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  _renderStep4() {
    return `
      <div class="auth-form" style="gap:16px;">
        <div class="form-group">
          <label class="form-label" for="ob-bio">Sobre você</label>
          <textarea id="ob-bio" class="textarea" placeholder="Conte um pouco sobre você, seu histórico esportivo, motivações..." rows="4">${Utils.esc(this._data.bio)}</textarea>
          <div class="form-hint">Aparecerá no seu perfil público.</div>
        </div>
        <div class="create-form-grid">
          <div class="form-group">
            <label class="form-label" for="ob-profession">Profissão</label>
            <input type="text" id="ob-profession" class="input" placeholder="Ex: Engenheiro, Professor..." value="${Utils.esc(this._data.profession)}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="ob-hobbies">Outros hobbies</label>
            <input type="text" id="ob-hobbies" class="input" placeholder="Ex: Ciclismo, leitura..." value="${Utils.esc(this._data.hobbies)}" />
          </div>
        </div>
      </div>
    `;
  },

  _renderStep5() {
    const user = Auth.getCurrentUser();
    return `
      <div style="text-align:center;padding:16px 0;">
        <div style="font-size:4rem;margin-bottom:16px;animation:float 3s ease-in-out infinite;">🎉</div>
        <h3 style="margin-bottom:8px;">Perfil criado com sucesso!</h3>
        <p style="color:var(--text-secondary);margin-bottom:24px;">
          Olá, ${Utils.esc(user?.name?.split(' ')[0] || '')}! Seu perfil está configurado. 
          Agora você pode encontrar partidas ou criar a sua própria.
        </p>
        <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-size:2rem;margin-bottom:4px;">⚽</div>
            <div style="font-size:0.78rem;font-weight:600;color:var(--text-muted);">${this._data.sports.length} esporte${this._data.sports.length !== 1 ? 's' : ''}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:2rem;margin-bottom:4px;">💪</div>
            <div style="font-size:0.78rem;font-weight:600;color:var(--text-muted);">${this._data.sports.reduce((acc, s) => acc + (s.strengths?.length || 0), 0)} pontos fortes</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:2rem;margin-bottom:4px;">🔍</div>
            <div style="font-size:0.78rem;font-weight:600;color:var(--text-muted);">Pronto para explorar</div>
          </div>
        </div>
      </div>
    `;
  },

  toggleSport(sportId) {
    const idx = this._data.sports.findIndex(es => es.sportId === sportId);
    if (idx === -1) {
      this._data.sports.push({ sportId, level: 3, strengths: [], weaknesses: [] });
    } else {
      this._data.sports.splice(idx, 1);
    }
    const card = document.getElementById(`sport-card-${sportId}`);
    if (card) card.classList.toggle('selected', this._data.sports.some(es => es.sportId === sportId));
  },

  setLevel(sportId, level) {
    const es = this._data.sports.find(s => s.sportId === sportId);
    if (es) {
      es.level = level;
      const item = document.getElementById(`level-item-${sportId}`);
      if (item) {
        item.querySelectorAll('.level-btn').forEach((btn, i) => {
          btn.classList.toggle('active', Store.LEVELS[i].value === level);
        });
      }
    }
  },

  toggleStrength(sportId, strength) {
    const es = this._data.sports.find(s => s.sportId === sportId);
    if (!es) return;
    if (!es.strengths) es.strengths = [];
    const idx = es.strengths.indexOf(strength);
    if (idx === -1) {
      if (es.strengths.length >= 5) { Utils.toast('warning', 'Limite', 'Máximo de 5 pontos fortes por esporte.'); return; }
      es.strengths.push(strength);
    } else {
      es.strengths.splice(idx, 1);
    }
    // Update UI
    const item = document.getElementById(`sw-item-${sportId}`);
    if (item) {
      item.querySelectorAll('.tag-selectable').forEach(tag => {
        const text = tag.textContent.trim().replace('💪 ', '').replace('📉 ', '');
        if (es.strengths.includes(text)) tag.classList.add('selected');
      });
    }
  },

  toggleWeakness(sportId, weakness) {
    const es = this._data.sports.find(s => s.sportId === sportId);
    if (!es) return;
    if (!es.weaknesses) es.weaknesses = [];
    const idx = es.weaknesses.indexOf(weakness);
    if (idx === -1) {
      if (es.weaknesses.length >= 5) { Utils.toast('warning', 'Limite', 'Máximo de 5 pontos fracos por esporte.'); return; }
      es.weaknesses.push(weakness);
    } else {
      es.weaknesses.splice(idx, 1);
    }
  },

  _validateStep() {
    switch (this._step) {
      case 1:
        if (!this._data.sports.length) {
          Utils.toast('warning', 'Selecione um esporte', 'Escolha pelo menos um esporte para continuar.');
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        for (const es of this._data.sports) {
          if (!es.strengths?.length) {
            Utils.toast('warning', 'Pontos fortes', `Selecione pelo menos 1 ponto forte para ${Store.getSportName(es.sportId)}.`);
            return false;
          }
          if (!es.weaknesses?.length) {
            Utils.toast('warning', 'Pontos fracos', `Selecione pelo menos 1 ponto fraco para ${Store.getSportName(es.sportId)}.`);
            return false;
          }
        }
        return true;
      case 4:
        this._data.bio = document.getElementById('ob-bio')?.value || '';
        this._data.profession = document.getElementById('ob-profession')?.value || '';
        this._data.hobbies = document.getElementById('ob-hobbies')?.value || '';
        return true;
      default:
        return true;
    }
  },

  nextStep() {
    if (!this._validateStep()) return;

    if (this._step === this._totalSteps) {
      this._save();
      return;
    }

    this._step++;
    this._updateUI();
  },

  prevStep() {
    if (this._step <= 1) return;
    this._step--;
    this._updateUI();
  },

  _updateUI() {
    const card = document.getElementById('ob-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateX(20px)';
      setTimeout(() => {
        card.innerHTML = this._renderStep(this._step);
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      }, 150);
    }

    const progress = (this._step / this._totalSteps) * 100;
    const bar = document.getElementById('ob-progress-bar');
    if (bar) bar.style.width = `${progress}%`;

    const label = document.getElementById('ob-step-label');
    if (label) label.textContent = `Passo ${this._step} de ${this._totalSteps} — ${this._stepTitles[this._step - 1]}`;

    const backBtn = document.getElementById('ob-back-btn');
    if (backBtn) backBtn.style.visibility = this._step > 1 ? 'visible' : 'hidden';

    const nextBtn = document.getElementById('ob-next-btn');
    if (nextBtn) nextBtn.textContent = this._step === this._totalSteps ? '🚀 Começar a jogar!' : 'Próximo →';

    for (let i = 0; i < this._totalSteps; i++) {
      const dot = document.getElementById(`ob-dot-${i}`);
      if (dot) {
        dot.style.background = i < this._step ? 'var(--primary)' : 'var(--bg-surface-3)';
        dot.style.width = i === this._step - 1 ? '20px' : '8px';
        dot.style.borderRadius = 'var(--radius-full)';
        dot.style.transition = 'all 0.3s ease';
      }
    }
  },

  _save() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    // Save sports
    this._data.sports.forEach(es => {
      Store.saveUserSport(user.id, es.sportId, es.level, es.strengths || [], es.weaknesses || []);
    });

    // Save profile info
    Store.updateUser(user.id, {
      bio: this._data.bio,
      profession: this._data.profession,
      hobbies: this._data.hobbies,
      onboardingComplete: true
    });

    Utils.toast('success', 'Perfil configurado!', 'Bem-vindo ao SportMatch! 🎉');
    Utils.navigate('#/dashboard');
  },

  skip() {
    Utils.confirm(
      'Pular configuração',
      'Você pode configurar seu perfil esportivo mais tarde no seu perfil. Deseja continuar?',
      () => {
        const user = Auth.getCurrentUser();
        if (user) Store.updateUser(user.id, { onboardingComplete: true });
        Utils.navigate('#/dashboard');
      },
      'Pular',
      false
    );
  },

  afterRender() {}
};

/* ============================================================
   SPORTMATCH — STORE.JS
   Global state management using LocalStorage
   ============================================================ */

const Store = {
  // Sports catalog
  SPORTS: [
    { id: 'football',    name: 'Futebol',      icon: '⚽', maxPlayers: 22, positions: ['Goleiro','Defensor','Meio-campo','Atacante'] },
    { id: 'futsal',      name: 'Futsal',       icon: '🥅', maxPlayers: 10, positions: ['Goleiro','Fixo','Ala','Pivô'] },
    { id: 'volleyball',  name: 'Vôlei',        icon: '🏐', maxPlayers: 12, positions: ['Levantador','Líbero','Ponteiro','Central','Oposto'] },
    { id: 'basketball',  name: 'Basquete',     icon: '🏀', maxPlayers: 10, positions: ['Armador','Ala','Ala-Pivô','Pivô'] },
    { id: 'handball',    name: 'Handebol',     icon: '🤾', maxPlayers: 14, positions: ['Goleiro','Central','Ponta','Pivô'] },
    { id: 'tennis',      name: 'Tênis',        icon: '🎾', maxPlayers: 4,  positions: ['Simples','Dupla'] },
    { id: 'beach_tennis',name: 'Beach Tennis', icon: '🏖️', maxPlayers: 4,  positions: ['Simples','Dupla'] },
    { id: 'padel',       name: 'Padel',        icon: '🏓', maxPlayers: 4,  positions: ['Dupla'] },
    { id: 'badminton',   name: 'Badminton',    icon: '🏸', maxPlayers: 4,  positions: ['Simples','Dupla'] },
    { id: 'running',     name: 'Corrida',      icon: '🏃', maxPlayers: 50, positions: [] },
    { id: 'cycling',     name: 'Ciclismo',     icon: '🚴', maxPlayers: 20, positions: [] },
    { id: 'other',       name: 'Outro',        icon: '🏅', maxPlayers: 20, positions: [] }
  ],

  LEVELS: [
    { value: 1, label: 'Iniciante',     desc: 'Estou começando agora' },
    { value: 2, label: 'Básico',        desc: 'Conheço o esporte' },
    { value: 3, label: 'Intermediário', desc: 'Jogo com regularidade' },
    { value: 4, label: 'Avançado',      desc: 'Jogo em alto nível' },
    { value: 5, label: 'Competitivo',   desc: 'Competições e ligas' }
  ],

  STRENGTHS_BY_SPORT: {
    football:    ['Passe','Drible','Finalização','Visão de jogo','Posicionamento','Velocidade','Físico','Liderança','Jogo aéreo','Marcação'],
    futsal:      ['Técnica','Velocidade','Dribles','Finalização','Jogo coletivo','Visão de jogo','Marcação','Jogadas ensaiadas'],
    volleyball:  ['Saque','Recepção','Levantamento','Ataque','Bloqueio','Defesa','Comunicação','Posicionamento'],
    basketball:  ['Arremesso','Passe','Drible','Rebote','Defesa','Velocidade','Visão de jogo','Liderança'],
    handball:    ['Arremesso','Dribles','Velocidade','Defesa','Jogo aéreo','Finalização','Resistência'],
    tennis:      ['Saque','Backhand','Forehand','Voleio','Consistência','Potência','Posicionamento'],
    beach_tennis:['Saque','Defesa','Bandeja','Smash','Consistência','Comunicação (dupla)'],
    padel:       ['Parede','Smash','Bandeja','Voleio','Consistência','Comunicação (dupla)'],
    badminton:   ['Saque','Smash','Defesa','Potência','Consistência','Velocidade'],
    running:     ['Resistência','Velocidade','Pace','Respiração','Técnica de corrida'],
    cycling:     ['Resistência','Velocidade','Subidas','Descidas','Pedalada','Grupo'],
    other:       ['Técnica','Resistência','Velocidade','Trabalho em equipe','Comunicação']
  },

  WEAKNESSES_BY_SPORT: {
    football:    ['Finalização','Velocidade','Jogo aéreo','Físico','Drible','Marcação','Passe longo','Cabeçada'],
    futsal:      ['Finalização','Velocidade','Marcação','Jogo coletivo','Técnica individual'],
    volleyball:  ['Saque','Ataque potente','Bloqueio','Recepção','Jogadas rápidas'],
    basketball:  ['Arremesso de 3','Lances livres','Defesa','Rebote','Velocidade'],
    handball:    ['Arremesso potente','Velocidade','Defesa','Resistência'],
    tennis:      ['Saque potente','Backhand','Consistência','Rede','Potência'],
    beach_tennis:['Saque','Smash','Consistência','Comunicação (dupla)'],
    padel:       ['Parede','Smash','Consistência','Rede'],
    badminton:   ['Saque','Defesa','Consistência','Velocidade de reação'],
    running:     ['Velocidade','Resistência','Ritmo constante','Técnica'],
    cycling:     ['Subidas','Sprints','Resistência longa'],
    other:       ['Resistência','Velocidade','Técnica','Comunicação']
  },

  // ---- Storage helpers ----
  _get(key) {
    try {
      const val = localStorage.getItem('sportmatch_' + key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },

  _set(key, value) {
    try {
      localStorage.setItem('sportmatch_' + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  // ---- Users ----
  getUsers() { return this._get('users') || []; },
  saveUsers(users) { this._set('users', users); },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser(data) {
    const users = this.getUsers();
    const user = {
      id: Utils.uid(),
      name: data.name,
      email: data.email,
      password: Utils.simpleHash(data.password),
      avatar: data.avatar || null,
      city: data.city || '',
      bio: data.bio || '',
      hobbies: data.hobbies || '',
      profession: data.profession || '',
      isAdmin: false,
      isSuspended: false,
      isVerified: false,
      onboardingComplete: false,
      createdAt: Date.now()
    };
    users.push(user);
    this.saveUsers(users);
    return user;
  },

  updateUser(id, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data, updatedAt: Date.now() };
    this.saveUsers(users);
    return users[idx];
  },

  // ---- User Sports ----
  getUserSports() { return this._get('user_sports') || []; },
  saveUserSports(data) { this._set('user_sports', data); },

  getUserSportsByUserId(userId) {
    return this.getUserSports().filter(us => us.userId === userId);
  },

  saveUserSport(userId, sportId, level, strengths, weaknesses) {
    const all = this.getUserSports();
    const idx = all.findIndex(us => us.userId === userId && us.sportId === sportId);
    const entry = { userId, sportId, level, strengths, weaknesses, updatedAt: Date.now() };
    if (idx === -1) { all.push(entry); }
    else { all[idx] = entry; }
    this.saveUserSports(all);
    return entry;
  },

  removeUserSport(userId, sportId) {
    const all = this.getUserSports().filter(us => !(us.userId === userId && us.sportId === sportId));
    this.saveUserSports(all);
  },

  // ---- Matches ----
  getMatches() { return this._get('matches') || []; },
  saveMatches(data) { this._set('matches', data); },

  getMatchById(id) {
    return this.getMatches().find(m => m.id === id) || null;
  },

  createMatch(data) {
    const matches = this.getMatches();
    const match = {
      id: Utils.uid(),
      title: data.title,
      sportId: data.sportId,
      creatorId: data.creatorId,
      date: data.date,
      time: data.time,
      location: data.location,
      city: data.city,
      maxParticipants: parseInt(data.maxParticipants),
      level: parseInt(data.level),
      description: data.description || '',
      rules: data.rules || '',
      isPublic: data.isPublic !== false,
      requiresApproval: data.requiresApproval !== false,
      status: 'open',
      ageMin: data.ageMin || null,
      ageMax: data.ageMax || null,
      createdAt: Date.now()
    };
    matches.push(match);
    this.saveMatches(matches);

    // Creator auto-joins as accepted participant
    this.addParticipant(match.id, data.creatorId, 'accepted');
    return match;
  },

  updateMatch(id, data) {
    const matches = this.getMatches();
    const idx = matches.findIndex(m => m.id === id);
    if (idx === -1) return null;
    matches[idx] = { ...matches[idx], ...data, updatedAt: Date.now() };
    this.saveMatches(matches);
    return matches[idx];
  },

  // ---- Match Participants ----
  getParticipants() { return this._get('participants') || []; },
  saveParticipants(data) { this._set('participants', data); },

  getMatchParticipants(matchId) {
    return this.getParticipants().filter(p => p.matchId === matchId);
  },

  getUserParticipation(matchId, userId) {
    return this.getParticipants().find(p => p.matchId === matchId && p.userId === userId) || null;
  },

  getUserMatches(userId) {
    const participations = this.getParticipants().filter(p => p.userId === userId && p.status === 'accepted');
    return participations.map(p => this.getMatchById(p.matchId)).filter(Boolean);
  },

  getUserRequests(userId) {
    return this.getParticipants().filter(p => p.userId === userId);
  },

  addParticipant(matchId, userId, status = 'pending') {
    const all = this.getParticipants();
    const existing = all.find(p => p.matchId === matchId && p.userId === userId);
    if (existing) {
      existing.status = status;
      existing.updatedAt = Date.now();
      this.saveParticipants(all);
      return existing;
    }
    const entry = { matchId, userId, status, checkedIn: false, joinedAt: Date.now(), updatedAt: Date.now() };
    all.push(entry);
    this.saveParticipants(all);
    return entry;
  },

  updateParticipantStatus(matchId, userId, status) {
    const all = this.getParticipants();
    const idx = all.findIndex(p => p.matchId === matchId && p.userId === userId);
    if (idx === -1) return null;
    all[idx].status = status;
    all[idx].updatedAt = Date.now();
    this.saveParticipants(all);

    // Update match status if needed
    const match = this.getMatchById(matchId);
    if (match) {
      const accepted = all.filter(p => p.matchId === matchId && p.status === 'accepted').length;
      if (accepted >= match.maxParticipants && match.status === 'open') {
        this.updateMatch(matchId, { status: 'full' });
      } else if (accepted < match.maxParticipants && match.status === 'full') {
        this.updateMatch(matchId, { status: 'open' });
      }
    }

    return all[idx];
  },

  // ---- Reviews ----
  getReviews() { return this._get('reviews') || []; },
  saveReviews(data) { this._set('reviews', data); },

  getReviewsForUser(userId) {
    return this.getReviews().filter(r => r.reviewedId === userId);
  },

  getUserAverageRating(userId) {
    const reviews = this.getReviewsForUser(userId);
    if (!reviews.length) return { sport: 0, behavior: 0, count: 0 };
    const sportAvg = reviews.reduce((acc, r) => acc + r.sportRating, 0) / reviews.length;
    const behaviorAvg = reviews.reduce((acc, r) => acc + r.behaviorRating, 0) / reviews.length;
    return { sport: sportAvg, behavior: behaviorAvg, count: reviews.length };
  },

  createReview(data) {
    const reviews = this.getReviews();
    // Prevent duplicate review
    const existing = reviews.find(r => r.matchId === data.matchId && r.reviewerId === data.reviewerId && r.reviewedId === data.reviewedId);
    if (existing) return existing;

    const review = {
      id: Utils.uid(),
      matchId: data.matchId,
      reviewerId: data.reviewerId,
      reviewedId: data.reviewedId,
      sportRating: data.sportRating,
      behaviorRating: data.behaviorRating,
      comment: data.comment || '',
      createdAt: Date.now()
    };
    reviews.push(review);
    this.saveReviews(reviews);
    return review;
  },

  hasReviewed(matchId, reviewerId, reviewedId) {
    return this.getReviews().some(r => r.matchId === matchId && r.reviewerId === reviewerId && r.reviewedId === reviewedId);
  },

  // ---- Notifications ----
  getNotifications() { return this._get('notifications') || []; },
  saveNotifications(data) { this._set('notifications', data); },

  getUserNotifications(userId) {
    return this.getNotifications()
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  getUnreadCount(userId) {
    return this.getNotifications().filter(n => n.userId === userId && !n.read).length;
  },

  createNotification(userId, type, message, data = {}) {
    const notifs = this.getNotifications();
    const notif = {
      id: Utils.uid(),
      userId,
      type,
      message,
      data,
      read: false,
      createdAt: Date.now()
    };
    notifs.push(notif);
    this.saveNotifications(notifs);
    return notif;
  },

  markNotifRead(notifId) {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === notifId);
    if (idx !== -1) {
      notifs[idx].read = true;
      this.saveNotifications(notifs);
    }
  },

  markAllNotifsRead(userId) {
    const notifs = this.getNotifications().map(n => {
      if (n.userId === userId) n.read = true;
      return n;
    });
    this.saveNotifications(notifs);
  },

  // ---- Reports ----
  getReports() { return this._get('reports') || []; },
  saveReports(data) { this._set('reports', data); },

  createReport(reporterId, targetId, targetType, reason, description) {
    const reports = this.getReports();
    const report = {
      id: Utils.uid(),
      reporterId,
      targetId,
      targetType,
      reason,
      description: description || '',
      status: 'pending',
      createdAt: Date.now()
    };
    reports.push(report);
    this.saveReports(reports);
    return report;
  },

  updateReportStatus(id, status) {
    const reports = this.getReports();
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      reports[idx].resolvedAt = Date.now();
      this.saveReports(reports);
    }
  },

  // ---- Session ----
  getSession() { return this._get('session'); },
  saveSession(userId) { this._set('session', { userId, loginAt: Date.now() }); },
  clearSession() { localStorage.removeItem('sportmatch_session'); },
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return this.getUserById(session.userId);
  },

  // ---- Sport helpers ----
  getSportById(id) { return this.SPORTS.find(s => s.id === id) || null; },
  getSportName(id) { return this.getSportById(id)?.name || id; },
  getSportIcon(id) { return this.getSportById(id)?.icon || '🏅'; },

  // ---- Stats ----
  getUserStats(userId) {
    const participations = this.getParticipants().filter(p => p.userId === userId);
    const accepted = participations.filter(p => p.status === 'accepted');
    const matches = accepted.map(p => this.getMatchById(p.matchId)).filter(Boolean);
    const past = matches.filter(m => Utils.isMatchPast(m) && m.status !== 'cancelled_match');
    const upcoming = matches.filter(m => !Utils.isMatchPast(m) && m.status !== 'cancelled_match');
    const ratings = this.getUserAverageRating(userId);

    return {
      totalMatches: past.length,
      upcomingMatches: upcoming.length,
      ratings,
      attendanceRate: this._calcAttendanceRate(userId)
    };
  },

  _calcAttendanceRate(userId) {
    const pastParticipations = this.getParticipants()
      .filter(p => p.userId === userId && p.status === 'accepted')
      .map(p => ({ p, match: this.getMatchById(p.matchId) }))
      .filter(({ match }) => match && Utils.isMatchPast(match));

    if (!pastParticipations.length) return null;
    const checkedIn = pastParticipations.filter(({ p }) => p.checkedIn).length;
    return Math.round((checkedIn / pastParticipations.length) * 100);
  },

  // ---- Seed demo data ----
  seedDemoData() {
    if (this._get('seeded')) return;

    // Create admin user
    const admin = this.createUser({
      name: 'Admin SportMatch',
      email: 'admin@sportmatch.com',
      password: 'admin123',
      city: 'São Paulo, SP'
    });
    this.updateUser(admin.id, { isAdmin: true, onboardingComplete: true });

    // Create demo users
    const users = [
      { name: 'João Silva', email: 'joao@demo.com', password: '123456', city: 'São Paulo, SP', bio: 'Jogador de futebol apaixonado. Adoro jogar no fim de semana com os amigos.' },
      { name: 'Pedro Santos', email: 'pedro@demo.com', password: '123456', city: 'São Paulo, SP', bio: 'Pratico esportes há 10 anos. Futebol e basquete são minha paixão.' },
      { name: 'Lucas Oliveira', email: 'lucas@demo.com', password: '123456', city: 'São Paulo, SP', bio: 'Vôlei e beach tennis. Sempre disposto a conhecer novos jogadores.' },
      { name: 'Maria Fernanda', email: 'maria@demo.com', password: '123456', city: 'São Paulo, SP', bio: 'Tenista há 5 anos. Busco jogadores para treinos regulares.' },
      { name: 'Ana Costa', email: 'ana@demo.com', password: '123456', city: 'Campinas, SP', bio: 'Corredora e ciclista. Amo esportes ao ar livre.' },
    ];

    const createdUsers = users.map(u => {
      const user = this.createUser(u);
      this.updateUser(user.id, { onboardingComplete: true });
      return user;
    });

    // Add sports to demo users
    this.saveUserSport(createdUsers[0].id, 'football', 3, ['Passe','Visão de jogo','Posicionamento'], ['Finalização','Velocidade']);
    this.saveUserSport(createdUsers[0].id, 'futsal', 2, ['Técnica','Jogo coletivo'], ['Velocidade','Dribles']);

    this.saveUserSport(createdUsers[1].id, 'football', 4, ['Drible','Velocidade','Finalização'], ['Jogo aéreo']);
    this.saveUserSport(createdUsers[1].id, 'basketball', 3, ['Arremesso','Passe'], ['Rebote']);

    this.saveUserSport(createdUsers[2].id, 'volleyball', 4, ['Saque','Ataque','Bloqueio'], ['Recepção']);
    this.saveUserSport(createdUsers[2].id, 'beach_tennis', 3, ['Saque','Defesa'], ['Smash']);

    this.saveUserSport(createdUsers[3].id, 'tennis', 4, ['Forehand','Consistência','Posicionamento'], ['Backhand','Saque potente']);

    this.saveUserSport(createdUsers[4].id, 'running', 3, ['Resistência','Pace'], ['Velocidade']);
    this.saveUserSport(createdUsers[4].id, 'cycling', 2, ['Resistência'], ['Subidas','Sprints']);

    // Create demo matches
    const today = new Date();
    const addDays = (d, n) => {
      const dd = new Date(d);
      dd.setDate(dd.getDate() + n);
      return dd.toISOString().split('T')[0];
    };

    const match1 = this.createMatch({
      title: 'Futebol Society — Final de Semana',
      sportId: 'football',
      creatorId: createdUsers[0].id,
      date: addDays(today, 3),
      time: '16:00',
      location: 'Arena Society Moema, R. Afonso Brás, 473',
      city: 'São Paulo, SP',
      maxParticipants: 14,
      level: 3,
      description: 'Partida amistosa de futebol society. Buscamos jogadores de nível intermediário. Campo de grama sintética, chuteira society obrigatória.',
      rules: 'Chuteira society obrigatória. Comunicar com antecedência caso não possa comparecer. Sem palavrões e falta violenta.',
      requiresApproval: true,
      isPublic: true
    });

    const match2 = this.createMatch({
      title: 'Vôlei de Praia — Tarde de Sábado',
      sportId: 'volleyball',
      creatorId: createdUsers[2].id,
      date: addDays(today, 5),
      time: '14:00',
      location: 'Parque Ibirapuera — Quadra de Areia',
      city: 'São Paulo, SP',
      maxParticipants: 12,
      level: 3,
      description: 'Vôlei de praia no Ibirapuera. Ambiente descontraído e amistoso. Todos os níveis são bem-vindos, mas preferência para intermediários.',
      rules: 'Trazer protetor solar e água. Respeitar todos os participantes.',
      requiresApproval: false,
      isPublic: true
    });

    const match3 = this.createMatch({
      title: 'Basquete 3x3 — Quinta à Noite',
      sportId: 'basketball',
      creatorId: createdUsers[1].id,
      date: addDays(today, 2),
      time: '19:30',
      location: 'Quadra Coberta Vila Mariana',
      city: 'São Paulo, SP',
      maxParticipants: 12,
      level: 3,
      description: 'Basquete 3x3 descontraído. Quem souber jogar está dentro!',
      rules: 'Tênis esportivo obrigatório. Máximo de 2 times por jogador na noite.',
      requiresApproval: true,
      isPublic: true
    });

    const match4 = this.createMatch({
      title: 'Tênis Dupla Mista — Domingo Manhã',
      sportId: 'tennis',
      creatorId: createdUsers[3].id,
      date: addDays(today, 6),
      time: '09:00',
      location: 'Clube Pinheiros — Quadra 7',
      city: 'São Paulo, SP',
      maxParticipants: 4,
      level: 4,
      description: 'Tênis dupla mista para jogadores avançados. Ambiente competitivo e saudável.',
      rules: 'Roupa esportiva branca preferencial. Trazer raquete.',
      requiresApproval: true,
      isPublic: true
    });

    const match5 = this.createMatch({
      title: 'Futsal Noturno — Terça-Feira',
      sportId: 'futsal',
      creatorId: createdUsers[0].id,
      date: addDays(today, 1),
      time: '21:00',
      location: 'Ginásio Municipal Ipiranga',
      city: 'São Paulo, SP',
      maxParticipants: 10,
      level: 2,
      description: 'Futsal para iniciantes e básicos. Sem pressão, só diversão!',
      rules: 'Chuteira futsal obrigatória. Todos os níveis até básico.',
      requiresApproval: false,
      isPublic: true
    });

    const pastMatch = this.createMatch({
      title: 'Futebol Society — Semana Passada',
      sportId: 'football',
      creatorId: createdUsers[0].id,
      date: addDays(today, -7),
      time: '16:00',
      location: 'Arena Society Moema',
      city: 'São Paulo, SP',
      maxParticipants: 14,
      level: 3,
      description: 'Partida encerrada.',
      rules: '',
      requiresApproval: false,
      isPublic: true
    });

    this.updateMatch(pastMatch.id, { status: 'completed' });

    // Add participants to matches
    this.addParticipant(match1.id, createdUsers[1].id, 'accepted');
    this.addParticipant(match1.id, createdUsers[4].id, 'pending');
    this.addParticipant(match2.id, createdUsers[0].id, 'accepted');
    this.addParticipant(match2.id, createdUsers[1].id, 'accepted');
    this.addParticipant(match3.id, createdUsers[2].id, 'accepted');
    this.addParticipant(match5.id, createdUsers[1].id, 'accepted');
    this.addParticipant(match5.id, createdUsers[2].id, 'accepted');

    // Add past match participants with check-in
    this.addParticipant(pastMatch.id, createdUsers[1].id, 'accepted');
    const allP = this.getParticipants();
    allP.forEach(p => {
      if (p.matchId === pastMatch.id) p.checkedIn = true;
    });
    this.saveParticipants(allP);

    // Add some reviews for past match
    this.createReview({
      matchId: pastMatch.id,
      reviewerId: createdUsers[0].id,
      reviewedId: createdUsers[1].id,
      sportRating: 4,
      behaviorRating: 5,
      comment: 'Ótimo jogador, muito respeitoso e pontual.'
    });

    this.createReview({
      matchId: pastMatch.id,
      reviewerId: createdUsers[1].id,
      reviewedId: createdUsers[0].id,
      sportRating: 5,
      behaviorRating: 4,
      comment: 'Jogou muito bem, grande visão de jogo.'
    });

    // Notifications for demo
    this.createNotification(createdUsers[0].id, 'match_request', 'Ana Costa solicitou participação na partida "Futebol Society — Final de Semana"', { matchId: match1.id });
    this.createNotification(createdUsers[0].id, 'review_received', 'Pedro Santos avaliou você com 5⭐ no esporte', {});

    this._set('seeded', true);
  }
};

// Seed demo data on first load
Store.seedDemoData();

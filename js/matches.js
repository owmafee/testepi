/* ============================================================
   SPORTMATCH — MATCHES.JS
   Match business logic
   ============================================================ */

const Matches = {
  // Search / filter matches
  search(filters = {}) {
    let matches = Store.getMatches();

    // Exclude cancelled
    matches = matches.filter(m => m.status !== 'cancelled_match');

    if (filters.sportId) {
      matches = matches.filter(m => m.sportId === filters.sportId);
    }

    if (filters.city) {
      matches = matches.filter(m =>
        m.city.toLowerCase().includes(filters.city.toLowerCase()) ||
        m.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.level) {
      matches = matches.filter(m => m.level === parseInt(filters.level));
    }

    if (filters.status) {
      matches = matches.filter(m => m.status === filters.status);
    }

    if (filters.upcoming) {
      matches = matches.filter(m => !Utils.isMatchPast(m));
    }

    if (filters.past) {
      matches = matches.filter(m => Utils.isMatchPast(m));
    }

    if (filters.hasSlots) {
      matches = matches.filter(m => {
        const accepted = Store.getMatchParticipants(m.id).filter(p => p.status === 'accepted').length;
        return accepted < m.maxParticipants && m.status === 'open';
      });
    }

    if (filters.isPublic !== undefined) {
      matches = matches.filter(m => m.isPublic === filters.isPublic);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      matches = matches.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        Store.getSportName(m.sportId).toLowerCase().includes(q)
      );
    }

    // Sort by date
    matches.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA - dateB;
    });

    return matches;
  },

  // Get recommended matches for a user
  getRecommended(userId, limit = 6) {
    const userSports = Store.getUserSportsByUserId(userId);
    const sportIds = userSports.map(us => us.sportId);
    const user = Store.getUserById(userId);

    let matches = this.search({ upcoming: true, isPublic: true });

    // Exclude matches user already joined
    const userParticipations = Store.getUserRequests(userId).map(p => p.matchId);
    matches = matches.filter(m => !userParticipations.includes(m.id) && m.creatorId !== userId);

    // Score matches by relevance
    matches = matches.map(m => {
      let score = 0;
      if (sportIds.includes(m.sportId)) score += 10;
      const userSport = userSports.find(us => us.sportId === m.sportId);
      if (userSport && Math.abs(userSport.level - m.level) <= 1) score += 5;
      if (user?.city && m.city === user.city) score += 3;
      return { match: m, score };
    });

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, limit).map(m => m.match);
  },

  // Request to join a match
  requestJoin(matchId, userId) {
    const match = Store.getMatchById(matchId);
    if (!match) return { success: false, error: 'Partida não encontrada.' };
    if (match.status === 'cancelled_match') return { success: false, error: 'Esta partida foi cancelada.' };

    const existing = Store.getUserParticipation(matchId, userId);
    if (existing) {
      if (existing.status === 'accepted') return { success: false, error: 'Você já está participando desta partida.' };
      if (existing.status === 'pending') return { success: false, error: 'Sua solicitação já está pendente.' };
      if (existing.status === 'declined') return { success: false, error: 'Sua solicitação foi recusada pelo administrador.' };
    }

    const accepted = Store.getMatchParticipants(matchId).filter(p => p.status === 'accepted').length;
    if (accepted >= match.maxParticipants) return { success: false, error: 'Esta partida está lotada.' };

    const status = match.requiresApproval ? 'pending' : 'accepted';
    Store.addParticipant(matchId, userId, status);

    // Notify match creator
    if (match.creatorId !== userId) {
      const user = Store.getUserById(userId);
      Store.createNotification(
        match.creatorId,
        'match_request',
        `${user?.name} solicitou participação em "${match.title}"`,
        { matchId, userId }
      );
    }

    return { success: true, status };
  },

  // Admin: approve/decline request
  handleRequest(matchId, userId, action, adminId) {
    const match = Store.getMatchById(matchId);
    if (!match) return { success: false, error: 'Partida não encontrada.' };
    if (match.creatorId !== adminId) return { success: false, error: 'Apenas o administrador pode gerenciar solicitações.' };

    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    Store.updateParticipantStatus(matchId, userId, newStatus);

    // Notify user
    const user = Store.getUserById(userId);
    const message = action === 'accept'
      ? `Sua solicitação para "${match.title}" foi aceita! 🎉`
      : `Sua solicitação para "${match.title}" foi recusada.`;

    Store.createNotification(userId, action === 'accept' ? 'request_accepted' : 'request_declined', message, { matchId });

    return { success: true };
  },

  // Cancel participation
  cancelParticipation(matchId, userId) {
    Store.updateParticipantStatus(matchId, userId, 'cancelled');
    const match = Store.getMatchById(matchId);
    if (match && match.creatorId !== userId) {
      const user = Store.getUserById(userId);
      Store.createNotification(
        match.creatorId,
        'participant_left',
        `${user?.name} cancelou participação em "${match.title}"`,
        { matchId }
      );
    }
    return { success: true };
  },

  // Cancel match (creator only)
  cancelMatch(matchId, creatorId) {
    const match = Store.getMatchById(matchId);
    if (!match) return { success: false, error: 'Partida não encontrada.' };
    if (match.creatorId !== creatorId) return { success: false, error: 'Apenas o criador pode cancelar a partida.' };

    Store.updateMatch(matchId, { status: 'cancelled_match' });

    // Notify all accepted participants
    const participants = Store.getMatchParticipants(matchId).filter(p => p.status === 'accepted' && p.userId !== creatorId);
    participants.forEach(p => {
      Store.createNotification(p.userId, 'match_cancelled', `A partida "${match.title}" foi cancelada.`, { matchId });
    });

    return { success: true };
  },

  // Check-in
  checkIn(matchId, userId) {
    const all = Store.getParticipants();
    const idx = all.findIndex(p => p.matchId === matchId && p.userId === userId);
    if (idx !== -1) {
      all[idx].checkedIn = true;
      all[idx].checkedInAt = Date.now();
      Store.saveParticipants(all);
    }
    return { success: true };
  },

  // Get match with enriched data
  getMatchDetails(matchId) {
    const match = Store.getMatchById(matchId);
    if (!match) return null;

    const participants = Store.getMatchParticipants(matchId);
    const accepted = participants.filter(p => p.status === 'accepted');
    const pending = participants.filter(p => p.status === 'pending');
    const sport = Store.getSportById(match.sportId);
    const creator = Store.getUserById(match.creatorId);

    return {
      ...match,
      sport,
      creator,
      participants: accepted.map(p => ({ ...p, user: Store.getUserById(p.userId) })),
      pendingRequests: pending.map(p => ({ ...p, user: Store.getUserById(p.userId) })),
      acceptedCount: accepted.length,
      slotsLeft: match.maxParticipants - accepted.length,
      isPast: Utils.isMatchPast(match)
    };
  }
};

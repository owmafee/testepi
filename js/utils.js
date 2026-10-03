/* ============================================================
   SPORTMATCH — UTILS.JS
   Utility functions used across the app
   ============================================================ */

const Utils = {
  // Generate a unique ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // Format date to pt-BR
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatDateShort(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  },

  formatTime(timeStr) {
    if (!timeStr) return '—';
    return timeStr.substring(0, 5);
  },

  formatDateTime(dateStr, timeStr) {
    return `${this.formatDate(dateStr)} às ${this.formatTime(timeStr)}`;
  },

  // Relative time
  timeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return this.formatDate(new Date(timestamp).toISOString().split('T')[0]);
    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'agora mesmo';
  },

  // Avatar initials
  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  },

  // Render avatar HTML
  renderAvatar(user, sizeClass = 'avatar-md') {
    const initials = this.getInitials(user?.name || '?');
    const colors = ['#6c63ff','#00d4aa','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#10b981'];
    const colorIndex = (user?.name || '').charCodeAt(0) % colors.length;
    const bg = colors[colorIndex];

    if (user?.avatar) {
      return `<div class="avatar ${sizeClass}"><img src="${user.avatar}" alt="${user.name}" loading="lazy" /></div>`;
    }
    return `<div class="avatar ${sizeClass}" style="background: ${bg};">${initials}</div>`;
  },

  // Render star rating
  renderStars(rating, max = 5, interactive = false) {
    let html = `<div class="stars ${interactive ? 'stars-interactive' : ''}">`;
    for (let i = 1; i <= max; i++) {
      const filled = i <= Math.floor(rating) ? 'filled' : (i - 0.5 <= rating ? 'half' : '');
      html += `<span class="star ${filled}" data-value="${i}">★</span>`;
    }
    html += `</div>`;
    return html;
  },

  // Render level badge
  renderLevelBadge(level) {
    const levels = {
      1: { label: 'Iniciante', class: 'level-1' },
      2: { label: 'Básico', class: 'level-2' },
      3: { label: 'Intermediário', class: 'level-3' },
      4: { label: 'Avançado', class: 'level-4' },
      5: { label: 'Competitivo', class: 'level-5' }
    };
    const l = levels[level] || levels[1];
    return `<span class="badge ${l.class}">${l.label}</span>`;
  },

  // Level label only
  levelLabel(level) {
    const labels = { 1: 'Iniciante', 2: 'Básico', 3: 'Intermediário', 4: 'Avançado', 5: 'Competitivo' };
    return labels[level] || 'Iniciante';
  },

  // Sport banner gradient
  sportGradient(sportId) {
    const gradients = {
      football: 'linear-gradient(135deg, #22c55e, #16a34a)',
      futsal: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      volleyball: 'linear-gradient(135deg, #f59e0b, #d97706)',
      basketball: 'linear-gradient(135deg, #ef4444, #dc2626)',
      handball: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      tennis: 'linear-gradient(135deg, #eab308, #ca8a04)',
      beach_tennis: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      padel: 'linear-gradient(135deg, #f97316, #ea580c)',
      badminton: 'linear-gradient(135deg, #a855f7, #9333ea)',
      running: 'linear-gradient(135deg, #10b981, #059669)',
      cycling: 'linear-gradient(135deg, #6c63ff, #4f48d4)',
      other: 'linear-gradient(135deg, #6b7280, #4b5563)'
    };
    return gradients[sportId] || gradients.other;
  },

  // Status badge
  renderStatusBadge(status) {
    const statuses = {
      pending:  { label: 'Pendente', class: 'badge-warning' },
      accepted: { label: 'Aceito', class: 'badge-success' },
      declined: { label: 'Recusado', class: 'badge-danger' },
      cancelled:{ label: 'Cancelado', class: 'badge-muted' },
      waitlist: { label: 'Lista de espera', class: 'badge-muted' },
      open:     { label: 'Aberta', class: 'badge-success' },
      full:     { label: 'Lotada', class: 'badge-danger' },
      completed:{ label: 'Encerrada', class: 'badge-muted' },
      cancelled_match: { label: 'Cancelada', class: 'badge-danger' }
    };
    const s = statuses[status] || { label: status, class: 'badge-muted' };
    return `<span class="badge ${s.class}">${s.label}</span>`;
  },

  // Is match in the past?
  isMatchPast(match) {
    const matchDate = new Date(match.date + 'T' + match.time);
    return matchDate < new Date();
  },

  // Is match today?
  isMatchToday(match) {
    const today = new Date().toISOString().split('T')[0];
    return match.date === today;
  },

  // Escape HTML
  esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  // Toast notifications
  toast(type, title, message = '', duration = 4000) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const container = document.getElementById('toast-container') || (() => {
      const el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-container';
      document.body.appendChild(el);
      return el;
    })();

    const id = Utils.uid();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${id}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '💬'}</span>
      <div class="toast-content">
        <div class="toast-title">${Utils.esc(title)}</div>
        ${message ? `<div class="toast-message">${Utils.esc(message)}</div>` : ''}
      </div>
      <span class="toast-close" onclick="document.getElementById('toast-${id}').remove()">✕</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      const el = document.getElementById(`toast-${id}`);
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
      }
    }, duration);
  },

  // Show modal
  showModal(content, size = '') {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = `<div class="modal ${size}">${content}</div>`;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
    return overlay;
  },

  closeModal() {
    const modal = document.getElementById('active-modal');
    if (modal) modal.remove();
  },

  // Confirm dialog
  confirm(title, message, onConfirm, confirmText = 'Confirmar', dangerClass = false) {
    const content = `
      <div class="modal-header">
        <h3 class="modal-title">${Utils.esc(title)}</h3>
        <button class="modal-close" onclick="Utils.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p style="color: var(--text-secondary);">${Utils.esc(message)}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Utils.closeModal()">Cancelar</button>
        <button class="btn ${dangerClass ? 'btn-danger' : 'btn-primary'}" id="confirm-btn">${Utils.esc(confirmText)}</button>
      </div>
    `;
    const modal = Utils.showModal(content, 'modal-sm');
    document.getElementById('confirm-btn').addEventListener('click', () => {
      Utils.closeModal();
      onConfirm();
    });
  },

  // Simple hash for passwords (demonstration only — not cryptographically secure)
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  },

  // Debounce
  debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // Navigate
  navigate(hash) {
    window.location.hash = hash;
  },

  // Pluralize
  pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
  }
};

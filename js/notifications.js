/* ============================================================
   SPORTMATCH — NOTIFICATIONS.JS
   Notification icons and helpers
   ============================================================ */

const Notifications = {
  ICONS: {
    match_request:    { icon: '👋', bg: 'rgba(108,99,255,0.1)', color: 'var(--primary-light)' },
    request_accepted: { icon: '✅', bg: 'rgba(34,197,94,0.1)', color: 'var(--success)' },
    request_declined: { icon: '❌', bg: 'rgba(239,68,68,0.1)', color: 'var(--danger)' },
    match_cancelled:  { icon: '🚫', bg: 'rgba(239,68,68,0.1)', color: 'var(--danger)' },
    participant_left: { icon: '🚪', bg: 'rgba(245,158,11,0.1)', color: 'var(--warning)' },
    review_received:  { icon: '⭐', bg: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
    match_reminder:   { icon: '⏰', bg: 'rgba(59,130,246,0.1)', color: 'var(--info)' },
    default:          { icon: '🔔', bg: 'rgba(108,99,255,0.1)', color: 'var(--primary-light)' }
  },

  getIcon(type) {
    return this.ICONS[type] || this.ICONS.default;
  },

  renderNotifItem(notif) {
    const { icon, bg, color } = this.getIcon(notif.type);
    const unreadClass = !notif.read ? 'unread' : '';
    const navLink = notif.data?.matchId ? `#/match/${notif.data.matchId}` : '#/notifications';

    return `
      <div class="notif-item ${unreadClass}" data-notif-id="${notif.id}" onclick="Notifications.handleClick('${notif.id}', '${navLink}')">
        <div class="notif-icon-wrap" style="background:${bg}; color:${color};">
          ${icon}
        </div>
        <div class="notif-content">
          <div class="notif-message">${Utils.esc(notif.message)}</div>
          <div class="notif-time">${Utils.timeAgo(notif.createdAt)}</div>
        </div>
        ${!notif.read ? '<div class="notif-unread-dot"></div>' : ''}
      </div>
    `;
  },

  handleClick(notifId, navLink) {
    Store.markNotifRead(notifId);
    App.updateNavBadge();
    if (navLink && navLink !== '#/notifications') {
      window.location.hash = navLink;
    } else {
      // Re-render current page if on notifications
      const item = document.querySelector(`[data-notif-id="${notifId}"]`);
      if (item) {
        item.classList.remove('unread');
        const dot = item.querySelector('.notif-unread-dot');
        if (dot) dot.remove();
      }
    }
  }
};

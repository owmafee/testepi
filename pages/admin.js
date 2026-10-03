/* ============================================================
   SPORTMATCH — ADMIN PAGE (DASHBOARD)
   ============================================================ */

const AdminPage = {
  render() {
    if (!Auth.requireAdmin()) return '';

    const allUsers = Store.getUsers();
    const allMatches = Store.getMatches();
    const allReports = Store.getReports();

    return `
      <div class="main-content">
        <div style="max-width:1000px;margin:0 auto;padding:24px;">
          <h1 style="margin-bottom:24px;font-family:var(--font-head);font-size:1.75rem;">🛡️ Painel Administrativo</h1>
          
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;margin-bottom:32px;">
            <div class="stat-card">
              <div class="stat-label">Total de Usuários</div>
              <div class="stat-value">${allUsers.length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total de Partidas</div>
              <div class="stat-value">${allMatches.length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Denúncias Abertas</div>
              <div class="stat-value" style="color:var(--danger);">${allReports.filter(r => r.status === 'open').length}</div>
            </div>
          </div>

          <div class="card mb-5">
            <div class="card-header"><h4>Denúncias Recentes</h4></div>
            <div class="card-body">
              ${allReports.length ? `
                <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
                  <tr style="border-bottom:1px solid var(--border);text-align:left;">
                    <th style="padding:12px 8px;">ID</th>
                    <th style="padding:12px 8px;">Tipo</th>
                    <th style="padding:12px 8px;">Motivo</th>
                    <th style="padding:12px 8px;">Status</th>
                    <th style="padding:12px 8px;">Ação</th>
                  </tr>
                  ${allReports.slice(0, 5).map(r => `
                    <tr style="border-bottom:1px solid var(--border);">
                      <td style="padding:12px 8px;">#${r.id.substring(0,6)}</td>
                      <td style="padding:12px 8px;">${r.targetType}</td>
                      <td style="padding:12px 8px;">${Utils.esc(r.reason)}</td>
                      <td style="padding:12px 8px;">${Utils.renderStatusBadge(r.status)}</td>
                      <td style="padding:12px 8px;"><button class="btn btn-outline btn-sm" onclick="AdminPage.resolveReport('${r.id}')">Resolver</button></td>
                    </tr>
                  `).join('')}
                </table>
              ` : '<p style="color:var(--text-muted);">Nenhuma denúncia encontrada.</p>'}
            </div>
          </div>

        </div>
        ${App.renderMobileNav('')}
      </div>
    `;
  },

  resolveReport(id) {
    Store.resolveReport(id);
    Utils.toast('success', 'Denúncia resolvida!');
    App.renderPage();
  },

  afterRender() {}
};

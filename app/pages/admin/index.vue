<template>
  <div>
    <div class="admin-page-header">
      <h1 class="admin-page-title">Tableau de bord</h1>
      <p class="admin-page-desc">Vue d'ensemble de la plateforme CAP ALI</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-card--green">
        <div class="kpi-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div class="kpi-card__data">
          <span class="kpi-card__number">{{ stats?.users?.total ?? '—' }}</span>
          <span class="kpi-card__label">Utilisateurs inscrits</span>
        </div>
        <span class="kpi-card__badge">+{{ stats?.users?.newThisMonth ?? 0 }} ce mois</span>
      </div>

      <div class="kpi-card kpi-card--gold">
        <div class="kpi-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <div class="kpi-card__data">
          <span class="kpi-card__number">{{ stats?.pendingMentors ?? '—' }}</span>
          <span class="kpi-card__label">Mentors en attente</span>
        </div>
        <NuxtLink to="/admin/mentors?filter=pending" class="kpi-card__link">Voir →</NuxtLink>
      </div>

      <div class="kpi-card kpi-card--blue">
        <div class="kpi-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div class="kpi-card__data">
          <span class="kpi-card__number">{{ stats?.mentorships?.accepted ?? '—' }}</span>
          <span class="kpi-card__label">Mentorats actifs</span>
        </div>
        <span class="kpi-card__sub">{{ stats?.mentorships?.pending ?? 0 }} en attente</span>
      </div>

      <div class="kpi-card kpi-card--red">
        <div class="kpi-card__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <div class="kpi-card__data">
          <span class="kpi-card__number">{{ stats?.flaggedPosts ?? '—' }}</span>
          <span class="kpi-card__label">Posts signalés</span>
        </div>
        <NuxtLink to="/admin/moderation" class="kpi-card__link">Modérer →</NuxtLink>
      </div>
    </div>

    <!-- Secondary stats -->
    <div class="stats-row">
      <div class="stat-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <div>
          <span class="stat-card__number">{{ stats?.resources ?? 0 }}</span>
          <span class="stat-card__label">Ressources publiées</span>
        </div>
      </div>
      <div class="stat-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <div>
          <span class="stat-card__number">{{ stats?.upcomingEvents ?? 0 }}</span>
          <span class="stat-card__label">Événements à venir</span>
        </div>
      </div>
      <div class="stat-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <div>
          <span class="stat-card__number">{{ stats?.mentorships?.closed ?? 0 }}</span>
          <span class="stat-card__label">Mentorats clôturés</span>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="quick-actions">
      <h2 class="quick-actions__title">Actions rapides</h2>
      <div class="quick-actions__grid">
        <NuxtLink to="/admin/resources/new" class="quick-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle ressource
        </NuxtLink>
        <NuxtLink to="/admin/events/new" class="quick-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvel événement
        </NuxtLink>
        <NuxtLink to="/admin/mentors?filter=pending" class="quick-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Valider les mentors
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data: statsData } = await useFetch('/api/admin/stats')
const stats = computed(() => statsData.value?.data)
</script>

<style scoped>
.admin-page-header { margin-bottom: var(--space-8); }
.admin-page-title { font-family: var(--font-serif); font-size: var(--text-3xl); font-weight: 700; color: var(--neutral-900); margin-bottom: var(--space-1); }
.admin-page-desc { font-size: var(--text-sm); color: var(--neutral-500); }

/* KPI Grid */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-bottom: var(--space-6); }

.kpi-card { background: var(--neutral-0); border-radius: var(--radius-xl); padding: var(--space-6); border: 1px solid var(--neutral-100); display: flex; flex-direction: column; gap: var(--space-3); transition: all var(--transition-base); position: relative; overflow: hidden; }
.kpi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.kpi-card--green::before { background: var(--green-500); }
.kpi-card--gold::before { background: var(--gold-500); }
.kpi-card--blue::before { background: #3b82f6; }
.kpi-card--red::before { background: var(--red-500); }
.kpi-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.kpi-card__icon { width: 44px; height: 44px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; }
.kpi-card--green .kpi-card__icon { background: var(--green-50); color: var(--green-600); }
.kpi-card--gold .kpi-card__icon { background: var(--gold-50); color: var(--gold-600); }
.kpi-card--blue .kpi-card__icon { background: #eff6ff; color: #3b82f6; }
.kpi-card--red .kpi-card__icon { background: var(--red-50); color: var(--red-500); }

.kpi-card__number { font-size: var(--text-3xl); font-weight: 700; color: var(--neutral-900); display: block; }
.kpi-card__label { font-size: var(--text-sm); color: var(--neutral-500); }

.kpi-card__badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full); background: var(--green-50); color: var(--green-600); align-self: flex-start; }
.kpi-card__link { font-size: var(--text-sm); font-weight: 600; color: var(--green-600); }
.kpi-card__link:hover { text-decoration: underline; }
.kpi-card__sub { font-size: var(--text-xs); color: var(--neutral-400); }

/* Stats row */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-bottom: var(--space-8); }
.stat-card { background: var(--neutral-0); border-radius: var(--radius-lg); padding: var(--space-5); border: 1px solid var(--neutral-100); display: flex; align-items: center; gap: var(--space-4); color: var(--neutral-400); }
.stat-card__number { font-size: var(--text-xl); font-weight: 700; color: var(--neutral-900); display: block; }
.stat-card__label { font-size: var(--text-sm); color: var(--neutral-500); }

/* Quick actions */
.quick-actions__title { font-size: var(--text-lg); font-weight: 600; color: var(--neutral-900); margin-bottom: var(--space-4); }
.quick-actions__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
.quick-action { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); background: var(--neutral-0); border: 1px solid var(--neutral-200); border-radius: var(--radius-lg); font-size: var(--text-sm); font-weight: 500; color: var(--neutral-700); transition: all var(--transition-fast); }
.quick-action:hover { border-color: var(--green-300); color: var(--green-600); background: var(--green-50); }

@media (max-width: 1024px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .kpi-grid, .stats-row, .quick-actions__grid { grid-template-columns: 1fr; }
}
</style>

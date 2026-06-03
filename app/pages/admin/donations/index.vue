<template>
  <div class="donations-page">
    <h1 class="page-title">Gestion des Dons</h1>

    <div v-if="pending" class="loading-state">
      Chargement...
    </div>
    
    <template v-else>
      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__label">Montant total récolté</p>
            <h3 class="stat-card__value">{{ stats?.totalAmount || 0 }} €</h3>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__label">Nombre de donateurs</p>
            <h3 class="stat-card__value">{{ stats?.totalDonors || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-card__content">
            <p class="stat-card__label">Dons réussis</p>
            <h3 class="stat-card__value">{{ stats?.totalCompletedDonations || 0 }}</h3>
          </div>
        </div>
      </div>

      <!-- Liste des dons -->
      <div class="donations-table-wrapper">
        <div class="donations-table-header">
          <h2 class="table-title">Derniers dons</h2>
        </div>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donateur</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="donationsList.length === 0">
                <td colspan="5" class="empty-state">Aucun don enregistré pour le moment.</td>
              </tr>
              <tr v-for="donation in donationsList" :key="donation.id">
                <td class="whitespace-nowrap">{{ formatDate(donation.createdAt) }}</td>
                <td>
                  <div class="donor-name">{{ donation.firstName }} {{ donation.lastName }}</div>
                  <div class="donor-email">{{ donation.email }}</div>
                </td>
                <td class="whitespace-nowrap font-bold">{{ donation.amount }} €</td>
                <td class="whitespace-nowrap capitalize">{{ donation.method }}</td>
                <td class="whitespace-nowrap">
                  <span class="status-badge" :class="`status-badge--${donation.status}`">
                    {{ donation.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { data: response, pending } = await useFetch<any>('/api/admin/donations')
const donationsList = computed(() => response.value?.data || [])
const stats = computed(() => response.value?.stats)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.page-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: var(--space-6);
}

.loading-state {
  text-align: center;
  padding: var(--space-10) 0;
  color: var(--neutral-500);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-card__icon--green {
  background: var(--green-100);
  color: var(--green-600);
}
.stat-card__icon--blue {
  background: #dbeafe;
  color: #2563eb;
}
.stat-card__icon--purple {
  background: #f3e8ff;
  color: #9333ea;
}

.stat-card__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-500);
  margin-bottom: 2px;
}

.stat-card__value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--neutral-900);
}

/* Table */
.donations-table-wrapper {
  background: var(--neutral-0);
  border-radius: var(--radius-xl);
  border: 1px solid var(--neutral-200);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.donations-table-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--neutral-200);
}

.table-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--neutral-900);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: var(--text-sm);
}

.data-table th {
  padding: var(--space-4) var(--space-6);
  background: var(--neutral-50);
  color: var(--neutral-700);
  font-weight: 600;
  text-transform: uppercase;
  font-size: var(--text-xs);
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--neutral-200);
}

.data-table td {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--neutral-100);
  color: var(--neutral-600);
}

.data-table tbody tr:hover {
  background: var(--neutral-50);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: var(--space-8) !important;
  color: var(--neutral-500) !important;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.font-bold {
  font-weight: 700;
  color: var(--neutral-900);
}

.capitalize {
  text-transform: capitalize;
}

.donor-name {
  font-weight: 500;
  color: var(--neutral-900);
}

.donor-email {
  font-size: var(--text-xs);
  color: var(--neutral-500);
  margin-top: 2px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}
.status-badge--completed {
  background: var(--green-100);
  color: var(--green-800);
}
.status-badge--pending {
  background: #fef08a; /* yellow-200 */
  color: #854d0e; /* yellow-800 */
}
.status-badge--failed {
  background: var(--red-100);
  color: var(--red-800);
}
</style>

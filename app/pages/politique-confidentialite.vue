<template>
  <div class="privacy-page">
    <header class="privacy-hero">
      <div class="privacy-hero__glow privacy-hero__glow--one" aria-hidden="true"></div>
      <div class="privacy-hero__glow privacy-hero__glow--two" aria-hidden="true"></div>

      <div class="privacy-container privacy-hero__content">
        <div class="privacy-hero__icon" aria-hidden="true">
          <svg
            class="privacy-svg privacy-svg--hero"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <p class="privacy-eyebrow">CAP ALI · Protection des données</p>
        <h1>Politique de confidentialité</h1>
        <p class="privacy-hero__lead">
          Une information claire sur les données que nous collectons, leur utilisation
          et les moyens mis en œuvre pour les protéger.
        </p>

        <div class="privacy-meta" aria-label="Informations sur la politique">
          <span class="privacy-meta__item">
            <svg
              class="privacy-svg privacy-svg--meta"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
            Mise à jour le 16 août 2026
          </span>
          <span class="privacy-meta__divider" aria-hidden="true"></span>
          <span class="privacy-meta__item">
            <svg
              class="privacy-svg privacy-svg--meta"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Conforme au RGPD
          </span>
        </div>
      </div>
    </header>

    <main class="privacy-container privacy-layout">
      <aside class="privacy-sidebar" aria-label="Sommaire de la politique">
        <div class="privacy-sidebar__card">
          <p class="privacy-sidebar__title">Dans cette page</p>
          <nav>
            <a href="#donnees-collectees"><span>01</span>Données collectées</a>
            <a href="#utilisation"><span>02</span>Utilisation des données</a>
            <a href="#partage"><span>03</span>Partage des données</a>
            <a href="#securite"><span>04</span>Sécurité des données</a>
            <a href="#droits"><span>05</span>Vos droits</a>
            <a href="#cookies"><span>06</span>Cookies</a>
          </nav>
        </div>

        <div class="privacy-contact">
          <span class="privacy-contact__label">Une question ?</span>
          <p>Notre équipe peut vous renseigner sur l’utilisation de vos données.</p>
          <a href="mailto:privacy@capali.org">privacy@capali.org</a>
        </div>
      </aside>

      <article class="privacy-card">
        <div class="privacy-intro">
          <span class="privacy-intro__line" aria-hidden="true"></span>
          <p>
            L’association <strong>CAP ALI</strong> s’engage à respecter la vie privée de
            ses utilisateurs. Cette politique explique quelles informations nous
            collectons, pourquoi nous les utilisons et comment nous les protégeons
            lorsque vous utilisez la plateforme capali.org.
          </p>
        </div>

        <section id="donnees-collectees" class="privacy-section">
          <div class="privacy-section__heading">
            <span class="privacy-section__number">01</span>
            <div>
              <p class="privacy-section__kicker">Ce que nous enregistrons</p>
              <h2>Données collectées</h2>
            </div>
          </div>

          <p>Nous collectons uniquement les informations nécessaires au fonctionnement de la plateforme.</p>

          <div class="privacy-data-grid">
            <div class="privacy-data-card">
              <span class="privacy-data-card__icon" aria-hidden="true">A</span>
              <div>
                <h3>Informations de compte</h3>
                <p>Nom, prénom, adresse e-mail et mot de passe chiffré.</p>
              </div>
            </div>
            <div class="privacy-data-card">
              <span class="privacy-data-card__icon" aria-hidden="true">M</span>
              <div>
                <h3>Profil et mentorat</h3>
                <p>Parcours d’études, ville, projet professionnel, type de profil et réponses aux tests d’orientation.</p>
              </div>
            </div>
            <div class="privacy-data-card">
              <span class="privacy-data-card__icon" aria-hidden="true">P</span>
              <div>
                <h3>Paiements et dons</h3>
                <p>Historique des transactions. Les données bancaires sont traitées par Stripe ou Kkiapay et ne transitent pas par nos serveurs.</p>
              </div>
            </div>
            <div class="privacy-data-card">
              <span class="privacy-data-card__icon" aria-hidden="true">N</span>
              <div>
                <h3>Données de navigation</h3>
                <p>Journaux de connexion et adresse IP, uniquement pour des raisons de sécurité.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="utilisation" class="privacy-section">
          <div class="privacy-section__heading">
            <span class="privacy-section__number">02</span>
            <div>
              <p class="privacy-section__kicker">Pourquoi nous les utilisons</p>
              <h2>Utilisation de vos données</h2>
            </div>
          </div>

          <p>Vos données sont utilisées exclusivement pour les finalités suivantes :</p>
          <ul class="privacy-check-list">
            <li>Fournir et maintenir l’accès à la plateforme communautaire et au forum.</li>
            <li>Organiser les mises en relation entre mentors et mentorés.</li>
            <li>Traiter les inscriptions aux événements et l’envoi de billets.</li>
            <li>Gérer les dons et émettre, lorsque nécessaire, les reçus correspondants.</li>
            <li>Envoyer les notifications importantes liées à votre compte ou à nos activités.</li>
          </ul>
        </section>

        <section id="partage" class="privacy-section">
          <div class="privacy-section__heading">
            <span class="privacy-section__number">03</span>
            <div>
              <p class="privacy-section__kicker">Nos engagements</p>
              <h2>Partage des données</h2>
            </div>
          </div>

          <div class="privacy-highlight">
            <div class="privacy-highlight__icon" aria-hidden="true">
              <svg
                class="privacy-svg privacy-svg--highlight"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3>Vos données ne sont pas commercialisées.</h3>
              <p>
                CAP ALI ne vend, ne loue ni ne cède vos données personnelles à des tiers.
                Elles sont partagées uniquement avec les prestataires techniques indispensables
                au fonctionnement du service : hébergement, e-mailing et paiement.
              </p>
            </div>
          </div>
        </section>

        <section id="securite" class="privacy-section">
          <div class="privacy-section__heading">
            <span class="privacy-section__number">04</span>
            <div>
              <p class="privacy-section__kicker">Comment nous les protégeons</p>
              <h2>Sécurité des données</h2>
            </div>
          </div>

          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger
            vos données contre toute destruction, perte, altération ou consultation non autorisée.
            Les communications avec la plateforme sont chiffrées via HTTPS et les mots de passe sont hashés.
          </p>
          <div class="privacy-security-row">
            <span>Connexion HTTPS</span>
            <span>Mots de passe hashés</span>
            <span>Accès contrôlés</span>
          </div>
        </section>

        <section id="droits" class="privacy-section">
          <div class="privacy-section__heading">
            <span class="privacy-section__number">05</span>
            <div>
              <p class="privacy-section__kicker">Vous gardez le contrôle</p>
              <h2>Vos droits au titre du RGPD</h2>
            </div>
          </div>

          <p>Conformément à la réglementation européenne, vous disposez des droits suivants :</p>
          <div class="privacy-rights-grid">
            <div>
              <span>01</span>
              <h3>Droit d’accès</h3>
              <p>Demander une copie des données que nous détenons sur vous.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Droit de rectification</h3>
              <p>Faire corriger toute information personnelle inexacte.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Droit à l’effacement</h3>
              <p>Demander la suppression de votre compte et de vos données.</p>
            </div>
            <div>
              <span>04</span>
              <h3>Droit d’opposition</h3>
              <p>Vous opposer à certains traitements de vos informations.</p>
            </div>
          </div>

          <p class="privacy-rights-contact">
            Pour exercer vos droits, écrivez-nous à
            <a href="mailto:privacy@capali.org">privacy@capali.org</a>.
          </p>
        </section>

        <section id="cookies" class="privacy-section privacy-section--last">
          <div class="privacy-section__heading">
            <span class="privacy-section__number">06</span>
            <div>
              <p class="privacy-section__kicker">Une utilisation limitée</p>
              <h2>Cookies</h2>
            </div>
          </div>

          <p>
            La plateforme utilise uniquement des cookies techniques, comme
            <code>capali_session</code>, strictement nécessaires au bon fonctionnement
            de votre session. Nous n’utilisons aucun traceur publicitaire invasif.
          </p>
        </section>

        <footer class="privacy-card__footer">
          <span>CAP ALI</span>
          <p>Orientation · Mentorat · Intégration</p>
        </footer>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Politique de confidentialité | CAP ALI',
  meta: [
    {
      name: 'description',
      content: 'Politique de confidentialité et protection des données personnelles de CAP ALI.',
    },
  ],
})
</script>

<style scoped>
.privacy-page,
.privacy-page * {
  box-sizing: border-box;
}

.privacy-page {
  --privacy-green-950: var(--green-950, #072f27);
  --privacy-green-900: var(--green-900, #0b493b);
  --privacy-green-800: var(--green-800, #12604e);
  --privacy-green-700: var(--green-700, #17755e);
  --privacy-green-100: var(--green-100, #dff1ea);
  --privacy-green-50: var(--green-50, #f0f8f5);
  --privacy-gold: var(--gold-500, #d7aa52);
  --privacy-ink: var(--neutral-950, #17211e);
  --privacy-text: var(--neutral-700, #4d5c57);
  --privacy-muted: var(--neutral-500, #73807b);
  --privacy-border: var(--neutral-200, #e3e8e5);
  --privacy-surface: var(--neutral-50, #f7f9f8);
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--privacy-text);
  background: var(--privacy-surface);
  font-family: inherit;
}

.privacy-container {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
}

.privacy-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 112px 0 124px;
  color: #fff;
  background:
    linear-gradient(118deg, rgba(5, 48, 39, 0.98), rgba(14, 91, 72, 0.94)),
    var(--privacy-green-900);
}

.privacy-hero::after {
  position: absolute;
  right: -90px;
  bottom: -210px;
  z-index: -1;
  width: 520px;
  height: 520px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  content: '';
}

.privacy-hero__glow {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  filter: blur(2px);
  pointer-events: none;
}

.privacy-hero__glow--one {
  top: -140px;
  right: 8%;
  width: 390px;
  height: 390px;
  background: rgba(36, 148, 116, 0.22);
}

.privacy-hero__glow--two {
  bottom: -130px;
  left: 7%;
  width: 280px;
  height: 280px;
  background: rgba(215, 170, 82, 0.13);
}

.privacy-hero__content {
  position: relative;
}

.privacy-hero__icon {
  display: grid;
  width: 58px;
  height: 58px;
  margin-bottom: 28px;
  place-items: center;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.09);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.13);
  backdrop-filter: blur(10px);
}

.privacy-svg {
  display: block !important;
  flex: 0 0 auto !important;
  max-width: none !important;
}

.privacy-svg--hero {
  width: 28px !important;
  height: 28px !important;
}

.privacy-svg--meta {
  width: 18px !important;
  height: 18px !important;
}

.privacy-svg--highlight {
  width: 24px !important;
  height: 24px !important;
}

.privacy-eyebrow,
.privacy-section__kicker,
.privacy-sidebar__title,
.privacy-contact__label {
  margin: 0;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.privacy-eyebrow {
  margin-bottom: 15px;
  color: #b8e0d4;
}

.privacy-hero h1 {
  max-width: 820px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.55rem, 6vw, 4.7rem);
  font-weight: 720;
  line-height: 1.02;
  letter-spacing: -0.055em;
}

.privacy-hero__lead {
  max-width: 680px;
  margin: 26px 0 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: clamp(1.02rem, 2vw, 1.24rem);
  line-height: 1.72;
}

.privacy-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 38px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.9rem;
  font-weight: 650;
}

.privacy-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.privacy-meta__divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.22);
}

.privacy-layout {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-top: -58px;
  padding-bottom: 100px;
}

.privacy-sidebar {
  position: sticky;
  top: 28px;
  display: grid;
  gap: 18px;
}

.privacy-sidebar__card,
.privacy-contact,
.privacy-card {
  border: 1px solid rgba(222, 230, 226, 0.88);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 70px rgba(14, 49, 39, 0.09);
}

.privacy-sidebar__card {
  padding: 24px 18px 18px;
  border-radius: 22px;
}

.privacy-sidebar__title {
  padding-inline: 10px;
  color: var(--privacy-muted);
}

.privacy-sidebar nav {
  display: grid;
  gap: 3px;
  margin-top: 14px;
}

.privacy-sidebar nav a {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 8px;
  align-items: center;
  min-height: 43px;
  padding: 8px 10px;
  color: #53615c;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 650;
  line-height: 1.3;
  text-decoration: none;
  transition: color 180ms ease, background 180ms ease, transform 180ms ease;
}

.privacy-sidebar nav a span {
  color: #8d9995;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

.privacy-sidebar nav a:hover {
  color: var(--privacy-green-800);
  background: var(--privacy-green-50);
  transform: translateX(2px);
}

.privacy-contact {
  padding: 24px;
  color: #d9eee7;
  border-color: rgba(255, 255, 255, 0.05);
  border-radius: 22px;
  background: var(--privacy-green-950);
  box-shadow: 0 22px 60px rgba(7, 47, 39, 0.18);
}

.privacy-contact__label {
  color: #91cbb9;
}

.privacy-contact p {
  margin: 12px 0 18px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.86rem;
  line-height: 1.6;
}

.privacy-contact a {
  color: #fff;
  font-size: 0.86rem;
  font-weight: 750;
  text-underline-offset: 4px;
}

.privacy-card {
  --privacy-card-padding: clamp(32px, 6vw, 72px);
  overflow: hidden;
  padding: var(--privacy-card-padding);
  border-radius: 28px;
}

.privacy-intro {
  display: grid;
  grid-template-columns: 4px 1fr;
  gap: 22px;
  align-items: stretch;
  padding-bottom: 52px;
  border-bottom: 1px solid var(--privacy-border);
}

.privacy-intro__line {
  width: 4px;
  border-radius: 999px;
  background: var(--privacy-gold);
}

.privacy-intro p {
  margin: 0;
  color: #35423e;
  font-size: clamp(1.08rem, 2vw, 1.28rem);
  line-height: 1.76;
}

.privacy-intro strong {
  color: var(--privacy-ink);
}

.privacy-section {
  padding: 56px 0;
  scroll-margin-top: 32px;
  border-bottom: 1px solid var(--privacy-border);
}

.privacy-section--last {
  padding-bottom: 26px;
  border-bottom: 0;
}

.privacy-section__heading {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 18px;
  align-items: center;
  margin-bottom: 26px;
}

.privacy-section__number {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  color: var(--privacy-green-800);
  border: 1px solid #cfe5dc;
  border-radius: 17px;
  background: var(--privacy-green-50);
  font-size: 0.84rem;
  font-weight: 850;
}

.privacy-section__kicker {
  margin-bottom: 5px;
  color: var(--privacy-green-700);
}

.privacy-section h2 {
  margin: 0;
  color: var(--privacy-ink);
  font-size: clamp(1.55rem, 3vw, 2rem);
  line-height: 1.16;
  letter-spacing: -0.035em;
}

.privacy-section > p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.78;
}

.privacy-data-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.privacy-data-card {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--privacy-border);
  border-radius: 17px;
  background: #fbfcfb;
}

.privacy-data-card__icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: var(--privacy-green-800);
  border-radius: 11px;
  background: var(--privacy-green-100);
  font-size: 0.76rem;
  font-weight: 850;
}

.privacy-data-card h3,
.privacy-highlight h3,
.privacy-rights-grid h3 {
  margin: 0;
  color: var(--privacy-ink);
  font-size: 0.96rem;
  line-height: 1.4;
}

.privacy-data-card p {
  margin: 6px 0 0;
  color: var(--privacy-muted);
  font-size: 0.86rem;
  line-height: 1.62;
}

.privacy-check-list {
  display: grid;
  gap: 13px;
  margin: 26px 0 0;
  padding: 0;
  list-style: none;
}

.privacy-check-list li {
  position: relative;
  padding: 14px 16px 14px 48px;
  color: #43514c;
  border: 1px solid var(--privacy-border);
  border-radius: 14px;
  background: #fff;
  font-size: 0.94rem;
  line-height: 1.55;
}

.privacy-check-list li::before {
  position: absolute;
  top: 14px;
  left: 16px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  color: #fff;
  border-radius: 50%;
  background: var(--privacy-green-700);
  content: '✓';
  font-size: 0.72rem;
  font-weight: 900;
}

.privacy-highlight {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 18px;
  margin-top: 8px;
  padding: 26px;
  color: #315047;
  border: 1px solid #cce3da;
  border-radius: 19px;
  background: linear-gradient(135deg, #edf8f4, #f7fbf9);
}

.privacy-highlight__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: var(--privacy-green-800);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(19, 91, 72, 0.1);
}

.privacy-highlight h3 {
  font-size: 1.05rem;
}

.privacy-highlight p {
  margin: 8px 0 0;
  font-size: 0.92rem;
  line-height: 1.72;
}

.privacy-security-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 24px;
}

.privacy-security-row span {
  padding: 9px 13px;
  color: var(--privacy-green-800);
  border: 1px solid #d4e7df;
  border-radius: 999px;
  background: var(--privacy-green-50);
  font-size: 0.78rem;
  font-weight: 750;
}

.privacy-rights-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.privacy-rights-grid > div {
  min-height: 158px;
  padding: 22px;
  border: 1px solid var(--privacy-border);
  border-radius: 17px;
  background: #fbfcfb;
}

.privacy-rights-grid span {
  display: block;
  margin-bottom: 22px;
  color: var(--privacy-green-700);
  font-size: 0.73rem;
  font-weight: 850;
}

.privacy-rights-grid p {
  margin: 7px 0 0;
  color: var(--privacy-muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.privacy-rights-contact {
  margin-top: 24px !important;
  padding: 17px 19px;
  border-left: 3px solid var(--privacy-gold);
  background: #fcfaf5;
}

.privacy-rights-contact a {
  color: var(--privacy-green-800);
  font-weight: 800;
  text-underline-offset: 3px;
}

.privacy-section code {
  padding: 3px 7px;
  color: var(--privacy-green-900);
  border: 1px solid #dce8e3;
  border-radius: 6px;
  background: #edf3f0;
  font-size: 0.85em;
}

.privacy-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin: 36px calc(0px - var(--privacy-card-padding)) calc(0px - var(--privacy-card-padding));
  padding: 24px var(--privacy-card-padding);
  color: #7a8782;
  border-top: 1px solid var(--privacy-border);
  background: #fafbfa;
  font-size: 0.78rem;
}

.privacy-card__footer span {
  color: var(--privacy-green-900);
  font-weight: 850;
  letter-spacing: 0.08em;
}

.privacy-card__footer p {
  margin: 0;
}

@media (max-width: 900px) {
  .privacy-hero {
    padding: 92px 0 104px;
  }

  .privacy-layout {
    grid-template-columns: 1fr;
    margin-top: -42px;
  }

  .privacy-sidebar {
    position: static;
  }

  .privacy-sidebar__card,
  .privacy-contact {
    display: none;
  }
}

@media (max-width: 640px) {
  .privacy-container {
    width: min(100% - 24px, 1180px);
  }

  .privacy-hero {
    padding: 76px 0 84px;
  }

  .privacy-hero__icon {
    width: 50px;
    height: 50px;
    margin-bottom: 22px;
    border-radius: 15px;
  }

  .privacy-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    margin-top: 28px;
  }

  .privacy-meta__divider {
    display: none;
  }

  .privacy-layout {
    gap: 0;
    padding-bottom: 44px;
  }

  .privacy-card {
    --privacy-card-padding: 20px;
    padding: 28px 20px;
    border-radius: 21px;
  }

  .privacy-intro {
    gap: 15px;
    padding-bottom: 38px;
  }

  .privacy-section {
    padding: 42px 0;
  }

  .privacy-section__heading {
    grid-template-columns: 44px 1fr;
    gap: 13px;
    margin-bottom: 22px;
  }

  .privacy-section__number {
    width: 44px;
    height: 44px;
    border-radius: 13px;
    font-size: 0.73rem;
  }

  .privacy-section__kicker {
    font-size: 0.65rem;
  }

  .privacy-data-grid,
  .privacy-rights-grid {
    grid-template-columns: 1fr;
  }

  .privacy-data-card {
    padding: 17px;
  }

  .privacy-highlight {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .privacy-rights-grid > div {
    min-height: 0;
  }

  .privacy-card__footer {
    align-items: flex-start;
    flex-direction: column;
    margin: 28px -20px -28px;
    padding: 21px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .privacy-sidebar nav a {
    transition: none;
  }
}
</style>
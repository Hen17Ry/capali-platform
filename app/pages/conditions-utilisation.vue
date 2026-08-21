<template>
  <div class="legal-page">
    <header class="legal-hero">
      <div class="legal-hero__glow legal-hero__glow--one" aria-hidden="true"></div>
      <div class="legal-hero__glow legal-hero__glow--two" aria-hidden="true"></div>

      <div class="legal-container legal-hero__content">
        <div class="legal-hero__icon" aria-hidden="true">
          <svg
            class="legal-svg legal-svg--hero"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
          </svg>
        </div>

        <p class="legal-eyebrow">CAP ALI · Cadre d’utilisation</p>
        <h1>Conditions d’utilisation</h1>
        <p class="legal-hero__lead">
          Les règles essentielles pour utiliser la plateforme et participer à la
          communauté CAP ALI dans un cadre sûr, respectueux et responsable.
        </p>

        <div class="legal-meta" aria-label="Informations sur les conditions d’utilisation">
          <span class="legal-meta__item">
            <svg
              class="legal-svg legal-svg--meta"
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
          <span class="legal-meta__divider" aria-hidden="true"></span>
          <span class="legal-meta__item">
            <svg
              class="legal-svg legal-svg--meta"
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
              <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
              <path d="m22 4-10 10-3-3" />
            </svg>
            Applicables immédiatement
          </span>
        </div>
      </div>
    </header>

    <main class="legal-container legal-layout">
      <aside class="legal-sidebar" aria-label="Sommaire des conditions d’utilisation">
        <div class="legal-sidebar__card">
          <p class="legal-sidebar__title">Dans cette page</p>
          <nav>
            <a href="#objet"><span>01</span>Objet du site</a>
            <a href="#acces"><span>02</span>Accès et compte</a>
            <a href="#comportement"><span>03</span>Comportement</a>
            <a href="#paiements"><span>04</span>Paiements</a>
            <a href="#responsabilite"><span>05</span>Responsabilité</a>
            <a href="#evolution"><span>06</span>Évolution des CGU</a>
          </nav>
        </div>

        <div class="legal-sidebar__notice">
          <span>À retenir</span>
          <p>
            L’utilisation de CAP ALI implique l’acceptation de ces règles et le
            respect des autres membres de la communauté.
          </p>
        </div>
      </aside>

      <article class="legal-card">
        <div class="legal-intro">
          <span class="legal-intro__line" aria-hidden="true"></span>
          <p>
            Les présentes Conditions Générales d’Utilisation (CGU) encadrent
            juridiquement l’utilisation des services du site <strong>capali.org</strong>.
            En naviguant sur le site ou en vous y inscrivant, vous acceptez pleinement
            et sans réserve les présentes conditions.
          </p>
        </div>

        <section id="objet" class="legal-section">
          <div class="legal-section__heading">
            <span class="legal-section__number">01</span>
            <div>
              <p class="legal-section__kicker">Notre mission</p>
              <h2>Objet du site</h2>
            </div>
          </div>

          <p>
            CAP ALI est une plateforme communautaire dédiée à l’accompagnement,
            au mentorat et à la diffusion de ressources pour faciliter l’intégration
            des jeunes Africains et des leaders inspirants, notamment béninois, en France.
          </p>

          <div class="legal-mission-row" aria-label="Missions principales de CAP ALI">
            <span>Orientation</span>
            <span>Mentorat</span>
            <span>Intégration</span>
            <span>Ressources</span>
          </div>
        </section>

        <section id="acces" class="legal-section">
          <div class="legal-section__heading">
            <span class="legal-section__number">02</span>
            <div>
              <p class="legal-section__kicker">Utiliser la plateforme</p>
              <h2>Accès au site et création de compte</h2>
            </div>
          </div>

          <div class="legal-access-grid">
            <div class="legal-info-card">
              <span class="legal-info-card__label">Accès public</span>
              <h3>Consultation gratuite</h3>
              <p>Les parties publiques du site sont accessibles gratuitement.</p>
            </div>
            <div class="legal-info-card">
              <span class="legal-info-card__label">Compte requis</span>
              <h3>Services communautaires</h3>
              <p>
                Le forum, la demande de mentorat et l’inscription aux événements
                nécessitent la création d’un compte.
              </p>
            </div>
          </div>

          <div class="legal-account-note">
            <span class="legal-account-note__icon" aria-hidden="true">
              <svg
                class="legal-svg legal-svg--note"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <p>
              Lors de la création de votre compte, vous vous engagez à fournir des
              informations exactes et à jour. Vous êtes responsable de la confidentialité
              de vos identifiants de connexion.
            </p>
          </div>
        </section>

        <section id="comportement" class="legal-section">
          <div class="legal-section__heading">
            <span class="legal-section__number">03</span>
            <div>
              <p class="legal-section__kicker">Vivre ensemble</p>
              <h2>Comportement et modération</h2>
            </div>
          </div>

          <p>En tant qu’utilisateur, vous vous engagez à :</p>
          <ul class="legal-check-list">
            <li>
              Faire preuve de bienveillance, de respect et de courtoisie dans vos
              échanges sur le forum comme lors des séances de mentorat.
            </li>
            <li>
              Ne publier aucun contenu injurieux, diffamatoire, raciste, illicite
              ou incitant à la haine.
            </li>
            <li>Ne pas diffuser de publicité commerciale non sollicitée ou de spam.</li>
          </ul>

          <div class="legal-warning">
            <span class="legal-warning__symbol" aria-hidden="true">!</span>
            <p>
              CAP ALI se réserve le droit de supprimer sans préavis tout contenu ne
              respectant pas ces règles, et de suspendre ou bannir définitivement le
              compte de l’utilisateur fautif.
            </p>
          </div>
        </section>

        <section id="paiements" class="legal-section">
          <div class="legal-section__heading">
            <span class="legal-section__number">04</span>
            <div>
              <p class="legal-section__kicker">Transactions sécurisées</p>
              <h2>Paiements, dons et événements</h2>
            </div>
          </div>

          <div class="legal-highlight">
            <div class="legal-highlight__icon" aria-hidden="true">
              <svg
                class="legal-svg legal-svg--highlight"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20M7 15h2" />
              </svg>
            </div>
            <div>
              <h3>Des paiements confiés à des prestataires spécialisés</h3>
              <p>
                Les inscriptions payantes aux événements et les dons sont gérés par
                Stripe et Kkiapay. CAP ALI émet une confirmation pour toute transaction
                réussie. En cas d’annulation d’un événement par CAP ALI, un remboursement
                pourra être envisagé selon les conditions spécifiques de l’événement.
              </p>
            </div>
          </div>
        </section>

        <section id="responsabilite" class="legal-section">
          <div class="legal-section__heading">
            <span class="legal-section__number">05</span>
            <div>
              <p class="legal-section__kicker">Limites du service</p>
              <h2>Responsabilité</h2>
            </div>
          </div>

          <div class="legal-responsibility-grid">
            <div>
              <span>Disponibilité</span>
              <h3>Accès à la plateforme</h3>
              <p>
                CAP ALI s’efforce de maintenir le site accessible 24 h/24 et 7 j/7,
                mais ne peut être tenu responsable des indisponibilités liées à la
                maintenance, aux pannes techniques ou à un cas de force majeure.
              </p>
            </div>
            <div>
              <span>Contributions</span>
              <h3>Conseils des membres</h3>
              <p>
                Les conseils donnés par les mentors ou les membres du forum n’engagent
                que leurs auteurs. CAP ALI ne peut être tenu responsable des décisions
                prises à la suite d’un échange sur la plateforme.
              </p>
            </div>
          </div>
        </section>

        <section id="evolution" class="legal-section legal-section--last">
          <div class="legal-section__heading">
            <span class="legal-section__number">06</span>
            <div>
              <p class="legal-section__kicker">Mises à jour</p>
              <h2>Évolution des CGU</h2>
            </div>
          </div>

          <p>
            CAP ALI se réserve le droit de modifier les présentes conditions à tout
            moment. Les utilisateurs seront informés des mises à jour majeures par
            e-mail ou au moyen d’une notification sur le site.
          </p>
          <div class="legal-update-row">
            <span>Information par e-mail</span>
            <span>Notification sur le site</span>
          </div>
        </section>

        <footer class="legal-card__footer">
          <span>CAP ALI</span>
          <p>Orientation · Mentorat · Intégration</p>
        </footer>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Conditions d’utilisation | CAP ALI",
  meta: [
    {
      name: 'description',
      content: "Conditions générales d’utilisation de la plateforme CAP ALI.",
    },
  ],
})
</script>

<style scoped>
.legal-page,
.legal-page * {
  box-sizing: border-box;
}

.legal-page {
  --legal-green-950: var(--green-950, #072f27);
  --legal-green-900: var(--green-900, #0b493b);
  --legal-green-800: var(--green-800, #12604e);
  --legal-green-700: var(--green-700, #17755e);
  --legal-green-100: var(--green-100, #dff1ea);
  --legal-green-50: var(--green-50, #f0f8f5);
  --legal-gold: var(--gold-500, #d7aa52);
  --legal-ink: var(--neutral-950, #17211e);
  --legal-text: var(--neutral-700, #4d5c57);
  --legal-muted: var(--neutral-500, #73807b);
  --legal-border: var(--neutral-200, #e3e8e5);
  --legal-surface: var(--neutral-50, #f7f9f8);
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--legal-text);
  background: var(--legal-surface);
  font-family: inherit;
}

.legal-container {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
}

.legal-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 112px 0 124px;
  color: #fff;
  background:
    linear-gradient(118deg, rgba(5, 48, 39, 0.98), rgba(14, 91, 72, 0.94)),
    var(--legal-green-900);
}

.legal-hero::after {
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

.legal-hero__glow {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  pointer-events: none;
}

.legal-hero__glow--one {
  top: -140px;
  right: 8%;
  width: 390px;
  height: 390px;
  background: rgba(36, 148, 116, 0.22);
}

.legal-hero__glow--two {
  bottom: -130px;
  left: 7%;
  width: 280px;
  height: 280px;
  background: rgba(215, 170, 82, 0.13);
}

.legal-hero__content {
  position: relative;
}

.legal-hero__icon {
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

.legal-svg {
  display: block !important;
  flex: 0 0 auto !important;
  max-width: none !important;
}

.legal-svg--hero {
  width: 28px !important;
  height: 28px !important;
}

.legal-svg--meta {
  width: 18px !important;
  height: 18px !important;
}

.legal-svg--note {
  width: 22px !important;
  height: 22px !important;
}

.legal-svg--highlight {
  width: 24px !important;
  height: 24px !important;
}

.legal-eyebrow,
.legal-section__kicker,
.legal-sidebar__title,
.legal-sidebar__notice > span {
  margin: 0;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.legal-eyebrow {
  margin-bottom: 15px;
  color: #b8e0d4;
}

.legal-hero h1 {
  max-width: 820px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.55rem, 6vw, 4.7rem);
  font-weight: 720;
  line-height: 1.02;
  letter-spacing: -0.055em;
}

.legal-hero__lead {
  max-width: 720px;
  margin: 26px 0 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: clamp(1.02rem, 2vw, 1.24rem);
  line-height: 1.72;
}

.legal-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 38px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.9rem;
  font-weight: 650;
}

.legal-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.legal-meta__divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.22);
}

.legal-layout {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-top: -58px;
  padding-bottom: 100px;
}

.legal-sidebar {
  position: sticky;
  top: 28px;
  display: grid;
  gap: 18px;
}

.legal-sidebar__card,
.legal-sidebar__notice,
.legal-card {
  border: 1px solid rgba(222, 230, 226, 0.88);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 70px rgba(14, 49, 39, 0.09);
}

.legal-sidebar__card {
  padding: 24px 18px 18px;
  border-radius: 22px;
}

.legal-sidebar__title {
  padding-inline: 10px;
  color: var(--legal-muted);
}

.legal-sidebar nav {
  display: grid;
  gap: 3px;
  margin-top: 14px;
}

.legal-sidebar nav a {
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

.legal-sidebar nav a span {
  color: #8d9995;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

.legal-sidebar nav a:hover {
  color: var(--legal-green-800);
  background: var(--legal-green-50);
  transform: translateX(2px);
}

.legal-sidebar__notice {
  padding: 24px;
  color: #d9eee7;
  border-color: rgba(255, 255, 255, 0.05);
  border-radius: 22px;
  background: var(--legal-green-950);
  box-shadow: 0 22px 60px rgba(7, 47, 39, 0.18);
}

.legal-sidebar__notice > span {
  color: #91cbb9;
}

.legal-sidebar__notice p {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.86rem;
  line-height: 1.65;
}

.legal-card {
  --legal-card-padding: clamp(32px, 6vw, 72px);
  overflow: hidden;
  padding: var(--legal-card-padding);
  border-radius: 28px;
}

.legal-intro {
  display: grid;
  grid-template-columns: 4px 1fr;
  gap: 22px;
  align-items: stretch;
  padding-bottom: 52px;
  border-bottom: 1px solid var(--legal-border);
}

.legal-intro__line {
  width: 4px;
  border-radius: 999px;
  background: var(--legal-gold);
}

.legal-intro p {
  margin: 0;
  color: #35423e;
  font-size: clamp(1.08rem, 2vw, 1.28rem);
  line-height: 1.76;
}

.legal-intro strong {
  color: var(--legal-ink);
}

.legal-section {
  padding: 56px 0;
  scroll-margin-top: 32px;
  border-bottom: 1px solid var(--legal-border);
}

.legal-section--last {
  padding-bottom: 26px;
  border-bottom: 0;
}

.legal-section__heading {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 18px;
  align-items: center;
  margin-bottom: 26px;
}

.legal-section__number {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  color: var(--legal-green-800);
  border: 1px solid #cfe5dc;
  border-radius: 17px;
  background: var(--legal-green-50);
  font-size: 0.84rem;
  font-weight: 850;
}

.legal-section__kicker {
  margin-bottom: 5px;
  color: var(--legal-green-700);
}

.legal-section h2 {
  margin: 0;
  color: var(--legal-ink);
  font-size: clamp(1.55rem, 3vw, 2rem);
  line-height: 1.16;
  letter-spacing: -0.035em;
}

.legal-section > p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.78;
}

.legal-mission-row,
.legal-update-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 24px;
}

.legal-mission-row span,
.legal-update-row span {
  padding: 9px 13px;
  color: var(--legal-green-800);
  border: 1px solid #d4e7df;
  border-radius: 999px;
  background: var(--legal-green-50);
  font-size: 0.78rem;
  font-weight: 750;
}

.legal-access-grid,
.legal-responsibility-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.legal-info-card,
.legal-responsibility-grid > div {
  padding: 22px;
  border: 1px solid var(--legal-border);
  border-radius: 17px;
  background: #fbfcfb;
}

.legal-info-card__label,
.legal-responsibility-grid > div > span {
  display: block;
  margin-bottom: 19px;
  color: var(--legal-green-700);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.legal-info-card h3,
.legal-highlight h3,
.legal-responsibility-grid h3 {
  margin: 0;
  color: var(--legal-ink);
  font-size: 1rem;
  line-height: 1.4;
}

.legal-info-card p,
.legal-responsibility-grid p {
  margin: 7px 0 0;
  color: var(--legal-muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

.legal-account-note {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 15px;
  align-items: start;
  margin-top: 15px;
  padding: 19px;
  border: 1px solid #d9e5e0;
  border-radius: 16px;
  background: #f7faf9;
}

.legal-account-note__icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: var(--legal-green-800);
  border-radius: 13px;
  background: var(--legal-green-100);
}

.legal-account-note p {
  margin: 0;
  color: #4c5a55;
  font-size: 0.9rem;
  line-height: 1.68;
}

.legal-check-list {
  display: grid;
  gap: 13px;
  margin: 26px 0 0;
  padding: 0;
  list-style: none;
}

.legal-check-list li {
  position: relative;
  padding: 14px 16px 14px 48px;
  color: #43514c;
  border: 1px solid var(--legal-border);
  border-radius: 14px;
  background: #fff;
  font-size: 0.94rem;
  line-height: 1.55;
}

.legal-check-list li::before {
  position: absolute;
  top: 14px;
  left: 16px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  color: #fff;
  border-radius: 50%;
  background: var(--legal-green-700);
  content: '✓';
  font-size: 0.72rem;
  font-weight: 900;
}

.legal-warning {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 15px;
  align-items: start;
  margin-top: 18px;
  padding: 19px;
  color: #713f25;
  border: 1px solid #f1d7bf;
  border-radius: 16px;
  background: #fff8f1;
}

.legal-warning__symbol {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: #9c542c;
  border-radius: 11px;
  background: #f9e4d1;
  font-weight: 900;
}

.legal-warning p {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 650;
  line-height: 1.65;
}

.legal-highlight {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 18px;
  padding: 26px;
  color: #315047;
  border: 1px solid #cce3da;
  border-radius: 19px;
  background: linear-gradient(135deg, #edf8f4, #f7fbf9);
}

.legal-highlight__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: var(--legal-green-800);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(19, 91, 72, 0.1);
}

.legal-highlight p {
  margin: 8px 0 0;
  font-size: 0.92rem;
  line-height: 1.72;
}

.legal-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin: 36px calc(0px - var(--legal-card-padding)) calc(0px - var(--legal-card-padding));
  padding: 24px var(--legal-card-padding);
  color: #7a8782;
  border-top: 1px solid var(--legal-border);
  background: #fafbfa;
  font-size: 0.78rem;
}

.legal-card__footer span {
  color: var(--legal-green-900);
  font-weight: 850;
  letter-spacing: 0.08em;
}

.legal-card__footer p {
  margin: 0;
}

@media (max-width: 900px) {
  .legal-hero {
    padding: 92px 0 104px;
  }

  .legal-layout {
    grid-template-columns: 1fr;
    margin-top: -42px;
  }

  .legal-sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .legal-container {
    width: min(100% - 24px, 1180px);
  }

  .legal-hero {
    padding: 76px 0 84px;
  }

  .legal-hero__icon {
    width: 50px;
    height: 50px;
    margin-bottom: 22px;
    border-radius: 15px;
  }

  .legal-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    margin-top: 28px;
  }

  .legal-meta__divider {
    display: none;
  }

  .legal-layout {
    gap: 0;
    padding-bottom: 44px;
  }

  .legal-card {
    --legal-card-padding: 20px;
    padding: 28px 20px;
    border-radius: 21px;
  }

  .legal-intro {
    gap: 15px;
    padding-bottom: 38px;
  }

  .legal-section {
    padding: 42px 0;
  }

  .legal-section__heading {
    grid-template-columns: 44px 1fr;
    gap: 13px;
    margin-bottom: 22px;
  }

  .legal-section__number {
    width: 44px;
    height: 44px;
    border-radius: 13px;
    font-size: 0.73rem;
  }

  .legal-section__kicker {
    font-size: 0.65rem;
  }

  .legal-access-grid,
  .legal-responsibility-grid {
    grid-template-columns: 1fr;
  }

  .legal-account-note,
  .legal-warning,
  .legal-highlight {
    grid-template-columns: 1fr;
  }

  .legal-card__footer {
    align-items: flex-start;
    flex-direction: column;
    margin: 28px -20px -28px;
    padding: 21px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .legal-sidebar nav a {
    transition: none;
  }
}
</style>
<template>
  <footer class="footer">
    <!-- Tri-color top bar -->
    <div class="footer__bar" aria-hidden="true" />

    <div class="container">
      <div class="footer__grid">
        <!-- Brand -->
        <div class="footer__brand">
          <div class="footer__logo">
            <img src="/logo.png" alt="CAP ALI" width="48" height="48" >
            <span>CAP <strong>ALI</strong></span>
          </div>
          <p class="footer__desc">{{ $t('footer.description') }}</p>
          <div class="footer__socials">
            <a href="https://www.tiktok.com/@cap_ali" target="_blank" rel="noopener" aria-label="TikTok" class="footer__social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.6a6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 3.76.92V6.69z"/></svg>
            </a>
            <a href="https://www.instagram.com/cap_ali" target="_blank" rel="noopener" aria-label="Instagram" class="footer__social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/cap-ali" target="_blank" rel="noopener" aria-label="LinkedIn" class="footer__social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div class="footer__col">
          <h4 class="footer__col-title">{{ $t('footer.nav_title') }}</h4>
          <ul>
            <li><a href="#mission">{{ $t('nav.about') }}</a></li>
            <li><a href="#mentorship">{{ $t('nav.mentorship') }}</a></li>
            <li><a href="#resources">{{ $t('nav.resources') }}</a></li>
            <li><a href="#events">{{ $t('nav.events') }}</a></li>
            <li><a href="#forum">{{ $t('nav.forum') }}</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="footer__col">
          <h4 class="footer__col-title">{{ $t('footer.resources_title') }}</h4>
          <ul>
            <li><a href="#">{{ $t('footer.faq') }}</a></li>
            <li><a href="#">{{ $t('footer.contact_us') }}</a></li>
            <li><a href="#">{{ $t('footer.press') }}</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer__col">
          <h4 class="footer__col-title">{{ $t('footer.legal_title') }}</h4>
          <ul>
            <li><a href="#">{{ $t('footer.privacy') }}</a></li>
            <li><a href="#">{{ $t('footer.terms') }}</a></li>
            <li><a href="#">{{ $t('footer.legal_notices') }}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
        <p class="footer__made">{{ $t('footer.made_with') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--neutral-900); color: var(--neutral-300); padding-top: 0; }

.footer__bar { height: 4px; background: linear-gradient(90deg, var(--green-500) 33%, var(--gold-400) 33% 66%, var(--red-500) 66%); }

.footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: var(--space-10); padding: var(--space-16) 0 var(--space-12); }

/* Brand */
.footer__logo { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.footer__logo img { width: 48px; height: 48px; border-radius: var(--radius-full); }
.footer__logo span { font-family: var(--font-serif); font-size: var(--text-xl); color: var(--neutral-0); }
.footer__logo strong { color: var(--gold-400); }

.footer__desc { font-size: var(--text-sm); line-height: 1.7; color: var(--neutral-400); margin-bottom: var(--space-6); max-width: 320px; }

.footer__socials { display: flex; gap: var(--space-3); }
.footer__social { width: 40px; height: 40px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; color: var(--neutral-400); transition: all var(--transition-base); }
.footer__social:hover { background: var(--green-500); color: var(--neutral-0); transform: translateY(-2px); }

/* Columns */
.footer__col-title { font-size: var(--text-sm); font-weight: 600; color: var(--neutral-0); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-4); }
.footer__col ul { display: flex; flex-direction: column; gap: var(--space-2); }
.footer__col a { font-size: var(--text-sm); color: var(--neutral-400); transition: color var(--transition-fast); }
.footer__col a:hover { color: var(--gold-400); }

/* Bottom */
.footer__bottom { display: flex; justify-content: space-between; align-items: center; padding: var(--space-6) 0; border-top: 1px solid rgba(255,255,255,0.08); font-size: var(--text-sm); color: var(--neutral-500); }

.footer__made { color: var(--neutral-500); }

@media (max-width: 768px) {
  .footer__grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); }
  .footer__brand { grid-column: 1 / -1; }
  .footer__bottom { flex-direction: column; gap: var(--space-2); text-align: center; }
}

@media (max-width: 480px) {
  .footer__grid { grid-template-columns: 1fr; }
}
</style>

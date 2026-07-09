<template>
  <div class="orientation-page" :class="{'mode-junior': mode === 'junior'}">
    <!-- PROGRESS -->
    <div v-if="currentScreen === 'question'" class="prog-bar-wrap">
      <div class="prog-label">Question {{ currentQ + 1 }} sur {{ questions.length }}</div>
      <div class="prog-track">
        <div class="prog-fill" :style="{ width: ((currentQ / questions.length) * 100) + '%' }"/>
      </div>
    </div>

    <!-- ══ SCREEN ACCUEIL ══ -->
    <div v-if="currentScreen === 'welcome'" id="s-welcome" class="screen active">
      <div style="max-width:680px;margin:0 auto;padding:52px 24px;text-align:center">
        <div class="welcome-badge">Test d'orientation · Cap Ali</div>
        <h1 class="welcome-title">Découvre qui tu es<br>et <span>où tu vas</span> ✨</h1>
        <p class="welcome-desc">Un test de 24 questions pour explorer tes talents, tes intérêts et découvrir les métiers et filières qui te correspondent vraiment.</p>

        <p style="font-size:13px;font-weight:700;color:var(--forest);text-transform:uppercase;letter-spacing:1px;margin-bottom:18px">Quel est ton niveau scolaire ?</p>
        <div class="level-cards">
          <div class="level-card" :class="{ selected: mode === 'junior' }" @click="selectLevel('junior')">
            <span class="level-card-emoji">🎒</span>
            <div class="level-card-ages">4e · 3e · 2de</div>
            <div class="level-card-title">Collège & Lycée</div>
            <p class="level-card-desc">Questions fun sur tes passions, tes talents et ce que tu aimes faire au quotidien.</p>
          </div>
          <div class="level-card" :class="{ selected: mode === 'senior' }" @click="selectLevel('senior')">
            <span class="level-card-emoji">🎓</span>
            <div class="level-card-ages">1re · Tle · BAC+1 → +5</div>
            <div class="level-card-title">Lycée & Études sup.</div>
            <p class="level-card-desc">Questions sur tes valeurs, tes compétences et ton projet professionnel.</p>
          </div>
        </div>

        <button class="btn-go" :class="{ ready: mode !== null }" @click="goToRegister">Commencer →</button>
        <p class="welcome-note">~5 minutes · Aucune bonne ou mauvaise réponse · Résultats confidentiels</p>
      </div>
    </div>

    <!-- ══ SCREEN REGISTER ══ -->
    <div v-if="currentScreen === 'register'" id="s-register" class="screen active">
      <div style="max-width:500px;margin:60px auto;padding:40px 24px;background:white;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.05);text-align:center;">
        <h2 style="font-family:'Cormorant Garamond', serif;font-size:28px;color:var(--forest);margin-bottom:12px;">Faisons connaissance 👋</h2>
        <p style="font-size:14px;color:var(--muted);margin-bottom:24px;">Avant de commencer, laisse-nous quelques infos pour recevoir tes résultats et nos conseils d'orientation.</p>
        
        <form style="text-align:left;" @submit.prevent="submitRegister">
          <div class="f-field" style="margin-bottom:12px;">
            <label class="f-label">Prénom</label>
            <input v-model="registerForm.firstName" class="f-input" type="text" required placeholder="Ton prénom">
          </div>
          <div class="f-field" style="margin-bottom:12px;">
            <label class="f-label">Nom</label>
            <input v-model="registerForm.lastName" class="f-input" type="text" required placeholder="Ton nom">
          </div>
          <div class="f-field" style="margin-bottom:24px;">
            <label class="f-label">Email</label>
            <input v-model="registerForm.email" class="f-input" type="email" required placeholder="ton@email.com">
          </div>
          <div v-if="registerError" style="color:#C26A42;font-size:13px;margin-bottom:12px;text-align:center;">{{ registerError }}</div>
          <button type="submit" class="submit-btn" :disabled="isRegistering" style="margin-top:0;">
            <span v-if="!isRegistering">Démarrer le test →</span>
            <span v-else>Chargement...</span>
          </button>
        </form>
      </div>
    </div>

    <!-- ══ SCREEN QUESTION ══ -->
    <div v-if="currentScreen === 'question'" id="s-question" class="screen active">
      <!-- Junior Question -->
      <div v-if="mode === 'junior'" class="q-wrap-junior">
        <div class="q-bloc-label-junior">{{ currentQuestionData.bloc }}</div>
        <div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:16px">
          <div>
            <div class="q-num-junior">{{ String(currentQ + 1).padStart(2, '0') }}</div>
            <div class="q-num-sub-junior">sur {{ questions.length }}</div>
          </div>
        </div>
        <div class="q-bubble fade-up">
          <div class="q-text-junior">{{ currentQuestionData.text }}</div>
        </div>
        <div class="opts-junior fade-up">
          <button v-for="(opt, i) in currentQuestionData.opts" :key="i" class="opt-junior" :class="{ selected: answers[currentQ] === Number(i) }" @click="selectOpt(Number(i))">
            <span class="opt-emoji">{{ opt.e }}</span>
            <span>{{ opt.t }}</span>
          </button>
        </div>
        <button class="btn-next-junior" :class="{ ready: answers[currentQ] !== undefined }" @click="nextQ">
          {{ currentQ === questions.length - 1 ? 'Voir mes résultats →' : 'Question suivante →' }}
        </button>
      </div>

      <!-- Senior Question -->
      <div v-else class="q-wrap-senior">
        <div class="q-header-senior">
          <div class="q-num-senior">{{ String(currentQ + 1).padStart(2, '0') }}</div>
          <div class="q-meta-senior">
            <div class="q-cat-senior">{{ currentQuestionData.bloc }}</div>
            <div class="q-num-sub-senior">Question {{ currentQ + 1 }} sur {{ questions.length }}</div>
          </div>
        </div>
        <div class="q-text-senior fade-up">{{ currentQuestionData.text }}</div>
        <div class="opts-senior fade-up">
          <button v-for="(opt, i) in currentQuestionData.opts" :key="i" class="opt-senior" :class="{ selected: answers[currentQ] === Number(i) }" @click="selectOpt(Number(i))">
            <span class="opt-letter">{{ opt.l }}</span>
            <span>{{ opt.t }}</span>
          </button>
        </div>
        <button class="btn-next-senior" :class="{ ready: answers[currentQ] !== undefined }" @click="nextQ">
          {{ currentQ === questions.length - 1 ? 'Voir mes résultats →' : 'Question suivante →' }}
        </button>
      </div>
    </div>

    <!-- ══ SCREEN RÉSULTATS ══ -->
    <div v-if="currentScreen === 'result'" id="s-result" class="screen active">
      <div id="result-inner" class="result-inner" style="padding: 40px 0 60px;">
        <div class="result-hero fade-up">
          <div class="result-eyebrow">Tes résultats · Cap Ali</div>
          <h2 class="result-main-title">Ton profil : <span>{{ resultProfile.code }}</span></h2>
          <p class="result-sub">Voici ce que ce test révèle sur toi — tes forces, ton fonctionnement naturel et les chemins qui s'ouvrent à toi.</p>
        </div>

        <div class="profile-hero-card fade-up" :style="{ background: resultProfile.bg }">
          <div class="profile-hero-code">
            {{ mode === 'junior' ? resultProfile.emoji + ' ' : '' }}{{ resultProfile.code }}
          </div>
          <div class="profile-hero-name">{{ resultProfile.name }}</div>
          <p class="profile-hero-desc">{{ resultProfile.desc }}</p>
        </div>

        <div class="card-white fade-up">
          <div class="card-title">Tes 6 dimensions</div>
          <div v-for="d in dimOrder" :key="d" class="dim-bar-row">
            <div class="dim-bar-label">
              <div class="dim-bar-name">{{ dimInfo[d]?.name }}</div>
              <div class="dim-bar-sub">{{ dimInfo[d]?.sub }}</div>
            </div>
            <div class="dim-bar-track">
              <div class="dim-bar-fill" :style="{ width: Math.min(100, Math.round(((scores[d] || 0) / maxScore) * 100)) + '%', background: 'var(--col-' + d + ')' }"/>
            </div>
            <div class="dim-bar-pct">{{ Math.min(100, Math.round(((scores[d] || 0) / maxScore) * 100)) }}%</div>
          </div>
        </div>

        <div class="two-cols fade-up">
          <div class="mini-card green">
            <div class="mini-card-label">Tes forces</div>
            <div class="mini-card-title">Ce qui te distingue</div>
            <span v-for="f in resultProfile.forces" :key="f" class="mini-tag">{{ f }}</span>
          </div>
          <div class="mini-card orange">
            <div class="mini-card-label">Points d'attention</div>
            <div class="mini-card-title">À garder en tête</div>
            <span v-for="v in resultProfile.vigilance" :key="v" class="mini-tag">{{ v }}</span>
          </div>
        </div>

        <div class="card-white fade-up">
          <div class="card-title">Métiers qui pourraient te correspondre</div>
          <div class="metiers-grid">
            <div v-for="m in resultProfile.metiers" :key="m" class="metier-chip">{{ m }}</div>
          </div>
        </div>

        <div class="card-white fade-up">
          <div class="card-title">Filières et études à explorer</div>
          <div class="filieres-grid">
            <div v-for="f in resultProfile.filieres" :key="f" class="filiere-chip">
              <span class="f-dot" :style="{ background: resultProfile.bg }"/>{{ f }}
            </div>
          </div>
        </div>

        <!-- Mentorship Form (Mentore) -->
        <div class="mentore-wrap fade-up">
          <div class="mentore-eyebrow">Programme de mentorat · Cap Ali</div>
          <div class="mentore-title">Tu veux aller plus loin ?<br>Inscris-toi comme mentoré(e) 🎯</div>
          <p class="mentore-desc">Cap Ali accompagne les jeunes Béninois dans leur orientation. Nos mentors t'aident à construire ton projet et réussir ton parcours.</p>

          <div style="text-align: center; margin-top: 32px;">
            <NuxtLink to="/auth/register" class="submit-btn" style="display: inline-flex; width: auto; padding: 16px 40px; text-decoration: none;">
              S'inscrire comme mentoré(e) →
            </NuxtLink>
          </div>
        </div>

        <div class="restart-row">
          <button class="restart-btn" @click="restartTest">↩ Recommencer le test</button>
        </div>

        <p class="disclaimer">Ce test est inspiré du modèle RIASEC de John Holland, adapté par Cap Ali. Il constitue un support de réflexion.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default',
  title: "Test d'Orientation",
})

const currentScreen = ref('welcome') // welcome, register, question, result
const mode = ref<string | null>(null) // 'junior' | 'senior'

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: ''
})
const isRegistering = ref(false)
const registerError = ref('')

const questions = ref<any[]>([])
const currentQ = ref(0)
const answers = ref<number[]>([])
const scores = ref<Record<string, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 })

const currentQuestionData = computed(() => questions.value[currentQ.value] || {})
const maxScore = computed(() => questions.value.length * 3)


/* ══════════════════════════════════════════════════════════════
   QUESTIONS — VERSION JUNIOR (4e / 3e / 2de)
   24 questions · 4 par dimension RIASEC
   Langage simple, emojis, situations du quotidien scolaire
══════════════════════════════════════════════════════════════ */
const questionsJunior = [
  /* ── R : RÉALISTE (4 questions) ── */
  {
    dim: 'R',
    bloc: '🛠️ Ce que tu aimes faire',
    text: 'Ton activité préférée le week-end, c\'est plutôt...',
    opts: [
      { e:'🔨', t:'Construire ou réparer quelque chose de mes mains', s:{R:3} },
      { e:'🎨', t:'Dessiner, peindre, créer quelque chose de beau', s:{A:3} },
      { e:'📚', t:'Lire, regarder des documentaires, apprendre des trucs', s:{I:3} },
      { e:'🏀', t:'Faire du sport, bouger, être actif(ve)', s:{R:2,E:1} },
    ]
  },
  {
    dim: 'R',
    bloc: '🛠️ Ce que tu aimes faire',
    text: 'Si tu pouvais choisir un atelier extra-scolaire, tu prendrais...',
    opts: [
      { e:'🌱', t:'Jardinage ou élevage d\'animaux', s:{R:3} },
      { e:'🎭', t:'Théâtre ou danse', s:{A:3} },
      { e:'🔬', t:'Sciences ou robotique', s:{I:2,R:1} },
      { e:'🏋️', t:'Sport de compétition ou arts martiaux', s:{R:2,E:1} },
    ]
  },
  {
    dim: 'R',
    bloc: '🛠️ Ce que tu aimes faire',
    text: 'Tu dois aider à préparer la fête de l\'école. Tu te proposes pour...',
    opts: [
      { e:'🔧', t:'Monter les tables, installer la scène, s\'occuper du matériel', s:{R:3} },
      { e:'🎨', t:'Décorer la salle, créer les affiches', s:{A:3} },
      { e:'📋', t:'Organiser le planning et les équipes', s:{C:3} },
      { e:'🎤', t:'Animer l\'événement, parler devant tout le monde', s:{E:3} },
    ]
  },
  {
    dim: 'R',
    bloc: '🛠️ Ce que tu aimes faire',
    text: 'Dans ton cartable, la matière que tu portes le plus volontiers c\'est...',
    opts: [
      { e:'🏃', t:'EPS — j\'adore bouger et être sur le terrain', s:{R:3} },
      { e:'🎵', t:'Musique ou arts plastiques', s:{A:3} },
      { e:'🔢', t:'Maths ou Sciences', s:{I:2,C:1} },
      { e:'📖', t:'Français, Histoire ou Langues', s:{S:2,A:1} },
    ]
  },
  /* ── I : INVESTIGATEUR (4 questions) ── */
  {
    dim: 'I',
    bloc: '🔍 Ta façon de réfléchir',
    text: 'Quand quelque chose t\'intrigue, tu fais quoi en premier ?',
    opts: [
      { e:'🔎', t:'Je cherche sur internet ou dans un livre jusqu\'à comprendre vraiment', s:{I:3} },
      { e:'🗣️', t:'J\'en parle à quelqu\'un pour avoir son avis', s:{S:2,E:1} },
      { e:'✋', t:'J\'essaie directement pour voir ce qui se passe', s:{R:2,E:1} },
      { e:'📝', t:'Je note les infos et je les classe dans un tableau', s:{C:3} },
    ]
  },
  {
    dim: 'I',
    bloc: '🔍 Ta façon de réfléchir',
    text: 'Le prof vous laisse choisir un sujet d\'exposé. Tu choisis...',
    opts: [
      { e:'🧠', t:'Comment fonctionne le cerveau humain ou l\'univers', s:{I:3} },
      { e:'🎨', t:'L\'histoire d\'un artiste ou d\'un mouvement culturel', s:{A:2,I:1} },
      { e:'💼', t:'Comment une grande entreprise a réussi', s:{E:3} },
      { e:'🤝', t:'Un problème social dans ta ville ou ton pays', s:{S:3} },
    ]
  },
  {
    dim: 'I',
    bloc: '🔍 Ta façon de réfléchir',
    text: 'Quelle émission ou quel contenu tu regardes le plus souvent ?',
    opts: [
      { e:'🔭', t:'Documentaires sur la nature, la science, les mystères du monde', s:{I:3} },
      { e:'🎬', t:'Films, séries, clips musicaux', s:{A:2,S:1} },
      { e:'📱', t:'Lives, défis, humour, célébrités', s:{E:1,S:2} },
      { e:'⚽', t:'Sport en direct, analyses tactiques', s:{R:2,E:1} },
    ]
  },
  {
    dim: 'I',
    bloc: '🔍 Ta façon de réfléchir',
    text: 'En classe, tu es le/la genre à...',
    opts: [
      { e:'🙋', t:'Poser des questions sur le "pourquoi" et le "comment"', s:{I:3} },
      { e:'✏️', t:'Tout noter soigneusement et vérifier que rien ne manque', s:{C:3} },
      { e:'😂', t:'Faire rire la classe ou lancer des discussions', s:{E:2,S:1} },
      { e:'🎨', t:'Illustrer tes cours avec des dessins ou des schémas colorés', s:{A:3} },
    ]
  },
  /* ── A : ARTISTE (4 questions) ── */
  {
    dim: 'A',
    bloc: '🎨 Tes talents créatifs',
    text: 'On te donne du temps libre et des fournitures. Qu\'est-ce que tu crées ?',
    opts: [
      { e:'🖌️', t:'Un dessin, une peinture, un collage ou un mandala', s:{A:3} },
      { e:'🛠️', t:'Un objet en bois, en métal ou quelque chose de pratique', s:{R:3} },
      { e:'📊', t:'Un tableau de suivi ou un agenda bien organisé', s:{C:3} },
      { e:'📣', t:'Un affiche pour un événement ou une campagne', s:{A:1,E:2} },
    ]
  },
  {
    dim: 'A',
    bloc: '🎨 Tes talents créatifs',
    text: 'Dans un projet de groupe, quel rôle tu prends naturellement ?',
    opts: [
      { e:'🎨', t:'Je m\'occupe du visuel, de la mise en page, des illustrations', s:{A:3} },
      { e:'📋', t:'Je fais le plan, je répartis les tâches et je gère le timing', s:{C:3} },
      { e:'📢', t:'Je présente le travail devant la classe', s:{E:2,S:1} },
      { e:'🔬', t:'Je fais les recherches et je vérifie les informations', s:{I:3} },
    ]
  },
  {
    dim: 'A',
    bloc: '🎨 Tes talents créatifs',
    text: 'Si tu devais faire une chaîne YouTube, ce serait sur...',
    opts: [
      { e:'🎭', t:'Art, mode, musique, photographie ou cinéma', s:{A:3} },
      { e:'🧪', t:'Science, technologie, expériences rigolotes', s:{I:3} },
      { e:'💪', t:'Sport, fitness, challenges', s:{R:2,E:1} },
      { e:'💡', t:'Entrepreneuriat, conseils, motivation', s:{E:3} },
    ]
  },
  {
    dim: 'A',
    bloc: '🎨 Tes talents créatifs',
    text: 'Tes amis disent que tu as du talent pour...',
    opts: [
      { e:'🖊️', t:'Écrire, raconter des histoires, trouver des mots originaux', s:{A:3} },
      { e:'🧩', t:'Résoudre des problèmes logiques ou des puzzles', s:{I:3} },
      { e:'🗣️', t:'Convaincre les gens et donner envie de te suivre', s:{E:3} },
      { e:'🤗', t:'Écouter les autres et les mettre à l\'aise', s:{S:3} },
    ]
  },
  /* ── S : SOCIAL (4 questions) ── */
  {
    dim: 'S',
    bloc: '🤝 Tes relations avec les autres',
    text: 'Un(e) ami(e) est triste et vient te voir. Tu fais quoi ?',
    opts: [
      { e:'👂', t:'Je prends le temps de l\'écouter sans l\'interrompre', s:{S:3} },
      { e:'💡', t:'Je lui propose des solutions concrètes tout de suite', s:{E:2,I:1} },
      { e:'😄', t:'Je le/la distrait avec des blagues ou une sortie', s:{E:1,S:2} },
      { e:'📖', t:'Je cherche des infos ou des ressources qui pourraient l\'aider', s:{I:2,S:1} },
    ]
  },
  {
    dim: 'S',
    bloc: '🤝 Tes relations avec les autres',
    text: 'Si tu avais un super pouvoir, lequel choisirais-tu ?',
    opts: [
      { e:'💬', t:'Comprendre et parler toutes les langues du monde', s:{S:3} },
      { e:'🧠', t:'Apprendre n\'importe quoi en 5 minutes', s:{I:3} },
      { e:'🚀', t:'Avoir une énergie infinie pour tout accomplir', s:{E:3} },
      { e:'🔨', t:'Construire ou réparer n\'importe quoi d\'un coup de main', s:{R:3} },
    ]
  },
  {
    dim: 'S',
    bloc: '🤝 Tes relations avec les autres',
    text: 'Si tu pouvais faire un métier juste pour une semaine, tu choisirais...',
    opts: [
      { e:'👨‍⚕️', t:'Médecin ou infirmier(ère) — pour aider les gens à guérir', s:{S:3,R:1} },
      { e:'🕵️', t:'Détective ou scientifique — pour résoudre des mystères', s:{I:3} },
      { e:'👨‍🎨', t:'Artiste, musicien(ne) ou designer', s:{A:3} },
      { e:'👨‍💼', t:'Chef d\'entreprise ou directeur(trice)', s:{E:3} },
    ]
  },
  {
    dim: 'S',
    bloc: '🤝 Tes relations avec les autres',
    text: 'Ce que tu aimes le plus dans le travail en groupe, c\'est...',
    opts: [
      { e:'🤝', t:'Quand tout le monde s\'entraide et personne n\'est laissé de côté', s:{S:3} },
      { e:'💥', t:'Quand on peut débattre d\'idées et trouver la meilleure solution', s:{I:2,E:1} },
      { e:'🎯', t:'Quand c\'est bien organisé et que chacun sait ce qu\'il fait', s:{C:3} },
      { e:'🎨', t:'Quand on peut laisser libre cours à notre créativité', s:{A:3} },
    ]
  },
  /* ── E : ENTREPRENANT (4 questions) ── */
  {
    dim: 'E',
    bloc: '🚀 Ton esprit d\'initiative',
    text: 'Dans ta classe, on veut organiser une sortie. Tu fais quoi ?',
    opts: [
      { e:'📣', t:'Je prends les devants, je propose une idée et je convaincs les autres', s:{E:3} },
      { e:'📝', t:'Je prépare une liste détaillée de tout ce qu\'il faut prévoir', s:{C:3} },
      { e:'🎨', t:'Je crée les affiches ou je m\'occupe de la déco', s:{A:3} },
      { e:'🤝', t:'Je m\'assure que tout le monde est content et d\'accord', s:{S:3} },
    ]
  },
  {
    dim: 'E',
    bloc: '🚀 Ton esprit d\'initiative',
    text: 'Si tu pouvais monter ton propre projet dès maintenant, ce serait...',
    opts: [
      { e:'💼', t:'Une petite entreprise ou un service que je vends dans mon quartier', s:{E:3} },
      { e:'🎵', t:'Un groupe de musique, un atelier créatif ou un blog', s:{A:3} },
      { e:'🔬', t:'Un labo de science ou un club de lecture/débat', s:{I:3} },
      { e:'🤝', t:'Une association pour aider les élèves en difficulté', s:{S:3} },
    ]
  },
  {
    dim: 'E',
    bloc: '🚀 Ton esprit d\'initiative',
    text: 'Quand il y a une décision à prendre en groupe, tu...',
    opts: [
      { e:'🙋', t:'Je propose mon avis et j\'essaie de convaincre', s:{E:3} },
      { e:'🧮', t:'Je réfléchis longtemps avant de choisir', s:{I:2,C:1} },
      { e:'😌', t:'Je suis l\'avis des autres, l\'important c\'est que tout le monde soit ok', s:{S:3} },
      { e:'📊', t:'Je cherche des informations pour faire le meilleur choix', s:{I:2,C:1} },
    ]
  },
  {
    dim: 'E',
    bloc: '🚀 Ton esprit d\'initiative',
    text: 'La phrase qui te ressemble le plus, c\'est...',
    opts: [
      { e:'🦁', t:'« Si tu veux que ça marche, fais-le toi-même »', s:{E:3} },
      { e:'🌊', t:'« Comprendre le monde, c\'est le meilleur voyage »', s:{I:3} },
      { e:'❤️', t:'« Ce qui compte, c\'est de s\'entraider »', s:{S:3} },
      { e:'🎨', t:'« Exprimer ce qu\'on ressent, c\'est être libre »', s:{A:3} },
    ]
  },
  /* ── C : CONVENTIONNEL (4 questions) ── */
  {
    dim: 'C',
    bloc: '📋 Ton sens de l\'organisation',
    text: 'Ton cahier ou ton bureau, il ressemble à quoi ?',
    opts: [
      { e:'📐', t:'Tout est rangé, organisé, avec des couleurs et des onglets', s:{C:3} },
      { e:'🌀', t:'Un peu le bazar mais je sais où tout est', s:{A:2,E:1} },
      { e:'📷', t:'Plein de dessins, de gribouillages, de notes créatives', s:{A:3} },
      { e:'📌', t:'Des post-its partout avec les infos importantes', s:{I:1,C:2} },
    ]
  },
  {
    dim: 'C',
    bloc: '📋 Ton sens de l\'organisation',
    text: 'Avant un grand contrôle, tu travailles comment ?',
    opts: [
      { e:'📅', t:'Je fais un planning de révisions détaillé plusieurs jours avant', s:{C:3} },
      { e:'🔄', t:'Je révise un peu chaque jour sans plan fixe', s:{I:2} },
      { e:'🧑‍🤝‍🧑', t:'Je révise avec des amis, on s\'explique les trucs ensemble', s:{S:3} },
      { e:'⚡', t:'Je révise la veille ou le matin, ça va je gère', s:{E:2} },
    ]
  },
  {
    dim: 'C',
    bloc: '📋 Ton sens de l\'organisation',
    text: 'Si tu gagnais de l\'argent de poche en plus, tu...',
    opts: [
      { e:'💰', t:'Je le mets de côté dans une enveloppe ou une application d\'épargne', s:{C:3} },
      { e:'🛍️', t:'J\'achète ce dont j\'ai besoin et j\'aide ma famille si nécessaire', s:{S:2,C:1} },
      { e:'🚀', t:'Je l\'investis dans un projet ou dans mes ambitions', s:{E:3} },
      { e:'🎨', t:'Je m\'offre des fournitures créatives ou une expérience culturelle', s:{A:3} },
    ]
  },
  {
    dim: 'C',
    bloc: '📋 Ton sens de l\'organisation',
    text: 'Dans une équipe, le rôle qui t\'attire le plus naturellement c\'est...',
    opts: [
      { e:'📊', t:'Celui qui suit les étapes, gère les délais et vérifie la qualité', s:{C:3} },
      { e:'💡', t:'Celui qui trouve de nouvelles idées et challenges le groupe', s:{I:2,E:1} },
      { e:'🎨', t:'Celui qui donne de l\'élan créatif et rend le projet beau', s:{A:3} },
      { e:'🤗', t:'Celui qui maintient la bonne ambiance et soutient chacun', s:{S:3} },
    ]
  },
];

/* ══════════════════════════════════════════════════════════════
   QUESTIONS — VERSION SENIOR (1re / Terminale / BAC+1 → BAC+5)
   24 questions · 4 par dimension RIASEC
   Langage adulte, projections professionnelles, valeurs
══════════════════════════════════════════════════════════════ */
const questionsSenior = [
  /* ── R : RÉALISTE (4 questions) ── */
  {
    dim: 'R',
    bloc: 'Tes intérêts concrets',
    text: 'Parmi ces activités, laquelle t\'attirerait le plus dans un contexte professionnel ?',
    opts: [
      { l:'A', t:'Travailler sur le terrain, avec des outils, des machines ou en plein air', s:{R:3} },
      { l:'B', t:'Mener des recherches et analyser des données ou des textes complexes', s:{I:3} },
      { l:'C', t:'Créer du contenu visuel, musical ou narratif à partir de rien', s:{A:3} },
      { l:'D', t:'Gérer des dossiers, des budgets et des procédures administratives', s:{C:3} },
    ]
  },
  {
    dim: 'R',
    bloc: 'Tes intérêts concrets',
    text: 'Le secteur qui t\'attire le plus instinctivement, c\'est...',
    opts: [
      { l:'A', t:'BTP, agriculture, artisanat, mécanique ou industrie', s:{R:3} },
      { l:'B', t:'Santé, sciences, ingénierie ou technologie', s:{I:2,R:1} },
      { l:'C', t:'Arts, design, communication créative', s:{A:3} },
      { l:'D', t:'Éducation, social, accompagnement humain', s:{S:3} },
    ]
  },
  {
    dim: 'R',
    bloc: 'Tes intérêts concrets',
    text: 'Dans quel environnement de travail est-ce que tu te vois le mieux ?',
    opts: [
      { l:'A', t:'Sur le terrain, en mouvement, avec une dimension physique ou manuelle', s:{R:3} },
      { l:'B', t:'Dans un bureau ou labo, concentré(e) sur un problème à résoudre', s:{I:3} },
      { l:'C', t:'Dans un espace créatif et stimulant avec beaucoup de liberté', s:{A:3} },
      { l:'D', t:'Dans une structure bien organisée avec des procédures claires', s:{C:3} },
    ]
  },
  {
    dim: 'R',
    bloc: 'Tes intérêts concrets',
    text: 'On te propose un projet concret ce week-end. Tu te portes volontaire pour...',
    opts: [
      { l:'A', t:'Rénover, construire ou réparer quelque chose de physique', s:{R:3} },
      { l:'B', t:'Faire une analyse approfondie d\'un sujet pour un compte-rendu', s:{I:3} },
      { l:'C', t:'Créer une vidéo, une affiche ou un support de communication', s:{A:3} },
      { l:'D', t:'Coordonner l\'équipe, gérer le budget et les délais', s:{C:2,E:1} },
    ]
  },
  /* ── I : INVESTIGATEUR (4 questions) ── */
  {
    dim: 'I',
    bloc: 'Ta curiosité intellectuelle',
    text: 'Face à un problème complexe, tu commences par...',
    opts: [
      { l:'A', t:'Chercher de l\'information, lire, creuser jusqu\'à trouver l\'explication', s:{I:3} },
      { l:'B', t:'Agir immédiatement, tester des solutions et ajuster en cours de route', s:{E:3} },
      { l:'C', t:'En discuter avec des personnes de confiance pour avoir plusieurs avis', s:{S:3} },
      { l:'D', t:'Faire une liste, suivre une méthode structurée étape par étape', s:{C:3} },
    ]
  },
  {
    dim: 'I',
    bloc: 'Ta curiosité intellectuelle',
    text: 'Quel type de contenu consommes-tu naturellement quand tu as du temps libre ?',
    opts: [
      { l:'A', t:'Documentaires, articles de fond, podcasts sur des sujets complexes', s:{I:3} },
      { l:'B', t:'Contenus entrepreneuriaux, success stories, business ou finance', s:{E:2,C:1} },
      { l:'C', t:'Créations artistiques : films, musique, design, littérature', s:{A:3} },
      { l:'D', t:'Contenus humains : témoignages, développement personnel, social', s:{S:3} },
    ]
  },
  {
    dim: 'I',
    bloc: 'Ta curiosité intellectuelle',
    text: 'Quelle activité intellectuelle te procure le plus de satisfaction ?',
    opts: [
      { l:'A', t:'Résoudre un problème théorique ou comprendre un concept difficile', s:{I:3} },
      { l:'B', t:'Analyser des chiffres, optimiser un tableau ou modéliser des données', s:{I:1,C:2} },
      { l:'C', t:'Convaincre quelqu\'un avec des arguments bien construits', s:{E:2,I:1} },
      { l:'D', t:'Trouver une solution créative à un problème inattendu', s:{A:2,I:1} },
    ]
  },
  {
    dim: 'I',
    bloc: 'Ta curiosité intellectuelle',
    text: 'Si tu pouvais suivre une formation complémentaire gratuite, tu choisirais...',
    opts: [
      { l:'A', t:'Recherche scientifique, data science ou philosophie', s:{I:3} },
      { l:'B', t:'Arts, expression créative, design ou écriture', s:{A:3} },
      { l:'C', t:'Entrepreneuriat, marketing, leadership', s:{E:3} },
      { l:'D', t:'Gestion, comptabilité, droit ou administration', s:{C:3} },
    ]
  },
  /* ── A : ARTISTE (4 questions) ── */
  {
    dim: 'A',
    bloc: 'Ton sens créatif',
    text: 'Dans un projet professionnel, qu\'est-ce qui te motive vraiment ?',
    opts: [
      { l:'A', t:'Concevoir quelque chose d\'original, avoir une liberté créative totale', s:{A:3} },
      { l:'B', t:'Résoudre un problème complexe grâce à l\'analyse', s:{I:3} },
      { l:'C', t:'Convaincre, vendre une idée, ou fédérer une équipe', s:{E:3} },
      { l:'D', t:'Livrer un travail irréprochable, sans erreur, dans les délais', s:{C:3} },
    ]
  },
  {
    dim: 'A',
    bloc: 'Ton sens créatif',
    text: 'Si on te laissait carte blanche pour un projet, tu créerais...',
    opts: [
      { l:'A', t:'Une œuvre, un film, un album, une pièce ou une exposition', s:{A:3} },
      { l:'B', t:'Un rapport d\'enquête, une étude ou un article de fond', s:{I:3} },
      { l:'C', t:'Une startup, un produit ou un service innovant', s:{E:3} },
      { l:'D', t:'Un système ou une procédure qui améliore une organisation', s:{C:3} },
    ]
  },
  {
    dim: 'A',
    bloc: 'Ton sens créatif',
    text: 'Tes proches diraient que tu as un talent particulier pour...',
    opts: [
      { l:'A', t:'Trouver des formulations originales, des visuels marquants, surprendre', s:{A:3} },
      { l:'B', t:'Aller au fond des choses, comprendre ce que les autres ne voient pas', s:{I:3} },
      { l:'C', t:'Prendre des initiatives, entraîner les autres', s:{E:3} },
      { l:'D', t:'Organiser, anticiper, ne rien laisser au hasard', s:{C:3} },
    ]
  },
  {
    dim: 'A',
    bloc: 'Ton sens créatif',
    text: 'Face à une page blanche ou un problème sans solution évidente, tu...',
    opts: [
      { l:'A', t:'Aimes ça — le vide me stimule, je vais créer quelque chose d\'unique', s:{A:3} },
      { l:'B', t:'Cherches des méthodes existantes pour structurer ma réflexion', s:{I:2,C:1} },
      { l:'C', t:'Consultes d\'autres personnes pour brainstormer ensemble', s:{S:2,E:1} },
      { l:'D', t:'Fais un plan d\'action clair avant de te lancer', s:{C:3} },
    ]
  },
  /* ── S : SOCIAL (4 questions) ── */
  {
    dim: 'S',
    bloc: 'Tes relations et valeurs humaines',
    text: 'Ce qui compte le plus pour toi dans un futur métier, c\'est...',
    opts: [
      { l:'A', t:'Avoir un impact direct sur la vie des personnes que j\'accompagne', s:{S:3} },
      { l:'B', t:'Faire avancer les connaissances ou maîtriser une expertise rare', s:{I:3} },
      { l:'C', t:'Créer quelque chose qui n\'existait pas, laisser une trace', s:{A:2,E:1} },
      { l:'D', t:'Contribuer à une organisation solide et bien gérée', s:{C:3} },
    ]
  },
  {
    dim: 'S',
    bloc: 'Tes relations et valeurs humaines',
    text: 'Dans 10 ans, tu te vois plutôt en train de...',
    opts: [
      { l:'A', t:'Accompagner des individus dans leur développement personnel ou professionnel', s:{S:3} },
      { l:'B', t:'Travailler seul(e) ou en petit groupe sur des problèmes complexes', s:{I:3} },
      { l:'C', t:'Diriger une équipe ou une organisation vers un objectif ambitieux', s:{E:3} },
      { l:'D', t:'Garantir la bonne gestion et la conformité d\'une structure', s:{C:3} },
    ]
  },
  {
    dim: 'S',
    bloc: 'Tes relations et valeurs humaines',
    text: 'Un(e) collègue ou ami(e) traverse une période difficile. Tu...',
    opts: [
      { l:'A', t:'Prends du temps pour l\'écouter vraiment, sans chercher à résoudre tout de suite', s:{S:3} },
      { l:'B', t:'Cherches des ressources ou des solutions concrètes à lui proposer', s:{I:2,S:1} },
      { l:'C', t:'Le/la motives, lui rappelles ses forces et ses victoires passées', s:{E:2,S:1} },
      { l:'D', t:'Lui proposes de t\'organiser ensemble pour avancer méthhodiquement', s:{C:2,S:1} },
    ]
  },
  {
    dim: 'S',
    bloc: 'Tes relations et valeurs humaines',
    text: 'Parmi ces missions professionnelles, laquelle t\'inspire le plus profondément ?',
    opts: [
      { l:'A', t:'Orienter, former ou soutenir des jeunes dans leur parcours', s:{S:3} },
      { l:'B', t:'Mener une enquête, une étude ou développer une expertise pointue', s:{I:3} },
      { l:'C', t:'Lancer un projet, convaincre des partenaires, ouvrir de nouveaux marchés', s:{E:3} },
      { l:'D', t:'Structurer des processus, gérer des données ou piloter des budgets', s:{C:3} },
    ]
  },
  /* ── E : ENTREPRENANT (4 questions) ── */
  {
    dim: 'E',
    bloc: 'Ton ambition et ton leadership',
    text: 'En dehors des études, est-ce qu\'il t\'arrive de...',
    opts: [
      { l:'A', t:'Lancer des initiatives, proposer des projets, prendre des responsabilités', s:{E:3} },
      { l:'B', t:'Faire des recherches approfondies sur des sujets qui te passionnent', s:{I:3} },
      { l:'C', t:'Créer du contenu : photos, vidéos, écriture, dessin, musique', s:{A:3} },
      { l:'D', t:'Tenir un budget, organiser des événements ou gérer des ressources', s:{C:3} },
    ]
  },
  {
    dim: 'E',
    bloc: 'Ton ambition et ton leadership',
    text: 'Comment les autres te perçoivent-ils généralement ?',
    opts: [
      { l:'A', t:'Dynamique, ambitieux(se), force de proposition, prend les devants', s:{E:3} },
      { l:'B', t:'Curieux(se), analytique, cherche toujours à comprendre', s:{I:3} },
      { l:'C', t:'Créatif(ve), original(e), surprend souvent par ses idées', s:{A:3} },
      { l:'D', t:'Rigoureux(se), fiable, organisé(e), on peut compter sur lui/elle', s:{C:3} },
    ]
  },
  {
    dim: 'E',
    bloc: 'Ton ambition et ton leadership',
    text: 'Si tu dirigeais une organisation demain, ta priorité serait...',
    opts: [
      { l:'A', t:'Développer, innover, conquérir de nouveaux marchés ou publics', s:{E:3} },
      { l:'B', t:'Comprendre les enjeux en profondeur avant d\'agir', s:{I:3} },
      { l:'C', t:'Créer une culture forte, une identité visuelle et un récit inspirant', s:{A:2,E:1} },
      { l:'D', t:'Mettre en place une gestion solide, des procédures claires', s:{C:3} },
    ]
  },
  {
    dim: 'E',
    bloc: 'Ton ambition et ton leadership',
    text: 'Quelle citation résonne le plus avec ta vision de la réussite ?',
    opts: [
      { l:'A', t:'« Le meilleur moyen de prédire l\'avenir, c\'est de le créer. »', s:{E:3} },
      { l:'B', t:'« La connaissance, c\'est le pouvoir. »', s:{I:3} },
      { l:'C', t:'« La créativité, c\'est l\'intelligence qui s\'amuse. »', s:{A:3} },
      { l:'D', t:'« L\'excellence est une habitude, pas un acte ponctuel. »', s:{C:3} },
    ]
  },
  /* ── C : CONVENTIONNEL (4 questions) ── */
  {
    dim: 'C',
    bloc: 'Ton sens de la rigueur',
    text: 'Comment tu travailles généralement sur un projet long ?',
    opts: [
      { l:'A', t:'Je fais un plan détaillé dès le départ, je suis les étapes, je vérifie', s:{C:3} },
      { l:'B', t:'Je plonge dans la recherche d\'abord pour bien cerner le sujet', s:{I:3} },
      { l:'C', t:'J\'avance par l\'inspiration, je structure au fur et à mesure', s:{A:2,E:1} },
      { l:'D', t:'Je consulte les autres régulièrement pour m\'assurer qu\'on est alignés', s:{S:2,E:1} },
    ]
  },
  {
    dim: 'C',
    bloc: 'Ton sens de la rigueur',
    text: 'Quelle compétence tu considères comme vraiment la tienne ?',
    opts: [
      { l:'A', t:'L\'organisation : je structure, classe et planifie mieux que quiconque', s:{C:3} },
      { l:'B', t:'L\'analyse : je comprends les systèmes complexes et trouve les failles', s:{I:3} },
      { l:'C', t:'La créativité : je génère des idées nouvelles et originales', s:{A:3} },
      { l:'D', t:'L\'influence : je convaincs, fédère et entraîne les autres', s:{E:3} },
    ]
  },
  {
    dim: 'C',
    bloc: 'Ton sens de la rigueur',
    text: 'Parmi ces secteurs, lequel t\'attire le plus ?',
    opts: [
      { l:'A', t:'Finance, comptabilité, audit, administration ou droit', s:{C:3} },
      { l:'B', t:'Recherche, ingénierie, data science ou médecine', s:{I:3} },
      { l:'C', t:'Arts, communication, design ou médias', s:{A:3} },
      { l:'D', t:'Ressources humaines, formation, orientation ou travail social', s:{S:3} },
    ]
  },
  {
    dim: 'C',
    bloc: 'Ton sens de la rigueur',
    text: 'Ta relation au détail et à la précision, c\'est...',
    opts: [
      { l:'A', t:'Je ne peux pas rendre quelque chose sans que ce soit irréprochable', s:{C:3} },
      { l:'B', t:'Je vise la rigueur surtout quand ça impacte les autres ou le résultat final', s:{I:2,S:1} },
      { l:'C', t:'Je préfère avancer vite et peaufiner si nécessaire', s:{E:2,A:1} },
      { l:'D', t:'Ça dépend du projet — je m\'adapte', s:{E:1,S:1,I:1} },
    ]
  },
];

/* ══════════════════════════════════════════════════════════════
   PROFILS
══════════════════════════════════════════════════════════════ */
const profilesJunior = {
  R: {
    code:'RÉALISTE', bg:'#E07B39', emoji:'🛠️',
    name:'Le/La Bâtisseur(se)',
    desc:'Tu aimes faire des choses concrètes avec tes mains. Construire, réparer, bouger, être sur le terrain — c\'est ce qui t\'anime. Tu es pragmatique, débrouillard(e) et tu es fier(ère) de voir le résultat de ton travail.',
    forces:['👐 Habile et débrouillard(e)','⚡ Actif(ve) et énergique','🎯 Concret(e), tu passes à l\'action'],
    vigilance:['Peut s\'impatienter avec trop de théorie','Préfère faire qu\'expliquer'],
    metiers:['Technicien(ne)','Électricien(ne)','Agriculteur(trice)','Vétérinaire','Kinésithérapeute','Architecte','Ingénieur(e)','Pompier / Militaire'],
    filieres:['Bac Pro Technique','CAP / BEP','BUT Génie Civil','École d\'ingénieurs','Licence Sciences de la vie']
  },
  I: {
    code:'INVESTIGATEUR', bg:'#3A7CA5', emoji:'🔬',
    name:'Le/La Chercheur(se)',
    desc:'Tu es curieux(se) de tout ! Tu aimes comprendre comment les choses fonctionnent, poser des questions et chercher des réponses. La science, les mystères, les grandes questions du monde — ça te fascine.',
    forces:['🧠 Très curieux(se) et analytique','📚 Aime apprendre en profondeur','🔍 Trouve des solutions là où les autres n\'en voient pas'],
    vigilance:['Peut rester trop longtemps dans sa tête','Parfois difficile d\'agir sans tout comprendre'],
    metiers:['Médecin','Chercheur(se)','Ingénieur(e)','Pharmacien(ne)','Informaticien(ne)','Biologiste','Économiste','Prof de maths / sciences'],
    filieres:['Bac S / Terminale scientifique','Prépa BCPST ou MPSI','Licence Sciences','Médecine / Pharmacie','École d\'ingénieurs']
  },
  A: {
    code:'ARTISTE', bg:'#9B59B6', emoji:'🎨',
    name:'Le/La Créateur(trice)',
    desc:'Tu as une âme créative ! Tu vois le monde avec un regard original et tu aimes exprimer ce que tu ressens. Que ce soit par le dessin, l\'écriture, la musique ou le style — tu as un talent pour créer des choses qui touchent les autres.',
    forces:['✨ Original(e) et créatif(ve)','🎭 Grande sensibilité artistique','💡 Trouve des idées que les autres n\'auraient pas'],
    vigilance:['Peut manquer de structure','L\'organisation n\'est pas toujours le fort'],
    metiers:['Designer','Graphiste','Musicien(ne)','Réalisateur(trice)','Architecte','Journaliste','Auteur(e)','Comédien(ne)'],
    filieres:['Bac L / Terminale Humanités','BTS Design ou Communication','École d\'art / ESAD','Licence Arts / Lettres','École de journalisme']
  },
  S: {
    code:'SOCIAL', bg:'#27AE60', emoji:'🤝',
    name:'Le/La Guide Humain(e)',
    desc:'Tu es fait(e) pour les autres ! Écouter, aider, comprendre — c\'est naturel pour toi. Les gens se sentent bien avec toi, tu sais créer des liens et tu veux que tout le monde aille bien.',
    forces:['❤️ Empathique et à l\'écoute','🤝 Excellent(e) en travail d\'équipe','🌟 Inspire confiance naturellement'],
    vigilance:['Peut oublier ses propres besoins','Difficulté à dire non'],
    metiers:['Enseignant(e)','Psychologue','Infirmier(ère)','Assistant(e) social(e)','Éducateur(trice)','Conseiller(ère) d\'orientation','Coach'],
    filieres:['Bac L ou ES','BTS Services aux personnes','Licence Psychologie / Sciences sociales','Travail social','IFSI (Infirmier)']
  },
  E: {
    code:'ENTREPRENANT', bg:'#C9A84C', emoji:'🚀',
    name:'Le/La Leader',
    desc:'Tu es une force de la nature ! Tu prends les devants, tu as des idées plein la tête et tu sais entraîner les autres. Tu n\'attends pas — tu agis. Les défis te stimulent et tu n\'as pas peur d\'échouer pour apprendre.',
    forces:['🦁 Leadership naturel','💥 Plein(e) d\'énergie et d\'idées','🎯 Persuasif(ve) et ambitieux(se)'],
    vigilance:['Peut s\'emporter ou aller trop vite','Besoin d\'apprendre à écouter les détails'],
    metiers:['Chef d\'entreprise','Commercial(e)','Manager','Responsable de projet','Avocat(e)','Journaliste','Politique / Diplomate'],
    filieres:['Bac ES / Économique','BTS Management','École de commerce','Licence Gestion / Droit','Sciences Po']
  },
  C: {
    code:'CONVENTIONNEL', bg:'#1C4A35', emoji:'📋',
    name:'L\'Architecte de l\'Ordre',
    desc:'Tu es la personne sur qui on peut compter ! Tu aimes que tout soit en ordre, bien organisé et que chaque chose soit à sa place. Tu es rigoureux(se), méthodique, et tu as un talent naturel pour les chiffres et les données.',
    forces:['📐 Super organisé(e) et rigoureux(se)','🔢 À l\'aise avec les chiffres et les données','✅ Fiable, ponctuel(le), sans erreur'],
    vigilance:['Peut être trop perfectionniste','Difficulté à improviser'],
    metiers:['Comptable','Gestionnaire','Banquier(ère)','Secrétaire de direction','Logisticien(ne)','Responsable RH','Notaire'],
    filieres:['Bac STMG','BTS Comptabilité / Gestion','Licence AES / Économie','DUT GEA','École de commerce (gestion)']
  }
};

const profilesSenior = {
  R: {
    code:'RÉALISTE', bg:'#E07B39',
    name:'Le/La Technicien(ne) Expert(e)',
    desc:'Tu es attiré(e) par le concret, l\'opérationnel et le terrain. Tu trouves du sens dans le travail qui produit des résultats visibles et tangibles. Pragmatique, débrouillard(e), tu excelles dans les environnements qui demandent de l\'action et du savoir-faire technique.',
    forces:['Sens pratique et efficacité opérationnelle','Autonomie sur le terrain','Capacité à produire des résultats concrets'],
    vigilance:['Peut s\'impatienter avec les environnements très théoriques ou administratifs','Préfère l\'action à la communication'],
    metiers:['Ingénieur(e) civil / industriel','Architecte','Kinésithérapeute','Technicien(ne) spécialisé(e)','Vétérinaire','Chirurgien(ne)','Topographe'],
    filieres:['Licence ou Master Sciences & Techniques','École d\'ingénieurs','IFMK (Kiné)','Médecine / Chirurgie','Génie civil / BTP','Agriculture et agronomie']
  },
  I: {
    code:'INVESTIGATEUR', bg:'#3A7CA5',
    name:'L\'Investigateur(trice)',
    desc:'Tu as une soif de comprendre le monde. Analytique, curieux(se) et rigoureux(se), tu excelles dans la recherche, la maîtrise d\'un domaine d\'expertise et la résolution de problèmes complexes. Les grandes questions ne te font pas peur — elles t\'attirent.',
    forces:['Rigueur intellectuelle et analyse approfondie','Indépendance d\'esprit','Capacité à maîtriser un domaine en profondeur'],
    vigilance:['Peut sembler trop dans sa tête','Peut manquer d\'urgence à l\'action'],
    metiers:['Chercheur(se)','Data analyst / Scientist','Médecin spécialiste','Économiste','Ingénieur(e) R&D','Consultant(e) stratégie','Pharmacien(ne)','Psychologue clinicien(ne)'],
    filieres:['Master Recherche','École d\'ingénieurs','Médecine / Pharmacie','Master Économie / Data Science','Droit (carrières savantes)','Sciences cognitives']
  },
  A: {
    code:'ARTISTE', bg:'#9B59B6',
    name:'Le/La Créateur(trice)',
    desc:'Tu portes un regard original sur le monde et tu as besoin de l\'exprimer. Que ce soit par l\'image, le mot, le son ou le design — tu crées des choses qui touchent, qui provoquent, qui restent. Les environnements trop rigides t\'étouffent ; la liberté t\'inspire.',
    forces:['Originalité et vision créative unique','Grande sensibilité et sens esthétique','Capacité à surprendre et à innover'],
    vigilance:['La structure et l\'organisation ne sont pas le point fort','Peut avoir du mal avec les contraintes bureaucratiques'],
    metiers:['Designer UX/UI ou graphique','Réalisateur(trice)','Journaliste / Auteur(e)','Architecte','Directeur(trice) artistique','Chargé(e) de communication créative','Game designer'],
    filieres:['École d\'art / Architecture','École de journalisme','Master Communication / Médias','BTS Design / Audiovisuel','Licence Arts / Lettres','Sciences Po (communication)']
  },
  S: {
    code:'SOCIAL', bg:'#27AE60',
    name:'Le/La Bâtisseur(se) Humain(e)',
    desc:'Tu es naturellement tourné(e) vers les autres. Empathique, à l\'écoute, tu trouves du sens dans le fait d\'aider, d\'accompagner et de transmettre. Les relations humaines sont au cœur de ce qui te motive. Tu seras épanoui(e) dans un métier qui place l\'humain au centre.',
    forces:['Écoute et empathie naturelles','Excellence en travail collaboratif','Sens de la transmission et du service'],
    vigilance:['Tendance à trop se sacrifier pour les autres','Difficulté à dire non'],
    metiers:['Conseiller(ère) d\'orientation','Psychologue du travail','Formateur(trice)','Chargé(e) RH','Coach professionnel(le)','Enseignant(e)','Travailleur(se) social(e)','Chargé(e) de mission ONG'],
    filieres:['Master Psychologie du travail','Sciences de l\'éducation','Travail social / Éducation spécialisée','Master RH','Sciences Po (affaires sociales)','Formation continue / Coaching']
  },
  E: {
    code:'ENTREPRENANT', bg:'#C9A84C',
    name:'L\'Entrepreneur(e)-Leader',
    desc:'Tu es fait(e) pour initier, convaincre et fédérer. Dynamique, ambitieux(se), tu n\'attends pas que les choses arrivent : tu les crées. Tu as une vision, tu sais communiquer avec énergie et tu aimes prendre des responsabilités.',
    forces:['Leadership naturel et prise d\'initiative','Sens de la persuasion et de la négociation','Énergie et capacité à fédérer autour d\'un projet'],
    vigilance:['Peut sous-estimer la rigueur et les détails','Impatience face aux processus lents'],
    metiers:['Entrepreneur(e)','Chef(fe) de projet','Directeur(trice) commercial(e)','Manager','Consultant(e) en stratégie','Avocat(e) d\'affaires','Responsable marketing','Directeur(trice) RH'],
    filieres:['École de commerce (HEC, KEDGE...)','Master Management / Entrepreneuriat','Droit des affaires','Sciences Po','MBA','Master Marketing / Commerce international']
  },
  C: {
    code:'CONVENTIONNEL', bg:'#1C4A35',
    name:'L\'Architecte de l\'Organisation',
    desc:'Tu es dans ton élément quand les choses sont bien organisées, structurées et documentées. Rigoureux(se), fiable et méticuleux(se), tu as un sens du détail que tout le monde apprécie. Tu assures la solidité des projets et des institutions.',
    forces:['Rigueur et organisation exemplaires','Fiabilité et sens du détail','Excellente maîtrise des données et des chiffres'],
    vigilance:['Peut être trop perfectionniste ou résistant(e) au changement','Inconfort face à l\'ambiguïté'],
    metiers:['Comptable / Auditeur(trice)','Analyste financier(ère)','Responsable administratif(ve)','Gestionnaire RH','Inspecteur(trice) des finances','Logisticien(ne)','Notaire','DAF'],
    filieres:['DCG / DSCG / Expert-comptable','Master Finance / Comptabilité','Droit notarial ou fiscal','Master RH / Administration','École de commerce (gestion)','IEP (administration publique)']
  }
};




const dimInfo: Record<string, any> = {
  R: { name: 'Réaliste', sub: 'Terrain & Pratique' },
  I: { name: 'Investigateur', sub: 'Apprendre & Analyser' },
  A: { name: 'Artiste', sub: 'Créer & Exprimer' },
  S: { name: 'Social', sub: 'Aider & Transmettre' },
  E: { name: 'Entreprenant', sub: 'Innover & Diriger' },
  C: { name: 'Conventionnel', sub: 'Organiser & Structurer' }
}
const dimOrder = ['S', 'I', 'E', 'C', 'A', 'R']

function selectLevel(lvl: string) {
  mode.value = lvl
}

function goToRegister() {
  if (mode.value) {
    currentScreen.value = 'register'
  }
}

async function submitRegister() {
  isRegistering.value = true
  registerError.value = ''
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        ...registerForm.value,
        source: 'orientation_test'
      }
    })
    startTest()

  } catch (err: any) {
    registerError.value = err.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    isRegistering.value = false
  }
}

function startTest() {
  questions.value = mode.value === 'junior' ? questionsJunior : questionsSenior
  currentQ.value = 0
  answers.value = []
  scores.value = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  currentScreen.value = 'question'
}

function selectOpt(idx: number) {
  answers.value[currentQ.value] = idx
}

function nextQ() {
  if (answers.value[currentQ.value] === undefined) return
  
  const opt = currentQuestionData.value?.opts?.[answers.value[currentQ.value] as number]
  if (!opt || !opt.s) return
  
  for (const [d, v] of Object.entries(opt.s)) {
    if (scores.value[d] !== undefined) scores.value[d] += v as number
  }
  
  if (currentQ.value < questions.value.length - 1) {
    currentQ.value++
  } else {
    currentScreen.value = 'result'
  }
}

const resultProfile = computed<any>(() => {
  if (currentScreen.value !== 'result') return {}
  const dims = ['R', 'I', 'A', 'S', 'E', 'C']
  const sorted = [...dims].sort((a, b) => (scores.value[b] || 0) - (scores.value[a] || 0))
  const profKey = sorted[0]
  const profs = mode.value === 'junior' ? profilesJunior : profilesSenior
  return profs[profKey as keyof typeof profs]
})



function restartTest() {
  mode.value = null
  currentScreen.value = 'welcome'
}
</script>

<style scoped>

/* ══════════════════════════════════════════
   VARIABLES & RESET
══════════════════════════════════════════ */
.orientation-page {
  --forest: #1C4A35;
  --forest-light: #2A6B4F;
  --gold: #C9A84C;
  --gold-light: #E8C86A;
  --terra: #C26A42;
  --offwhite: #F7F3ED;
  --cream: #EDE8DF;
  --dark: #1A1A1A;
  --text: #2C2C2C;
  --muted: #6B6B6B;
  /* Dimension colors */
  --col-R: #E07B39;
  --col-I: #3A7CA5;
  --col-A: #9B59B6;
  --col-S: #27AE60;
  --col-E: #C9A84C;
  --col-C: #1C4A35;
}
* { margin:0; padding:0; box-sizing:border-box; }
.orientation-page { font-family:'DM Sans',sans-serif; background:var(--offwhite); color:var(--text); min-height:100vh; overflow-x:hidden; }

/* ══ HEADER ══ */
.header { background:var(--forest); padding:16px 28px; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:100; box-shadow:0 2px 20px rgba(0,0,0,.25); }
.logo-circle { width:40px;height:40px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:15px;color:var(--forest);flex-shrink:0; }
.header-title { font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--offwhite); }
.header-subtitle { font-size:10px;color:var(--gold-light);letter-spacing:1.5px;text-transform:uppercase;margin-top:1px; }

/* ══ PROGRESS ══ */
.prog-bar-wrap { background:var(--cream);padding:12px 28px;border-bottom:1px solid rgba(28,74,53,.1); }
.prog-label { font-size:12px;color:var(--muted);margin-bottom:5px; }
.prog-track { height:6px;background:rgba(28,74,53,.12);border-radius:10px;overflow:hidden; }
.prog-fill { height:100%;background:linear-gradient(90deg,var(--forest),var(--gold));border-radius:10px;transition:width .5s cubic-bezier(.4,0,.2,1); }

/* ══ SCREENS ══ */
.screen { display:none; }
.screen.active { display:block; }

/* ══════════════════════════════════════════
   SCREEN 0 : ACCUEIL (choix de niveau)
══════════════════════════════════════════ */
#s-welcome { max-width:680px;margin:0 auto;padding:52px 24px;text-align:center; }
.welcome-badge { display:inline-block;background:var(--gold);color:var(--forest);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 16px;border-radius:20px;margin-bottom:24px; }
.welcome-title { font-family:'Cormorant Garamond',serif;font-size:clamp(32px,6vw,50px);font-weight:700;color:var(--forest);line-height:1.2;margin-bottom:16px; }
.welcome-title span { color:var(--gold); }
.welcome-desc { font-size:15px;color:var(--muted);line-height:1.7;max-width:500px;margin:0 auto 40px; }
.level-cards { display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:560px;margin:0 auto 32px; }
@media(max-width:480px){ .level-cards{grid-template-columns:1fr;} }
.level-card { background:white;border:2.5px solid rgba(28,74,53,.12);border-radius:20px;padding:28px 22px;cursor:pointer;transition:all .22s ease;text-align:left;position:relative;overflow:hidden; }
.level-card:hover { border-color:var(--forest);transform:translateY(-3px);box-shadow:0 8px 28px rgba(28,74,53,.18); }
.level-card.selected { border-color:var(--forest);background:var(--forest);color:white; }
.level-card-emoji { font-size:32px;display:block;margin-bottom:12px; }
.level-card-title { font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--forest);margin-bottom:6px; }
.level-card.selected .level-card-title { color:var(--gold); }
.level-card-ages { font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:8px; }
.level-card.selected .level-card-ages { color:var(--gold-light); }
.level-card-desc { font-size:13px;color:var(--muted);line-height:1.5; }
.level-card.selected .level-card-desc { color:rgba(247,243,237,.75); }
.btn-go { background:var(--forest);color:white;border:none;padding:16px 52px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;letter-spacing:.5px;border-radius:50px;cursor:pointer;transition:all .22s;opacity:.35;pointer-events:none;box-shadow:0 6px 24px rgba(28,74,53,.25); }
.btn-go.ready { opacity:1;pointer-events:auto; }
.btn-go.ready:hover { background:var(--forest-light);transform:translateY(-2px); }
.welcome-note { margin-top:16px;font-size:11px;color:var(--muted); }

/* ══════════════════════════════════════════
   SCREEN 1 : QUESTION — VERSION JUNIOR (4e/3e)
══════════════════════════════════════════ */
/* Style fun avec emojis et fond coloré léger */
.orientation-page.mode-junior { background:#FAFFF8; }
.q-wrap-junior { max-width:640px;margin:0 auto;padding:32px 20px; }
.q-bloc-label-junior { display:inline-flex;align-items:center;gap:7px;background:white;border:2px solid rgba(28,74,53,.12);border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;color:var(--forest);letter-spacing:.5px;text-transform:uppercase;margin-bottom:20px; }
.q-num-junior { font-family:'Nunito',sans-serif;font-size:52px;font-weight:900;color:var(--forest);line-height:1;margin-bottom:6px; }
.q-num-sub-junior { font-size:12px;color:var(--muted); }
.q-bubble { background:white;border-radius:20px;padding:22px 26px;margin-bottom:24px;box-shadow:0 3px 16px rgba(0,0,0,.07);border-left:5px solid var(--gold); }
.q-text-junior { font-family:'Nunito',sans-serif;font-size:clamp(18px,3.5vw,24px);font-weight:800;color:var(--dark);line-height:1.35; }
.opts-junior { display:grid;gap:11px; }
.opt-junior { background:white;border:2.5px solid rgba(28,74,53,.12);border-radius:14px;padding:14px 18px;text-align:left;cursor:pointer;font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;color:var(--text);transition:all .18s;display:flex;align-items:center;gap:13px; }
.opt-junior:hover { border-color:var(--forest);background:#F0FAF4;transform:translateX(3px); }
.opt-junior.selected { border-color:var(--forest);background:var(--forest);color:white; }
.opt-junior.selected .opt-emoji { filter:none; }
.opt-emoji { font-size:22px;flex-shrink:0;width:32px;text-align:center; }
.btn-next-junior { margin-top:24px;width:100%;background:var(--forest);color:white;border:none;padding:16px;font-family:'Nunito',sans-serif;font-size:16px;font-weight:800;border-radius:14px;cursor:pointer;transition:all .22s;opacity:.3;pointer-events:none; }
.btn-next-junior.ready { opacity:1;pointer-events:auto; }
.btn-next-junior.ready:hover { background:var(--forest-light); }

/* ══════════════════════════════════════════
   SCREEN 1 : QUESTION — VERSION SENIOR (1re → Master)
══════════════════════════════════════════ */
.q-wrap-senior { max-width:660px;margin:40px auto;padding:0 24px; }
.q-header-senior { display:flex;align-items:flex-start;gap:16px;margin-bottom:28px; }
.q-num-senior { font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:700;color:var(--gold);line-height:1;flex-shrink:0; }
.q-meta-senior { padding-top:6px; }
.q-cat-senior { font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--forest);font-weight:600;margin-bottom:4px; }
.q-num-sub-senior { font-size:12px;color:var(--muted); }
.q-text-senior { font-family:'Cormorant Garamond',serif;font-size:clamp(21px,3.5vw,29px);font-weight:600;color:var(--dark);line-height:1.35;margin-bottom:30px; }
.opts-senior { display:grid;gap:11px; }
.opt-senior { background:white;border:2px solid rgba(28,74,53,.12);border-radius:13px;padding:16px 20px;text-align:left;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);transition:all .18s;display:flex;align-items:center;gap:12px; }
.opt-senior:hover { border-color:var(--forest);transform:translateX(3px);box-shadow:0 3px 14px rgba(28,74,53,.12); }
.opt-senior.selected { border-color:var(--forest);background:var(--forest);color:white; }
.opt-letter { width:30px;height:30px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--forest);flex-shrink:0;transition:all .18s; }
.opt-senior.selected .opt-letter { background:var(--gold);color:var(--forest); }
.btn-next-senior { margin-top:28px;width:100%;background:var(--forest);color:white;border:none;padding:15px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;border-radius:11px;cursor:pointer;transition:all .22s;opacity:.3;pointer-events:none; }
.btn-next-senior.ready { opacity:1;pointer-events:auto; }
.btn-next-senior.ready:hover { background:var(--forest-light); }

/* ══════════════════════════════════════════
   SCREEN 2 : RÉSULTATS
══════════════════════════════════════════ */
#s-result { padding:40px 0 60px; }
.result-inner { max-width:740px;margin:0 auto;padding:0 20px; }

/* Hero profil */
.result-hero { text-align:center;margin-bottom:36px; }
.result-eyebrow { display:inline-block;background:var(--gold);color:var(--forest);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 16px;border-radius:20px;margin-bottom:18px; }
.result-main-title { font-family:'Cormorant Garamond',serif;font-size:clamp(26px,5vw,42px);font-weight:700;color:var(--forest);margin-bottom:10px;line-height:1.2; }
.result-main-title span { color:var(--gold); }
.result-sub { font-size:14px;color:var(--muted);max-width:480px;margin:0 auto;line-height:1.65; }

/* Profile card */
.profile-hero-card { border-radius:22px;padding:32px;margin-bottom:26px;color:white;position:relative;overflow:hidden; }
.profile-hero-card::after { content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.07); }
.profile-hero-code { font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;letter-spacing:6px;margin-bottom:6px;opacity:.9; }
.profile-hero-name { font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;margin-bottom:14px; }
.profile-hero-desc { font-size:14px;line-height:1.7;opacity:.88;max-width:540px; }

/* Scores */
.card-white { background:white;border-radius:18px;padding:28px;margin-bottom:22px;box-shadow:0 2px 18px rgba(0,0,0,.06); }
.card-title { font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:700;color:var(--forest);margin-bottom:20px; }
.dim-bar-row { display:flex;align-items:center;gap:12px;margin-bottom:14px; }
.dim-bar-label { width:120px;flex-shrink:0; }
.dim-bar-name { font-size:13px;font-weight:600;color:var(--text); }
.dim-bar-sub { font-size:11px;color:var(--muted); }
.dim-bar-track { flex:1;height:10px;background:var(--cream);border-radius:10px;overflow:hidden; }
.dim-bar-fill { height:100%;border-radius:10px;transition:width 1.2s cubic-bezier(.4,0,.2,1); }
.dim-bar-pct { width:38px;text-align:right;font-size:13px;font-weight:700;color:var(--text);flex-shrink:0; }

/* Forces / Vigilance */
.two-cols { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px; }
@media(max-width:520px){.two-cols{grid-template-columns:1fr;}}
.mini-card { background:white;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06); }
.mini-card.green { border-top:4px solid var(--forest); }
.mini-card.orange { border-top:4px solid var(--terra); }
.mini-card-label { font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:8px; }
.mini-card-title { font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--dark);margin-bottom:8px; }
.mini-tag { display:inline-block;background:var(--offwhite);border:1px solid rgba(28,74,53,.12);border-radius:20px;padding:4px 12px;font-size:12px;color:var(--text);margin:3px 3px 3px 0; }

/* Métiers */
.metiers-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px; }
.metier-chip { background:var(--offwhite);border:1px solid rgba(28,74,53,.13);border-radius:10px;padding:11px 14px;font-size:12px;font-weight:600;color:var(--forest);display:flex;align-items:center;gap:7px; }
.metier-chip::before { content:'◆';color:var(--gold);font-size:7px;flex-shrink:0; }

/* Filières / études */
.filieres-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px; }
.filiere-chip { background:white;border:1.5px solid rgba(28,74,53,.15);border-radius:10px;padding:12px 16px;font-size:12px;font-weight:500;color:var(--text);display:flex;align-items:flex-start;gap:8px; }
.filiere-chip .f-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px; }

/* ══ FORMULAIRE MENTORÉ ══ */
.mentore-wrap { background:white;border-radius:22px;padding:36px;margin-bottom:24px;box-shadow:0 2px 18px rgba(0,0,0,.07);border-top:4px solid var(--gold); }
.mentore-eyebrow { font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:8px; }
.mentore-title { font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--forest);margin-bottom:10px;line-height:1.3; }
.mentore-desc { font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:24px; }
.pills-row { display:flex;gap:9px;flex-wrap:wrap;margin-bottom:22px; }
.s-pill { background:var(--offwhite);border:2px solid rgba(28,74,53,.13);border-radius:50px;padding:9px 16px;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:6px; }
.s-pill:hover { border-color:var(--forest); }
.s-pill.sel { background:var(--forest);border-color:var(--forest);color:white; }
.form-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px; }
@media(max-width:520px){.form-grid{grid-template-columns:1fr;}}
.f-field { display:flex;flex-direction:column;gap:5px; }
.f-field.full { grid-column:1/-1; }
.f-label { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--forest); }
.f-input,.f-select { border:2px solid rgba(28,74,53,.14);border-radius:9px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);background:var(--offwhite);outline:none;transition:border-color .18s;width:100%; }
.f-input:focus,.f-select:focus { border-color:var(--forest);background:white; }
.f-select { appearance:none;cursor:pointer; }
.submit-btn { width:100%;margin-top:18px;background:var(--forest);color:white;border:none;padding:16px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;border-radius:11px;cursor:pointer;transition:all .22s;display:flex;align-items:center;justify-content:center;gap:8px; }
.submit-btn:hover { background:var(--forest-light);transform:translateY(-1px); }
.submit-btn:disabled { opacity:.5;cursor:not-allowed;transform:none; }
.ministry-note { background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.3);border-radius:12px;padding:14px 18px;margin-top:14px;display:flex;gap:10px;align-items:flex-start;font-size:12px;color:var(--muted);line-height:1.6; }
.ministry-note strong { color:var(--forest); }
.form-success { display:none;text-align:center;padding:28px 0 8px; }
.success-circle { width:60px;height:60px;background:var(--forest);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 16px; }
.success-title { font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--forest);margin-bottom:10px; }
.success-text { font-size:13px;color:var(--muted);line-height:1.7;max-width:420px;margin:0 auto 14px; }
.success-note { font-size:12px;color:var(--gold);font-weight:600; }

/* Restart */
.restart-row { text-align:center;margin-bottom:28px; }
.restart-btn { background:none;border:2px solid rgba(28,74,53,.18);color:var(--forest);padding:11px 30px;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s; }
.restart-btn:hover { background:var(--forest);color:white; }

.disclaimer { text-align:center;font-size:11px;color:var(--muted);line-height:1.6;padding:0 20px 28px;max-width:600px;margin:0 auto; }

/* ══ ANIMATIONS ══ */
@keyframes fadeUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
.fade-up { animation:fadeUp .45s ease forwards; }

</style>

<template>
  <div>
    <UiTheNavbar />

    <main>
      <UiHeroSection />
      <UiMissionSection />
      <UiMentorshipSection />
      <UiResourcesSection />
      <UiEventsSection />
      <UiForumSection />
      <UiFoundersSection />
      <UiImpactSection />
      <UiPartnersSection />
      <UiCtaSection />
    </main>

    <UiTheFooter />
  </div>
</template>

<script setup lang="ts">
useScrollReveal()

useHead({
  title: 'CAP ALI - Communauté d\'Appui au Parcours des Africains et Leaders Inspirants',
  meta: [
    {
      name: 'description',
      content: 'CAP ALI accompagne les jeunes Béninois et Africains francophones dans leur parcours vers et en France. Mentorat, ressources, communauté.',
    },
  ],
})
</script>

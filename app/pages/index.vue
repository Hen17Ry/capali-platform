<template>
  <div>
    <UiTheNavbar />

    <main>
      <UiHeroSection />
      <UiMissionSection />
      <LazyUiMentorshipSection />
      <LazyUiResourcesSection />
      <LazyUiEventsSection />
      <LazyUiForumSection />
      <LazyUiFoundersSection />
      <LazyUiImpactSection />
      <LazyUiPartnersSection />
      <LazyUiCtaSection />
    </main>

    <LazyUiTheFooter />
  </div>
</template>

<script setup lang="ts">
useScrollReveal()

useHead({
  title: 'CAP ALI',
  meta: [
    {
      name: 'description',
      content: 'CAP ALI accompagne les jeunes Béninois et Africains francophones dans leur parcours vers et en France. Mentorat, ressources, communauté.',
    },
  ],
})
</script>

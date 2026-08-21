<template>
  <div id="app" style="overflow-x: hidden; width: 100%; max-width: 100vw;">
    <VitePwaManifest />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiDonationModal />
    <UiPwaInstallPrompt />
  </div>
</template>

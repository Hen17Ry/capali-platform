<template>
  <div class="default-layout">
    <slot />
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="app-layout">
    <AppHeader />
    <ToastNotification />
    <main class="app-layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";
import ToastNotification from "~/components/ToastNotification.vue";
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-body);

  &__main {
    flex: 1;
    padding: 1.5rem 0 3rem 0;
  }
}
</style>
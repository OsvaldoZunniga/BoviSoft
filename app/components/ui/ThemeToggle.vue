<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    aria-label="Alternar modo de color"
  >
    <IconSun v-if="isDark" class="theme-toggle__icon" />
    <IconMoon v-else class="theme-toggle__icon" />
    <span class="theme-toggle__text">{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "~/composables/useTheme";
import IconSun from "~/components/icons/IconSun.vue";
import IconMoon from "~/components/icons/IconMoon.vue";

const { isDark, toggleTheme, initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<style scoped lang="scss">
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-main);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-surface-hover);
    border-color: var(--text-muted);
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: var(--accent-gold);
  }

  &__text {
    font-size: 0.82rem;
  }
}
</style>

<template>
  <span :class="['base-badge', `base-badge--${variant}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "active" | "inactive" | "sold" | "unassigned" | "neutral" | "tag";
  }>(),
  {
    variant: "neutral",
  }
);
</script>

<style scoped lang="scss">
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;

  &--active {
    background-color: var(--status-active-bg);
    color: var(--status-active);
    border: 1px solid var(--status-active);
  }

  &--inactive {
    background-color: var(--status-inactive-bg);
    color: var(--status-inactive);
    border: 1px solid var(--border-color);
  }

  &--sold {
    background-color: var(--status-sold-bg);
    color: var(--status-sold);
    border: 1px solid var(--status-sold);
  }

  &--unassigned {
    background-color: var(--bg-surface-elevated);
    color: var(--text-muted);
    border: 1px dashed var(--border-color);
  }

  &--tag {
    background-color: var(--color-secondary-subtle);
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);
  }

  &--neutral {
    background-color: var(--bg-surface-hover);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
  }
}
</style>

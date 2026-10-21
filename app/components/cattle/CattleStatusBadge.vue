<template>
  <span :class="['status-chip', `status-chip--${statusClass}`]">
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  statusId: number;
}>();

const statusClass = computed(() => {
  switch (props.statusId) {
    case 1:
      return "active";
    case 2:
      return "sold";
    case 0:
    default:
      return "inactive";
  }
});

const statusLabel = computed(() => {
  switch (props.statusId) {
    case 1:
      return "Activo";
    case 2:
      return "Vendido";
    case 0:
    default:
      return "Inactivo";
  }
});
</script>

<style scoped lang="scss">
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;

  &--active {
    background-color: var(--status-active-bg);
    color: var(--status-active);
    border: 1px solid var(--status-active);
  }

  &--sold {
    background-color: var(--status-sold-bg);
    color: var(--status-sold);
    border: 1px solid var(--status-sold);
  }

  &--inactive {
    background-color: var(--status-inactive-bg);
    color: var(--status-inactive);
    border: 1px solid var(--border-color);
  }
}
</style>

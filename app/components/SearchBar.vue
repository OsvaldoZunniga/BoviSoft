<template>
  <div class="search-bar">
    <input
      class="search-bar__input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <button
      v-if="modelValue"
      class="search-bar__clear"
      @click="$emit('update:modelValue', '')"
      title="Limpiar búsqueda"
    >
      &times;
    </button>
    <span class="search-bar__counter" v-if="total !== undefined">
      {{ visible }} / {{ total }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    visible?: number;
    total?: number;
  }>(),
  {
    modelValue: "",
    placeholder: "Buscar...",
    visible: 0,
    total: 0,
  },
);
defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 280px;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-surface);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);

  &__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 0.95rem;

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  &__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.16);
    }
  }

  &__counter {
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(255, 215, 0, 0.12);
    color: var(--accent-gold);
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }
}
</style>

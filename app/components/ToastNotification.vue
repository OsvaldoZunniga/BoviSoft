<template>
  <div class="toast-wrapper">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.tipo}`]"
      >
        <span class="toast__msg">{{ toast.mensaje }}</span>
        <button
          type="button"
          class="toast__close"
          @click="eliminarToast(toast.id)"
          aria-label="Cerrar notificación"
        >
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

const { toasts, eliminarToast } = useToast();
</script>

<style scoped lang="scss">
.toast-wrapper {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  pointer-events: none;
}

.toast-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 280px;
  max-width: 420px;
  padding: 0.9rem 1.15rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 500;
  box-shadow: var(--shadow-md);
  pointer-events: auto;
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);

  &--success {
    background-color: var(--status-active-bg);
    color: var(--status-active);
    border-left: 4px solid var(--status-active);
  }

  &--error {
    background-color: var(--status-danger-bg);
    color: var(--status-danger);
    border-left: 4px solid var(--status-danger);
  }

  &--info {
    background-color: var(--color-primary-subtle);
    color: var(--color-primary);
    border-left: 4px solid var(--color-primary);
  }

  &__msg {
    flex: 1;
    line-height: 1.4;
  }

  &__close {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 1.3rem;
    line-height: 1;
    color: currentColor;
    opacity: 0.65;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}
</style>

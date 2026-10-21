<template>
  <header class="header">
    <div class="header__left">
      <NuxtLink to="/cattle" class="header__brand">
        <img
          src="/logo.png"
          alt="BoviSoft"
          class="header__logo"
          @error="onLogoError"
        />
        <span class="header__title">BoviSoft</span>
      </NuxtLink>
    </div>

    <div class="header__right">
      <nav class="header__nav">
        <NuxtLink to="/cattle" class="header__link" active-class="header__link--active">
          Ganado
        </NuxtLink>
        <NuxtLink to="/events" class="header__link" active-class="header__link--active">
          Eventos
        </NuxtLink>
      </nav>

      <div class="header__actions">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from "~/components/ui/ThemeToggle.vue";

const onLogoError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = "none";
  }
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 2rem;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.25s ease, border-color 0.25s ease;

  &__left {
    display: flex;
    align-items: center;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
  }

  &__logo {
    height: 38px;
    width: auto;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  &__title {
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-primary);
    font-family: 'Space Grotesk', sans-serif;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__link {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-main);
      background-color: var(--bg-surface-hover);
    }

    &--active {
      color: var(--text-inverse);
      background-color: var(--color-primary);

      &:hover {
        background-color: var(--color-primary-hover);
        color: var(--text-inverse);
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 0.75rem 1rem;

    &__right {
      gap: 0.75rem;
    }

    &__link {
      padding: 0.4rem 0.65rem;
      font-size: 0.82rem;
    }
  }
}
</style>
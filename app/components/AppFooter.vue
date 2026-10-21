<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__text">BoviSoft &bull; Sistema de Gestión Ganadera Bovina</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 1.25rem 0;
  margin-top: auto;
  transition: background-color 0.25s ease, border-color 0.25s ease;

  &__container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    text-align: center;
  }

  &__text {
    color: var(--text-muted);
    font-size: 0.85rem;
  }
}
</style>
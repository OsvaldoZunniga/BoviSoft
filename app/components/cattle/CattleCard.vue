<template>
  <NuxtLink :to="`/cattle/${cattle.id}`" class="cattle-card card">
    <div class="cattle-card__media">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="cattle.name"
        class="cattle-card__img"
        loading="lazy"
      />
      <div v-else class="cattle-card__placeholder">
        <IconBovine class="cattle-card__bovine-icon" />
      </div>
    </div>

    <div class="cattle-card__content">
      <div class="cattle-card__top">
        <span v-if="cattle.earTag" class="ear-tag-badge">
          Arete #{{ cattle.earTag }}
        </span>
        <span v-else class="ear-tag-badge ear-tag-badge--empty">
          Sin arete
        </span>
        <CattleStatusBadge :status-id="cattle.statusId" />
      </div>

      <h3 class="cattle-card__name">{{ cattle.name }}</h3>

      <p class="cattle-card__meta">
        <span>{{ cattle.breed }}</span>
        <span v-if="cattle.gender" class="dot-separator">&bull;</span>
        <span v-if="cattle.gender">{{ cattle.gender }}</span>
      </p>

      <div class="cattle-card__details">
        <div class="detail-row">
          <span class="detail-label">Peso:</span>
          <span class="detail-val">{{ cattle.weight }} kg</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Propietario:</span>
          <span :class="['detail-val', { 'detail-val--empty': !cattle.ownerId }]">
            {{ ownerName }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Cattle } from '~/types/Cattle';
import CattleStatusBadge from '~/components/cattle/CattleStatusBadge.vue';
import IconBovine from '~/components/icons/IconBovine.vue';
import { getImageUrl } from '~/services/apiClient';
import { getOwnerName } from '~/constants/owners';

const props = defineProps<{
  cattle: Cattle;
}>();

const imageUrl = computed(() => {
  return getImageUrl(props.cattle.image || props.cattle.imagePath);
});

const ownerName = computed(() => {
  return getOwnerName(props.cattle.ownerId);
});
</script>

<style scoped lang="scss">
.cattle-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.15rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }

  &__media {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--color-primary-subtle);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--color-primary);
  }

  &__bovine-icon {
    width: 44px;
    height: 44px;
    opacity: 0.85;
  }

  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__name {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  &__meta {
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text-muted);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.25rem;
    padding-top: 0.45rem;
    border-top: 1px solid var(--border-color-subtle);
  }
}

.ear-tag-badge {
  font-size: 0.78rem;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-primary);
  background-color: var(--color-primary-subtle);
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);

  &--empty {
    color: var(--text-muted);
    background-color: var(--bg-surface-hover);
    font-weight: 500;
  }
}

.dot-separator {
  color: var(--border-color);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
}

.detail-label {
  color: var(--text-muted);
}

.detail-val {
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &--empty {
    font-weight: 400;
    font-style: italic;
    color: var(--text-muted);
  }
}

@media (max-width: 580px) {
  .cattle-card {
    flex-direction: column;
    align-items: flex-start;

    &__media {
      width: 100%;
      height: 180px;
    }

    &__content {
      width: 100%;
    }
  }
}
</style>

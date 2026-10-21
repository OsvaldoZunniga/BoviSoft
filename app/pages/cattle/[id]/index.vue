<template>
  <div class="container animate-fade-in">
    <div class="detail-header">
      <NuxtLink to="/cattle" class="btn btn--secondary btn--sm">
        Volver al listado
      </NuxtLink>
      <div class="detail-header__actions">
        <NuxtLink :to="`/cattle/${cattleId}/edit`" class="btn btn--secondary btn--sm">
          <IconEdit />
          Editar
        </NuxtLink>
        <button
          v-if="cattle && cattle.statusId !== 0"
          type="button"
          class="btn btn--danger btn--sm"
          @click="isDeleteModalOpen = true"
        >
          <IconTrash />
          Dar de baja
        </button>
      </div>
    </div>

    <div v-if="loading && !cattle" class="loading-state">
      <p>Cargando ficha del bovino...</p>
    </div>

    <div v-else-if="cattle" class="detail-layout">
      <div class="profile-card card">
        <div class="profile-card__media-container">
          <div class="profile-card__media">
            <img
              v-if="cattleImageUrl"
              :src="cattleImageUrl"
              :alt="cattle.name"
              class="profile-card__img"
            />
            <div v-else class="profile-card__placeholder">
              <IconBovine class="profile-card__bovine-icon" />
            </div>

            <div class="photo-overlay" @click="triggerPhotoInput">
              <input
                ref="photoInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                class="hidden-input"
                @change="onPhotoChange"
              />
              <span class="photo-overlay__text">
                <IconEdit />
                Cambiar foto
              </span>
            </div>
          </div>
        </div>

        <div class="profile-card__info">
          <div class="profile-card__tags">
            <span v-if="cattle.earTag" class="ear-tag-badge">
              Arete #{{ cattle.earTag }}
            </span>
            <span v-else class="ear-tag-badge ear-tag-badge--empty">
              Sin arete
            </span>
            <CattleStatusBadge :status-id="cattle.statusId" />
          </div>

          <h1 class="profile-card__name">{{ cattle.name }}</h1>
          <p class="profile-card__breed">{{ cattle.breed }}</p>

          <div class="profile-card__grid">
            <div class="info-block">
              <span class="info-block__label">Género</span>
              <span class="info-block__value">{{ cattle.gender || 'No registrado' }}</span>
            </div>
            <div class="info-block">
              <span class="info-block__label">Peso actual</span>
              <span class="info-block__value">{{ cattle.weight }} kg</span>
            </div>
            <div class="info-block">
              <span class="info-block__label">Fecha de nacimiento</span>
              <span class="info-block__value">{{ cattle.birthday || 'No registrada' }}</span>
            </div>
            <div class="info-block">
              <span class="info-block__label">Edad calculada</span>
              <span class="info-block__value">{{ calculatedAge }}</span>
            </div>
            <div class="info-block">
              <span class="info-block__label">Propietario</span>
              <span :class="['info-block__value', { 'info-block__value--unassigned': !cattle.ownerId }]">
                {{ ownerName }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="pedigree-card card">
        <h2 class="section-title">Genealogía y Ascendencia</h2>
        <div class="pedigree-grid">
          <div class="pedigree-box">
            <span class="pedigree-box__type">Madre</span>
            <div v-if="motherCattle" class="pedigree-box__content">
              <NuxtLink :to="`/cattle/${motherCattle.id}`" class="pedigree-link">
                {{ motherCattle.name }}
                <span v-if="motherCattle.earTag">(Arete #{{ motherCattle.earTag }})</span>
                <span v-else>(Sin arete)</span>
              </NuxtLink>
              <span class="pedigree-box__breed">{{ motherCattle.breed }}</span>
            </div>
            <div v-else class="pedigree-box__empty">
              <span v-if="cattle.motherId && cattle.motherId !== 'none'">
                Madre registrada con ID #{{ cattle.motherId }}
              </span>
              <span v-else>Sin madre registrada / No disponible</span>
            </div>
          </div>

          <div class="pedigree-box">
            <span class="pedigree-box__type">Padre</span>
            <div v-if="fatherCattle" class="pedigree-box__content">
              <NuxtLink :to="`/cattle/${fatherCattle.id}`" class="pedigree-link">
                {{ fatherCattle.name }}
                <span v-if="fatherCattle.earTag">(Arete #{{ fatherCattle.earTag }})</span>
                <span v-else>(Sin arete)</span>
              </NuxtLink>
              <span class="pedigree-box__breed">{{ fatherCattle.breed }}</span>
            </div>
            <div v-else class="pedigree-box__empty">
              <span v-if="cattle.fatherId && cattle.fatherId !== 'none'">
                Padre registrado con ID #{{ cattle.fatherId }}
              </span>
              <span v-else>Sin padre registrado / No disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      title="Bovino no encontrado"
      description="El ejemplar solicitado no existe o fue eliminado."
    >
      <template #action>
        <NuxtLink to="/cattle" class="btn btn--primary btn--sm">
          Volver al listado
        </NuxtLink>
      </template>
    </EmptyState>

    <CattleDeleteModal
      :is-open="isDeleteModalOpen"
      :cattle="cattle || null"
      @confirm="handleConfirmDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import CattleStatusBadge from '~/components/cattle/CattleStatusBadge.vue';
import CattleDeleteModal from '~/components/cattle/CattleDeleteModal.vue';
import EmptyState from '~/components/ui/EmptyState.vue';
import IconEdit from '~/components/icons/IconEdit.vue';
import IconTrash from '~/components/icons/IconTrash.vue';
import IconBovine from '~/components/icons/IconBovine.vue';
import { useCattle } from '~/composables/useCattle';
import { getImageUrl } from '~/services/apiClient';
import { getOwnerName } from '~/constants/owners';

const route = useRoute();
const cattleId = route.params.id as string;

const { cattleList, fetchCattle, deleteCattle, updateCattleImage, loading } = useCattle();

onMounted(async () => {
  if (cattleList.value.length === 0) {
    await fetchCattle();
  }
});

const cattle = computed(() => {
  return cattleList.value.find((c) => c.id === cattleId);
});

const cattleImageUrl = computed(() => {
  return getImageUrl(cattle.value?.image || cattle.value?.imagePath);
});

const ownerName = computed(() => {
  return getOwnerName(cattle.value?.ownerId);
});

const motherCattle = computed(() => {
  if (!cattle.value?.motherId || cattle.value.motherId === 'none') return null;
  return cattleList.value.find((c) => c.id === cattle.value?.motherId) || null;
});

const fatherCattle = computed(() => {
  if (!cattle.value?.fatherId || cattle.value.fatherId === 'none') return null;
  return cattleList.value.find((c) => c.id === cattle.value?.fatherId) || null;
});

const photoInputRef = ref<HTMLInputElement | null>(null);

const triggerPhotoInput = () => {
  photoInputRef.value?.click();
};

const onPhotoChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && cattle.value?.id) {
    await updateCattleImage(cattle.value.id, target.files[0]);
    if (photoInputRef.value) {
      photoInputRef.value.value = '';
    }
  }
};

const calculatedAge = computed(() => {
  if (!cattle.value?.birthday) return 'No calculable';
  const birth = new Date(cattle.value.birthday);
  if (isNaN(birth.getTime())) return 'Fecha inválida';
  const diffMs = Date.now() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return `${diffDays} días`;
  const months = Math.floor(diffDays / 30.4375);
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths > 0 ? `${years} años, ${remainingMonths} meses` : `${years} años`;
});

const isDeleteModalOpen = ref(false);

const handleConfirmDelete = async () => {
  if (cattle.value?.id) {
    await deleteCattle(cattle.value.id);
  }
  isDeleteModalOpen.value = false;
};
</script>

<style scoped lang="scss">
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;

  &__actions {
    display: flex;
    gap: 0.75rem;
  }
}

.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 920px;
}

.profile-card {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  align-items: flex-start;

  &__media-container {
    flex-shrink: 0;
  }

  &__media {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background-color: var(--color-primary-subtle);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
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
    width: 64px;
    height: 64px;
    opacity: 0.85;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  &__name {
    font-size: 1.85rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.02em;
    margin: 0;
  }

  &__breed {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-muted);
    margin: 0.2rem 0 1.25rem 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 1.5rem;
  }
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(2px);

  &:hover {
    opacity: 1;
  }

  &__text {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: var(--radius-sm);

    svg {
      width: 14px;
      height: 14px;
    }
  }
}

.hidden-input {
  display: none;
}

.ear-tag-badge {
  font-size: 0.85rem;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-primary);
  background-color: var(--color-primary-subtle);
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);

  &--empty {
    color: var(--text-muted);
    background-color: var(--bg-surface-hover);
    font-weight: 500;
  }
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  &__label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    font-weight: 600;
  }

  &__value {
    font-size: 0.98rem;
    font-weight: 600;
    color: var(--text-main);

    &--unassigned {
      color: var(--text-muted);
      font-style: italic;
      font-weight: 400;
    }
  }
}

.pedigree-card {
  padding: 1.75rem;

  .section-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0 0 1.25rem 0;
    color: var(--text-main);
  }
}

.pedigree-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.pedigree-box {
  padding: 1.15rem;
  background-color: var(--bg-surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__type {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__breed {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  &__empty {
    font-size: 0.88rem;
    color: var(--text-muted);
    font-style: italic;
  }
}

.pedigree-link {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }
}

.loading-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;

    &__grid {
      grid-template-columns: 1fr;
    }

    &__tags {
      justify-content: center;
    }
  }

  .pedigree-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="calf-section card">
    <div class="calf-section__header">
      <div class="calf-section__icon">
        <IconBovine />
      </div>
      <div>
        <h4 class="calf-section__title">Ficha del Nuevo Ternero (Nacimiento)</h4>
        <p class="calf-section__subtitle">
          Se creará automáticamente la ficha del nuevo ejemplar en el catálogo de bovinos.
        </p>
      </div>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label class="form-label" for="calfMother">Madre *</label>
        <select
          id="calfMother"
          v-model="calfData.motherId"
          class="form-select"
          required
          @change="onMotherChange"
        >
          <option value="" disabled>Seleccione la vaca madre</option>
          <option
            v-for="cow in femaleCattle"
            :key="cow.id"
            :value="cow.id"
          >
            {{ cow.name }} {{ cow.earTag ? `(Arete #${cow.earTag})` : '' }} - {{ cow.breed }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="calfFather">Padre</label>
        <select
          id="calfFather"
          v-model="calfData.fatherId"
          class="form-select"
        >
          <option value="none">Desconocido / Sin registrar</option>
          <option
            v-for="bull in maleCattle"
            :key="bull.id"
            :value="bull.id"
          >
            {{ bull.name }} {{ bull.earTag ? `(Arete #${bull.earTag})` : '' }} - {{ bull.breed }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="calfName">Nombre del ejemplar *</label>
        <input
          id="calfName"
          v-model="calfData.name"
          type="text"
          class="form-input"
          placeholder="Ej. Lucero, Triunfo"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="calfEarTag">Número de arete</label>
        <input
          id="calfEarTag"
          v-model="calfData.earTag"
          type="text"
          class="form-input"
          placeholder="Ej. 1045"
        />
        <span class="form-helper">Opcional para terneros pequeños</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="calfGender">Género *</label>
        <select
          id="calfGender"
          v-model="calfData.gender"
          class="form-select"
          required
        >
          <option value="Hembra">Hembra</option>
          <option value="Macho">Macho</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="calfBreed">Raza *</label>
        <select
          id="calfBreed"
          v-model="calfData.breed"
          class="form-select"
          required
        >
          <option value="Brahman">Brahman</option>
          <option value="Gyr">Gyr</option>
          <option value="Girolando">Girolando</option>
          <option value="Guzerá">Guzerá</option>
          <option value="Nelore">Nelore</option>
          <option value="Holstein">Holstein</option>
          <option value="Pardo Suizo">Pardo Suizo</option>
          <option value="Jersey">Jersey</option>
          <option value="Angus">Angus</option>
          <option value="Simmental">Simmental</option>
          <option value="Brangus">Brangus</option>
          <option value="Cruza / Mestizo">Cruza / Mestizo</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="calfWeight">Peso al nacer (kg) *</label>
        <input
          id="calfWeight"
          v-model.number="calfData.weight"
          type="number"
          step="0.5"
          min="1"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="calfOwner">Propietario</label>
        <select
          id="calfOwner"
          v-model="calfData.ownerId"
          class="form-select"
        >
          <option value="">Sin asignar</option>
          <option
            v-for="owner in OWNERS"
            :key="owner.id"
            :value="owner.id"
          >
            {{ owner.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cattle } from '~/types/Cattle';
import { OWNERS } from '~/constants/owners';
import IconBovine from '~/components/icons/IconBovine.vue';

const props = defineProps<{
  cattleList: readonly Cattle[];
  eventDate: string;
}>();

const femaleCattle = computed(() => {
  return props.cattleList.filter((c) => {
    const g = c.gender ? c.gender.toLowerCase().trim() : '';
    return g === 'hembra' || g === 'female';
  });
});

const maleCattle = computed(() => {
  return props.cattleList.filter((c) => {
    const g = c.gender ? c.gender.toLowerCase().trim() : '';
    return g === 'macho' || g === 'male';
  });
});

const calfData = reactive({
  name: '',
  earTag: '',
  gender: 'Hembra',
  breed: 'Brahman',
  weight: 35,
  motherId: '',
  fatherId: 'none',
  ownerId: '',
});

const onMotherChange = () => {
  const mother = props.cattleList.find((c) => c.id === calfData.motherId);
  if (mother) {
    if (mother.ownerId) {
      calfData.ownerId = mother.ownerId;
    }
    if (mother.breed) {
      calfData.breed = mother.breed;
    }
  }
};

defineExpose({
  getCalfPayload: (): Omit<Cattle, 'id'> => ({
    name: calfData.name.trim(),
    earTag: calfData.earTag.trim() || null,
    gender: calfData.gender,
    breed: calfData.breed,
    birthday: props.eventDate || new Date().toISOString().split('T')[0],
    weight: Number(calfData.weight),
    statusId: 1,
    motherId: calfData.motherId || 'none',
    fatherId: calfData.fatherId || 'none',
    ownerId: calfData.ownerId.trim() || null,
  }),
});
</script>

<style scoped lang="scss">
.calf-section {
  padding: 1.25rem;
  background-color: var(--color-primary-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-top: 1rem;

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  &__icon {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    color: var(--text-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  &__title {
    font-size: 0.98rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__subtitle {
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin: 0.15rem 0 0 0;
  }
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-helper {
  font-size: 0.74rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
  display: block;
}

@media (max-width: 600px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>

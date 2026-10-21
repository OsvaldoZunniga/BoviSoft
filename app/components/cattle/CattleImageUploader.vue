<template>
  <div class="uploader">
    <label class="form-label">Fotografía del ejemplar</label>
    
    <div
      :class="['dropzone', { 'dropzone--active': isDragging }]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        class="hidden-input"
        @change="handleFileInput"
      />

      <div v-if="previewSrc" class="preview-box">
        <img :src="previewSrc" alt="Vista previa" class="preview-img" />
        <button
          type="button"
          class="remove-btn"
          @click.stop="clearImage"
          aria-label="Eliminar imagen"
        >
          &times;
        </button>
      </div>

      <div v-else class="empty-dropzone">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <p class="dropzone-text">Haga clic o arrastre una imagen aquí</p>
        <span class="dropzone-hint">Formatos JPG, PNG, WEBP o GIF (máximo 15 MB)</span>
      </div>
    </div>

    <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '~/services/apiClient';

const props = defineProps<{
  initialImage?: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:file', file: File | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const previewSrc = ref<string>('');
const errorMsg = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

watch(
  () => props.initialImage,
  (newImg) => {
    if (newImg && !selectedFile.value) {
      previewSrc.value = getImageUrl(newImg);
    }
  },
  { immediate: true }
);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFile(target.files[0]);
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    processFile(e.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  errorMsg.value = null;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    errorMsg.value = 'Formato no admitido. Utilice JPG, PNG, WEBP o GIF.';
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    errorMsg.value = 'El archivo supera el límite de 15 MB.';
    return;
  }

  if (previewSrc.value && previewSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewSrc.value);
  }

  selectedFile.value = file;
  previewSrc.value = URL.createObjectURL(file);
  emit('update:file', file);
};

const clearImage = () => {
  if (previewSrc.value && previewSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewSrc.value);
  }
  previewSrc.value = '';
  selectedFile.value = null;
  errorMsg.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  emit('update:file', null);
};

onUnmounted(() => {
  if (previewSrc.value && previewSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewSrc.value);
  }
});
</script>

<style scoped lang="scss">
.uploader {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.hidden-input {
  display: none;
}

.dropzone {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  background-color: var(--bg-surface-elevated);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  transition: all 0.2s ease;

  &:hover,
  &--active {
    border-color: var(--color-primary);
    background-color: var(--color-primary-subtle);
  }
}

.empty-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
}

.upload-icon {
  color: var(--color-primary);
  opacity: 0.85;
}

.dropzone-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}

.dropzone-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preview-box {
  position: relative;
  width: 100%;
  max-width: 240px;
  height: 140px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--status-danger);
  }
}

.error-text {
  font-size: 0.78rem;
  color: var(--status-danger);
  margin: 0.2rem 0 0 0;
}
</style>

<script setup lang="ts">
  import { Photo } from "@renderer/types/photo";

  defineProps<{
    photo?: Photo;
  }>();
</script>

<template>
  <div class="main-preview">
    <div v-if="photo" class="preview-box">
      <img :src="`local://${photo.url}`" :alt="photo.name || 'preview'" />
    </div>
    <div v-else class="empty-box">
      <span>请选择一张图片预览</span>
    </div>
  </div>
</template>

<style scoped>
  .main-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .preview-box {
    max-width: 100%;
    max-height: 100%;
  }
  .preview-box img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
    object-fit: contain;
  }
  .empty-box {
    color: #999;
  }
</style>

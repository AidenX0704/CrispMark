<template>
  <div ref="previewContainer" class="main-preview">
    <div v-if="photo" class="preview-box">
      <!-- 水印层 -->
      <div v-if="watermarkComponent && isImageLoaded" class="watermark-overlay">
        <component :is="watermarkComponent" :photo="photo" :config="watermarkConfig" />
      </div>
      <div v-else class="loading-box"> 加载中... </div>
    </div>
    <div v-else class="empty-box">
      <span>请选择一张图片预览</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Photo } from "@renderer/types/photo";
  import { computed, ref, watch } from "vue";
  import BottomMarking from "@renderer/templates/BottomMarking";
  import GaussianFuzzyMarking from "@renderer/templates/GaussianFuzzyMarking";

  const props = defineProps<{
    photo?: Photo;
    template?: string;
    watermarkConfig?: Record<string, any>;
  }>();

  const watermarkComponents: Record<string, any> = {
    BottomMarking,
    GaussianFuzzyMarking
  };

  const watermarkComponent = computed(() => {
    if (props.template && watermarkComponents[props.template]) {
      return watermarkComponents[props.template];
    }
    return null;
  });

  const previewContainer = ref<HTMLDivElement | null>(null);
  const isImageLoaded = ref(false);

  watch(
    () => props.photo,
    () => {
      // 每次切换照片时重置加载状态
      isImageLoaded.value = false;
      // 延迟设置为已加载，确保模板可以渲染
      setTimeout(() => {
        isImageLoaded.value = true;
      }, 100);
    }
  );
</script>

<style scoped>
  .main-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }

  .preview-box {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .watermark-overlay {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .loading-box,
  .empty-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #999;
  }
</style>

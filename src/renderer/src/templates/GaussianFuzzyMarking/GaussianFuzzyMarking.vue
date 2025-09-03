<script setup lang="ts">
  import { Photo } from "@renderer/types/photo";
  import { ref, onMounted } from "vue";

  interface Props {
    photo?: Photo;
    config?: Record<string, any>;
  }

  const props = withDefaults(defineProps<Props>(), {
    config: () => ({})
  });

  const imageSrc = ref<string>("");

  // 默认配置
  const defaultConfig = {
    text: "水印文字",
    fontSize: 16,
    color: "rgba(255, 255, 255, 1)",
    blur: 10,
    photoBorderRadius: 10,
    photoBoxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    photoMargin: 40,
    ...props.config
  };

  // 照片EXIF信息
  const exifData = ref<Record<string, any> | null>(null);

  // 获取照片EXIF信息
  onMounted(async () => {
    if (props.photo) {
      try {
        exifData.value = await window.api.getExif(props.photo.url);
        const imageData = await window.api.getImageDataUrl(props.photo.url);
        imageSrc.value = `data:image/jpeg;base64,${imageData}`;
        console.log("EXIF信息:", exifData.value);
      } catch (error) {
        console.error("获取EXIF信息失败:", error);
        // 如果获取失败，尝试直接使用URL（可能适用于某些情况）
        imageSrc.value = `local://${props.photo.url}`;
      }
    }
  });
</script>

<template>
  <div
    class="gaussian-fuzzy-wrapper"
    :style="{
      backdropFilter: `blur(${defaultConfig.blur}px)`,
      WebkitBackdropFilter: `blur(${defaultConfig.blur}px)`,
      padding: defaultConfig.photoMargin + 'px',
      width: '100%',
      height: '100%'
    }"
  >
    <!-- 照片容器 -->
    <div
      class="photo-container"
      :style="{
        borderRadius: defaultConfig.photoBorderRadius + 'px',
        boxShadow: defaultConfig.photoBoxShadow,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }"
    >
      <!-- 照片本身 -->
      <div class="photo-wrapper">
        <img
          v-if="photo"
          :src="imageSrc"
          :alt="photo.name"
          class="photo"
          :style="{
            borderRadius: defaultConfig.photoBorderRadius + 'px'
          }"
        />
      </div>

      <!-- 底部水印信息 -->
      <div
        class="watermark-text"
        :style="{
          color: defaultConfig.color,
          fontSize: defaultConfig.fontSize + 'px'
        }"
      >
        {{ defaultConfig.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .gaussian-fuzzy-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-container {
    position: relative;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .photo-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .photo {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    display: block;
    object-fit: contain;
  }

  .watermark-text {
    text-align: center;
    padding: 8px;
    background: rgba(0, 0, 0, 0.3);
    font-weight: bold;
    flex-shrink: 0;
  }
</style>

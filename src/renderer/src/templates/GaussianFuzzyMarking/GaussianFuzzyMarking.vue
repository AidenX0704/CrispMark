<script setup lang="ts">
  import { Photo } from "@renderer/types/photo";
  import { ref, onMounted, watch } from "vue";

  interface Props {
    photo?: Photo;
    config?: Record<string, any>;
  }

  const props = withDefaults(defineProps<Props>(), {
    config: () => ({})
  });

  const imageSrc = ref<string>("");
  const imageAspectRatio = ref<number>(16 / 9); // 默认16:9

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

  // 监听图片加载完成，获取图片原始尺寸
  const handleImageLoad = (event: Event): void => {
    const img = event.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth && naturalHeight) {
      imageAspectRatio.value = naturalWidth / naturalHeight;
    }
  };

  // 监听photo变化
  watch(
    () => props.photo,
    async (newPhoto) => {
      if (newPhoto) {
        try {
          const imageData = await window.api.getImageDataUrl(newPhoto.url);
          imageSrc.value = `data:image/jpeg;base64,${imageData}`;
        } catch (error) {
          console.error("获取图片数据失败:", error);
          imageSrc.value = `local://${newPhoto.url}`;
        }
      }
    }
  );
</script>

<template>
  <div class="gaussian-fuzzy-wrapper">
    <!-- 背景模糊层 -->
    <div
      class="background-blur"
      :style="{
        backgroundImage: `url(${imageSrc})`,
        filter: 'blur(60px) brightness(0.3) saturate(1.2)',
        transform: 'scale(1.1)'
      }"
    ></div>

    <div class="gaussian-main">
      <div
        class="gaussian-container"
        :style="{
          aspectRatio: imageAspectRatio
        }"
      >
        <img :src="imageSrc" alt="高斯模糊图片" class="gaussian-photo" @load="handleImageLoad" />
      </div>
      <div class="gaussian-photo-info"> </div>
    </div>
  </div>
</template>

<style scoped>
  .gaussian-fuzzy-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family:
      "PingFang SC",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    user-select: none;

    .background-blur {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: all 1s ease;
      z-index: 1;
    }

    .gaussian-main {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 20px;

      .gaussian-container {
        position: relative;
        max-width: 95%;
        max-height: 80%;
        border-radius: 16px;
        overflow: hidden;
        box-shadow:
          0 25px 80px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.1);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(1px);
        z-index: 9999;

        .gaussian-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }
    }
  }
</style>

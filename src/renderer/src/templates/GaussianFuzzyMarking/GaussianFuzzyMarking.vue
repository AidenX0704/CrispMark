<script setup lang="ts">
  import { Photo } from "@renderer/types/photo";
  import { ref, onMounted, watch, computed } from "vue";

  interface Props {
    photo?: Photo;
    config?: Record<string, any>;
  }

  const props = withDefaults(defineProps<Props>(), {
    config: () => ({})
  });

  const imageSrc = ref<string>("");
  const imageAspectRatio = ref<number>(16 / 9);
  const containerRef = ref<HTMLElement>();

  // 默认配置（用户可覆盖）
  const defaultConfig = {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    blur: 60,
    brightness: 0.3,
    saturate: 1.2,
    photoBorderRadius: 16,
    photoBoxShadow: "0 0 0 0 rgba(0, 0, 0, 0.4)",
    photoMargin: 20,
    watermarkPosition: "bottom-right",
    ...props.config
  };

  // 照片EXIF信息
  const exifData = ref<Record<string, any> | null>(null);

  // 相机品牌 LOGO 映射
  const brandLogos: Record<string, string> = {
    Canon: "/assets/camera-logo/canon.png",
    Nikon: "/assets/camera-logo/nikon.png",
    Sony: "/assets/camera-logo/sony.png",
    Fujifilm: "/assets/camera-logo/fujifilm.png",
    Olympus: "/assets/camera-logo/olympus.png",
    Panasonic: "/assets/camera-logo/panasonic.png",
    Leica: "/assets/camera-logo/leica.png",
    Apple: "/assets/camera-logo/apple.png"
  };

  // 提取常见拍摄参数
  const shootingInfo = computed(() => {
    if (!exifData.value) return "";
    const exif = exifData.value;
    const aperture = exif.FNumber ? `f${exif.FNumber}` : "";
    const exposure = exif.ExposureTime ? `1/${1 / exif.ExposureTime}s` : "";
    const iso = exif.ISO ? `ISO ${exif.ISO}` : "";
    const focal = exif.FocalLength ? `${exif.FocalLength}mm` : "";
    return [aperture, exposure, iso, focal].filter(Boolean).join(" · ");
  });

  const brandLogo = computed(() => {
    if (!exifData.value) return "";
    const make = exifData.value.Make || "";
    for (const brand in brandLogos) {
      if (make.toLowerCase().includes(brand.toLowerCase())) {
        return brandLogos[brand];
      }
    }
    return "";
  });

  // 计算照片容器的最大尺寸
  const photoContainerStyle = computed(() => {
    if (!containerRef.value) return {};

    const containerWidth = containerRef.value.clientWidth - defaultConfig.photoMargin * 2;
    const containerHeight = containerRef.value.clientHeight - defaultConfig.photoMargin * 2 - 60;

    let maxWidth = containerWidth;
    let maxHeight = containerHeight;

    // 根据照片宽高比计算最适合的尺寸
    if (imageAspectRatio.value > 0) {
      const photoWidth = Math.min(maxWidth, maxHeight * imageAspectRatio.value);
      const photoHeight = Math.min(maxHeight, maxWidth / imageAspectRatio.value);

      return {
        maxWidth: `${photoWidth}px`,
        maxHeight: `${photoHeight}px`,
        width: imageAspectRatio.value > containerWidth / containerHeight ? "100%" : "auto",
        height: imageAspectRatio.value > containerWidth / containerHeight ? "auto" : "100%"
      };
    }

    return {
      maxWidth: `${maxWidth}px`,
      maxHeight: `${maxHeight}px`
    };
  });

  // 获取照片EXIF信息
  onMounted(async () => {
    if (props.photo) {
      try {
        exifData.value = await window.api.getExif(props.photo.url);
        const imageData = await window.api.getImageDataUrl(props.photo.url);
        imageSrc.value = `data:image/jpeg;base64,${imageData}`;
      } catch (error) {
        console.error("获取EXIF信息失败:", error);
        imageSrc.value = `local://${props.photo.url}`;
      }
    }
  });

  // 图片加载完成时获取原始比例
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
  <div ref="containerRef" class="gaussian-fuzzy-wrapper">
    <div class="gaussian-aspect-wrapper">
      <div class="background-blur">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          class="background-image"
          :style="{
            filter: `blur(${defaultConfig.blur}px) brightness(${defaultConfig.brightness}) saturate(${defaultConfig.saturate})`
          }"
          alt="模糊背景"
        />
      </div>

      <!-- 主体层 -->
      <div class="gaussian-main" :style="{ padding: defaultConfig.photoMargin + 'px' }">
        <div
          class="gaussian-container"
          :style="{
            borderRadius: defaultConfig.photoBorderRadius + 'px',
            boxShadow: defaultConfig.photoBoxShadow,
            ...photoContainerStyle
          }"
        >
          <img :src="imageSrc" alt="预览图片" class="gaussian-photo" @load="handleImageLoad" />
        </div>

        <!-- 照片信息 -->
        <div class="gaussian-photo-info">
          <div v-if="shootingInfo" class="shooting-info">{{ shootingInfo }}</div>
          <img v-if="brandLogo" :src="brandLogo" alt="相机品牌" class="brand-logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .gaussian-fuzzy-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
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
  }

  .gaussian-aspect-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* 背景层 */
  .background-blur {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    overflow: hidden;

    .background-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transform: scale(1.05);
    }
  }

  .gaussian-main {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .gaussian-container {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .gaussian-photo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }

  .gaussian-photo-info {
    margin-top: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.85);

    .shooting-info {
      font-size: 14px;
      margin-bottom: 6px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .brand-logo {
      height: 28px;
      object-fit: contain;
      opacity: 0.9;
    }
  }
</style>
